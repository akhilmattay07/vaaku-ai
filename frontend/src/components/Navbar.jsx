import { Link, useLocation }        from "react-router-dom"
import { useAuth }                  from "../hooks/useAuth"
import { useEffect, useState, useCallback } from "react"
import { supabase }                 from "../lib/supabase"

export default function Navbar() {
  const { user, signOut }     = useAuth()
  const loc                   = useLocation()
  const [profile, setProfile] = useState({ username: "", avatar_url: "" })

  const fetchProfile = useCallback(() => {
    if (!user) return
    supabase.from("profiles")
      .select("username, first_name, avatar_url")
      .eq("id", user.id)
      .single()
      .then(({ data }) => {
        if (data) setProfile({
          username:   data.username   || data.first_name || "",
          avatar_url: data.avatar_url || ""
        })
      })
  }, [user])

  useEffect(() => { fetchProfile() }, [fetchProfile])

  useEffect(() => {
    window.addEventListener("profile-updated", fetchProfile)
    return () => window.removeEventListener("profile-updated", fetchProfile)
  }, [fetchProfile])

  const link = (to, label) => (
    <Link to={to}
      className={`px-3 py-1 rounded-lg text-sm transition
        ${loc.pathname === to
          ? "bg-orange-500 text-white"
          : "text-gray-400 hover:text-white"}`}>
      {label}
    </Link>
  )

  return (
    <nav className="fixed top-0 w-full bg-gray-900 border-b border-gray-800 z-50 px-6 py-3 flex items-center justify-between">
      <Link to="/" className="text-orange-400 font-bold text-xl">வாக்கு AI</Link>
      <div className="flex items-center gap-2">
        {link("/practice",    "Practice")}
        {link("/dashboard",   "Dashboard")}
        {link("/leaderboard", "Leaderboard")}
        {user ? (
          <>
            <Link to="/profile"
              className={`flex items-center gap-2 px-3 py-1 rounded-lg text-sm transition
                ${loc.pathname === "/profile"
                  ? "bg-orange-500 text-white"
                  : "text-gray-400 hover:text-white"}`}>
              <div className="w-7 h-7 rounded-full overflow-hidden border border-orange-400 flex-shrink-0">
                {profile.avatar_url
                  ? <img src={`${profile.avatar_url}?t=${Date.now()}`}
                      alt="avatar" className="w-full h-full object-cover" />
                  : <div className="w-full h-full bg-gray-600 flex items-center justify-center text-xs text-white font-bold">
                      {profile.username?.[0]?.toUpperCase() || "?"}
                    </div>}
              </div>
              {profile.username && <span>{profile.username}</span>}
            </Link>
            <button onClick={signOut}
              className="text-sm text-gray-400 hover:text-red-400 ml-1">
              Sign out
            </button>
          </>
        ) : (
          link("/login", "Login")
        )}
      </div>
    </nav>
  )
}