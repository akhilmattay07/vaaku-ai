import { useState, useEffect } from "react"
import { getWordOfDay, getAudioUrl } from "../lib/api"

export default function WordOfDay() {
  const [word,    setWord]    = useState(null)
  const [loading, setLoading] = useState(true)
  const [flipped, setFlipped] = useState(false)

  useEffect(() => {
    getWordOfDay()
      .then(w => { setWord(w); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const playAudio = (e) => {
    e.stopPropagation()
    if (!word) return
    const audio = new Audio(getAudioUrl(word.tamil))
    audio.play()
  }

  if (loading || !word) return null

  return (
    <div className="w-full max-w-lg">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">📅</span>
        <h3 className="text-lg font-bold text-gray-200">Word of the Day</h3>
        <span className="ml-auto text-xs text-gray-500">
          {new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long" })}
        </span>
      </div>

      <div
        onClick={() => setFlipped(f => !f)}
        className="bg-gradient-to-br from-orange-900/30 to-gray-800 rounded-2xl p-6 border border-orange-800/30 cursor-pointer hover:border-orange-600/50 transition space-y-3">

        {!flipped ? (
          <div className="text-center space-y-2">
            <p className="text-5xl font-bold">{word.tamil}</p>
            <p className="text-orange-300 text-lg">{word.roman}</p>
            <p className="text-gray-400">{word.meaning}</p>
            <p className="text-xs text-gray-500 mt-3">Tap to see example →</p>
          </div>
        ) : (
          <div className="text-center space-y-2">
            <p className="text-gray-400 text-xs uppercase tracking-wide">Example</p>
            <p className="text-2xl font-bold">{word.example}</p>
            <p className="text-orange-300">{word.example_roman}</p>
            <p className="text-xs text-gray-500 mt-3">← Tap to go back</p>
          </div>
        )}

        <div className="flex justify-center pt-2">
          <button
            onClick={playAudio}
            className="text-sm text-blue-400 hover:text-blue-300 underline">
            🔊 Hear pronunciation
          </button>
        </div>
      </div>
    </div>
  )
}