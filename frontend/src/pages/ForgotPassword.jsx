import { useState } from "react"
import { supabase } from "../lib/supabase"
import { Link } from "react-router-dom"

export default function ForgotPassword() {
  const [email,   setEmail]   = useState("")
  const [message, setMessage] = useState("")
  const [error,   setError]   = useState("")
  const [loading, setLoading] = useState(false)

  const submit = async () => {
    if (!email) { setError("Please enter your email"); return }
    setLoading(true); setError(""); setMessage("")

    const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "http://localhost:5173/reset-password"
    })

    setLoading(false)
    if (err) setError(err.message)
    else setMessage("✅ Password reset link sent! Check your email.")
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-6">
      <div className="bg-gray-800 rounded-2xl p-8 w-full max-w-sm space-y-4 border border-gray-700">
        <h2 className="text-2xl font-bold text-orange-400 text-center">Forgot Password</h2>
        <p className="text-gray-400 text-sm text-center">
          Enter your email and we'll send you a reset link
        </p>
        <input
          value={email} onChange={e => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full bg-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-orange-500"
        />
        {error   && <p className="text-red-400 text-sm">{error}</p>}
        {message && <p className="text-green-400 text-sm">{message}</p>}
        <button onClick={submit} disabled={loading}
          className="w-full bg-orange-500 hover:bg-orange-400 py-3 rounded-xl font-semibold disabled:opacity-50">
          {loading ? "Sending..." : "Send Reset Link"}
        </button>
        <Link to="/login"
          className="block text-center text-sm text-gray-400 hover:text-gray-200">
          ← Back to Sign In
        </Link>
      </div>
    </div>
  )
}