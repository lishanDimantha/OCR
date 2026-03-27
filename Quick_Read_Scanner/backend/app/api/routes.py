from fastapi import APIRouter, UploadFile, File, HTTPException
from app.core.quality_check import check_image_quality
from app.core.preprocessor import preprocess_image
from app.core.ocr_engine import run_ocr_engines
from app.ml.utils.drug_checker import check_drug
from app.ml.utils.drug_database import lookup_drug
import numpy as np
import cv2

router = APIRouter()


@router.post("/scan")
async def scan_prescription(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        np_arr   = np.frombuffer(contents, np.uint8)
        image    = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

        if image is None:
            raise HTTPException(status_code=400,
                                detail="Invalid image file")

        # Quality check
        quality_status, quality_msg = check_image_quality(image)
        if quality_status == "error":
            raise HTTPException(status_code=400,
                                detail=quality_msg)

        # Resize image to prevent large smartphone photos 
        # from causing slow uploads and API timeouts
        max_dim = 1600
        h, w = image.shape[:2]
        if max(h, w) > max_dim:
            scale = max_dim / max(h, w)
            image = cv2.resize(image, (int(w * scale), int(h * scale)))

        # Run OCR
        ocr_result = await run_ocr_engines(image)

        # Manual needed
        if ocr_result["needs_manual"]:
            return {
                "status":     "manual_needed",
                "message":    "OCR confidence අඩුයි. Manual selection.",
                "ocr_text":   ocr_result["text"],
                "words":      ocr_result["drug_words"],
                "rx_items":   ocr_result.get("rx_items", []),
                "confidence": ocr_result["confidence"],
                "engines": {
                    "vision_conf":    ocr_result["engines"].get("gemini", {}).get("confidence", 0),
                }
            }

        # Build structured prescription
        prescription = []
        for item in ocr_result.get("rx_items", []):
            drug_name = item["drug"].upper()

            # Check local DB first
            local = lookup_drug(drug_name)
            if local:
                prescription.append({
                    "status":       "found",
                    "input_word":   drug_name,
                    "drug_name":    item["drug"],
                    "generic":      local.get("generic",""),
                    "class":        local.get("class",""),
                    "use":          local.get("use",""),
                    "classification": local.get("classification", ""),
                    "side_effects": local.get("side_effects", ""),
                    "dosage":       item.get("dosage",""),
                    "quantity":     item.get("quantity",""),
                    "instructions": item.get("instructions",""),
                    "similarity":   item.get("similarity",100),
                    "source":       "local_db",
                    "message":      f"✅ {item['drug']} හඳුනා ගනී",
                })
            else:
                # Check online DB
                db_result = await check_drug(drug_name)
                db_result["dosage"]       = item.get("dosage","")
                db_result["quantity"]     = item.get("quantity","")
                db_result["instructions"] = item.get("instructions","")
                prescription.append(db_result)

        # Fallback: if rx_items empty, use drug_words
        if not prescription:
            for word in ocr_result["drug_words"]:
                result = await check_drug(word)
                prescription.append(result)

        # Format the beautiful OCR text for the mobile app UI
        formatted_text = "--- FULL PIPELINE ---\n"
        formatted_text += f"Method:     {ocr_result.get('method', 'unknown')}\n"
        formatted_text += f"Confidence: {ocr_result.get('confidence', 0)}%\n"
        
        rx_items = ocr_result.get("rx_items", [])
        formatted_text += f"Drugs found: {len(rx_items)}\n"

        if rx_items:
            for i, item in enumerate(rx_items, 1):
                formatted_text += f"\n  [{i}] {item.get('drug', '')}\n"
                formatted_text += f"      Dosage:       {item.get('dosage', '')}\n"
                formatted_text += f"      Qty:          {item.get('quantity', '')}\n"
                formatted_text += f"      Instructions: {item.get('instructions', '')[:100]}\n"
        else:
            formatted_text += f"\n{ocr_result.get('text', '')}"

        return {
            "status":       "success",
            "ocr_text":     formatted_text.strip(),
            "confidence":   ocr_result["confidence"],
            "method":       ocr_result["method"],
            "prescription": prescription,
            "engines": {
                "vision_conf":    ocr_result["engines"].get("gemini", {}).get("confidence", 0),
            }
        }

    except HTTPException:
        raise
    except Exception as e:
        import traceback
        return {"status":"server_error","message":str(e),
                "traceback":traceback.format_exc()}


@router.post("/check-drug")
async def check_single_drug(word: str):
    result = await check_drug(word)
    return result


@router.get("/health")
def health():
    return {"status":"ok","message":"Prescription OCR API running!",
            "engines":["google_vision"]}