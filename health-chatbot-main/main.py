from fastapi import FastAPI, Form, Header

from composer import compose
from executor import execute
from models import ApiResponse
from profiles import build_profile_api
from router import detect_intent


app = FastAPI(title="HMS Health Chatbot")

INTENTS_NEED_PROFILE = {
    "vital.query",
    "labs.summary",
    "lifestyle.advice",
    "visits.summary",
    "health.overview",
}


@app.get("/health")
async def health():
    return {"status": "UP"}


@app.post("/ask")
@app.post("/chatbot/ask")
async def ask(
    question: str = Form(...),
    authorization: str | None = Header(None, alias="Authorization"),
    patient_id: str | None = Header(None, alias="Patient-Id"),
):
    intent_id, slots = detect_intent(question or "")
    profile: dict = {"latest": {"vitals": {}, "labs": {}}, "history": []}

    if intent_id in INTENTS_NEED_PROFILE:
        if not authorization:
            return ApiResponse(
                ok=False,
                error={
                    "code": "BAD_REQUEST",
                    "message": "Bạn chưa đăng nhập. Hãy đăng nhập và hỏi lại lần nữa!",
                },
            ).model_dump(exclude_none=True, exclude_defaults=True)

        try:
            _, profile = build_profile_api(patient_id, authorization)
        except PermissionError:
            return ApiResponse(
                ok=False,
                error={
                    "code": "AUTH_EXPIRED",
                    "message": "Phiên đăng nhập đã hết hạn hoặc không hợp lệ. Hãy đăng nhập lại!",
                },
            ).model_dump(exclude_none=True, exclude_defaults=True)
        except FileNotFoundError:
            return ApiResponse(
                ok=False,
                error={
                    "code": "PATIENT_NOT_FOUND",
                    "message": "Không có dữ liệu kết quả khám của bạn.",
                },
            ).model_dump(exclude_none=True, exclude_defaults=True)
        except TimeoutError:
            return ApiResponse(
                ok=False,
                error={
                    "code": "UPSTREAM_UNAVAILABLE",
                    "message": "Hệ thống hồ sơ không phản hồi. Hãy thử lại sau ít phút nữa.",
                },
            ).model_dump(exclude_none=True, exclude_defaults=True)
        except Exception:
            return ApiResponse(
                ok=False,
                error={
                    "code": "UPSTREAM_UNAVAILABLE",
                    "message": "Hệ thống hồ sơ không phản hồi. Hãy thử lại sau ít phút nữa.",
                },
            ).model_dump(exclude_none=True, exclude_defaults=True)

    profile["last_question"] = question

    payload = execute(intent_id, slots, profile)
    answer = compose(intent_id, payload or {})

    return ApiResponse(ok=True, data=answer).model_dump(exclude_none=True, exclude_defaults=True)
