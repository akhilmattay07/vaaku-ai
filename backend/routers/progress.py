from fastapi import APIRouter
from services import supabase_service
from models.schemas import ProgressSummary
from datetime import date

router = APIRouter()

@router.get("/word-of-day")
async def get_word_of_day():
    today = date.today().isoformat()
    try:
        res = supabase_service.client.table("word_of_day")\
            .select("*")\
            .eq("date", today)\
            .single()\
            .execute()
        if res.data:
            return res.data
    except Exception:
        pass
    try:
        res2 = supabase_service.client.table("word_of_day")\
            .select("*")\
            .order("date", desc=True)\
            .limit(1)\
            .execute()
        if res2.data:
            return res2.data[0]
    except Exception:
        pass
    return {
        "tamil":         "வணக்கம்",
        "roman":         "Vanakkam",
        "meaning":       "Hello",
        "example":       "வணக்கம் நண்பா",
        "example_roman": "Vanakkam nanbaa"
    }

@router.get("/leaderboard")
async def get_leaderboard():
    try:
        res = supabase_service.client.table("leaderboard")\
            .select("*")\
            .order("average_score", desc=True)\
            .limit(20)\
            .execute()
        return res.data or []
    except Exception as e:
        return []

@router.get("/progress/{user_id}", response_model=ProgressSummary)
async def get_progress(user_id: str):
    attempts = supabase_service.get_user_attempts(user_id, limit=200)
    data     = attempts.data

    if not data:
        return ProgressSummary(
            total_attempts=0, average_score=0, best_score=0,
            weak_sounds=[], strong_sounds=[], streak_days=0)

    scores        = [a["score"] for a in data]
    avg           = round(sum(scores) / len(scores), 1)
    best          = max(scores)
    streak        = supabase_service.get_streak(user_id)
    mistake_map   = supabase_service.get_mistake_map(user_id)
    sorted_m      = sorted(mistake_map.items(), key=lambda x: x[1], reverse=True)
    weak_sounds   = [m[0] for m in sorted_m[:3]]
    strong_sounds = [m[0] for m in sorted_m[-3:] if m[1] <= 1]

    return ProgressSummary(
        total_attempts=len(data), average_score=avg, best_score=best,
        weak_sounds=weak_sounds, strong_sounds=strong_sounds, streak_days=streak)

@router.get("/achievements/{user_id}")
async def get_achievements(user_id: str):
    return supabase_service.get_achievements(user_id)

@router.get("/history/{user_id}")
async def get_history(user_id: str):
    return supabase_service.get_user_attempts(user_id, limit=20).data