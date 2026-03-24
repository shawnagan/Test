import { useState, useEffect } from 'react'
import { useAgents } from '../context/AgentContext'
import { useAgentStatus } from '../hooks/useAgentStatus'
import { useToast } from './Toaster'
import { useUptime } from '../hooks/useUptime'
import './AgentGrid.css'

const MESSAGE_INTERFACES = ['Telegram', 'WhatsApp', 'Slack', 'Discord']

const STATUS_FILTER_OPTS = [
  { key: 'all',    label: 'All' },
  { key: 'active', label: 'Active' },
  { key: 'idle',   label: 'Idle' },
  { key: 'error',  label: 'Error' },
]

// ── Status indicator ────────────────────────────────────────────────────────

const STATUS_CFG = {
  active:       { dotClass: 'status-dot--active',       pulse: true,  label: 'Running' },
  idle:         { dotClass: 'status-dot--idle',         pulse: false, label: 'Slow'    },
  error:        { dotClass: 'status-dot--error',        pulse: false, label: 'Offline' },
  unconfigured: { dotClass: 'status-dot--unconfigured', pulse: false, label: 'Setup needed' },
}

function StatusIndicator({ status, responseTimeMs }) {
  const cfg = STATUS_CFG[status] ?? STATUS_CFG.unconfigured
  const showMs = (status === 'active' || status === 'idle') && responseTimeMs != null
  return (
    <div className="status-indicator">
      <div className={`status-dot ${cfg.dotClass}${cfg.pulse ? ' status-dot--pulse' : ''}`} />
      <span className={`status-indicator-label status-indicator-label--${status}`}>{cfg.label}</span>
      {showMs && <span className="status-indicator-ms">{responseTimeMs}ms</span>}
    </div>
  )
}

// ── Add Agent modal ─────────────────────────────────────────────────────────

