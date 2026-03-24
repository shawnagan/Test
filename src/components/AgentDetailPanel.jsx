import { useEffect } from 'react'
import { useAgents } from '../context/AgentContext'
import './AgentDetailPanel.css'

const STATUS_LABELS = {
  active:       'Running',
  idle:         'Slow / Idle',
  error:        'Offline',
  unconfigured: 'Setup needed',
}

const STATUS_COLORS = {
  active: 'var(--success)',
  idle:   'var(--warning)',
  error:  'var(--danger)',
  unconfigured: 'var(--text-muted)',
}

function Field({ label, value, mono }) {
  if (!value) return null
  return (
    <div className="dp-field">
      <span className="dp-field-label">{label}</span>
      <span className={`dp-field-value${mono ? ' dp-field-value--mono' : ''}`}>{value}</span>
    </div>
  )
}

export default function AgentDetailPanel({ agentId, onClose }) {
  const { agents, removeAgent } = useAgents()
  const agent = agents.find(a => a.id === agentId)

  // Close panel if the agent was removed
  useEffect(() => {
    if (!agent) onClose()
  }, [agent, onClose])

  // Trap Escape key
  useEffect(() => {
    function handleKey(e) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [onClose])

  if (!agent) return null

  const isOpenClaw = agent.type === 'openclaw'
  const statusLabel = STATUS_LABELS[agent.status] ?? agent.status
  const statusColor = STATUS_COLORS[agent.status] ?? 'var(--text-muted)'

  function formatDate(d) {
    return new Date(d).toLocaleString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    })
  }

  function maskKey(key) {
    if (!key) return null
    if (key.startsWith('http')) return key.replace(/\/\/[^@/]+@/, '//<credentials>@')
    return key.slice(0, 4) + '•'.repeat(Math.max(8, key.length - 8)) + key.slice(-4)
  }

  function handleRemove() {
    removeAgent(agent.id)
    onClose()
  }

  return (
    <>
      {/* Backdrop */}
      <div className="dp-backdrop" onClick={onClose} />

      {/* Panel */}
      <aside className="dp-panel" role="dialog" aria-label={`Details for ${agent.name}`}>
        {/* Header */}
        <div className="dp-header">
          <div className="dp-header-left">
            <div className={`dp-avatar dp-avatar--${agent.platformColor}`}>{agent.avatar}</div>
            <div>
              <h2 className="dp-name">{agent.name}</h2>
              <div className="dp-badges">
                <span className={`platform-tag platform-tag--${agent.platformColor}`}>{agent.platform}</span>
                {isOpenClaw && <span className="dp-type-badge">OpenClaw</span>}
              </div>
            </div>
          </div>
          <button className="dp-close" onClick={onClose} aria-label="Close panel">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Status pill */}
        <div className="dp-status-row">
          <div className="dp-status-pill" style={{ borderColor: statusColor, background: `${statusColor}18` }}>
            <span className="dp-status-dot" style={{ background: statusColor }}></span>
            <span className="dp-status-label" style={{ color: statusColor }}>{statusLabel}</span>
            {agent.responseTimeMs != null && (
              <span className="dp-status-rt">{agent.responseTimeMs}ms</span>
            )}
          </div>
        </div>

        {/* Body */}
        <div className="dp-body">
          <div className="dp-section">
            <span className="dp-section-label">Current Task</span>
            <p className="dp-task">{agent.task}</p>
          </div>

          <div className="dp-section">
            <span className="dp-section-label">Agent Info</span>
            <div className="dp-fields">
              <Field label="Model / Interface" value={agent.model} />
              {isOpenClaw && <Field label="Message Interface" value={agent.messageInterface} />}
              <Field label="Platform" value={agent.platform} />
              <Field label="Added" value={formatDate(agent.createdAt)} />
            </div>
          </div>

          {isOpenClaw && (
            <div className="dp-section">
              <span className="dp-section-label">Connection</span>
              <div className="dp-fields">
                <Field
                  label="Gateway URL"
                  value={agent.gatewayUrl ?? 'Not configured'}
                  mono
                />
                <Field
                  label="API Key"
                  value={agent.apiKey ? maskKey(agent.apiKey) : 'Not set'}
                  mono
                />
              </div>
            </div>
          )}

          <div className="dp-section">
            <span className="dp-section-label">Statistics</span>
            <div className="dp-stats-grid">
              <div className="dp-stat">
                <span className="dp-stat-value">{agent.tasksCompleted.toLocaleString()}</span>
                <span className="dp-stat-label">Tasks Done</span>
              </div>
              <div className="dp-stat">
                <span className="dp-stat-value">{agent.uptime}</span>
                <span className="dp-stat-label">Uptime</span>
              </div>
              {!isOpenClaw && agent.status === 'active' && (
                <div className="dp-stat">
                  <span className="dp-stat-value">{agent.progress}%</span>
                  <span className="dp-stat-label">Progress</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="dp-footer">
          <button className="dp-remove-btn" onClick={handleRemove}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
            </svg>
            Remove Agent
          </button>
        </div>
      </aside>
    </>
  )
}
