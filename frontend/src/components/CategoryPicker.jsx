import { CATEGORIES } from "../data/sentences"

export default function CategoryPicker({ selected, onSelect }) {
  return (
    <div className="w-full max-w-lg">
      <h3 className="text-lg font-bold text-gray-200 mb-3">Choose a Category</h3>
      <div className="grid grid-cols-3 gap-3">
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => onSelect(cat.id)}
            className={`rounded-xl p-3 text-center border transition space-y-1
              ${selected === cat.id
                ? "bg-orange-500/20 border-orange-500 text-white"
                : "bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-500 hover:text-white"}`}>
            <div className="text-2xl">{cat.emoji}</div>
            <p className="text-xs font-semibold">{cat.label}</p>
          </button>
        ))}
      </div>
    </div>
  )
}