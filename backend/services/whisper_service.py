from faster_whisper import WhisperModel
from config import WHISPER_MODEL
import tempfile, os

_model = None

def get_model():
    global _model
    if _model is None:
        _model = WhisperModel(WHISPER_MODEL, device="cpu", compute_type="int8")
    return _model

def transcribe(audio_bytes: bytes, suffix=".webm") -> str:
    model = get_model()
    with tempfile.NamedTemporaryFile(suffix=suffix, delete=False) as f:
        f.write(audio_bytes)
        tmp_path = f.name
    try:
        segments, _ = model.transcribe(tmp_path, language="ta")
        return " ".join(s.text for s in segments).strip()
    finally:
        os.unlink(tmp_path)