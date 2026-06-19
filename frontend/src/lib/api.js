import axios from "axios"

const BASE = import.meta.env.VITE_API_URL || "http://localhost:8000/api"

export const analyzeAudio       = (formData) =>
  axios.post(`${BASE}/analyze`, formData).then(r => r.data)

export const getAudioUrl        = (text) =>
  `${import.meta.env.VITE_API_URL || "http://localhost:8000/api"}/audio/${encodeURIComponent(text)}`

export const getSlowAudioUrl    = (text) =>
  `${import.meta.env.VITE_API_URL || "http://localhost:8000/api"}/audio-slow/${encodeURIComponent(text)}`

export const getProgress        = (userId) =>
  axios.get(`${BASE}/progress/${userId}`).then(r => r.data)

export const getAchievements    = (userId) =>
  axios.get(`${BASE}/achievements/${userId}`).then(r => r.data)

export const getHistory         = (userId) =>
  axios.get(`${BASE}/history/${userId}`).then(r => r.data)

export const getAdaptiveSession = (userId) =>
  axios.get(`${BASE}/adaptive/${userId}`).then(r => r.data)

export const getWordOfDay       = () =>
  axios.get(`${BASE}/word-of-day`).then(r => r.data)

export const getLeaderboard     = () =>
  axios.get(`${BASE}/leaderboard`).then(r => r.data)