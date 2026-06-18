import { useState } from "react"
import { supabase } from "../lib/supabase"
import { useNavigate } from "react-router-dom"

export default function ResetPassword() {
  const [password,  setPassword]  = useState("")
  const [password2, setPassword2] = useState("")
  const [error,     setError]     = useState("")
  const [loading,   setLoading]   = useState(false)
  const navigate = useNavigate()

  const submit = async () => {
    if (!password)              { setError("Enter a new password"); return }
    if (password !== password2) { setError("Passwords don't match"); return }
    if (password.length < 6)    { setError("Password must be at least 6 characters"); return }

    setLoading(true); setError("")
    const { error: err } = await supabase.auth.updateUser({ password })
    setLoading(false)

    if (err) setError(err.message)
    else navigate("/practice")
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-6">
      <div className="bg-gray-800 rounded-2xl p-8 w-full max-w-sm space-y-4 border border-gray-700">
        <h2 className="text-2xl font-bold text-orange-400 text-center">Set New Password</h2>
        <input
          type="password" value={password} onChange={e => setPassword(e.target.value)}
          placeholder="New password"
          className="w-full bg-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-orange-500"
        />
        <input
          type="password" value={password2} onChange={e => setPassword2(e.target.value)}
          placeholder="Confirm new password"
          className="w-full bg-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-orange-500"
        />
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <button onClick={submit} disabled={loading}
          className="w-full bg-orange-500 hover:bg-orange-400 py-3 rounded-xl font-semibold disabled:opacity-50">
          {loading ? "Updating..." : "Update Password"}
        </button>
      </div>
    </div>
  )
}