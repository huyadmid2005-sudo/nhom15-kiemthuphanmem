from guide import get_guide
from typing import Any, Dict, List
# from utils import normalize
import re
from tools import advice_for_metric, lifestyle_config, metrics_synonyms


def _visit_date(record: Dict[str, Any]) -> str:
    vitals = record.get("vitals") or {}
    raw = record.get("raw") or {}
    for key in ("measured_at", "checkupDate", "appointmentDate", "createdAt", "updatedAt"):
        value = vitals.get(key) or raw.get(key)
        if value:
            return str(value)
    return "Chưa rõ ngày"


def _visit_snapshot(record: Dict[str, Any]) -> str:
    vitals = record.get("vitals") or {}
    labs = record.get("labs") or {}
    parts: List[str] = []

    blood_pressure = None
    if vitals.get("sbp_mmHg") is not None and vitals.get("dbp_mmHg") is not None:
        blood_pressure = f"{vitals.get('sbp_mmHg')}/{vitals.get('dbp_mmHg')} mmHg"
    if blood_pressure:
        parts.append(f"huyết áp {blood_pressure}")
    if vitals.get("bmi") is not None:
        parts.append(f"BMI {vitals.get('bmi')}")
    if labs.get("glucose_mmol_l") is not None:
        parts.append(f"đường huyết {labs.get('glucose_mmol_l')} mmol/L")
    if vitals.get("weight_kg") is not None:
        parts.append(f"cân nặng {vitals.get('weight_kg')} kg")
    if vitals.get("hr_bpm") is not None:
        parts.append(f"mạch {vitals.get('hr_bpm')} bpm")

    return ", ".join(parts) if parts else "có dữ liệu khám"


def _sorted_visits(profile: Dict[str, Any]) -> List[Dict[str, Any]]:
    history = profile.get("history") or []
    visits: List[Dict[str, Any]] = []
    for record in history:
        if not isinstance(record, dict):
            continue
        visits.append(
            {
                "date": _visit_date(record),
                "summary": _visit_snapshot(record),
            }
        )
    return sorted(visits, key=lambda item: item.get("date") or "", reverse=True)


def _dedup(seq: List[str]) -> List[str]:
    seen = set()
    out: List[str] = []
    for item in seq:
        if item and item not in seen:
            out.append(item)
            seen.add(item)
    return out


def _metric_status(label: str | None, category_id: str | None, value: Any) -> str | None:
    normal_ids = {"normal", "optimal", "good", "target"}
    normal_labels = {"bình thường", "binh thuong", "normal", "tối ưu", "toi uu", "optimal"}

    if not label and not category_id:
        return None
    if (category_id and str(category_id).lower() in normal_ids) or (
        label and str(label).lower() in normal_labels
    ):
        return "good"
    return "not_good"


def _metric_context(profile: Dict[str, Any]) -> Dict[str, Any]:
    metrics = list(metrics_synonyms().keys())
    numbers: List[Dict[str, Any]] = []
    actions: List[str] = []
    cautions: List[str] = []
    items: List[Dict[str, Any]] = []

    for metric_id in metrics:
        info = advice_for_metric(metric_id, profile)
        title = info.get("title") or metric_id
        value, unit, date = info.get("number", (None, None, None))
        label = (info.get("label") or "") or None
        category_id = (info.get("category_id") or "") or None
        status = _metric_status(label, category_id, value)

        actions.extend(info.get("tips") or [])
        cautions.extend(info.get("cautions") or [])

        if value is not None:
            numbers.append({"name": title, "value": value, "unit": unit, "date": date})

        if status:
            items.append(
                {
                    "metric": metric_id,
                    "title": title,
                    "value": value,
                    "unit": unit,
                    "date": date,
                    "status": status,
                    "label": label,
                    "advice_top": (info.get("tips") or [None])[0],
                }
            )

    items.sort(key=lambda item: 0 if item.get("status") == "not_good" else 1)
    return {
        "numbers": numbers,
        "items": items,
        "actions": _dedup(actions),
        "cautions": _dedup(cautions),
    }


