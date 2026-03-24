import { useEffect, useState } from 'react'
import { useAgents } from '../context/AgentContext'
import { useToast } from './Toaster'
import { useUptime } from '../hooks/useUptime'
import './AgentDetailPanel.css'

const MESSAGE_INTERFACES = ['Telegram', 'WhatsApp', 'Slack', 'Discord']

const STATUS_LABELS = {
  active:       'Running',
  idle:         'Slow / Idle',
  error:        'Offline',
  unconfigured: 'Setup needed',
}

const STATUS_COLORS = {
  active:       'var(--success)',
  idle:         'var(--warning)',
  error:        'var(--danger)',
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

// ── Edit modal ───────────────────────────────────────────────────────────────

function EditAgentModal({ agent, onClose, onSave }) {
  const isOpenClaw = agent.type === 'openclaw'
  const [name, setName] = useState(agent.name)
  const [messageInterface, setMessageInterface] = useState(agent.messageInterface ?? '')
  const [apiKey, setApiKey] = useState(agent.apiKey ?? '')
  const [gatewayUrl, setGatewayUrl] = useState(agent.gatewayUrl ?? '')
  const [showKey, setShowKey] = useState(false)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    function handleKey(e) { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [onClose])

  function validate() {
    const e = {}
    if (!name.trim()) e.name = 'Name is required'
    if (isOpenClaw && !messageInterface) e.messageInterface = 'Select a message interface'
    if (isOpenClaw && !apiKey.trim()) e.apiKey = 'API key is required'
    return e
  }

  function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    onSave({
      name: name.trim(),
      messageInterface: messageInterface || null,
      apiKey: apiKey.trim() || null,
      gatewayUrl: gatewayUrl.trim() || null,
    })
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <div>
            <h3 className="modal-title">Edit Agent</h3>
            <p className="modal-subtitle">Update configuration for {agent.name}</p>
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Close">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <form className="modal-form" onSubmit={handleSubmit} noValidate>
          <div className="form-field">
            <label className="form-label">Agent Name</label>
            <input
              className={`form-input${errors.name ? ' form-input--error' : ''}`}
              type="text"
              value={name}
              onChange={e => { setName(e.target.value); setErrors(p => ({ ...p, name: '' })) }}
            />
            {errors.name && <span className="form-error">{errors.name}</span>}
          </div>

          {isOpenClaw && (
            <>
              <div className="form-field">
                <label className="form-label">Message Interface</label>
                <select
                  className={`form-input form-select${errors.messageInterface ? ' form-input--error' : ''}`}
                  value={messageInterface}
                  onChange={e => { setMessageInterface(e.target.value); setErrors(p => ({ ...p, messageInterface: '' })) }}
                >
                  <option value="">Select interface…</option>
                  {MESSAGE_INTERFACES.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
                {errors.messageInterface && <span className="form-error">{errors.messageInterface}</span>}
              </div>

              <div className="form-field">
                <label className="form-label">API Key / Webhook URL</label>
                <div className="form-input-wrap">
                  <input
                    className={`form-input form-input-inner${errors.apiKey ? ' form-input--error' : ''}`}
                    type={showKey ? 'text' : 'password'}
                    value={apiKey}
                    onChange={e => { setApiKey(e.target.value); setErrors(p => ({ ...p, apiKey: '' })) }}
                  />
                  <button type="button" className="form-eye-btn" onClick={() => setShowKey(s => !s)} aria-label={showKey ? 'Hide' : 'Show'}>
                    {showKey ? (
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                        <line x1="1" y1="1" x2="23" y2="23"/>
                      </svg>
                    ) : (
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                    )}
                  </button>
                </div>
                {errors.apiKey && <span className="form-error">{errors.apiKey}</span>}
              </div>

              <div className="form-field">
                <label className="form-label">
                  Gateway URL
                  <span className="form-optional"> — optional</span>
                </label>
                <input
                  className="form-input"
                  type="url"
                  placeholder="http://localhost:3000"
                  value={gatewayUrl}
                  onChange={e => setGatewayUrl(e.target.value)}
                />
              </div>
            </>
          )}

          <div className="modal-footer">
            <button type="button" className="btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary">Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ── Main panel ───────────────────────────────────────────────────────────────

export default function AgentDetailPanel({ agentId, onClose }) {
  const { agents, removeAgent, editAgent, assignTask } = useAgents()
  const { addToast } = useToast()
  const agent = agents.find(a => a.id === agentId)

  const [editOpen, setEditOpen] = useState(false)
  const [instruction, setInstruction] = useState('')

  const uptime = useUptime(agent?.createdAt ?? new Date())

  // Close panel if the agent was removed
  useEffect(() => {
    if (!agent) onClose()
  }, [agent, onClose])

  // Trap Escape key (skip when edit modal is open — it handles Escape itself)
  useEffect(() => {
    if (editOpen) return
    function handleKey(e) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [onClose, editOpen])

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
    addToast(`${agent.name} removed`, 'warning')
    onClose()
  }

  function handleSaveEdit(data) {
    editAgent(agent.id, data)
    addToast(`${data.name} updated`, 'success')
    setEditOpen(false)
  }

  function handleAssignTask(e) {
    e.preventDefault()
    if (!instruction.trim()) return
    assignTask(agent.id, instruction.trim())
    addToast(`Task assigned to ${agent.name}`, 'success')
    setInstruction('')
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

          {/* Send instruction */}
          <div className="dp-section">
            <span className="dp-section-label">Send Instruction</span>
            <form className="dp-instruct-form" onSubmit={handleAssignTask}>
              <input
                className="dp-instruct-input"
                type="text"
                placeholder="Assign a new task…"
                value={instruction}
                onChange={e => setInstruction(e.target.value)}
                maxLength={200}
              />
              <button
                type="submit"
                className="dp-instruct-btn"
                disabled={!instruction.trim()}
                title="Send instruction"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                </svg>
              </button>
            </form>
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
                <Field label="Gateway URL" value={agent.gatewayUrl ?? 'Not configured'} mono />
                <Field label="API Key" value={agent.apiKey ? maskKey(agent.apiKey) : 'Not set'} mono />
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
                <span className="dp-stat-value">{uptime}</span>
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
          <button className="dp-edit-btn" onClick={() => setEditOpen(true)}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
            Edit
          </button>
          <button className="dp-remove-btn" onClick={handleRemove}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
            </svg>
            Remove
          </button>
        </div>
      </aside>

      {/* Edit modal rendered outside panel to avoid z-index issues */}
      {editOpen && (
        <EditAgentModal
          agent={agent}
          onClose={() => setEditOpen(false)}
          onSave={handleSaveEdit}
        />
      )}
    </>
  )
}
