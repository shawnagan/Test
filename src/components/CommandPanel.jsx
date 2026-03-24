import { useState, useEffect } from 'react'
import { useAgents } from '../context/AgentContext'
import './CommandPanel.css'

// ── Broadcast modal ─────────────────────────────────────────────────────────

function BroadcastModal({ onClose, onSend }) {
  const [msg, setMsg] = useState('')

  useEffect(() => {
    function handleKey(e) { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [onClose])

  function handleSend() {
    if (!msg.trim()) return
    onSend(msg.trim())
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <div>
            <h3 className="modal-title">Broadcast to All Agents</h3>
            <p className="modal-subtitle">Message will be logged for every deployed agent</p>
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Close">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        <div className="modal-form">
          <div className="form-field">
            <label className="form-label">Message</label>
            <textarea
              className="form-input cp-broadcast-textarea"
              placeholder="e.g. Entering maintenance window — stand by for 5 minutes"
              value={msg}
              onChange={e => setMsg(e.target.value)}
              rows={4}
              autoFocus
            />
          </div>
          <div className="modal-footer">
            <button type="button" className="btn-ghost" onClick={onClose}>Cancel</button>
            <button
              type="button"
              className="btn-primary cp-btn-broadcast"
              onClick={handleSend}
              disabled={!msg.trim()}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.65 3.4 2 2 0 0 1 3.62 1.24h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.96a16 16 0 0 0 6 6l.92-.92a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.73 16.92z"/>
              </svg>
              Send to All
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Stop-all confirm modal ──────────────────────────────────────────────────

function StopAllModal({ agentCount, onClose, onConfirm }) {
  useEffect(() => {
    function handleKey(e) { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [onClose])

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal cp-confirm-modal">
        <div className="modal-header">
          <div>
            <h3 className="modal-title cp-confirm-title">Halt all agents?</h3>
            <p className="modal-subtitle">
              This will pause {agentCount} active agent{agentCount !== 1 ? 's' : ''}.
              You can resume them individually afterwards.
            </p>
          </div>
        </div>
        <div className="modal-form">
          <div className="modal-footer">
            <button type="button" className="btn-ghost" onClick={onClose}>Cancel</button>
            <button type="button" className="btn-danger" onClick={() => { onConfirm(); onClose() }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                <rect x="4" y="4" width="16" height="16" rx="2"/>
              </svg>
              Halt {agentCount} Agent{agentCount !== 1 ? 's' : ''}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Command panel ───────────────────────────────────────────────────────────

export default function CommandPanel({ onAddAgent }) {
  const { agents, events, stopAllAgents, broadcastMessage } = useAgents()
  const [broadcastOpen, setBroadcastOpen] = useState(false)
  const [stopAllOpen, setStopAllOpen] = useState(false)

  const activeCount = agents.filter(a => a.status === 'active').length

  function handleExportLogs() {
    const lines = events.map(e =>
      `[${e.ts}] ${e.level.toUpperCase().padEnd(7)} [${e.agent}] ${e.msg}`
    )
    const content = lines.join('\n')
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `mission-control-${new Date().toISOString().slice(0, 10)}.log`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const commands = [
    {
      label: 'Add Agent',
      desc: 'Deploy a new agent',
      variant: 'accent',
      onClick: onAddAgent,
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
      ),
    },
    {
      label: 'Broadcast',
      desc: 'Message all agents',
      variant: 'success',
      onClick: () => setBroadcastOpen(true),
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.65 3.4 2 2 0 0 1 3.62 1.24h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.96a16 16 0 0 0 6 6l.92-.92a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.73 16.92z"/>
        </svg>
      ),
    },
    {
      label: 'Export Logs',
      desc: `Download ${events.length} events`,
      variant: 'warning',
      onClick: handleExportLogs,
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
        </svg>
      ),
    },
    {
      label: 'Stop All',
      desc: activeCount > 0 ? `Halt ${activeCount} active agent${activeCount > 1 ? 's' : ''}` : 'No active agents',
      variant: 'danger',
      onClick: activeCount > 0 ? () => setStopAllOpen(true) : undefined,
      disabled: activeCount === 0,
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <rect x="4" y="4" width="16" height="16" rx="2"/>
        </svg>
      ),
    },
  ]

  return (
    <>
      <div className="command-panel">
        <div className="cp-header">
          <h2 className="section-title">Quick Commands</h2>
          <p className="section-subtitle">Operator controls</p>
        </div>
        <div className="cp-grid">
          {commands.map(cmd => (
            <button
              key={cmd.label}
              className={`cp-btn cp-btn--${cmd.variant}${cmd.disabled ? ' cp-btn--disabled' : ''}`}
              onClick={cmd.onClick}
              disabled={cmd.disabled}
            >
              <span className="cp-icon">{cmd.icon}</span>
              <span className="cp-label">{cmd.label}</span>
              <span className="cp-desc">{cmd.desc}</span>
            </button>
          ))}
        </div>
      </div>

      {broadcastOpen && (
        <BroadcastModal
          onClose={() => setBroadcastOpen(false)}
          onSend={broadcastMessage}
        />
      )}

      {stopAllOpen && (
        <StopAllModal
          agentCount={activeCount}
          onClose={() => setStopAllOpen(false)}
          onConfirm={stopAllAgents}
        />
      )}
    </>
  )
}
