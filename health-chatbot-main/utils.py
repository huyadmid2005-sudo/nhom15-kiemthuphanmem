from unidecode import unidecode
import re

def normalize(text: str) -> str:
    return unidecode((text or "")).lower().strip()

def contains_any(text: str, keywords: list[str]) -> bool:
    if text is None:
        return False
    q = normalize(text)
    for keyword in keywords:
        k = normalize(keyword)
        if not k:
            continue
        if " " not in k and len(k) <= 3:
            if re.search(rf"(?<![a-z0-9]){re.escape(k)}(?![a-z0-9])", q):
                return True
            continue
        if k in q:
            return True
    return False
