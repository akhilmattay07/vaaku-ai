from supabase import create_client
from config import SUPABASE_URL, SUPABASE_KEY

client = create_client(SUPABASE_URL, SUPABASE_KEY)

def save_attempt(user_id: str, sentence: str, spoken: str,
                 score: int, feedback: str, mistakes: list):
    return client.table("attempts").insert({
        "user_id":  user_id,
        "sentence": sentence,
        "spoken":   spoken,
        "score":    score,
        "feedback": feedback,
        "mistakes": mistakes,
    }).execute()

def get_user_attempts(user_id: str, limit: int = 50):
    return client.table("attempts")\
        .select("*")\
        .eq("user_id", user_id)\
        .order("created_at", desc=True)\
        .limit(limit)\
        .execute()

def get_mistake_map(user_id: str):
    res = client.table("attempts")\
        .select("mistakes")\
        .eq("user_id", user_id)\
        .execute()
    freq = {}
    for row in res.data:
        for m in (row["mistakes"] or []):
            freq[m] = freq.get(m, 0) + 1
    return freq

def get_streak(user_id: str):
    from datetime import datetime, timedelta
    res = client.table("attempts")\
        .select("created_at")\
        .eq("user_id", user_id)\
        .order("created_at", desc=True)\
        .execute()
    if not res.data:
        return 0
    dates = sorted(set(
        datetime.fromisoformat(r["created_at"][:10])
        for r in res.data
    ), reverse=True)
    streak = 1
    for i in range(1, len(dates)):
        if (dates[i-1] - dates[i]).days == 1:
            streak += 1
        else:
            break
    return streak

def save_achievement(user_id: str, badge: str):
    existing = client.table("achievements")\
        .select("badge")\
        .eq("user_id", user_id)\
        .eq("badge", badge)\
        .execute()
    if not existing.data:
        client.table("achievements").insert({
            "user_id": user_id,
            "badge":   badge,
        }).execute()
        return True
    return False

def get_achievements(user_id: str):
    res = client.table("achievements")\
        .select("badge, created_at")\
        .eq("user_id", user_id)\
        .execute()
    return res.data