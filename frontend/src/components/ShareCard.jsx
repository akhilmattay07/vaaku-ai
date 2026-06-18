import { useRef } from "react"
import html2canvas from "html2canvas"

export default function ShareCard({ result, onClose }) {
  const cardRef = useRef(null)

  const download = async () => {
    if (!cardRef.current) return
    const canvas = await html2canvas(cardRef.current, {
      backgroundColor: "#030712",
      scale: 2,
    })
    const link    = document.createElement("a")
    link.download = "vaaku-ai-score.png"
    link.href     = canvas.toDataURL("image/png")
    link.click()
  }

  const share = async () => {
    if (!cardRef.current) return
    const canvas = await html2canvas(cardRef.current, {
      backgroundColor: "#030712",
      scale: 2,
    })
    canvas.toBlob(async (blob) => {
      const file = new File([blob], "vaaku-ai-score.png", { type: "image/png" })
      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: "My Tamil Score on Vaaku AI",
          files: [file],
        })
      } else {
        // Fallback — just download
        download()
      }
    })
  }

  const scoreColor = result.score >= 80 ? "#4ade80"
                   : result.score >= 50 ? "#facc15"
                   :                      "#f87171"

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-4">

        {/* The shareable card */}
        <div ref={cardRef}
          style={{ background: "linear-gradient(135deg, #1c0a00 0%, #030712 50%, #0c1a0c 100%)" }}
          className="rounded-2xl p-6 space-y-4 border border-orange-900/50">

          {/* Branding */}
          <div className="flex items-center justify-between">
            <p className="text-orange-400 font-black text-xl">வாக்கு AI</p>
            <p className="text-gray-500 text-xs">Tamil Speech Coach</p>
          </div>

          {/* Word practiced */}
          <div className="text-center space-y-1 py-2">
            <p className="text-gray-400 text-xs uppercase tracking-widest">I practiced</p>
            <p className="text-4xl font-black text-white">{result.expected}</p>
          </div>

          {/* Score */}
          <div className="text-center">
            <div
              style={{ borderColor: scoreColor }}
              className="w-28 h-28 rounded-full border-4 flex flex-col items-center justify-center mx-auto">
              <p style={{ color: scoreColor }} className="text-4xl font-black">
                {result.score}
              </p>
              <p className="text-gray-400 text-xs">/ 100</p>
            </div>
          </div>

          {/* Encouragement */}
          <div className="bg-white/5 rounded-xl p-3 text-center">
            <p className="text-gray-300 text-sm italic">"{result.encouragement}"</p>
          </div>

          {/* Footer */}
          <div className="text-center">
            <p className="text-gray-500 text-xs">Practice Tamil at vaaku-ai.vercel.app</p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3">
          <button onClick={onClose}
            className="flex-1 bg-gray-800 hover:bg-gray-700 py-3 rounded-xl text-sm font-semibold text-gray-300">
            Close
          </button>
          <button onClick={download}
            className="flex-1 bg-gray-700 hover:bg-gray-600 py-3 rounded-xl text-sm font-semibold text-white">
            Download
          </button>
          <button onClick={share}
            className="flex-1 bg-orange-500 hover:bg-orange-400 py-3 rounded-xl text-sm font-semibold text-white">
            Share
          </button>
        </div>
      </div>
    </div>
  )
}