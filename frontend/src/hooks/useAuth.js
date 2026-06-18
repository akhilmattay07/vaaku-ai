import { useState, useEffect } from "react"
import { supabase } from "../lib/supabase"

export function useAuth() {
  const [user, setUser]       = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check current session on load
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes including email confirmation redirect
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  const signIn = (email, password) =>
    supabase.auth.signInWithPassword({ email, password })

  const signUp = (email, password) =>
  supabase.auth.signUp({ email, password, options: {
    emailRedirectTo: "https://vaaku-ai.vercel.app/practice"
  }})

  const signOut = () => supabase.auth.signOut()

  return { user, loading, signIn, signUp, signOut }
}