import { useState, useCallback } from 'react'
import Navbar from './Navbar'
import StatCard from './StatCard'
import AgentGrid from './AgentGrid'
import ActivityLog from './ActivityLog'
import PlatformStatus from './PlatformStatus'
import CommandPanel from './CommandPanel'
import AgentDetailPanel from './AgentDetailPanel'
import StatDrillModal from './StatDrillModal'
import { useAgents } from '../context/AgentContext'
import './Dashboard.css'

export default function Dashboard({ darkMode, toggleDarkMode }) {
  const { agents } = useAgents()

  // ── Modal / panel state ────────────────────────────────────────────────
  const [addAgentOpen,  setAddAgentOpen]  = useState(false)
  const [detailAgentId, setDetailAgentId] = useState(null)
  const [drillStat,     setDrillStat]     = useState(null) // 'active' | 'in-progress' | 'idle' | 'attention'

  const handleCloseDetail = useCallback(() => setDetailAgentId(null), [])
  const handleCloseDrill  = useCallback(() => setDrillStat(null), [])

  // ── Live stats derived from context ───────────────────────────────────
  const activeAgents    = agents.filter(a => a.status === 'active')
  const idleAgents      = agents.filter(a => a.status === 'idle')
  const attentionAgents = agents.filter(a => a.status === 'error')
  const inProgressAgents = activeAgents.filter(a => a.progress > 0)

  const stats = [
    {
      id: 'active',
      label: 'Active Agents',
      value: `${activeAgents.length} / ${agents.length}`,
      change: activeAgents.length > 0
        ? `${activeAgents.length} running now`
        : 'None running',
      trend: activeAgents.length > 0 ? 'up' : 'down',
      color: 'accent',
    },
    {
      id: 'in-progress',
      label: 'Tasks in Progress',
      value: String(inProgressAgents.length),
      change: inProgressAgents.length > 0
        ? `${inProgressAgents.length} agent${inProgressAgents.length > 1 ? 's' : ''} working`
        : 'No active work',
      trend: inProgressAgents.length > 0 ? 'up' : 'down',
      color: 'success',
    },
    {
      id: 'idle',
      label: 'Idle Agents',
      value: String(idleAgents.length),
      change: idleAgents.length === 0
        ? 'Full fleet utilization'
        : `${idleAgents.length} awaiting tasks`,
      trend: idleAgents.length === 0 ? 'up' : 'down',
      color: 'warning',
    },
    {
      id: 'attention',
      label: 'Needs Attention',
      value: String(attentionAgents.length),
      change: attentionAgents.length === 0
        ? 'All clear'
        : `${attentionAgents.length} agent${attentionAgents.length > 1 ? 's' : ''} need${attentionAgents.length === 1 ? 's' : ''} attention`,
      trend: attentionAgents.length === 0 ? 'up' : 'down',
      color: 'danger',
    },
  ]

  return (
    <div className="dashboard">
      <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      <main className="dashboard-main">
        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-title">Mission Control</h1>
            <p className="dashboard-subtitle">Real-time oversight of all deployed AI agents</p>
          </div>
          <div className="header-right">
            <div className="live-indicator">
              <span className="live-dot"></span>
              LIVE
            </div>
            <span className="dashboard-date">
              {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </div>
        </div>

        <div className="stats-grid">
          {stats.map(stat => (
            <StatCard
              key={stat.id}
              {...stat}
              onClick={() => setDrillStat(stat.id)}
            />
          ))}
        </div>

        <AgentGrid
          addAgentOpen={addAgentOpen}
          onAddAgent={() => setAddAgentOpen(true)}
          onCloseAddAgent={() => setAddAgentOpen(false)}
          onViewDetail={setDetailAgentId}
        />

        <div className="bottom-grid">
          <ActivityLog />
          <div className="side-panel">
            <PlatformStatus />
            <CommandPanel onAddAgent={() => setAddAgentOpen(true)} />
          </div>
        </div>
      </main>

      {detailAgentId && (
        <AgentDetailPanel
          agentId={detailAgentId}
          onClose={handleCloseDetail}
        />
      )}

      {drillStat && (
        <StatDrillModal
          stat={drillStat}
          onClose={handleCloseDrill}
        />
      )}
    </div>
  )
}
