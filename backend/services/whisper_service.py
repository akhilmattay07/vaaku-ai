import os
import tempfile
from groq import Groq

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def transcribe(audio_bytes: bytes, suffix=".webm") -> str:
    with tempfile.NamedTemporaryFile(suffix=suffix, delete=False) as f:
        f.write(audio_bytes)
        tmp_path = f.name

    try:
        with open(tmp_path, "rb") as audio_file:
            transcription = client.audio.transcriptions.create(
                model="whisper-large-v3",
                file=("recording.webm", audio_file, "audio/webm"),
                language="ta",
                response_format="text"
            )
        return transcription.strip() if transcription else ""
    except Exception as e:
        print(f"Transcription error: {e}")
        return ""
    finally:
        import os as _os
        try:
            _os.unlink(tmp_path)
        except:
            pass