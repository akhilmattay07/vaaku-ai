PHONEME_GROUPS = {
    "ழ": ["ழ", "ல", "ள"],
    "ண": ["ண", "ன", "ந"],
    "ட": ["ட", "த", "ற"],
    "ங": ["ங", "ன"],
    "ஞ": ["ஞ", "ன"],
    "ற": ["ற", "ர"],
}

# English names for Tamil sounds
SOUND_NAMES = {
    "ழ": "zha (ழ)",
    "ண": "na (ண)",
    "ட": "ta (ட)",
    "ங": "nga (ங)",
    "ஞ": "nya (ஞ)",
    "ற": "ra (ற)",
}

def levenshtein(s1: str, s2: str) -> int:
    if len(s1) < len(s2):
        return levenshtein(s2, s1)
    if len(s2) == 0:
        return len(s1)
    prev = range(len(s2) + 1)
    for i, c1 in enumerate(s1):
        curr = [i + 1]
        for j, c2 in enumerate(s2):
            curr.append(min(prev[j+1]+1, curr[j]+1, prev[j]+(c1 != c2)))
        prev = curr
    return prev[-1]

def similarity(s1: str, s2: str) -> float:
    if not s1 and not s2:
        return 1.0
    if not s1 or not s2:
        return 0.0
    max_len = max(len(s1), len(s2))
    dist    = levenshtein(s1, s2)
    return 1.0 - (dist / max_len)

def score_word(expected: str, spoken: str) -> float:
    if expected == spoken:
        return 1.0
    sim = similarity(expected, spoken)
    if spoken in expected or expected in spoken:
        sim = max(sim, 0.85)
    return sim

def score_pronunciation(expected: str, spoken: str) -> dict:
    if not spoken.strip():
        return {"score": 0, "mistakes": [], "mistake_names": []}

    exp_words = expected.split()
    spk_words = spoken.split()

    if not exp_words:
        return {"score": 0, "mistakes": [], "mistake_names": []}

    word_scores = []
    for e_word in exp_words:
        if not spk_words:
            word_scores.append(0.0)
            continue
        best = max(score_word(e_word, s_word) for s_word in spk_words)
        word_scores.append(best)

    avg_score = sum(word_scores) / len(word_scores)

    # More generous scoring:
    # 0.6 similarity → 70 score
    # 0.8 similarity → 90 score
    # 0.9 similarity → 98 score
    final_score = min(100, round(avg_score * 120 - 10))
    final_score = max(0, final_score)

    # Only flag mistakes for clearly wrong words (below 0.6)
    mistakes      = []
    mistake_names = []
    for e_word, ws in zip(exp_words, word_scores):
        if ws < 0.6:
            for key, group in PHONEME_GROUPS.items():
                if any(ch in e_word for ch in group):
                    if key not in mistakes:
                        mistakes.append(key)
                        mistake_names.append(SOUND_NAMES.get(key, key))

    return {
        "score":         final_score,
        "mistakes":      mistakes,
        "mistake_names": mistake_names
    }