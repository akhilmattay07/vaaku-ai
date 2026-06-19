import axios from "axios"

const BASE = import.meta.env.VITE_API_URL || "http://localhost:8000/api"

const api = axios.create({
  baseURL: BASE,
  timeout: 120000, // 2 minutes — gives Render time to wake up
})

export const analyzeAudio       = (formData) =>
  api.post(`/analyze`, formData).then(r => r.data)

export const getAudioUrl        = (text) =>
  `${BASE}/audio/${encodeURIComponent(text)}`

export const getSlowAudioUrl    = (text) =>
  `${BASE}/audio-slow/${encodeURIComponent(text)}`

export const getProgress        = (userId) =>
  api.get(`/progress/${userId}`).then(r => r.data)

export const getAchievements    = (userId) =>
  api.get(`/achievements/${userId}`).then(r => r.data)

export const getHistory         = (userId) =>
  api.get(`/history/${userId}`).then(r => r.data)

export const getAdaptiveSession = (userId) =>
  api.get(`/adaptive/${userId}`).then(r => r.data)

export const getWordOfDay       = () =>
  api.get(`/word-of-day`).then(r => r.data)

export const getLeaderboard     = () =>
  api.get(`/leaderboard`).then(r => r.data)