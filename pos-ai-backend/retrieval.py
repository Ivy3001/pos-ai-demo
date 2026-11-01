

import math
import re
from dataclasses import dataclass
from pathlib import Path

KB_DIR = Path(__file__).parent / "knowledge-base"


STOPWORDS = {
    "a", "an", "and", "are", "as", "at", "be", "but", "by", "can", "do",
    "does", "for", "from", "has", "have", "how", "i", "if", "in", "is",
    "it", "its", "long", "me", "my", "of", "on", "or", "our", "should",
    "so", "that", "the", "their", "them", "there", "they", "this", "to",
    "until", "was", "what", "when", "which", "who", "will", "with", "you",
    "your", "any", "it's", "need", "want", "customer", "asking", "asked",
    "tell", "safe", "ok", "okay", "get", "much", "we",
    "ignore", "previous", "instruction", "prompt", "system", "rule",
}

SYNONYMS = {
    "ribeye": ["steak", "beef"],
    "rib-eye": ["steak", "beef"],
    "sirloin": ["steak", "beef"],
    "brat": ["sausage"],
    "bratwurst": ["sausage"],
    "burger": ["ground"],
    "hamburger": ["ground"],
    "salami": ["deli"],
    "turkey": ["poultry"],
    "chicken": ["poultry"],
    "pregnant": ["pregnant", "higher", "risk"],
    "pregnancy": ["pregnant", "higher", "risk"],
    "elderly": ["65", "older", "risk"],
    "fridge": ["refrigerator"],
    "freeze": ["freezer"],
    "frozen": ["freezer"],
    "temp": ["temperature"],
    "done": ["temperature", "thermometer"],
    "allergy": ["allergen"],
    "allergic": ["allergen", "reaction"],
    "nut": ["tree", "nuts", "peanuts"],
    "peanut": ["peanuts"],
    "slicer": ["cross-contact", "equipment"],
    "grade": ["prime", "choice", "select"],
    "marbling": ["prime", "choice"],
    "hot": ["90°f"],
    "outside": ["danger", "zone"],
    "sit": ["danger", "zone", "left"],
    "last": ["refrigerator", "keeps"],
    "keep": ["refrigerator", "keeps"],
}


@dataclass
class Chunk:
    text: str
    title: str
    source: str
    url: str
    file: str
    words: set


def _normalize(word: str) -> str:
    """Lowercase and strip a plural 's' so 'steaks' matches 'steak'."""
    word = word.lower().strip(".,;:!?()\"'")
    if len(word) > 4 and word.endswith("s") and not word.endswith("ss"):
        word = word[:-1]
    return word


def _tokenize(text: str) -> list[str]:
    raw = re.findall(r"[a-zA-Z0-9°\-']+", text)
    return [_normalize(w) for w in raw if w]


def load_knowledge_base() -> list[Chunk]:
    chunks = []
    if not KB_DIR.exists():
        return chunks

    for path in sorted(KB_DIR.glob("*.txt")):
        content = path.read_text(encoding="utf-8")
        blocks = [b.strip() for b in content.split("\n\n") if b.strip()]
        if not blocks:
            continue

        header = {}
        for line in blocks[0].splitlines():
            if ":" in line:
                key, value = line.split(":", 1)
                header.setdefault(key.strip().lower(), value.strip())

        for block in blocks[1:]:
            chunks.append(
                Chunk(
                    text=block,
                    title=header.get("title", path.stem),
                    source=header.get("source", "Unknown source"),
                    url=header.get("url", ""),
                    file=path.name,
                    words=set(_tokenize(block)) | set(_tokenize(header.get("title", ""))),
                )
            )
    return chunks


CHUNKS = load_knowledge_base()

_DOC_FREQ: dict[str, int] = {}
for _c in CHUNKS:
    for _w in _c.words:
        _DOC_FREQ[_w] = _DOC_FREQ.get(_w, 0) + 1


def _weight(word: str) -> float:
    n = len(CHUNKS) or 1
    return math.log((n + 1) / (_DOC_FREQ.get(word, 0) + 0.5))


def _question_keywords(question: str) -> set[str]:
    keywords = set()
    for word in _tokenize(question):
        if word in STOPWORDS or len(word) < 3:
            continue
        keywords.add(word)
        for extra in SYNONYMS.get(word, []):
            keywords.add(_normalize(extra))
    return keywords


def retrieve(question: str, top_k: int = 3, min_score: float = 1.5) -> list[dict]:

    keywords = _question_keywords(question)
    if not keywords:
        return []

    scored = []
    for chunk in CHUNKS:
        matched = keywords & chunk.words
        if not matched:
            continue
        score = sum(_weight(w) for w in matched)
        scored.append((score, sorted(matched), chunk))

    scored.sort(key=lambda item: (len(item[1]), item[0]), reverse=True)

    results = []
    for score, matched, chunk in scored[:top_k]:
        if score < min_score or (len(matched) < 2 and score < 3):
            continue
        results.append(
            {
                "text": chunk.text,
                "title": chunk.title,
                "source": chunk.source,
                "url": chunk.url,
                "file": chunk.file,
                "score": round(score, 2),
                "matched": matched,
            }
        )
    return results
