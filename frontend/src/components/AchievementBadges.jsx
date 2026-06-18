import { BADGE_INFO } from "../data/sentences"

export default function AchievementBadges({ earned = [] }) {
  const earnedSet = new Set(earned.map(a => a.badge))

  return (
    <div className="w-full max-w-lg">
      <h3 className="text-lg font-bold text-gray-200 mb-3">Achievements</h3>
      <div className="grid grid-cols-3 gap-3">
        {Object.entries(BADGE_INFO).map(([key, info]) => {
          const unlocked = earnedSet.has(key)
          return (
            <div key={key}
              className={`rounded-xl p-3 text-center space-y-1 border transition
                ${unlocked
                  ? "bg-yellow-900/30 border-yellow-700/50"
                  : "bg-gray-800 border-gray-700 opacity-40 grayscale"}`}>
              <div className="text-2xl">{info.emoji}</div>
              <p className="text-xs font-semibold text-gray-200">{info.label}</p>
              <p className="text-xs text-gray-400">{info.desc}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}