function AddAgentModal({ onClose, onSubmit }) {
  const [name, setName] = useState('')
  const [messageInterface, setMessageInterface] = useState('')
  const [apiKey, setApiKey] = useState('')
  const [gatewayUrl, setGatewayUrl] = useState('')
  const [showKey, setShowKey] = useState(false)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    function handleKey(e) { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [onClose])

  function validate() {
    const e = {}
    if (!name.trim()) e.name = 'Agent name is required'
    if (!messageInterface) e.messageInterface = 'Select a message interface'
    if (!apiKey.trim()) e.apiKey = 'API key or webhook URL is required'
    return e
  }

  function handleSubmit(e) {
    e.preventDefault()
    const e2 = validate()
    if (Object.keys(e2).length) { setErrors(e2); return }
    onSubmit({
      name: name.trim(),
      messageInterface,
      apiKey: apiKey.trim(),
      gatewayUrl: gatewayUrl.trim() || null,
    })
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <div>
            <h3 className="modal-title">Add OpenClaw Agent</h3>
            <p className="modal-subtitle">Configure a new OpenClaw agent instance</p>
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
              placeholder="e.g. Support Bot"
              value={name}
              onChange={e => { setName(e.target.value); setErrors(p => ({ ...p, name: '' })) }}
            />
            {errors.name && <span className="form-error">{errors.name}</span>}
          </div>

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
            <label className="form-label">OpenClaw API Key / Webhook URL</label>
            <div className="form-input-wrap">
              <input
                className={`form-input form-input-inner${errors.apiKey ? ' form-input--error' : ''}`}
                type={showKey ? 'text' : 'password'}
                placeholder="sk-… or https://…"
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
            <span className="form-hint">Your local or hosted OpenClaw instance. Used to check live status.</span>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary">Add Agent</button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ── Agent card ──────────────────────────────────────────────────────────────

function AgentCard({ agent, onViewDetail }) {
  const { pauseAgent, resumeAgent, removeAgent, updateAgentStatus } = useAgents()
  const { addToast } = useToast()
  const [confirmRemove, setConfirmRemove] = useState(false)

  const isOpenClaw = agent.type === 'openclaw'
  const polled = useAgentStatus(isOpenClaw ? agent.gatewayUrl : null)
  const uptime = useUptime(agent.createdAt)

  // Sync polled status back to context so the grid filter works correctly
  useEffect(() => {
    if (!isOpenClaw) return
    updateAgentStatus(agent.id, polled.status, polled.responseTimeMs)
  }, [polled.status, polled.responseTimeMs, agent.id, isOpenClaw, updateAgentStatus])

  // openclaw "idle" means "responding slowly" → use idle-slow accent colour
  const borderStatus = isOpenClaw
    ? (polled.status === 'idle' ? 'idle-slow' : polled.status)
    : agent.status

  function handlePauseResume() {
    if (agent.status === 'active') {
      pauseAgent(agent.id)
      addToast(`${agent.name} paused`, 'warning')
    } else {
      resumeAgent(agent.id)
      addToast(`${agent.name} resumed`, 'success')
    }
  }

  function handleRemove() {
    removeAgent(agent.id)
    addToast(`${agent.name} removed`, 'warning')
  }

  return (
    <div className={`agent-card agent-card--${borderStatus}`}>
      <div className="agent-card-header">
        <div className={`agent-avatar agent-avatar--${agent.platformColor}`}>{agent.avatar}</div>

        <div className="agent-info">
          <div className="agent-name-row">
            <span className="agent-name">{agent.name}</span>
            {!isOpenClaw && (
              <span className={`status-badge status-badge--${agent.status}`}>
                <span className="status-pulse"></span>
                {agent.status}
              </span>
            )}
          </div>
          {isOpenClaw && polled.status === 'error' && (
            <span className="agent-inline-error">Can't reach this agent</span>
          )}
          <div className="agent-meta">
            <span className={`platform-tag platform-tag--${agent.platformColor}`}>{agent.platform}</span>
            <span className="agent-model">{agent.model}</span>
          </div>
        </div>

        {isOpenClaw && (
          <StatusIndicator status={polled.status} responseTimeMs={polled.responseTimeMs} />
        )}
      </div>

      <div className="agent-task">
        <span className="task-label">Current Task</span>
        <span className="task-name">{agent.task}</span>
      </div>

      {!isOpenClaw && agent.status === 'active' && (
        <div className="agent-progress">
          <div className="progress-header">
            <span>Progress</span>
            <span>{agent.progress}%</span>
          </div>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${agent.progress}%` }}></div>
          </div>
        </div>
      )}

      {!isOpenClaw && agent.status === 'error' && (
        <div className="agent-error">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
          Connection error — retrying in 28s
        </div>
      )}

      {!isOpenClaw && agent.status === 'idle' && (
        <div className="agent-idle">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          Agent standing by
        </div>
      )}

      {isOpenClaw && (polled.status === 'idle' || polled.status === 'unconfigured') && (
        <div className="agent-idle">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          {polled.status === 'unconfigured'
            ? 'Add a Gateway URL to enable status checks'
            : 'Agent responding slowly'}
        </div>
      )}

      <div className="agent-footer">
        <div className="agent-stat">
          <span className="af-value">{agent.tasksCompleted.toLocaleString()}</span>
          <span className="af-label">Tasks Done</span>
        </div>
        <div className="agent-stat">
          <span className="af-value">{uptime}</span>
          <span className="af-label">Uptime</span>
        </div>

        <div className="agent-btns">
          {confirmRemove ? (
            <div className="agent-confirm">
              <span className="agent-confirm-msg">Remove?</span>
              <button
                className="agent-confirm-yes"
                onClick={handleRemove}
                title="Confirm remove"
              >Yes</button>
              <button
                className="agent-confirm-no"
                onClick={() => setConfirmRemove(false)}
                title="Cancel"
              >No</button>
            </div>
          ) : (
            <>
              <button
                className="agent-btn"
                title={agent.status === 'active' ? 'Pause' : 'Resume'}
                onClick={handlePauseResume}
              >
                {agent.status === 'active' ? (
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
                ) : (
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                )}
              </button>
              <button
                className="agent-btn agent-btn--stop"
                title="Remove agent"
                onClick={() => setConfirmRemove(true)}
                aria-label="Remove agent"
              >
                <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><rect x="4" y="4" width="16" height="16" rx="2"/></svg>
              </button>
              <button
                className="agent-btn agent-btn--details"
                title="View Details"
                onClick={() => onViewDetail(agent.id)}
              >
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
                </svg>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Grid ────────────────────────────────────────────────────────────────────

export default function AgentGrid({ addAgentOpen, onAddAgent, onCloseAddAgent, onViewDetail }) {
  const { agents, addAgent } = useAgents()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const activeCount = agents.filter(a => a.status === 'active').length

  const filtered = agents.filter(a => {
    const matchStatus = statusFilter === 'all' || a.status === statusFilter
    const matchSearch = !search || a.name.toLowerCase().includes(search.toLowerCase())
    return matchStatus && matchSearch
  })

  function handleAddAgent(data) {
    addAgent(data)
    onCloseAddAgent()
  }

  return (
    <section className="agent-grid-section">
      {/* Header */}
      <div className="section-header">
        <div>
          <h2 className="section-title">Deployed Agents</h2>
          <p className="section-subtitle">
            {activeCount} active · {agents.length - activeCount} idle or degraded · {agents.length} total
          </p>
        </div>
        <button className="deploy-btn" onClick={onAddAgent}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Add Agent
        </button>
      </div>

      {/* Filter / search bar */}
      <div className="agent-filter-bar">
        <div className="agent-filter-tabs">
          {STATUS_FILTER_OPTS.map(opt => (
            <button
              key={opt.key}
              className={`agent-filter-tab${statusFilter === opt.key ? ' agent-filter-tab--active' : ''}`}
              onClick={() => setStatusFilter(opt.key)}
            >
              {opt.label}
              {opt.key !== 'all' && (
                <span className="agent-filter-count">
                  {agents.filter(a => a.status === opt.key).length}
                </span>
              )}
            </button>
          ))}
        </div>
        <div className="agent-search-wrap">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="agent-search-icon">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            className="agent-search"
            type="text"
            placeholder="Search agents…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && (
            <button className="agent-search-clear" onClick={() => setSearch('')} aria-label="Clear">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="agent-grid">
          {filtered.map(agent => (
            <AgentCard key={agent.id} agent={agent} onViewDetail={onViewDetail} />
          ))}
        </div>
      ) : (
        <div className="agent-grid-empty">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8"/><path d="M12 17v4"/>
          </svg>
          <p>No agents match your filter</p>
          <button className="btn-ghost" onClick={() => { setSearch(''); setStatusFilter('all') }}>
            Clear filters
          </button>
        </div>
      )}

      {/* Add Agent modal */}
      {addAgentOpen && (
        <AddAgentModal
          onClose={onCloseAddAgent}
          onSubmit={handleAddAgent}
        />
      )}
    </section>
  )
}
