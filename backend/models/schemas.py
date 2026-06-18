from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class AnalyzeResponse(BaseModel):
    spoken: str
    expected: str
    score: int
    feedback: str
    mistakes: List[str]
    encouragement: str

class ProgressSummary(BaseModel):
    total_attempts: int
    average_score: float
    best_score: int
    weak_sounds: List[str]
    strong_sounds: List[str]
    streak_days: int

class AdaptiveSession(BaseModel):
    sentences: List[dict]
    focus_sounds: List[str]
    difficulty: str