from typing import Any, Dict, List

from models import Answer, AnswerStructured, NumberItem


def join_numbers(nums: List[dict]) -> str:
    lines: List[str] = []
    for item in nums:
        value = item.get("value")
        unit = item.get("unit")
        line = f"- {item.get('name')}: {value}{(' ' + unit) if unit else ''}"
        if item.get("date"):
            line += f" ({item.get('date')})"
        lines.append(line)
    return "\n".join(lines)


def render_items(items: List[dict]) -> str:
    lines: List[str] = []
    for item in items:
        title = item.get("title") or item.get("metric")
        value = item.get("value")
        unit = item.get("unit") or ""
        label = item.get("label")
        status = item.get("status")
        advice_top = item.get("advice_top")
        badge = "Tốt" if status == "good" else "Cần chú ý"
        value_part = f": {value} {unit}".strip() if value is not None else ""
        line = f"- {title}{value_part} - Trạng thái: {badge}"
        if label:
            line += f" ({label})"
        if advice_top:
            line += f". Lời khuyên: {advice_top}"
        lines.append(line)
    return "\n".join(lines)


def compose(intent_id: str, payload: Dict[str, Any]) -> Answer:
    payload = payload or {}
    explanations: List[str] = payload.get("explanations", [])
    numbers: List[dict] = payload.get("numbers", [])
    actions: List[str] = payload.get("actions", [])
    cautions: List[str] = payload.get("cautions", [])
    classification: Dict[str, Any] = payload.get("classification", {})
    suggestions: List[str] = payload.get("suggestions", [])
    targets: List[str] = payload.get("targets", []) or suggestions

    if payload.get("no_data") is True:
        blocks: List[str] = []
        conclusion = explanations[0] if explanations else "Xin lỗi, tôi chưa biết trả lời câu này."
        blocks.append(conclusion)
        if targets:
            blocks.append("Gợi ý:\n" + "\n".join([f"- {target}" for target in targets]))
        if actions:
            blocks.append("Bạn nên:\n" + "\n".join([f"- {action}" for action in actions]))
        if cautions:
            blocks.append("Lưu ý:\n" + "\n".join([f"- {caution}" for caution in cautions]))

        structured = AnswerStructured(
            conclusion=conclusion,
            numbers=[],
            targets=targets,
            actions=actions,
            cautions=cautions,
            classification=classification,
        )
        return Answer(
            text="\n\n".join(blocks).strip(),
            structured=structured,
            confidence=payload.get("confidence", 0.6),
            meta={"intent": intent_id},
        )

    blocks: List[str] = []
    if explanations:
        blocks.append(explanations[0])
    if numbers:
        blocks.append("Chỉ số:\n" + join_numbers(numbers))

    items = classification.get("items") if isinstance(classification, dict) else None
    if items and any(isinstance(item, dict) and ("steps" in item) for item in items):
        first = next(item for item in items if "steps" in item)
        guide_steps = [str(step) for step in (first.get("steps") or [])]
        if guide_steps:
            blocks.append("Các bước thực hiện:\n" + "\n".join([f"- {step}" for step in guide_steps]))
        items = [item for item in items if "steps" not in item]

    if items:
        blocks.append("Tổng hợp theo chỉ số:\n" + render_items(items))
    if targets:
        blocks.append("Gợi ý:\n" + "\n".join([f"- {target}" for target in targets]))
    if actions:
        blocks.append("Bạn nên:\n" + "\n".join([f"- {action}" for action in actions]))
    if cautions:
        blocks.append("Lưu ý:\n" + "\n".join([f"- {caution}" for caution in cautions]))

    structured = AnswerStructured(
        conclusion=explanations[0] if explanations else None,
        numbers=[NumberItem(**item) for item in numbers],
        targets=targets,
        actions=actions,
        cautions=cautions,
        classification=classification,
    )

    return Answer(
        text="\n\n".join(blocks).strip(),
        structured=structured,
        confidence=payload.get("confidence", 0.9),
        meta={"intent": intent_id},
    )
