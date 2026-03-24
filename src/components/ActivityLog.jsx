import { useState, useEffect, useRef } from 'react'
import { useAgents } from '../context/AgentContext'
import './ActivityLog.css'

const FILTERS = ['All', 'Info', 'Success', 'Warning', 'Error']

export default function ActivityLog() {
  const { events } = useAgents()
  const [filter, setFilter] = useState('All')
  const [autoScroll, setAutoScroll] = useState(true)
  const terminalRef = useRef(null)

  const filtered = filter === 'All'
    ? events
    : events.filter(l => l.level === filter.toLowerCase())

  // Auto-scroll to top when new events arrive (events are prepended)
  useEffect(() => {
    if (autoScroll && terminalRef.current) {
      terminalRef.current.scrollTop = 0
    }
  }, [events.length, autoScroll])

  function handleScroll(e) {
    // Disable auto-scroll if user scrolled down; re-enable when back at top
    setAutoScroll(e.target.scrollTop < 20)
  }

  const errorCount   = events.filter(e => e.level === 'error').length
  const warningCount = events.filter(e => e.level === 'warning').length

  return (
    <div className="activity-log">
      <div className="al-header">
        <div>
          <h2 className="section-title">Agent Activity Log</h2>
          <p className="section-subtitle">
            Live event stream · {events.length} events
            {errorCount > 0 && <span className="al-err-badge">{errorCount} error{errorCount > 1 ? 's' : ''}</span>}
            {warningCount > 0 && <span className="al-warn-badge">{warningCount} warning{warningCount > 1 ? 's' : ''}</span>}
          </p>
        </div>
        <div className="al-filters">
          {FILTERS.map(f => (
            <button
              key={f}
              className={`al-filter ${filter === f ? 'al-filter--active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div
        className="al-terminal"
        ref={terminalRef}
        onScroll={handleScroll}
      >
        {filtered.map(log => (
          <div key={log.id} className={`log-row log-row--${log.level}`}>
            <span className="log-ts">{log.ts}</span>
            <span className={`log-level log-level--${log.level}`}>{log.level.toUpperCase()}</span>
            <span className="log-agent">[{log.agent}]</span>
            <span className="log-msg">{log.msg}</span>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="log-empty">No {filter.toLowerCase()} events</div>
        )}
      </div>
    </div>
  )
}
