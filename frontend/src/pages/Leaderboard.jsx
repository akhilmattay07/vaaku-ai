import { useState, useEffect } from "react"
import { useAuth }             from "../hooks/useAuth"
import { getLeaderboard }      from "../lib/api"

const TABS = ["Top Scores", "Most Active"]

const medals = ["🥇", "🥈", "🥉"]

export default function Leaderboard() {
  const { user }                  = useAuth()
  const [data,    setData]        = useState([])
  const [loading, setLoading]     = useState(true)
  const [tab,     setTab]         = useState("Top Scores")

  useEffect(() => {
    getLeaderboard()
      .then(d => { setData(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const sorted = tab === "Top Scores"
    ? [...data].sort((a, b) => b.average_score - a.average_score)
    : [...data].sort((a, b) => b.total_attempts - a.total_attempts)

  const userRank = sorted.findIndex(d => d.id === user?.id) + 1
  const userData = sorted.find(d => d.id === user?.id)

  if (loading) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center text-gray-400">
      Loading leaderboard...
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-950 pt-20 flex flex-col items-center p-6 gap-6">
      <div className="w-full max-w-lg">

        {/* Header */}
        <div className="text-center mb-6 space-y-1">
          <h1 className="text-3xl font-black text-white">Leaderboard</h1>
          <p className="text-gray-400 text-sm">Top Tamil speakers on Vaaku AI</p>
        </div>

        {/* Your rank card */}
        {userData && (
          <div className="bg-orange-500/10 border border-orange-500/30 rounded-2xl p-4 mb-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center font-bold text-white flex-shrink-0">
              #{userRank}
            </div>
            <div className="flex items-center gap-3 flex-1">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-700 flex-shrink-0">
                {userData.avatar_url
                  ? <img src={userData.avatar_url} alt="avatar" className="w-full h-full object-cover" />
                  : <div className="w-full h-full flex items-center justify-center text-white font-bold">
                      {userData.username?.[0]?.toUpperCase()}
                    </div>}
              </div>
              <div>
                <p className="font-bold text-white">{userData.username || "You"}</p>
                <p className="text-xs text-gray-400">{userData.total_attempts} attempts</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-black text-orange-400">{userData.average_score}</p>
              <p className="text-xs text-gray-400">avg score</p>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex bg-gray-800 rounded-xl p-1 mb-4">
          {TABS.map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition
                ${tab === t
                  ? "bg-orange-500 text-white"
                  : "text-gray-400 hover:text-white"}`}>
              {t}
            </button>
          ))}
        </div>

        {/* Leaderboard list */}
        {sorted.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p className="text-4xl mb-3">🏆</p>
            <p>No data yet — be the first on the leaderboard!</p>
            <p className="text-sm mt-1">Complete some practice sessions to appear here.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {sorted.slice(0, 10).map((entry, i) => {
              const isCurrentUser = entry.id === user?.id
              const rank          = i + 1

              return (
                <div
                  key={entry.id}
                  className={`flex items-center gap-4 p-4 rounded-2xl border transition
                    ${isCurrentUser
                      ? "bg-orange-500/10 border-orange-500/40"
                      : "bg-gray-800 border-gray-700"}`}>

                  {/* Rank */}
                  <div className="w-8 text-center flex-shrink-0">
                    {rank <= 3
                      ? <span className="text-2xl">{medals[rank - 1]}</span>
                      : <span className="text-gray-400 font-bold">#{rank}</span>}
                  </div>

                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-700 flex-shrink-0">
                    {entry.avatar_url
                      ? <img src={entry.avatar_url} alt="avatar"
                          className="w-full h-full object-cover" />
                      : <div className="w-full h-full flex items-center justify-center text-white font-bold text-sm">
                          {(entry.username || "?")?.[0]?.toUpperCase()}
                        </div>}
                  </div>

                  {/* Name + attempts */}
                  <div className="flex-1 min-w-0">
                    <p className={`font-bold truncate ${isCurrentUser ? "text-orange-400" : "text-white"}`}>
                      {entry.username || entry.first_name || "Anonymous"}
                      {isCurrentUser && " (you)"}
                    </p>
                    <p className="text-xs text-gray-400">
                      {entry.total_attempts} attempts · best {entry.best_score}
                    </p>
                  </div>

                  {/* Score */}
                  <div className="text-right flex-shrink-0">
                    <p className={`text-xl font-black
                      ${entry.average_score >= 80 ? "text-green-400"
                      : entry.average_score >= 60 ? "text-yellow-400"
                      :                             "text-red-400"}`}>
                      {entry.average_score}
                    </p>
                    <p className="text-xs text-gray-500">avg</p>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Refresh */}
        <button
          onClick={() => {
            setLoading(true)
            getLeaderboard()
              .then(d => { setData(d); setLoading(false) })
              .catch(() => setLoading(false))
          }}
          className="w-full mt-4 bg-gray-800 hover:bg-gray-700 border border-gray-700 py-3 rounded-xl text-sm text-gray-400 hover:text-white transition">
          Refresh Leaderboard
        </button>
      </div>
    </div>
  )
}