from rapidfuzz import fuzz, process
from app.ml.utils.drug_database import get_all_names, lookup_drug

def find_similar_drugs_sync(word: str, limit=3) -> list:
    word = word.upper().strip()
    all_names = get_all_names()

    # Multiple scoring methods
    matches_wratio = process.extract(
        word, all_names, scorer=fuzz.WRatio, limit=limit*2)
    matches_partial = process.extract(
        word, all_names, scorer=fuzz.partial_ratio, limit=limit*2)
    matches_token = process.extract(
        word, all_names, scorer=fuzz.token_sort_ratio, limit=limit*2)

    # Combine scores
    score_map = {}
    for name, score, _ in matches_wratio:
        score_map[name] = score_map.get(name, 0) + score * 0.5
    for name, score, _ in matches_partial:
        score_map[name] = score_map.get(name, 0) + score * 0.3
    for name, score, _ in matches_token:
        score_map[name] = score_map.get(name, 0) + score * 0.2

    # Sort by combined score
    sorted_matches = sorted(score_map.items(),
                            key=lambda x: x[1], reverse=True)

    results = []
    for name, combined_score in sorted_matches[:limit]:
        if combined_score >= 50:
            drug_info = lookup_drug(name) or {}
            results.append({
                "name":        name.title(),
                "generic":     drug_info.get("generic", ""),
                "class":       drug_info.get("class", ""),
                "use":         drug_info.get("use", ""),
                "similarity":  round(combined_score, 1),
                "source":      "local_db"
            })
    return results

async def find_similar_drugs(word: str, limit=3) -> list:
    return find_similar_drugs_sync(word, limit)