def execute(intent_id: str, slots: Dict[str, Any], profile: Dict[str, Any]) -> Dict[str, Any]:
    # smalltalk suggest
    if intent_id == "greet.smalltalk":
        text = "Xin chào! Mình có thể giúp bạn đọc kết quả xét nghiệm, xem chỉ số (BMI, huyết áp, đường huyết…), hoặc hướng dẫn sử dụng hệ thống."
        suggestions = [
            "tổng hợp lời khuyên từ xét nghiệm của tôi",
            "BMI của tôi",
            "tôi đang có mấy lần khám",
            "Huyết áp của tôi",
            "Hướng dẫn tôi đăng ký"
        ]
        explanations = [text]
        return {
            "no_data": False,
            "explanations": explanations,
            "targets": [f"Hỏi: “{s}”" for s in suggestions]
        }

    if intent_id == "health.overview":
        ctx = _metric_context(profile)
        items = ctx["items"]
        numbers = ctx["numbers"]
        visits = _sorted_visits(profile)
        latest_visit = visits[0] if visits else None

        if not numbers and not items and not visits:
            return {
                "no_data": True,
                "explanations": ["Mình chưa có đủ dữ liệu khám để đánh giá tổng quan sức khỏe của bạn."],
                "suggestions": ["Hỏi: “Tôi đang có mấy lần khám?”", "Hỏi: “Hướng dẫn tôi đặt lịch khám”"],
                "numbers": [],
                "actions": [],
                "cautions": [],
                "classification": {},
            }

        not_good = [item for item in items if item.get("status") == "not_good"]
        good = [item for item in items if item.get("status") == "good"]

        if not_good:
            headline = f"Mình thấy {len(not_good)} chỉ số cần chú ý"
            focus = ", ".join(item.get("title") or item.get("metric") for item in not_good[:3])
            headline += f": {focus}."
        elif good:
            headline = "Các chỉ số hiện có trong hồ sơ gần nhất đang ở mức ổn."
        else:
            headline = "Mình đã tìm thấy dữ liệu khám của bạn nhưng chưa đủ ngưỡng để phân loại đầy đủ."

        if latest_visit:
            headline += f" Lần khám gần nhất được ghi nhận ngày {latest_visit['date']}."

        detail_lines = []
        for item in items[:6]:
            value = item.get("value")
            unit = item.get("unit") or ""
            value_text = f": {value} {unit}".strip() if value is not None else ""
            label = f" ({item.get('label')})" if item.get("label") else ""
            state = "ổn" if item.get("status") == "good" else "cần chú ý"
            detail_lines.append(f"- {item.get('title')}{value_text}: {state}{label}")

        explanation = headline
        if detail_lines:
            explanation += "\n\nTổng quan chỉ số:\n" + "\n".join(detail_lines)

        actions = ctx["actions"][:6]
        cautions = ctx["cautions"][:4]
        if not actions:
            ls = lifestyle_config()
            actions = _dedup((ls.get("diet_general") or []) + (ls.get("physical_activity") or []))[:5]
            cautions = _dedup(cautions + (ls.get("general_warnings") or []))[:4]

        return {
            "no_data": False,
            "explanations": [explanation],
            "numbers": numbers,
            "classification": {
                "items": items,
                "summary": {
                    "good_count": len(good),
                    "attention_count": len(not_good),
                    "visit_count": len(visits),
                    "latest_visit": latest_visit,
                },
            },
            "actions": actions,
            "cautions": cautions,
            "targets": [
                "Hỏi: “Tôi đang có mấy lần khám?”",
                "Hỏi: “Huyết áp của tôi thế nào?”",
                "Hỏi: “Tổng hợp xét nghiệm của tôi”",
            ],
        }

    if intent_id == "visits.summary":
        visits = _sorted_visits(profile)
        total = len(visits)
        if total == 0:
            return {
                "no_data": True,
                "explanations": ["Mình chưa tìm thấy lần khám nào trong hồ sơ của bạn."],
                "suggestions": ["Đặt lịch khám", "Hỏi: “Hướng dẫn tôi đặt lịch khám”"],
                "numbers": [],
                "actions": [],
                "cautions": [],
                "classification": {"visits": []},
            }

        latest = visits[0]
        recent = visits[:5]
        recent_lines = [f"- {visit['date']}: {visit['summary']}" for visit in recent]
        more_text = f"\n\nMình đang hiển thị 5 lần gần nhất trong tổng số {total} lần." if total > 5 else ""
        explanation = (
            f"Bạn đang có {total} lần khám được ghi nhận trong hệ thống. "
            f"Lần gần nhất là ngày {latest['date']}.\n\n"
            "Các lần khám gần đây:\n"
            + "\n".join(recent_lines)
            + more_text
        )

        return {
            "no_data": False,
            "explanations": [explanation],
            "numbers": [{"name": "Số lần khám", "value": total, "unit": "lần", "date": latest["date"]}],
            "targets": [
                "Hỏi: “Lần khám gần nhất của tôi thế nào?”",
                "Hỏi: “Tổng hợp xét nghiệm của tôi”",
                "Hỏi: “BMI của tôi”",
            ],
            "actions": [],
            "cautions": [],
            "classification": {"visits": visits, "latest_visit": latest},
        }

    # summary metric
    if intent_id == "labs.summary":
        syn = metrics_synonyms()
        metrics = list(syn.keys())
        numbers = []
        actions: List[str] = []
        cautions: List[str] = []
        explanations: List[str] = ["Tổng hợp lời khuyên về xét nghiệm"]
        items: List[Dict[str, Any]] = []

        NORMAL_IDS = {"normal", "optimal", "good", "target"}
        NORMAL_LABELS = {"bình thường", "binh thuong", "normal", "tối ưu", "toi uu", "optimal"}

        for mid in metrics:
            info = advice_for_metric(mid, profile)
            title = info.get("title") or mid
            val, unit, date = info.get("number", (None, None, None))
            label = (info.get("label") or "") or None
            cat_id = (info.get("category_id") or "") or None

            actions.extend(info.get("tips") or [])
            cautions.extend(info.get("cautions") or [])

            status = None
            if label or cat_id or val is not None:
                if (cat_id and str(cat_id).lower() in NORMAL_IDS) or (label and str(label).lower() in NORMAL_LABELS):
                    status = "good"
                else:
                    status = "not_good"

            first_tip = (info.get("tips") or [None])[0]
            if status:
                items.append({
                    "metric": mid,
                    "title": title,
                    "value": val,
                    "unit": unit,
                    "date": date,
                    "status": status,
                    "label": label,
                    "advice_top": first_tip,
                })

            if val is not None:
                numbers.append({"name": title, "value": val, "unit": unit, "date": date})

        
        items.sort(key=lambda x: 0 if x.get("status") == "not_good" else 1)
        # print(items)

        # de-dup
        def dedup(seq):
            seen = set(); out = []
            for x in seq:
                if x and x not in seen:
                    out.append(x); seen.add(x)
            return out

        actions = dedup(actions)[:10]
        cautions = dedup(cautions)[:6]

        if not items and not actions and not cautions:
            ls = lifestyle_config()
            actions = dedup((ls.get("diet_general") or []) + (ls.get("physical_activity") or []))[:8]
            cautions = dedup(ls.get("general_warnings") or [])[:5]

        return {
            "no_data": False,
            "numbers": numbers,
            "classification": {"items": items},
            "actions": actions,
            "cautions": cautions,
            "explanations": explanations,
        }

    # vital
    if intent_id == "vital.query":
        metric = (slots or {}).get("metric")
        kind = (slots or {}).get("query_kind") or "value"
        if not metric:
            syn = metrics_synonyms()
            q = (slots or {}).get("q") or ""
            for mid, kws in syn.items():
                if any((k.lower() in q.lower()) for k in (kws or [])):
                    metric = mid; break
        if not metric:
            return {"no_data": True, "explanations": ["Xin lỗi, mình chưa biết trả lời câu này."]}

        info = advice_for_metric(metric, profile)
        title = info.get("title") or metric
        val, unit, date = info.get("number", (None, None, None))
        label = info.get("label")
        cat_id = info.get("category_id")

        actions: List[str] = (info.get("tips") or [])[:5]
        cautions: List[str] = (info.get("cautions") or [])[:5]

        if val is None and label is None:
            return {"no_data": True, "explanations": [f"Chưa tìm thấy dữ liệu cho {title}."]}

        msg = None
        if val is not None:
            msg = f"{title} gần nhất: {val}{(' ' + unit) if unit else ''}" + (f" (ngày {date})" if date else "")
            if kind == "classification" and label:
                msg += f". Phân loại: {label}."
        elif label:
            msg = f"{title}: {label}."
        explanations = [msg]

        numbers = []
        if val is not None:
            numbers = [{"name": title, "value": val, "unit": unit, "date": date}]

        classification = {}
        if label or cat_id:
            classification = {"label": label, "category_id": cat_id}

        return {
            "no_data": False,
            "numbers": numbers,
            "actions": actions,
            "cautions": cautions,
            "explanations": explanations,
            "classification": classification,
        }

    # guide topic 
    if intent_id == "guide.query":
        topic_id = (slots or {}).get("topic_id") or ""
        g = get_guide(topic_id)
        if not g:
            return {
                "no_data": True,
                "explanations": ["Xin lỗi, mình chưa tìm thấy chủ đề hướng dẫn phù hợp."],
            }

        def strip_prefix(s: str) -> str:
            s = (s or "").strip()
            for pf in ("Hướng dẫn:", "Huong dan:", "Hướng dẫn:"):
                if s.lower().startswith(pf.lower()):
                    return s[len(pf):].strip()
            return s

        clean_title = strip_prefix(g.get("title") or topic_id)
        steps = g.get("steps") or []

        return {
            "no_data": False,
            "explanations": [f"Hướng dẫn: {clean_title}"],
            "classification": {"items": [{"title": clean_title, "steps": steps}], "topic_id": g.get("id") or topic_id},
            "numbers": [],
            "actions": [],
            "cautions": [],
        }

    if intent_id == "lifestyle.advice":
        ls = lifestyle_config()
        actions = []
        actions.extend(ls.get("diet_general") or [])
        actions.extend(ls.get("physical_activity") or [])
        cautions = ls.get("general_warnings") or []
        return {
            "no_data": False,
            "explanations": ["Một số gợi ý lối sống phù hợp với dữ liệu sức khỏe gần nhất của bạn:"],
            "numbers": [],
            "actions": actions[:8],
            "cautions": cautions[:5],
            "classification": {},
        }

    if intent_id == "fallback.clarify":
        return {
            "no_data": True,
            "explanations": ["Mình chưa rõ bạn muốn xem chỉ số nào. Bạn có thể chọn một trong các mục dưới đây:"],
            "suggestions": ["BMI của tôi", "Huyết áp của tôi", "Đường huyết của tôi", "Tổng hợp xét nghiệm"],
            "numbers": [],
            "actions": [],
            "cautions": [],
            "classification": {},
        }
