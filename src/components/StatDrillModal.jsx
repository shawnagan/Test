import { useEffect } from 'react'
import { useAgents } from '../context/AgentContext'
import { useUptime } from '../hooks/useUptime'
import './StatDrillModal.css'

// ── Shared sub-components ────────────────────────────────────────────────────

const STATUS_LABEL = { active: 'Running', idle: 'Idle', error: 'Error', unconfigured: 'Setup needed' }
const STATUS_ORDER = { active: 0, idle: 1, error: 2, unconfigured: 3 }

function StatusBadge({ status }) {
  return (
    <span className={`drill-badge drill-badge--${status}`}>
      <span className="drill-badge-dot" />
      {STATUS_LABEL[status] ?? status}
    </span>
  )
}

// Hook must live in its own component so it can be called per-row
function UptimeCell({ createdAt }) {
  const uptime = useUptime(createdAt)
  return <>{uptime}</>
}

function DrillProgressBar({ value }) {
  return (
    <div className="drill-progress-wrap">
      <div className="drill-progress-track">
        <div className="drill-progress-fill" style={{ width: `${value}%` }} />
      </div>
      <span className="drill-progress-pct">{value}%</span>
    </div>
  )
}

function AgentCell({ agent }) {
  return (
    <div className="drill-agent-cell">
      <span className={`drill-avatar drill-avatar--${agent.platformColor}`}>{agent.avatar}</span>
      <div>
        <div className="drill-agent-name">{agent.name}</div>
        <div className="drill-agent-platform">{agent.platform}</div>
      </div>
    </div>
  )
}

function EmptyState({ icon, title, sub }) {
  return (
    <div className="drill-empty">
      <div className="drill-empty-icon">{icon}</div>
      <p className="drill-empty-title">{title}</p>
      {sub && <p className="drill-empty-sub">{sub}</p>}
    </div>
  )
}

// ── Drill views ──────────────────────────────────────────────────────────────

function ActiveDrill({ agents }) {
  const sorted = [...agents].sort((a, b) => (STATUS_ORDER[a.status] ?? 9) - (STATUS_ORDER[b.status] ?? 9))

  return (
    <table className="drill-table">
      <thead>
        <tr>
          <th>Agent</th>
          <th>Status</th>
          <th>Current Task</th>
          <th>Tasks Done</th>
          <th>Uptime</th>
        </tr>
      </thead>
      <tbody>
        {sorted.map(a => (
          <tr key={a.id} className={`drill-row drill-row--${a.status}`}>
            <td><AgentCell agent={a} /></td>
            <td><StatusBadge status={a.status} /></td>
            <td className="drill-task">{a.task}</td>
            <td className="drill-num">{a.tasksCompleted.toLocaleString()}</td>
            <td className="drill-mono"><UptimeCell createdAt={a.createdAt} /></td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function InProgressDrill({ agents }) {
  const active = agents.filter(a => a.status === 'active')

  if (active.length === 0) return (
    <EmptyState
      icon={<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>}
      title="No active work right now"
      sub="Agents will appear here once they start processing tasks"
    />
  )

  return (
    <table className="drill-table">
      <thead>
        <tr>
          <th>Agent</th>
          <th>Current Task</th>
          <th>Progress</th>
          <th>Tasks Done</th>
        </tr>
      </thead>
      <tbody>
        {active.map(a => (
          <tr key={a.id} className="drill-row">
            <td><AgentCell agent={a} /></td>
            <td className="drill-task">{a.task}</td>
            <td><DrillProgressBar value={a.progress} /></td>
            <td className="drill-num">{a.tasksCompleted.toLocaleString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function IdleDrill({ agents }) {
  const idle = agents.filter(a => a.status === 'idle')

  if (idle.length === 0) return (
    <EmptyState
      icon={<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>}
      title="Full fleet utilization"
      sub="All agents are actively working — no idle capacity"
    />
  )

  return (
    <table className="drill-table">
      <thead>
        <tr>
          <th>Agent</th>
          <th>Standing By Since</th>
          <th>Last Task</th>
          <th>Tasks Done</th>
          <th>Uptime</th>
        </tr>
      </thead>
      <tbody>
        {idle.map(a => (
          <tr key={a.id} className="drill-row">
            <td><AgentCell agent={a} /></td>
            <td className="drill-mono"><UptimeCell createdAt={a.createdAt} /></td>
            <td className="drill-task">{a.task}</td>
            <td className="drill-num">{a.tasksCompleted.toLocaleString()}</td>
            <td className="drill-mono"><UptimeCell createdAt={a.createdAt} /></td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function AttentionDrill({ agents, events }) {
  const errored = agents.filter(a => a.status === 'error')

  if (errored.length === 0) return (
    <EmptyState
      icon={<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>}
      title="All agents healthy"
      sub="No errors or degraded agents detected"
    />
  )

  function lastErrorEvent(agentName) {
    return events.find(e => e.agent === agentName && e.level === 'error')
      ?? events.find(e => e.agent === agentName)
  }

  return (
    <table className="drill-table">
      <thead>
        <tr>
          <th>Agent</th>
          <th>Last Event</th>
          <th>Time</th>
          <th>Tasks Done</th>
        </tr>
      </thead>
      <tbody>
        {errored.map(a => {
          const ev = lastErrorEvent(a.name)
          return (
            <tr key={a.id} className="drill-row drill-row--error">
              <td><AgentCell agent={a} /></td>
              <td className="drill-task drill-task--error">{ev?.msg ?? a.task}</td>
              <td className="drill-mono">{ev?.ts ?? '—'}</td>
              <td className="drill-num">{a.tasksCompleted.toLocaleString()}</td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

// ── Modal shell ──────────────────────────────────────────────────────────────

const DRILL_META = {
  active:       { title: 'Active Agents',      sub: 'All agents and their current operational state' },
  'in-progress': { title: 'Tasks in Progress', sub: 'Agents currently processing work' },
  idle:         { title: 'Idle Agents',         sub: 'Agents with capacity standing by' },
  attention:    { title: 'Needs Attention',     sub: 'Agents in an error or degraded state' },
}

export default function StatDrillModal({ stat, onClose }) {
  const { agents, events } = useAgents()
  const meta = DRILL_META[stat]

  useEffect(() => {
    function handleKey(e) { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [onClose])

  return (
    <div className="modal-overlay drill-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="drill-modal">
        <div className="drill-modal-header">
          <div>
            <h3 className="drill-modal-title">{meta?.title}</h3>
            <p className="drill-modal-sub">{meta?.sub}</p>
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Close">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div className="drill-modal-body">
          {stat === 'active'       && <ActiveDrill     agents={agents} />}
          {stat === 'in-progress'  && <InProgressDrill agents={agents} />}
          {stat === 'idle'         && <IdleDrill        agents={agents} />}
          {stat === 'attention'    && <AttentionDrill   agents={agents} events={events} />}
        </div>
      </div>
    </div>
  )
}
