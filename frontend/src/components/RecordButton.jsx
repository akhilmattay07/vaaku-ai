export default function RecordButton({ recording, loading, onStart, onStop }) {
  return (
    <div className="flex flex-col items-center gap-3">
      <button
        onClick={recording ? onStop : onStart}
        disabled={loading}
        className={`w-24 h-24 rounded-full text-3xl font-bold shadow-lg transition-all duration-200
          ${loading   ? "bg-gray-600 cursor-not-allowed"
          : recording ? "bg-red-500 animate-pulse scale-110 shadow-red-500/40"
          :             "bg-orange-500 hover:bg-orange-400 hover:scale-105 shadow-orange-500/30"}`}>
        {loading ? "⏳" : recording ? "⏹" : "🎙"}
      </button>
      <p className="text-gray-500 text-sm">
        {loading   ? "Analyzing..."
        : recording ? "Recording — tap to stop"
        :             "Tap to speak"}
      </p>
    </div>
  )
}