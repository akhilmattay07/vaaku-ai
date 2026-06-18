import { useState } from "react"
import { useAuth }  from "../hooks/useAuth"
import { supabase } from "../lib/supabase"
import { useNavigate } from "react-router-dom"

const STEPS = [
  {
    id:       "level",
    question: "What's your Tamil level?",
    options:  [
      { value: "beginner",     label: "Beginner",      desc: "I know very little Tamil / I don't even know a single word" },
      { value: "intermediate", label: "Intermediate",  desc: "I know some words and phrases" },
      { value: "advanced",     label: "Advanced",      desc: "I can hold basic conversations" },
    ]
  },
  {
    id:       "goal",
    question: "What's your main goal?",
    options:  [
      { value: "heritage",  label: "Heritage",       desc: "Connect with my Tamil roots" },
      { value: "travel",    label: "Travel",         desc: "Communicate while travelling" },
      { value: "family",    label: "Family",         desc: "Talk with Tamil-speaking family" },
      { value: "academic",  label: "Academic",       desc: "Learn for school or exams"  },
    ]
  },
  {
    id:       "daily_minutes",
    question: "How much time can you practice daily?",
    options:  [
      { value: 5,  label: "5 minutes",  desc: "Quick daily practice" },
      { value: 10, label: "10 minutes", desc: "Steady progress" },
      { value: 20, label: "20 minutes", desc: "Serious learner" },
      { value: 30, label: "30 minutes", desc: "Dedicated student" },
    ]
  }
]

export default function Onboarding() {
  const { user }   = useAuth()
  const navigate   = useNavigate()
  const [step,     setStep]    = useState(0)
  const [answers,  setAnswers] = useState({})
  const [saving,   setSaving]  = useState(false)
  const [selected, setSelected] = useState(null)

  const current = STEPS[step]
  const isLast  = step === STEPS.length - 1

  const handleSelect = (value) => setSelected(value)

  const handleNext = async () => {
    if (selected === null) return
    const newAnswers = { ...answers, [current.id]: selected }
    setAnswers(newAnswers)

    if (isLast) {
      setSaving(true)
      await supabase.from("profiles").upsert({
        id:             user.id,
        level:          newAnswers.level,
        goal:           newAnswers.goal,
        daily_minutes:  newAnswers.daily_minutes,
        onboarded:      true,
        updated_at:     new Date().toISOString()
      })
      setSaving(false)
      navigate("/practice")
    } else {
      setStep(s => s + 1)
      setSelected(null)
    }
  }

  const handleBack = () => {
    if (step === 0) return
    setStep(s => s - 1)
    setSelected(answers[STEPS[step - 1].id] ?? null)
  }

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center p-6">

      {/* Progress bar */}
      <div className="w-full max-w-lg mb-8">
        <div className="flex justify-between text-xs text-gray-500 mb-2">
          <span>Step {step + 1} of {STEPS.length}</span>
          <span>{Math.round(((step + 1) / STEPS.length) * 100)}%</span>
        </div>
        <div className="w-full bg-gray-800 rounded-full h-2">
          <div
            className="bg-orange-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Card */}
      <div className="bg-gray-800 rounded-2xl p-8 w-full max-w-lg border border-gray-700 space-y-6">

        {/* Question */}
        <div className="text-center space-y-2">
          <div className="text-5xl">{current.emoji}</div>
          <h2 className="text-2xl font-bold text-white">{current.question}</h2>
        </div>

        {/* Options */}
        <div className="space-y-3">
          {current.options.map(opt => (
            <button
              key={opt.value}
              onClick={() => handleSelect(opt.value)}
              className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition text-left
                ${selected === opt.value
                  ? "border-orange-500 bg-orange-500/10"
                  : "border-gray-700 bg-gray-700/50 hover:border-gray-500"}`}>
              <span className="text-2xl">{opt.emoji}</span>
              <div>
                <p className="font-semibold text-white">{opt.label}</p>
                <p className="text-sm text-gray-400">{opt.desc}</p>
              </div>
              {selected === opt.value && (
                <span className="ml-auto text-orange-400 text-xl">✓</span>
              )}
            </button>
          ))}
        </div>

        {/* Navigation */}
        <div className="flex gap-3">
          {step > 0 && (
            <button onClick={handleBack}
              className="flex-1 bg-gray-700 hover:bg-gray-600 py-3 rounded-xl font-semibold text-sm">
              ← Back
            </button>
          )}
          <button
            onClick={handleNext}
            disabled={selected === null || saving}
            className="flex-1 bg-orange-500 hover:bg-orange-400 py-3 rounded-xl font-semibold disabled:opacity-50">
            {saving ? "Setting up..." : isLast ? "Start Learning! 🚀" : "Next →"}
          </button>
        </div>
      </div>

      {/* Skip */}
      <button
        onClick={() => navigate("/practice")}
        className="mt-4 text-sm text-gray-500 hover:text-gray-400">
        Skip for now
      </button>

    </div>
  )
}