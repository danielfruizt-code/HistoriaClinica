# app/extractor.py
import os
import re

def load_model(model_dir):
    try:
        import spacy
        if os.path.isdir(model_dir):
            return spacy.load(model_dir)
        # fallback a modelo spaCy en español si está instalado
        try:
            return spacy.load("es_core_news_sm")
        except Exception:
            return None
    except Exception:
        return None

# heurísticas/reglas regexp básicas (útiles para probar rápido con OCR ruidoso)
def extract_fields(text: str):
    out = {
        "nombre": None,
        "edad": None,
        "diagnostico": None,
        "fechaConsulta": None,
        "direccion": None,
        "telefono": None,
        "observaciones": None
    }

    def find(regex):
        m = re.search(regex, text, re.IGNORECASE | re.MULTILINE)
        return m.group(1).strip() if m else None

    out["nombre"] = find(r"Nombre[:\-\s]*([A-ZÁÉÍÓÚÑa-záéíóúñü\s]+)")
    out["edad"] = find(r"Edad[:\-\s]*(\d{1,3})")
    out["diagnostico"] = find(r"Diagnosti.?co[:\-\s]*([\w\s\,\-\.\:]+)")
    out["fechaConsulta"] = find(r"Fecha (?:de )?Consulta[:\-\s]*([\d\/\-\.\s]+)")
    out["direccion"] = find(r"Direcci[oó]n[:\-\s]*([\w0-9\,\.\-\s]+)")
    out["telefono"] = find(r"Tel[eé]fono[:\-\s]*([\+\d\-\s\(\)]{7,20})")
    # Observaciones: toma el bloque tras Observaciones:
    obs = re.search(r"Observaciones[:\-\s]*(.+)", text, re.IGNORECASE | re.DOTALL)
    if obs:
        out["observaciones"] = obs.group(1).strip()
    else:
        # si no hay campo dedicado, toma últimas 150 chars
        out["observaciones"] = text.strip()[:150]
    return out

# usar spaCy NER si existe un modelo entrenado
def extract_with_model(nlp, text: str):
    if not nlp:
        return {}
    doc = nlp(text)
    result = {}
    # Suponemos que durante training usamos etiquetas como: NOMBRE, DIAGNOSTICO, DIRECCION, FECHA, TELEFONO, EDAD
    for ent in doc.ents:
        label = ent.label_.upper()
        if label == "NOMBRE":
            result["nombre"] = ent.text
        elif label == "EDAD":
            result["edad"] = ent.text
        elif label == "DIAGNOSTICO":
            result["diagnostico"] = ent.text
        elif label in ("FECHA", "FECHACONSULTA"):
            result["fechaConsulta"] = ent.text
        elif label == "DIRECCION":
            result["direccion"] = ent.text
        elif label == "TELEFONO":
            result["telefono"] = ent.text
        elif label == "OBSERVACIONES":
            result["observaciones"] = ent.text
    return result
