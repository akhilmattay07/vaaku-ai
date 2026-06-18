import { useState, useEffect }         from "react"
import { useAuth }                     from "../hooks/useAuth"
import { useRecorder }                 from "../hooks/useRecorder"
import { analyzeAudio, getAdaptiveSession } from "../lib/api"
import { BEGINNER_SENTENCES, INTERMEDIATE_SENTENCES, ADVANCED_SENTENCES, CATEGORIES } from "../data/sentences"
import PracticeCard                    from "../components/PracticeCard"
import RecordButton                    from "../components/RecordButton"
import ResultCard                      from "../components/ResultCard"
import CategoryPicker                  from "../components/CategoryPicker"
import WordOfDay                       from "../components/WordOfDay"
import LevelProgress                   from "../components/LevelProgress"
import TipCard                         from "../components/TipCard"
import { useNavigate }                 from "react-router-dom"
import { supabase }                    from "../lib/supabase"

const LEVEL_SENTENCES = {
  beginner:     BEGINNER_SENTENCES,
  intermediate: INTERMEDIATE_SENTENCES,
  advanced:     ADVANCED_SENTENCES,
}

const NEXT_LEVEL = { beginner: "intermediate", intermediate: "advanced" }
const PREV_LEVEL = { intermediate: "beginner",  advanced: "intermediate" }

