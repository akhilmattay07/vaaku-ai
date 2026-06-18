from fastapi import APIRouter
from services.supabase_service import get_mistake_map, client
from models.schemas import AdaptiveSession

router = APIRouter()

BEGINNER_SENTENCES = [
    {"tamil": "வணக்கம்",              "meaning": "Hello",            "roman": "Vanakkam",             "sounds": ["ண"]},
    {"tamil": "நன்றி",                "meaning": "Thank you",        "roman": "Nandri",               "sounds": ["ன", "ற"]},
    {"tamil": "என் பெயர் ராஜா",       "meaning": "My name is Raja",  "roman": "En peyar Raja",        "sounds": ["ண", "ய"]},
    {"tamil": "அன்பு",                "meaning": "Love",             "roman": "Anbu",                 "sounds": ["ன"]},
    {"tamil": "பள்ளி",                "meaning": "School",           "roman": "Palli",                "sounds": ["ள"]},
]

INTERMEDIATE_SENTENCES = [
    {"tamil": "எப்படி இருக்கீர்கள்?", "meaning": "How are you?",      "roman": "Eppadi irukkiingal?",  "sounds": ["ட"]},
    {"tamil": "தமிழ் கற்றுக்கொள்கிறேன்","meaning": "I am learning Tamil","roman": "Tamil katrukolgiren","sounds": ["ழ", "ள"]},
    {"tamil": "வாழ்க வளமுடன்",        "meaning": "Live prosperously", "roman": "Vaazgha valamudan",    "sounds": ["ழ", "ள"]},
    {"tamil": "அன்பு என்பது அரிது",   "meaning": "Love is rare",      "roman": "Anbu enbadhu aridhu",  "sounds": ["ன"]},
    {"tamil": "நட்பு",                "meaning": "Friendship",        "roman": "Natpu",                "sounds": ["ட", "ண"]},
]

ADVANCED_SENTENCES = [
    {"tamil": "நட்பு மிகவும் முக்கியம்","meaning": "Friendship is important","roman": "Natpu migavum mukkiyam","sounds": ["ட", "ண"]},
    {"tamil": "குடும்பம் தான் அனைத்தும்","meaning": "Family is everything","roman": "Kudumbam thaan anaidhum","sounds": ["ட"]},
    {"tamil": "குடும்பம்",             "meaning": "Family",            "roman": "Kudumbam",             "sounds": ["ட"]},
    {"tamil": "வாழ்க வளமுடன்",        "meaning": "Live prosperously", "roman": "Vaazgha valamudan",    "sounds": ["ழ", "ள"]},
    {"tamil": "தமிழ் கற்றுக்கொள்கிறேன்","meaning": "I am learning Tamil","roman": "Tamil katrukolgiren","sounds": ["ழ", "ள"]},
]

ALL_SENTENCES = BEGINNER_SENTENCES + INTERMEDIATE_SENTENCES + ADVANCED_SENTENCES

def get_user_level(user_id: str) -> str:
    try:
        res = client.table("profiles")\
            .select("level")\
            .eq("id", user_id)\
            .single()\
            .execute()
        return res.data.get("level", "beginner") if res.data else "beginner"
    except Exception:
        return "beginner"

@router.get("/adaptive/{user_id}", response_model=AdaptiveSession)
async def get_adaptive_session(user_id: str):
    mistake_map = get_mistake_map(user_id)
    level       = get_user_level(user_id)

    # Pick base sentences from user's level
    if level == "advanced":
        base = ADVANCED_SENTENCES
    elif level == "intermediate":
        base = INTERMEDIATE_SENTENCES
    else:
        base = BEGINNER_SENTENCES

    if not mistake_map:
        return AdaptiveSession(
            sentences=base[:4],
            focus_sounds=[],
            difficulty=level
        )

    top_mistakes = sorted(mistake_map.items(), key=lambda x: x[1], reverse=True)[:3]
    focus        = [m[0] for m in top_mistakes]

    # Weight sentences by weak sounds
    scored = sorted(ALL_SENTENCES,
        key=lambda s: sum(1 for sound in focus if sound in s["sounds"]),
        reverse=True)

    total_err  = sum(mistake_map.values())
    difficulty = "advanced" if total_err > 20 else level

    return AdaptiveSession(sentences=scored[:5], focus_sounds=focus, difficulty=difficulty)