import { BrowserRouter, Routes, Route } from "react-router-dom"
import { useEffect } from "react"
import Navbar         from "./components/Navbar"
import Home           from "./pages/Home"
import Practice       from "./pages/Practice"
import Dashboard      from "./pages/Dashboard"
import Login          from "./pages/Login"
import ForgotPassword from "./pages/ForgotPassword"
import ResetPassword  from "./pages/ResetPassword"
import Profile        from "./pages/Profile"
import Onboarding     from "./pages/Onboarding"
import Leaderboard    from "./pages/Leaderboard"

export default function App() {
  useEffect(() => {
    // Ping backend every 10 minutes to keep Render awake
    const ping = () => {
      fetch(`${import.meta.env.VITE_API_URL?.replace("/api", "") || "http://localhost:8000"}`)
        .catch(() => {})
    }
    ping() // ping immediately on load
    const interval = setInterval(ping, 10 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <BrowserRouter>
      <div className="bg-gray-950 min-h-screen text-white">
        <Navbar />
        <Routes>
          <Route path="/"                element={<Home />}           />
          <Route path="/practice"        element={<Practice />}       />
          <Route path="/dashboard"       element={<Dashboard />}      />
          <Route path="/login"           element={<Login />}          />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password"  element={<ResetPassword />}  />
          <Route path="/profile"         element={<Profile />}        />
          <Route path="/onboarding"      element={<Onboarding />}     />
          <Route path="/leaderboard"     element={<Leaderboard />}    />
        </Routes>
      </div>
    </BrowserRouter>
  )
}