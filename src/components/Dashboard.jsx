import { useState, useCallback } from 'react'
import Navbar from './Navbar'
import StatCard from './StatCard'
import AgentGrid from './AgentGrid'
import ActivityLog from './ActivityLog'
import PlatformStatus from './PlatformStatus'
import CommandPanel from './CommandPanel'
import AgentDetailPanel from './AgentDetailPanel'
import { useAgents } from '../context/AgentContext'
import './Dashboard.css'

export default function Dashboard({ darkMode, toggleDarkMode }) {
  const { agents } = useAgents()

  // ── Modal / panel state ────────────────────────────────────────────────
  const [addAgentOpen, setAddAgentOpen] = useState(false)
  const [detailAgentId, setDetailAgentId] = useState(null)

  const handleCloseDetail = useCallback(() => setDetailAgentId(null), [])

  // ── Live stats derived from context ───────────────────────────────────
  const activeCount   = agents.filter(a => a.status === 'active').length
  const totalAgents   = agents.length
  const totalTasks    = agents.reduce((s, a) => s + a.tasksCompleted, 0)
  const errorCount    = agents.filter(a => a.status === 'error').length
  const withRt        = agents.filter(a => a.responseTimeMs != null)
  const avgResponseMs = withRt.length
    ? Math.round(withRt.reduce((s, a) => s + a.responseTimeMs, 0) / withRt.length)
    : null

  const stats = [
    {
      label: 'Active Agents',
      value: `${activeCount} / ${totalAgents}`,
      change: activeCount > 0 ? `${activeCount} running now` : 'None running',
      trend: activeCount > 0 ? 'up' : 'down',
      color: 'accent',
    },
    {
      label: 'Tasks Completed',
      value: totalTasks.toLocaleString(),
      change: '+18.3% vs yesterday',
      trend: 'up',
      color: 'success',
    },
    {
      label: 'Avg Response',
      value: avgResponseMs != null ? `${avgResponseMs}ms` : '—',
      change: avgResponseMs != null ? (avgResponseMs < 1000 ? 'Within SLA' : 'Above target') : 'No live data',
      trend: avgResponseMs == null || avgResponseMs < 1000 ? 'up' : 'down',
      color: 'warning',
    },
    {
      label: 'Errors Today',
      value: String(errorCount),
      change: errorCount === 0 ? 'All clear' : `${errorCount} agent${errorCount > 1 ? 's' : ''} need attention`,
      trend: errorCount === 0 ? 'up' : 'down',
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
            <StatCard key={stat.label} {...stat} />
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

      {/* Global slide-over panel */}
      {detailAgentId && (
        <AgentDetailPanel
          agentId={detailAgentId}
          onClose={handleCloseDetail}
        />
      )}
    </div>
  )
}
