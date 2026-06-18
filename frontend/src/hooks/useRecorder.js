import { useState, useRef } from "react"

export function useRecorder() {
  const [recording, setRecording] = useState(false)
  const mediaRef  = useRef(null)
  const chunksRef = useRef([])

  const start = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    const mr     = new MediaRecorder(stream)
    chunksRef.current = []
    mr.ondataavailable = e => { if (e.data.size > 0) chunksRef.current.push(e.data) }
    mediaRef.current  = mr
    mr.start()
    setRecording(true)
  }

  const stop = () => new Promise(resolve => {
    if (!mediaRef.current) return resolve(null)
    mediaRef.current.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: "audio/webm" })
      mediaRef.current.stream.getTracks().forEach(t => t.stop())
      setRecording(false)
      resolve(blob)
    }
    mediaRef.current.stop()
  })

  return { recording, start, stop }
}