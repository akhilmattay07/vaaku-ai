export default function LevelProgress({ level, sessionCount, onLevelUp, onLevelDown }) {
  const SESSIONS_TO_UNLOCK = 10
  const progress = Math.min(sessionCount, SESSIONS_TO_UNLOCK)
  const unlocked = sessionCount >= SESSIONS_TO_UNLOCK
  const percent  = (progress / SESSIONS_TO_UNLOCK) * 100

  const levelInfo = {
    beginner:     { label: "Beginner",     color: "bg-green-500"  },
    intermediate: { label: "Intermediate", color: "bg-blue-500"   },
    advanced:     { label: "Advanced",     color: "bg-purple-500" },
  }

  const info = levelInfo[level] || levelInfo.beginner

  return (
    <div className="w-full max-w-lg bg-gray-800 rounded-2xl p-5 border border-gray-700 space-y-4">

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{info.emoji}</span>
          <div>
            <p className="text-xs text-gray-400">Current Level</p>
            <p className="font-bold text-white">{info.label}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-400">Words attempted</p>
          <p className="font-bold text-orange-400">{progress} / {SESSIONS_TO_UNLOCK}</p>
        </div>
      </div>

      <div>
        <div className="w-full bg-gray-700 rounded-full h-3">
          <div
            className={`${info.color} h-3 rounded-full transition-all duration-700`}
            style={{ width: `${percent}%` }}
          />
        </div>
        {!unlocked
          ? <p className="text-xs text-gray-500 mt-1">
              Attempt {SESSIONS_TO_UNLOCK - progress} more word{SESSIONS_TO_UNLOCK - progress !== 1 ? "s" : ""} to unlock level change
            </p>
          : <p className="text-xs text-green-400 mt-1">
              Level change unlocked! Choose below to switch.
            </p>
        }
      </div>

      {unlocked && (
        <div className="flex gap-3">
          {level !== "beginner" && (
            <button onClick={onLevelDown}
              className="flex-1 bg-gray-700 hover:bg-gray-600 py-2 rounded-xl text-sm font-semibold text-gray-300">
              ← {level === "advanced" ? "Intermediate" : "Beginner"}
            </button>
          )}
          {level !== "advanced" && (
            <button onClick={onLevelUp}
              className="flex-1 bg-orange-500 hover:bg-orange-400 py-2 rounded-xl text-sm font-semibold text-white">
              {level === "beginner" ? "Intermediate" : "Advanced"} →
            </button>
          )}
        </div>
      )}
    </div>
  )
}