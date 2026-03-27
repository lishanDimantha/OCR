import httpx
from app.ml.utils.drug_database import lookup_drug
from app.ml.utils.fuzzy_search import find_similar_drugs_sync

RXNORM_URL = "https://rxnav.nlm.nih.gov/REST"

async def check_drug(word: str) -> dict:

    word = word.strip().upper()

    if not word or len(word) < 2:
        return {"status": "not_found", "input_word": word,
                "message": "Invalid word", "suggestions": []}
    local = lookup_drug(word)
    if local:
        return {
            "status":    "found",
            "input_word": word,
            "drug_name": word.title(),
            "generic":   local.get("generic", ""),
            "class":     local.get("class", ""),
            "use":       local.get("use", ""),
            "source":    "local_db",
            "message":   f"✅ {word.title()} Found"
        }
    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            r = await client.get(
                f"{RXNORM_URL}/drugs.json",
                params={"name": word}
            )

        data = r.json()
        concepts = data.get("drugGroup", {})\
                       .get("conceptGroup", [])

        for group in concepts:
                props = group.get("conceptProperties", [])
                if props:
                    drug = props[0]
                    return {
                        "status":    "found",
                        "input_word": word,
                        "drug_name": drug.get("name"),
                        "rxcui":     drug.get("rxcui"),
                        "generic":   drug.get("synonym", ""),
                        "source":    "rxnorm",
                        "message":   f"✅ {drug.get('name')} හඳුනා ගනී"
                    }

    except Exception:
        pass

    similar = find_similar_drugs_sync(word)
    if similar:
        return {
            "status":      "similar_found",
            "input_word":  word,
            "suggestions": similar,
            "message":     f"⚠️ '{word}' Not recognized. What does this mean?",
        }

    return {
        "status":     "not_found",
        "input_word": word,
        "message":    f"❌ '{word}' Not found in database.",
        "suggestions": []
    }