import google.genai as genai
import os, json, random

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

def get_feedback(expected: str, spoken: str, score: int, mistakes: list, username: str = "friend") -> dict:
    mistake_str = ", ".join(mistakes) if mistakes else "none"

    prompt = f"""You are Vaaku AI, a warm, friendly and encouraging Tamil pronunciation coach.
The student's name is {username}.

Expected sentence : {expected}
What student said : {spoken}
Score             : {score}/100
Difficult sounds  : {mistake_str}

Important rules:
- Always be encouraging and positive, even for low scores
- For scores above 70, praise them enthusiastically
- For scores 40-70, acknowledge the effort and give one specific tip
- For scores below 40, be extra gentle and motivating
- Keep feedback short — max 2 sentences
- Address student by name at least once

Give a JSON response with exactly these keys:
- "feedback": 2 sentence coaching note in English. Be warm and specific.
- "encouragement": One short punchy motivational line.

Return ONLY valid JSON, no markdown.
"""
    try:
        response = client.models.generate_content(
            model="gemini-1.5-flash-latest",
            contents=prompt
        )
        text = response.text.strip()
        if text.startswith("```"):
            text = text.split("```")[1]
            if text.startswith("json"):
                text = text[4:]
        return json.loads(text.strip())
    except Exception:
        return {
            "feedback":      f"Great effort, {username}! Keep practicing and you'll improve with every attempt.",
            "encouragement": random.choice([
                f"You're doing amazing, {username}!",
                f"Every attempt makes you better, {username}!",
                f"Tamil is challenging but you've got this, {username}!",
            ])
        }