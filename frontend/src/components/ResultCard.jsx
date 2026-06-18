import { useState } from "react"
import ShareCard    from "./ShareCard"

export default function ResultCard({ result, onNext, onRetry }) {
  const { score, spoken, expected, feedback, encouragement, mistakes } = result
  const [showShare, setShowShare] = useState(false)

  const color = score >= 80 ? "text-green-400"
              : score >= 50 ? "text-yellow-400"
              :               "text-red-400"

  const ring  = score >= 80 ? "ring-green-500"
              : score >= 50 ? "ring-yellow-500"
              :               "ring-red-500"

  return (
    <>
      {showShare && (
        <ShareCard result={result} onClose={() => setShowShare(false)} />
      )}

      <div className="bg-gray-800 rounded-2xl p-6 w-full max-w-lg space-y-4 border border-gray-700">

        {/* Score circle */}
        <div className="flex justify-center">
          <div className={`w-24 h-24 rounded-full ring-4 ${ring} flex flex-col items-center justify-center`}>
            <span className={`text-3xl font-black ${color}`}>{score}</span>
            <span className="text-xs text-gray-400">/ 100</span>
          </div>
        </div>

        {/* What you said */}
        <div className="bg-gray-700 rounded-xl p-4 space-y-1">
          <p className="text-xs text-gray-400">You said:</p>
          <p className="text-xl">
            {spoken || <span className="text-gray-500 italic">Nothing detected</span>}
          </p>
          <p className="text-xs text-gray-500">Expected: {expected}</p>
        </div>

        {/* Mistakes */}
        {mistakes?.length > 0 && (
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-xs text-gray-400">Focus sounds:</span>
            {mistakes.map(m => (
              <span key={m}
                className="bg-red-900/40 text-red-300 text-xs px-2 py-0.5 rounded-full">
                {m}
              </span>
            ))}
          </div>
        )}

        {/* Feedback */}
        <div className="bg-orange-950/40 border border-orange-800/30 rounded-xl p-4 space-y-2">
          <p className="text-xs text-orange-400 font-semibold">Coach says:</p>
          <p className="text-sm leading-relaxed text-gray-200">{feedback}</p>
          <p className="text-sm text-orange-300 italic">{encouragement}</p>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-3 gap-2">
          <button onClick={onRetry}
            className="bg-gray-700 hover:bg-gray-600 py-3 rounded-xl font-semibold text-sm">
            Try Again
          </button>
          <button onClick={() => setShowShare(true)}
            className="bg-gray-700 hover:bg-gray-600 py-3 rounded-xl font-semibold text-sm">
            Share
          </button>
          <button onClick={onNext}
            className="bg-orange-500 hover:bg-orange-400 py-3 rounded-xl font-semibold text-sm">
            Next →
          </button>
        </div>
      </div>
    </>
  )
}