const SOUND_TIPS = {
  "ழ": {
    name:    "zha (ழ)",
    tip:     "Curl your tongue back without touching the roof of your mouth. It's a unique Tamil sound with no English equivalent.",
    example: "வாழை (vaazhai) — banana",
    similar: "Similar to 'l' but with tongue curled back",
  },
  "ண": {
    name:    "na (ண)",
    tip:     "Press the tip of your tongue firmly against the roof of your mouth (retroflex). Different from the regular 'n' sound.",
    example: "வணக்கம் (vanakkam) — hello",
    similar: "Like 'n' but tongue touches the hard palate",
  },
  "ட": {
    name:    "ta (ட)",
    tip:     "Press your tongue to the roof of your mouth (retroflex 't'). Harder than English 't'.",
    example: "நட்பு (natpu) — friendship",
    similar: "Like 't' but tongue curls back to hard palate",
  },
  "ங": {
    name:    "nga (ங)",
    tip:     "A nasal sound made at the back of the throat. Like the 'ng' in 'sing' but at the start of a syllable.",
    example: "தங்கம் (thangam) — gold",
    similar: "Like 'ng' in 'singing'",
  },
  "ஞ": {
    name:    "nya (ஞ)",
    tip:     "A nasal 'ny' sound. Press your tongue to the hard palate while making a nasal sound.",
    example: "ஞாயிறு (nyaayiru) — Sunday",
    similar: "Like 'ny' in 'canyon'",
  },
  "ற": {
    name:    "ra (ற)",
    tip:     "A trilled or flapped 'r' sound. Tap your tongue quickly against the alveolar ridge.",
    example: "நன்றி (nandri) — thank you",
    similar: "Like a rolled 'r' in Spanish",
  },
}

const DEFAULT_TIP = {
  name:    "this sound",
  tip:     "Listen to the correct pronunciation carefully and try to match the exact sound. Practice slowly first.",
  example: "Use the 🐢 Slow button to hear it clearly",
  similar: "Focus on matching the AI's pronunciation",
}

export default function TipCard({ sound, onDismiss }) {
  const info = SOUND_TIPS[sound] || DEFAULT_TIP

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-2xl p-6 w-full max-w-md border border-orange-700/50 space-y-4">

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">💡</span>
            <h3 className="text-lg font-bold text-orange-400">Pronunciation Tip</h3>
          </div>
          <button onClick={onDismiss}
            className="text-gray-400 hover:text-white text-xl">×</button>
        </div>

        <div className="bg-gray-700 rounded-xl p-4 space-y-1">
          <p className="text-xs text-gray-400">Struggling with</p>
          <p className="text-2xl font-bold text-white">{sound} — {info.name}</p>
        </div>

        <div className="space-y-3">
          <div className="bg-blue-900/30 rounded-xl p-3 border border-blue-800/30">
            <p className="text-xs text-blue-400 font-semibold mb-1">How to pronounce</p>
            <p className="text-sm text-gray-200">{info.tip}</p>
          </div>

          <div className="bg-green-900/30 rounded-xl p-3 border border-green-800/30">
            <p className="text-xs text-green-400 font-semibold mb-1">Similar to</p>
            <p className="text-sm text-gray-200">{info.similar}</p>
          </div>

          <div className="bg-orange-900/30 rounded-xl p-3 border border-orange-800/30">
            <p className="text-xs text-orange-400 font-semibold mb-1">Example</p>
            <p className="text-sm text-gray-200">{info.example}</p>
          </div>
        </div>

        <button onClick={onDismiss}
          className="w-full bg-orange-500 hover:bg-orange-400 py-3 rounded-xl font-semibold">
          Got it, let me try again!
        </button>
      </div>
    </div>
  )
}