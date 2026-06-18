from fastapi import APIRouter
from fastapi.responses import FileResponse
from gtts import gTTS
import tempfile, os, urllib.parse

router = APIRouter()

@router.get("/audio/{text}")
async def get_audio(text: str):
    decoded = urllib.parse.unquote(text)
    tts     = gTTS(text=decoded, lang="ta", slow=False)
    tmp     = tempfile.mktemp(suffix=".mp3")
    tts.save(tmp)
    return FileResponse(tmp, media_type="audio/mpeg")

@router.get("/audio-slow/{text}")
async def get_audio_slow(text: str):
    decoded = urllib.parse.unquote(text)
    tts     = gTTS(text=decoded, lang="ta", slow=True)
    tmp     = tempfile.mktemp(suffix=".mp3")
    tts.save(tmp)
    return FileResponse(tmp, media_type="audio/mpeg")