export default function Practice() {
  const { user, loading: authLoading } = useAuth()
  const navigate                       = useNavigate()
  const { recording, start, stop }     = useRecorder()

  const [sentences,    setSentences]    = useState([])
  const [index,        setIndex]        = useState(0)
  const [result,       setResult]       = useState(null)
  const [loading,      setLoading]      = useState(false)
  const [category,     setCategory]     = useState(null)
  const [mode,         setMode]         = useState("home")
  const [userLevel,    setUserLevel]    = useState("beginner")
  const [sessionCount, setSessionCount] = useState(0)
  const [tipSound,     setTipSound]     = useState(null)

  useEffect(() => {
    if (authLoading) return
    if (!user) { navigate("/login"); return }

    supabase.from("profiles")
      .select("onboarded, level")
      .eq("id", user.id)
      .single()
      .then(({ data }) => {
        if (data && !data.onboarded) { navigate("/onboarding"); return }
        if (data?.level) setUserLevel(data.level)
      })

    const key   = `session_count_${user.id}`
    const saved = parseInt(localStorage.getItem(key) || "0")
    setSessionCount(saved)
  }, [user, authLoading])

  if (authLoading) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center text-gray-400">
      Loading...
    </div>
  )

  const getSentencesForLevel = (level) => {
    const all = LEVEL_SENTENCES[level] || BEGINNER_SENTENCES
    return [...all].sort(() => Math.random() - 0.5).slice(0, 5)
  }

  const startLevelPractice = () => {
    setSentences(getSentencesForLevel(userLevel))
    setCategory(null)
    setIndex(0)
    setResult(null)
    setMode("practice")
  }

  const startCategory = (catId) => {
    const cat = CATEGORIES.find(c => c.id === catId)
    if (!cat) return
    setCategory(catId)
    setSentences(cat.sentences)
    setIndex(0)
    setResult(null)
    setMode("practice")
  }

  const startAdaptive = async () => {
    try {
      const session = await getAdaptiveSession(user.id)
      if (session?.sentences?.length) setSentences(session.sentences)
      else setSentences(getSentencesForLevel(userLevel))
    } catch {
      setSentences(getSentencesForLevel(userLevel))
    }
    setCategory(null)
    setIndex(0)
    setResult(null)
    setMode("practice")
  }

  const changeLevel = async (newLevel) => {
    await supabase.from("profiles")
      .update({ level: newLevel, updated_at: new Date().toISOString() })
      .eq("id", user.id)
    const key = `session_count_${user.id}`
    localStorage.setItem(key, "0")
    setSessionCount(0)
    setUserLevel(newLevel)
    setMode("home")
  }

  // Check repeat detection — 3 consecutive low scores on same word
  const checkRepeatDetection = (word, score, mistakes) => {
    const key      = `repeat_${user.id}_${word}`
    const history  = JSON.parse(localStorage.getItem(key) || "[]")
    const updated  = [...history, score].slice(-3)
    localStorage.setItem(key, JSON.stringify(updated))

    // If 3 consecutive scores below 50 and there are mistakes
    if (updated.length === 3 &&
        updated.every(s => s < 50) &&
        mistakes.length > 0) {
      setTipSound(mistakes[0])
    }
  }

  const handleStop = async () => {
    setLoading(true)
    const blob = await stop()
    if (!blob) { setLoading(false); return }

    const form = new FormData()
    form.append("audio",    blob, "recording.webm")
    form.append("expected", sentences[index].tamil)
    form.append("user_id",  user.id)

    try {
      const data = await analyzeAudio(form)
      setResult(data)
      // Check if tip needed
      checkRepeatDetection(sentences[index].tamil, data.score, data.mistakes)
    } catch (e) {
      console.error(e)
    }
    setLoading(false)
  }

  const next = () => {
    if (!category) {
      const key      = `session_count_${user.id}`
      const newCount = sessionCount + 1
      localStorage.setItem(key, newCount.toString())
      setSessionCount(newCount)
    }
    if (index >= sentences.length - 1) {
      setResult(null)
      setMode("home")
    } else {
      setResult(null)
      setIndex(i => i + 1)
    }
  }

  const retry = () => setResult(null)

  const levelLabels = {
    beginner:     "Beginner",
    intermediate: "Intermediate",
    advanced:     "Advanced"
  }

  // Home screen
  if (mode === "home") return (
    <div className="min-h-screen bg-gray-950 pt-20 flex flex-col items-center gap-6 p-6">
      <WordOfDay />

      <LevelProgress
        level={userLevel}
        sessionCount={sessionCount}
        onLevelUp={() => changeLevel(NEXT_LEVEL[userLevel])}
        onLevelDown={() => changeLevel(PREV_LEVEL[userLevel])}
      />

      <div className="w-full max-w-lg space-y-3">
        <h3 className="text-lg font-bold text-gray-200">Start Practicing</h3>

        <button onClick={startLevelPractice}
          className="w-full bg-orange-500 hover:bg-orange-400 rounded-2xl p-5 text-left transition">
          <div className="flex items-center gap-4">
            <div>
              <p className="font-bold text-white text-lg">{levelLabels[userLevel]} Practice</p>
              <p className="text-orange-200 text-sm">5 random sentences from your level</p>
            </div>
            <span className="ml-auto text-white text-xl">→</span>
          </div>
        </button>

        <button onClick={startAdaptive}
          className="w-full bg-gray-800 hover:bg-gray-700 rounded-2xl p-5 text-left border border-gray-700 transition">
          <div className="flex items-center gap-4">
            <div>
              <p className="font-bold text-white text-lg">AI Personalized Session</p>
              <p className="text-gray-400 text-sm">Tailored to your weak points</p>
            </div>
            <span className="ml-auto text-gray-400 text-xl">→</span>
          </div>
        </button>

        <button onClick={() => setMode("category")}
          className="w-full bg-gray-800 hover:bg-gray-700 rounded-2xl p-5 text-left border border-gray-700 transition">
          <div className="flex items-center gap-4">
            <div>
              <p className="font-bold text-white text-lg">Practice by Category</p>
              <p className="text-gray-400 text-sm">Greetings, Family, Travel and more</p>
            </div>
            <span className="ml-auto text-gray-400 text-xl">→</span>
          </div>
        </button>
      </div>
    </div>
  )

  // Category screen
  if (mode === "category") return (
    <div className="min-h-screen bg-gray-950 pt-20 flex flex-col items-center gap-6 p-6">
      <div className="w-full max-w-lg flex items-center gap-3">
        <button onClick={() => setMode("home")}
          className="text-gray-400 hover:text-white text-sm">← Back</button>
        <h2 className="text-xl font-bold text-gray-200">Choose a Category</h2>
      </div>
      <CategoryPicker selected={category} onSelect={startCategory} />
    </div>
  )

  // Practice screen
  return (
    <div className="min-h-screen bg-gray-950 pt-20 flex flex-col items-center gap-6 p-6">

      {/* Tip card overlay */}
      {tipSound && (
        <TipCard
          sound={tipSound}
          onDismiss={() => setTipSound(null)}
        />
      )}

      <div className="w-full max-w-lg flex items-center justify-between">
        <button onClick={() => setMode("home")}
          className="text-gray-400 hover:text-white text-sm">← Back</button>
        <h2 className="text-xl font-bold text-gray-200">
          {category
            ? CATEGORIES.find(c => c.id === category)?.label
            : `${levelLabels[userLevel]} Practice`}
        </h2>
        <span className="text-xs text-gray-500">{index + 1}/{sentences.length}</span>
      </div>

      {!result && sentences[index] && (
        <>
          <PracticeCard
            sentence={sentences[index]}
            index={index}
            total={sentences.length}
          />
          <RecordButton
            recording={recording}
            loading={loading}
            onStart={start}
            onStop={handleStop}
          />
        </>
      )}

      {result && <ResultCard result={result} onNext={next} onRetry={retry} />}
    </div>
  )
}