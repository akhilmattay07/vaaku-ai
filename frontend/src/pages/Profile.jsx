import { useState, useEffect } from "react"
import { useAuth }    from "../hooks/useAuth"
import { supabase }   from "../lib/supabase"
import { useNavigate } from "react-router-dom"
import ImageCropper   from "../components/ImageCropper"

export default function Profile() {
  const { user, loading: authLoading } = useAuth()
  const navigate  = useNavigate()

  const [form, setForm] = useState({
    username:      "",
    first_name:    "",
    last_name:     "",
    date_of_birth: "",
    avatar_url:    "",
  })
  const [loading,    setLoading]    = useState(true)
  const [saving,     setSaving]     = useState(false)
  const [message,    setMessage]    = useState("")
  const [error,      setError]      = useState("")
  const [uploading,  setUploading]  = useState(false)
  const [showCropper, setShowCropper] = useState(false)

  useEffect(() => {
    if (authLoading) return
    if (!user) { navigate("/login"); return }

    supabase.from("profiles")
      .select("*")
      .eq("id", user.id)
      .single()
      .then(({ data }) => {
        if (data) setForm({
          username:      data.username      || "",
          first_name:    data.first_name    || "",
          last_name:     data.last_name     || "",
          date_of_birth: data.date_of_birth || "",
          avatar_url:    data.avatar_url    || "",
        })
        setLoading(false)
      })
  }, [user, authLoading])

  const handleChange = e =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleCropDone = async (blob) => {
    setShowCropper(false)
    setUploading(true)

    const path = `${user.id}/avatar.jpg`
    const { error: upErr } = await supabase.storage
      .from("avatars")
      .upload(path, blob, { upsert: true, contentType: "image/jpeg" })

    if (upErr) { setError(upErr.message); setUploading(false); return }

    const { data } = supabase.storage.from("avatars").getPublicUrl(path)
    const urlWithBust = `${data.publicUrl}?t=${Date.now()}`
    setForm(f => ({ ...f, avatar_url: urlWithBust }))
    setUploading(false)
  }

  const save = async () => {
    setSaving(true); setError(""); setMessage("")

    const { error: err } = await supabase.from("profiles")
      .upsert({ id: user.id, ...form, updated_at: new Date().toISOString() })

    setSaving(false)
    if (err) setError(err.message)
    else {
      setMessage("✅ Profile saved!")
      window.dispatchEvent(new Event("profile-updated"))
    }
  }

  if (authLoading || loading) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center text-gray-400">
      Loading...
    </div>
  )

  const displayName = form.first_name || form.username || user?.email

  return (
    <div className="min-h-screen bg-gray-950 pt-20 flex flex-col items-center p-6 gap-6">

      {showCropper && (
        <ImageCropper
          onCropDone={handleCropDone}
          onCancel={() => setShowCropper(false)}
        />
      )}

      <div className="bg-gray-800 rounded-2xl p-8 w-full max-w-lg border border-gray-700 space-y-6">
        <h2 className="text-2xl font-bold text-orange-400 text-center">Your Profile</h2>

        {/* Avatar */}
        <div className="flex flex-col items-center gap-3">
          <div className="w-24 h-24 rounded-full bg-gray-700 overflow-hidden border-2 border-orange-500">
            {uploading
              ? <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                  Uploading...
                </div>
              : form.avatar_url
              ? <img src={form.avatar_url} alt="avatar"
                  className="w-full h-full object-cover" />
              : <div className="w-full h-full flex items-center justify-center text-4xl text-gray-400">
                  {displayName?.[0]?.toUpperCase() || "?"}
                </div>}
          </div>
          <button
            onClick={() => setShowCropper(true)}
            disabled={uploading}
            className="text-sm text-orange-400 hover:text-orange-300 underline">
            {uploading ? "Uploading..." : "Change profile picture"}
          </button>
        </div>

        {/* Form fields */}
        <div className="space-y-4">
          <div>
            <label className="text-xs text-gray-400 mb-1 block">
              What should Vaaku AI call you? *
            </label>
            <input
              name="username" value={form.username} onChange={handleChange}
              placeholder="e.g. Raja, Priya, Tamil Learner"
              className="w-full bg-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-400 mb-1 block">First Name</label>
              <input
                name="first_name" value={form.first_name} onChange={handleChange}
                placeholder="First name"
                className="w-full bg-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Last Name</label>
              <input
                name="last_name" value={form.last_name} onChange={handleChange}
                placeholder="Last name"
                className="w-full bg-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-400 mb-1 block">Date of Birth</label>
            <input
              type="date" name="date_of_birth" value={form.date_of_birth}
              onChange={handleChange}
              className="w-full bg-gray-700 rounded-xl px-4 py-3 text-white outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="text-xs text-gray-400 mb-1 block">Email</label>
            <input
              value={user?.email} disabled
              className="w-full bg-gray-600 rounded-xl px-4 py-3 text-gray-400 cursor-not-allowed"
            />
          </div>
        </div>

        {error   && <p className="text-red-400 text-sm">{error}</p>}
        {message && <p className="text-green-400 text-sm">{message}</p>}

        <button onClick={save} disabled={saving}
          className="w-full bg-orange-500 hover:bg-orange-400 py-3 rounded-xl font-semibold disabled:opacity-50">
          {saving ? "Saving..." : "Save Profile"}
        </button>
      </div>
    </div>
  )
}