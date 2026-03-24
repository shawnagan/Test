import { useState, useCallback } from 'react'

/**
 * Fires a GET {url}/health with a 5s timeout and returns the result.
 * status: 'idle' | 'testing' | 'ok' | 'error'
 */
export function useConnectionTest() {
  const [state, setState] = useState({ status: 'idle', ms: null, msg: null })

  const test = useCallback(async (url) => {
    if (!url?.trim()) return
    setState({ status: 'testing', ms: null, msg: null })
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 5000)
    const start = Date.now()
    try {
      const res = await fetch(`${url.trim()}/health`, { signal: controller.signal })
      clearTimeout(timeout)
      const ms = Date.now() - start
      if (res.ok) {
        setState({ status: 'ok', ms, msg: null })
      } else {
        setState({ status: 'error', ms, msg: `HTTP ${res.status}` })
      }
    } catch (err) {
      clearTimeout(timeout)
      setState({
        status: 'error',
        ms: null,
        msg: err.name === 'AbortError' ? 'Timed out after 5s' : err.message,
      })
    }
  }, [])

  const reset = useCallback(() => setState({ status: 'idle', ms: null, msg: null }), [])

  return { ...state, test, reset }
}
