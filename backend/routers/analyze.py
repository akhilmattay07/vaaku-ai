from fastapi import APIRouter, UploadFile, File, Form
from services import whisper_service, scoring_service, claude_service, supabase_service
from models.schemas import AnalyzeResponse

router = APIRouter()

ACHIEVEMENT_RULES = {
    "first_attempt": lambda stats: stats["total"] >= 1,
    "score_80":      lambda stats: stats["best"]  >= 80,
    "score_100":     lambda stats: stats["best"]  == 100,
    "ten_attempts":  lambda stats: stats["total"] >= 10,
    "streak_3":      lambda stats: stats["streak"] >= 3,
}

@router.post("/analyze", response_model=AnalyzeResponse)
async def analyze(
    audio:    UploadFile = File(...),
    expected: str        = Form(...),
    user_id:  str        = Form(...)
):
    audio_bytes = await audio.read()
    spoken      = whisper_service.transcribe(audio_bytes) or ""

    result        = scoring_service.score_pronunciation(expected, spoken)
    score         = result["score"]
    mistakes      = result["mistakes"]
    mistake_names = result.get("mistake_names", [])

    # Get username for personalized feedback
    try:
        profile = supabase_service.client.table("profiles")\
            .select("username, first_name")\
            .eq("id", user_id)\
            .single()\
            .execute()
        username = profile.data.get("username") or profile.data.get("first_name") or "friend"
    except Exception:
        username = "friend"

    claude_resp   = claude_service.get_feedback(expected, spoken, score, mistake_names, username)
    feedback      = claude_resp.get("feedback", "")
    encouragement = claude_resp.get("encouragement", "")

    supabase_service.save_attempt(user_id, expected, spoken, score, feedback, mistakes)

    attempts = supabase_service.get_user_attempts(user_id, limit=200)
    scores   = [a["score"] for a in attempts.data]
    streak   = supabase_service.get_streak(user_id)
    stats    = {
        "total":  len(scores),
        "best":   max(scores) if scores else 0,
        "streak": streak
    }
    for badge, rule in ACHIEVEMENT_RULES.items():
        if rule(stats):
            supabase_service.save_achievement(user_id, badge)

    return AnalyzeResponse(
        spoken=spoken,
        expected=expected,
        score=score,
        feedback=feedback,
        mistakes=mistake_names,
        encouragement=encouragement,
    )