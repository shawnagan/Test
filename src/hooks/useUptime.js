import { useState, useEffect } from 'react'

function formatUptime(ms) {
  if (ms < 0) ms = 0
  const totalMins = Math.floor(ms / 60_000)
  const hours = Math.floor(totalMins / 60)
  const mins = totalMins % 60
  if (hours >= 24) {
    const days = Math.floor(hours / 24)
    const hrs = hours % 24
    return hrs > 0 ? `${days}d ${hrs}h` : `${days}d`
  }
  if (hours > 0) return `${hours}h ${mins}m`
  return `${mins}m`
}

export function useUptime(createdAt) {
  const [elapsed, setElapsed] = useState(() => Date.now() - new Date(createdAt).getTime())

  useEffect(() => {
    setElapsed(Date.now() - new Date(createdAt).getTime())
    const timer = setInterval(() => {
      setElapsed(Date.now() - new Date(createdAt).getTime())
    }, 30_000)
    return () => clearInterval(timer)
  }, [createdAt])

  return formatUptime(elapsed)
}
