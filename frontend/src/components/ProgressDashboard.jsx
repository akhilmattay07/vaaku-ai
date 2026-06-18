import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts"

function StreakCalendar({ history }) {
  const days = []
  for (let i = 29; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    days.push(d.toISOString().split("T")[0])
  }

  const practicedDates = new Set(
    (history || []).map(a => a.created_at?.split("T")[0])
  )

  const today = new Date().toISOString().split("T")[0]

  return (
    <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
      <p className="text-sm text-gray-400 mb-3">Last 30 days</p>
      <div className="grid grid-cols-10 gap-1.5">
        {days.map(day => {
          const practiced = practicedDates.has(day)
          const isToday   = day === today
          return (
            <div
              key={day}
              title={day}
              className={`w-full aspect-square rounded-sm transition
                ${isToday && practiced ? "bg-orange-500 ring-2 ring-orange-300"
                : isToday             ? "bg-gray-600 ring-2 ring-gray-400"
                : practiced           ? "bg-green-500"
                :                       "bg-gray-700"}`}
            />
          )
        })}
      </div>
      <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-sm bg-green-500" />
          <span>Practiced</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-sm bg-orange-500" />
          <span>Today</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-sm bg-gray-700" />
          <span>Missed</span>
        </div>
      </div>
    </div>
  )
}

export default function ProgressDashboard({ summary, history }) {
  const chartData = [...(history || [])].reverse().map((a, i) => ({
    attempt: i + 1,
    score:   a.score,
  }))

  const stat = (label, value) => (
    <div className="bg-gray-800 rounded-xl p-4 text-center border border-gray-700">
      <p className="text-2xl font-bold text-white">{value}</p>
      <p className="text-xs text-gray-400 mt-1">{label}</p>
    </div>
  )

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-100">Your Progress</h2>

      {/* Stats grid */}
      <div className="grid grid-cols-3 gap-3">
        {stat("Total Attempts", summary?.total_attempts ?? 0)}
        {stat("Avg Score",      `${summary?.average_score ?? 0}%`)}
        {stat("Best Score",     `${summary?.best_score ?? 0}%`)}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 text-center">
          <p className="text-2xl font-bold text-orange-400">
            🔥 {summary?.streak_days ?? 0}
          </p>
          <p className="text-xs text-gray-400 mt-1">Day Streak</p>
        </div>

        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <p className="text-xs text-gray-400 mb-2">Sounds to practice</p>
          <div className="flex flex-wrap gap-1">
            {(summary?.weak_sounds || []).length > 0
              ? summary.weak_sounds.map(s => (
                  <span key={s}
                    className="bg-red-900/40 text-red-300 text-xs px-2 py-0.5 rounded-full">
                    {s}
                  </span>
                ))
              : <span className="text-gray-500 text-sm">None yet!</span>}
          </div>
        </div>
      </div>

      {/* Streak Calendar */}
      <StreakCalendar history={history} />

      {/* Score chart */}
      {chartData.length > 1 && (
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <p className="text-sm text-gray-400 mb-3">Score over time</p>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="attempt" stroke="#6b7280" tick={{ fontSize: 11 }} />
              <YAxis domain={[0, 100]} stroke="#6b7280" tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{ background: "#1f2937", border: "none", borderRadius: 8 }}
                labelStyle={{ color: "#9ca3af" }} />
              <Line type="monotone" dataKey="score"
                stroke="#f97316" strokeWidth={2}
                dot={{ r: 3, fill: "#f97316" }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}