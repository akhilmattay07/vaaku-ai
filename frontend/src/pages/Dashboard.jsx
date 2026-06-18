import { useState, useEffect }  from "react"
import { useAuth }              from "../hooks/useAuth"
import { getProgress, getAchievements, getHistory } from "../lib/api"
import ProgressDashboard        from "../components/ProgressDashboard"
import AchievementBadges        from "../components/AchievementBadges"
import WordOfDay                from "../components/WordOfDay"
import { useNavigate }          from "react-router-dom"

export default function Dashboard() {
  const { user, loading: authLoading }  = useAuth()
  const navigate                        = useNavigate()
  const [summary,      setSummary]      = useState(null)
  const [achievements, setAchievements] = useState([])
  const [history,      setHistory]      = useState([])
  const [loading,      setLoading]      = useState(true)

  useEffect(() => {
    if (authLoading) return
    if (!user) { navigate("/login"); return }

    Promise.all([
      getProgress(user.id),
      getAchievements(user.id),
      getHistory(user.id),
    ]).then(([s, a, h]) => {
      setSummary(s); setAchievements(a); setHistory(h)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [user, authLoading])

  if (authLoading || loading) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center text-gray-400">
      Loading your progress...
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-950 pt-20 p-6 flex flex-col items-center gap-6">

      {/* Word of the Day — full width on top */}
      <div className="w-full max-w-5xl">
        <WordOfDay />
      </div>

      {/* Two column layout */}
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">

        {/* Left — Stats + Calendar + Chart */}
        <ProgressDashboard summary={summary} history={history} />

        {/* Right — Recent Attempts + Achievements */}
        <div className="space-y-6">

          {/* Recent Attempts */}
          {history?.length > 0 && (
            <div className="bg-gray-800 rounded-2xl p-5 border border-gray-700">
              <h3 className="text-lg font-bold text-gray-200 mb-4">Recent Attempts</h3>
              <div className="space-y-2">
                {history.slice(0, 8).map((a, i) => (
                  <div key={i}
                    className="flex items-center justify-between py-2 border-b border-gray-700 last:border-0">
                    <div className="flex-1 min-w-0 pr-3">
                      <p className="text-white font-medium truncate">{a.sentence}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(a.created_at).toLocaleDateString("en-IN", {
                          day: "numeric", month: "short",
                          hour: "2-digit", minute: "2-digit"
                        })}
                      </p>
                    </div>
                    <span className={`text-xl font-black flex-shrink-0
                      ${a.score >= 80 ? "text-green-400"
                      : a.score >= 50 ? "text-yellow-400"
                      :                 "text-red-400"}`}>
                      {a.score}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Achievements */}
          <AchievementBadges earned={achievements} />

        </div>
      </div>
    </div>
  )
}