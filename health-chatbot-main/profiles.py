from typing import Any, Dict, List, Optional, Tuple
import os

import requests
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry


API_URL = os.getenv(
    "HMS_PATIENT_HEALTH_RECORDS_URL",
    "http://localhost:8090/patients/health-records/patient/{patient_id}",
)
PROFILE_URL = os.getenv("HMS_PATIENT_PROFILE_URL", "http://localhost:8090/patients/profile")
VERIFY_PATIENT_ID = os.getenv("HMS_CHATBOT_VERIFY_PATIENT_ID", "true").lower() not in {
    "0",
    "false",
    "no",
}


def session_with_retry(
    status_retries: int = 1,
    connect_retries: int = 1,
    backoff_factor: float = 0.3,
) -> requests.Session:
    retry = Retry(
        total=None,
        connect=connect_retries,
        read=0,
        status=status_retries,
        status_forcelist=[429, 500, 502, 503, 504],
        allowed_methods=["GET"],
        respect_retry_after_header=True,
        backoff_factor=backoff_factor,
        raise_on_status=False,
    )
    session = requests.Session()
    adapter = HTTPAdapter(max_retries=retry)
    session.mount("https://", adapter)
    session.mount("http://", adapter)
    return session


def parse_bp(bp: str) -> Tuple[Optional[int], Optional[int]]:
    if not bp:
        return None, None
    try:
        parts = str(bp).split("/")
        if len(parts) != 2:
            return None, None
        sbp = int(parts[0].strip())
        dbp = int(parts[1].strip())
        return sbp, dbp
    except Exception:
        return None, None


def bmi(height_cm: Optional[float], weight_kg: Optional[float]) -> Optional[float]:
    if height_cm is None or weight_kg is None:
        return None
    height_m = float(height_cm) / 100.0
    if height_m <= 0:
        return None
    return round(float(weight_kg) / (height_m * height_m), 2)


def get_json(url: str, headers: Dict[str, str]) -> Any:
    try:
        response = session_with_retry().get(url, headers=headers, timeout=(3, 5))
    except requests.exceptions.Timeout as exc:
        raise TimeoutError("Upstream timed out") from exc
    except requests.exceptions.RequestException as exc:
        raise Exception(f"Upstream error: {exc}") from exc

    status = response.status_code
    if status in (401, 403):
        raise PermissionError("Unauthorized/Forbidden")
    if status == 404:
        raise FileNotFoundError("Patient not found")
    if 500 <= status <= 599:
        raise Exception(f"Upstream server error {status}")

    response.raise_for_status()
    return response.json()


def current_patient_id(headers: Dict[str, str]) -> Optional[str]:
    if not PROFILE_URL or not VERIFY_PATIENT_ID:
        return None

    data = get_json(PROFILE_URL, headers)
    if not isinstance(data, dict):
        raise ValueError("PROFILE_BAD_FORMAT")

    patient_id = data.get("patientId")
    return str(patient_id).strip() if patient_id else None


def build_profile_api(patient_id: Optional[str], token: str) -> tuple[list, dict]:
    if not token:
        raise PermissionError("Missing Authorization")

    authorization = token if token.lower().startswith("bearer ") else f"Bearer {token}"
    headers = {"Authorization": authorization}

    verified_patient_id = current_patient_id(headers)
    if verified_patient_id:
        if patient_id and str(patient_id).strip() != verified_patient_id:
            raise PermissionError("Patient id does not match authenticated user")
        patient_id = verified_patient_id

    if not patient_id:
        raise FileNotFoundError("Missing patient_id")

    data = get_json(API_URL.format(patient_id=patient_id), headers)

    if not isinstance(data, list):
        raise ValueError("UPSTREAM_BAD_FORMAT")

    normalized: List[Dict[str, Any]] = []

    for record in data:
        height_cm = record.get("heightInCm")
        weight_kg = record.get("weightInKg")
        sbp, dbp = parse_bp(record.get("bloodPressure"))

        vitals = {
            "height_cm": height_cm,
            "weight_kg": weight_kg,
            "bmi": bmi(height_cm, weight_kg),
            "sbp_mmHg": sbp,
            "dbp_mmHg": dbp,
            "hr_bpm": record.get("pulseRate"),
            "body_temp_c": record.get("bodyTemperature"),
            "measured_at": record.get("checkupDate"),
        }
        labs = {
            "glucose_mmol_l": record.get("bloodSugar"),
        }

        normalized.append(
            {
                "vitals": vitals,
                "labs": labs,
                "raw": record,
            }
        )

    latest = (
        sorted(normalized, key=lambda item: item["vitals"].get("measured_at") or "", reverse=True)[0]
        if normalized
        else {"vitals": {}, "labs": {}}
    )

    profile = {
        "latest": {
            "vitals": latest.get("vitals", {}),
            "labs": latest.get("labs", {}),
        },
        "history": normalized,
    }

    return data, profile
