import { useState, useEffect } from "react"
import { useAuth } from "../hooks/useAuth"
import { useNavigate, Link } from "react-router-dom"

export default function Login() {
  const { signIn, signUp, user } = useAuth()
  const navigate = useNavigate()
  const [email,    setEmail]    = useState("")
  const [password, setPassword] = useState("")
  const [isSignUp, setIsSignUp] = useState(false)
  const [error,    setError]    = useState("")
  const [loading,  setLoading]  = useState(false)
  const [message,  setMessage]  = useState("")

  useEffect(() => {
    if (user) navigate("/practice")
  }, [user])

  const submit = async () => {
    if (!email || !password) { setError("Please enter email and password"); return }
    setLoading(true); setError(""); setMessage("")

    if (isSignUp) {
      const { error: err } = await signUp(email, password)
      setLoading(false)
      if (err) setError(err.message)
      else setMessage("✅ Check your email and click the confirmation link, then come back and sign in!")
    } else {
      const { data, error: err } = await signIn(email, password)
      setLoading(false)
      if (err) setError(err.message)
      else if (data?.user) navigate("/practice")
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-6">
      <div className="bg-gray-800 rounded-2xl p-8 w-full max-w-sm space-y-4 border border-gray-700">
        <h2 className="text-2xl font-bold text-orange-400 text-center">
          {isSignUp ? "Create Account" : "Welcome Back"}
        </h2>
        <input
          id="email" value={email} onChange={e => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full bg-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-orange-500"
        />
        <input
          id="password" type="password" value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full bg-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-orange-500"
        />
        {!isSignUp && (
          <div className="text-right">
            <Link to="/forgot-password"
              className="text-xs text-orange-400 hover:text-orange-300">
              Forgot password?
            </Link>
          </div>
        )}
        {error   && <p className="text-red-400 text-sm">{error}</p>}
        {message && <p className="text-green-400 text-sm">{message}</p>}
        <button onClick={submit} disabled={loading}
          className="w-full bg-orange-500 hover:bg-orange-400 py-3 rounded-xl font-semibold disabled:opacity-50">
          {loading ? "..." : isSignUp ? "Sign Up" : "Sign In"}
        </button>
        <button onClick={() => { setIsSignUp(s => !s); setError(""); setMessage("") }}
          className="w-full text-sm text-gray-400 hover:text-gray-200">
          {isSignUp ? "Already have an account? Sign in" : "New here? Create account"}
        </button>
      </div>
    </div>
  )
}