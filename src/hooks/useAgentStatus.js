import { useState, useEffect, useRef } from 'react'

const POLL_INTERVAL = 30_000

/**
 * Polls {gatewayUrl}/health every 30 s and derives agent status.
 *
 * Status derivation:
 *   HTTP 200 + elapsed < 3 000 ms  → "active"
 *   HTTP 200 + elapsed >= 3 000 ms → "idle"
 *   Non-200 or network error        → "error"
 *   No gatewayUrl                   → "unconfigured"
 *
 * Returns { status, responseTimeMs, error }
 */
export function useAgentStatus(gatewayUrl) {
  const [state, setState] = useState({
    status: gatewayUrl ? 'idle' : 'unconfigured',
    responseTimeMs: null,
    error: null,
  })

  const controllerRef = useRef(null)

  useEffect(() => {
    if (!gatewayUrl) {
      setState({ status: 'unconfigured', responseTimeMs: null, error: null })
      return
    }

    let mounted = true

    async function poll() {
      // Abort any request still in flight from a previous poll cycle
      controllerRef.current?.abort()
      const controller = new AbortController()
      controllerRef.current = controller

      const start = Date.now()
      try {
        const res = await fetch(`${gatewayUrl}/health`, { signal: controller.signal })
        const elapsed = Date.now() - start
        if (!mounted) return

        if (!res.ok) {
          setState({ status: 'error', responseTimeMs: elapsed, error: `HTTP ${res.status}` })
        } else if (elapsed >= 3000) {
          setState({ status: 'idle', responseTimeMs: elapsed, error: null })
        } else {
          setState({ status: 'active', responseTimeMs: elapsed, error: null })
        }
      } catch (err) {
        if (!mounted || err.name === 'AbortError') return
        setState({ status: 'error', responseTimeMs: null, error: err.message })
      }
    }

    poll()
    const timer = setInterval(poll, POLL_INTERVAL)

    return () => {
      mounted = false
      clearInterval(timer)
      controllerRef.current?.abort()
    }
  }, [gatewayUrl])

  return state
}
