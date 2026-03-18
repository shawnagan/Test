import { useState } from 'react'
import { useAgents } from '../context/AgentContext'
import { useAgentStatus } from '../hooks/useAgentStatus'
import './AgentGrid.css'

const MESSAGE_INTERFACES = ['Telegram', 'WhatsApp', 'Slack', 'Discord']

// ── Status indicator ────────────────────────────────────────────────────────

const STATUS_CONFIG = {
  active:       { dotClass: 'status-dot--active',       pulse: true,  label: 'Running' },
  idle:         { dotClass: 'status-dot--idle',         pulse: false, label: 'Slow'    },
  error:        { dotClass: 'status-dot--error',        pulse: false, label: 'Offline' },
  unconfigured: { dotClass: 'status-dot--unconfigured', pulse: false, label: 'Setup needed' },
}

function StatusIndicator({ status, responseTimeMs }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.unconfigured
  const showMs = (status === 'active' || status === 'idle') && responseTimeMs !== null

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
              {MESSAGE_INTERFACES.map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
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
              <button
                type="button"
                className="form-eye-btn"
                onClick={() => setShowKey(s => !s)}
                aria-label={showKey ? 'Hide' : 'Show'}
              >
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

function AgentCard({ agent }) {
  // Hook is always called — passes null for mock agents so it returns 'unconfigured'
  // without starting any polling.
  const polled = useAgentStatus(agent.type === 'openclaw' ? agent.gatewayUrl : null)

  const isOpenClaw = agent.type === 'openclaw'
  // OpenClaw cards use the live polled status for the card border colour;
  // mock cards keep their static status.
  const borderStatus = isOpenClaw ? polled.status : agent.status

  return (
    <div className={`agent-card agent-card--${borderStatus}`}>
      <div className="agent-card-header">
        <div className={`agent-avatar agent-avatar--${agent.platformColor}`}>{agent.avatar}</div>

        <div className="agent-info">
          <div className="agent-name-row">
            <span className="agent-name">{agent.name}</span>
            {/* Mock agents keep the compact inline badge; OpenClaw cards use the
                full StatusIndicator block rendered after this div instead. */}
            {!isOpenClaw && (
              <span className={`status-badge status-badge--${agent.status}`}>
                <span className="status-pulse"></span>
                {agent.status}
              </span>
            )}
          </div>

          {/* Inline error line — only for OpenClaw when unreachable */}
          {isOpenClaw && polled.status === 'error' && (
            <span className="agent-inline-error">Can't reach this agent</span>
          )}

          <div className="agent-meta">
            <span className={`platform-tag platform-tag--${agent.platformColor}`}>{agent.platform}</span>
            <span className="agent-model">{agent.model}</span>
          </div>
        </div>

        {/* Live status indicator — OpenClaw agents only */}
        {isOpenClaw && (
          <StatusIndicator status={polled.status} responseTimeMs={polled.responseTimeMs} />
        )}
      </div>

      <div className="agent-task">
        <span className="task-label">Current Task</span>
        <span className="task-name">{agent.task}</span>
      </div>

      {/* Mock-agent body sections (progress / error / idle banners) */}
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

      {/* OpenClaw idle/unconfigured hint */}
      {isOpenClaw && (polled.status === 'idle' || polled.status === 'unconfigured') && (
        <div className="agent-idle">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          {polled.status === 'unconfigured' ? 'Add a Gateway URL to enable status checks' : 'Agent responding slowly'}
        </div>
      )}

      <div className="agent-footer">
        <div className="agent-stat">
          <span className="af-value">{agent.tasksCompleted}</span>
          <span className="af-label">Tasks Done</span>
        </div>
        <div className="agent-stat">
          <span className="af-value">{agent.uptime}</span>
          <span className="af-label">Uptime</span>
        </div>
        <div className="agent-btns">
          <button className="agent-btn" title={agent.status === 'active' ? 'Pause' : 'Resume'}>
            {agent.status === 'active' ? (
              <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
            ) : (
              <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
            )}
          </button>
          <button className="agent-btn agent-btn--stop" title="Stop">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><rect x="4" y="4" width="16" height="16" rx="2"/></svg>
          </button>
          <button className="agent-btn agent-btn--details" title="View Details">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Grid ────────────────────────────────────────────────────────────────────

export default function AgentGrid() {
  const { agents, addAgent } = useAgents()
  const [modalOpen, setModalOpen] = useState(false)

  const activeCount = agents.filter(a => a.status === 'active').length

  function handleAddAgent(data) {
    addAgent(data)
    setModalOpen(false)
  }

  return (
    <section className="agent-grid-section">
      <div className="section-header">
        <div>
          <h2 className="section-title">Deployed Agents</h2>
          <p className="section-subtitle">{activeCount} active · {agents.length - activeCount} idle or degraded · {agents.length} total</p>
        </div>
        <button className="deploy-btn" onClick={() => setModalOpen(true)}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Add Agent
        </button>
      </div>

      <div className="agent-grid">
        {agents.map(agent => (
          <AgentCard key={agent.id} agent={agent} />
        ))}
      </div>

      {modalOpen && (
        <AddAgentModal
          onClose={() => setModalOpen(false)}
          onSubmit={handleAddAgent}
        />
      )}
    </section>
  )
}
