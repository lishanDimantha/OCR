import os
import re
import base64
import httpx
import cv2
import numpy as np
from app.core.preprocessor import enhance_contrast

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "AIzaSyD5dP3OHMevDP-SqN5umbbCkoOgFSGXGss")
GEMINI_URL     = (
    "https://generativelanguage.googleapis.com/v1beta"
    "/models/gemini-2.5-flash:generateContent"
    f"?key={GEMINI_API_KEY}"
)

PROMPT = """You are a medical prescription OCR expert.
Analyze this doctor's handwritten prescription image carefully.

Extract ALL medicines with their details in this EXACT format:

DRUG: [medicine name]
DOSAGE: [dose like 500mg, 500/125mg, 200mg/5ml]
QTY: [quantity like #21, 30 tablets]
INSTRUCTIONS: [full instructions like "Take one with food every 8 hours for 7 days"]
---
DRUG: [next medicine]
DOSAGE: [dose]
QTY: [quantity]
INSTRUCTIONS: [instructions]
---

Rules:
- Extract EVERY medicine in the prescription
- Write medicine names in proper English (e.g. Amoxicillin, Paracetamol)
- Include dosage units (mg, ml, mcg)
- Include ALL instruction details (timing, frequency, duration, conditions)
- If a detail is not visible, write UNKNOWN
- Do NOT include patient info, doctor info, or dates
- Only output medicine entries in the format above, nothing else
"""

async def ocr_gemini(image_np: np.ndarray) -> dict:
    """
    Send prescription image to Gemini Vision.
    Returns structured prescription data.
    """

    if not GEMINI_API_KEY:
        return {
            "engine":     "gemini",
            "text":       "",
            "rx_items":   [],
            "confidence": 0,
            "success":    False,
            "error":      "No Gemini API key in .env"
        }

    try:
        enhanced     = enhance_contrast(image_np)
        enhanced_bgr = cv2.cvtColor(enhanced, cv2.COLOR_GRAY2BGR)

        _, buffer = cv2.imencode(
            '.jpg', enhanced_bgr,
            [cv2.IMWRITE_JPEG_QUALITY, 98]
        )
        b64_image = base64.b64encode(buffer).decode('utf-8')

        payload = {
            "contents": [{
                "parts": [
                    {
                        "inline_data": {
                            "mime_type": "image/jpeg",
                            "data":      b64_image
                        }
                    },
                    {
                        "text": PROMPT
                    }
                ]
            }],
            "generationConfig": {
                "temperature":     0.1,
                "maxOutputTokens": 2048,
            }
        }

        import asyncio

        for attempt in range(3):
            async with httpx.AsyncClient(timeout=30.0, trust_env=False) as client:
                resp = await client.post(GEMINI_URL, json=payload)
                data = resp.json()

            if resp.status_code == 429 and attempt < 2:
                error_msg = data.get("error", {}).get("message", "")
                wait_time = 15

                m = re.search(r'retry in (\d+(?:\.\d+)?)s', error_msg)
                if m:
                    wait_time = min(float(m.group(1)) + 1.0, 30.0)

                print(f"[Gemini API] Rate limited. Retrying in {wait_time:.1f}s (Attempt {attempt+1}/3)...")
                await asyncio.sleep(wait_time)
                continue

            break

        candidates = data.get("candidates", [])
        if not candidates:
            error = data.get("error", {}).get("message", "No response")
            return {
                "engine": "gemini", "text": "",
                "rx_items": [], "confidence": 0,
                "success": False, "error": error
            }

        raw_text = ""
        for part in candidates[0].get("content", {}).get("parts", []):
            raw_text += part.get("text", "")

            rx_items = parse_gemini_output(raw_text)

        return {
            "engine":     "gemini",
            "text":       raw_text,
            "rx_items":   rx_items,
            "confidence": 90.0 if rx_items else 50.0,
            "success":    bool(rx_items),
        }

    except Exception as e:
        return {
            "engine":     "gemini",
            "text":       "",
            "rx_items":   [],
            "confidence": 0,
            "success":    False,
            "error":      str(e)
        }

def parse_gemini_output(text: str) -> list:
    """
    Parse Gemini structured output into prescription items.
    Format:
        DRUG: Amoxicillin
        DOSAGE: 500/125mg
        QTY: #21
        INSTRUCTIONS: Take one with food every 8 hours for 7 days
        ---
    """

    items   = []
    entries = re.split(r'\n\s*---\s*\n?', text)

    for entry in entries:
        entry = entry.strip()
        if not entry:
            continue

        drug   = extract_field(entry, "DRUG")
        dosage = extract_field(entry, "DOSAGE")
        qty    = extract_field(entry, "QTY")
        instr  = extract_field(entry, "INSTRUCTIONS")

        if not drug or drug.upper() in {
            "UNKNOWN","N/A","NONE","NOT VISIBLE",""
        }:
            continue

        if qty and not qty.startswith("#"):
            m = re.search(r'\d+', qty)
            if m:
                qty = f"#{m.group(0)}"

        if dosage and dosage.upper() == "UNKNOWN":
            dosage = ""
        if instr and instr.upper() == "UNKNOWN":
            instr = ""

        items.append({
            "drug":         drug.strip(),
            "matched_from": drug.strip(),
            "similarity":   95,
            "dosage":       dosage.strip() if dosage else "",
            "quantity":     qty.strip() if qty else "",
            "instructions": instr.strip() if instr else "",
            "generic_hint": "",
            "raw_line":     drug.strip(),
            "source":       "gemini"
        })

    return items

def extract_field(text: str, field: str) -> str:
    """Extract a field value from Gemini output."""
    pattern = rf'^{field}\s*:\s*(.+)$'
    m = re.search(pattern, text, re.MULTILINE | re.IGNORECASE)
    if m:
        return m.group(1).strip()
    return ""