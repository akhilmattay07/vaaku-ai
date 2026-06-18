import { Link } from "react-router-dom"

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center text-center p-6 gap-8">
      <div className="space-y-3">
        <h1 className="text-6xl font-black text-orange-400">வாக்கு AI</h1>
        <p className="text-2xl font-semibold text-white">Tamil Speech Learning Companion</p>
        <p className="text-gray-400 max-w-md mx-auto">
          Improve your Tamil pronunciation with real-time AI coaching.
          Speak, get scored, and learn from personalized feedback.
        </p>
      </div>
      <div className="flex flex-col sm:flex-row gap-4">
        <Link to="/practice"
          className="bg-orange-500 hover:bg-orange-400 text-white font-bold px-8 py-4 rounded-2xl text-lg transition">
          Start Practicing →
        </Link>
        <Link to="/dashboard"
          className="bg-gray-800 hover:bg-gray-700 text-white font-bold px-8 py-4 rounded-2xl text-lg transition">
          View Progress
        </Link>
      </div>
      <div className="grid grid-cols-3 gap-6 text-center mt-4">
        {[
          ["🎙️", "Speak Tamil",   "Record yourself speaking"],
          ["🤖", "AI Feedback",   "Get instant coaching"],
          ["📈", "Track Growth",  "See your improvement"],
        ].map(([e, t, d]) => (
          <div key={t} className="space-y-2">
            <div className="text-3xl">{e}</div>
            <p className="font-semibold text-white text-sm">{t}</p>
            <p className="text-gray-500 text-xs">{d}</p>
          </div>
        ))}
      </div>
    </div>
  )
}