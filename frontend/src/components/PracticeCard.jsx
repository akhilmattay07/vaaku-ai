import { useState } from "react"
import { getAudioUrl, getSlowAudioUrl } from "../lib/api"

export default function PracticeCard({ sentence, index, total }) {
  const [playing, setPlaying] = useState(null) // 'normal' | 'slow' | null

  const playAudio = (slow = false) => {
    const url   = slow ? getSlowAudioUrl(sentence.tamil) : getAudioUrl(sentence.tamil)
    const audio = new Audio(url)
    setPlaying(slow ? "slow" : "normal")
    audio.play()
    audio.onended = () => setPlaying(null)
  }

  return (
    <div className="bg-gray-800 rounded-2xl p-8 w-full max-w-lg text-center space-y-3 border border-gray-700">
      <div className="flex justify-between text-xs text-gray-500 mb-2">
        <span className="capitalize bg-gray-700 px-2 py-1 rounded-full">
          {sentence.level || "practice"}
        </span>
        <span>{index + 1} / {total}</span>
      </div>

      <p className="text-gray-400 text-sm">Say this sentence:</p>
      <p className="text-5xl font-bold leading-tight">{sentence.tamil}</p>

      {sentence.roman && (
        <p className="text-orange-300 text-lg font-medium tracking-wide">
          {sentence.roman}
        </p>
      )}

      <p className="text-gray-400 text-base">{sentence.meaning}</p>

      {/* Audio buttons */}
      <div className="flex justify-center gap-3 pt-2">
        <button
          onClick={() => playAudio(false)}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition
            ${playing === "normal"
              ? "bg-blue-500 text-white"
              : "bg-gray-700 text-gray-300 hover:bg-gray-600"}`}>
          🔊 Normal
        </button>
        <button
          onClick={() => playAudio(true)}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition
            ${playing === "slow"
              ? "bg-blue-500 text-white"
              : "bg-gray-700 text-gray-300 hover:bg-gray-600"}`}>
          🐢 Slow
        </button>
      </div>
    </div>
  )
}