import Navbar from './Navbar'
import StatCard from './StatCard'
import AgentGrid from './AgentGrid'
import ActivityLog from './ActivityLog'
import PlatformStatus from './PlatformStatus'
import CommandPanel from './CommandPanel'
import './Dashboard.css'

const stats = [
  { label: 'Active Agents', value: '4 / 6', change: '+2 this hour', trend: 'up', color: 'accent' },
  { label: 'Tasks Completed', value: '247', change: '+18.3%', trend: 'up', color: 'success' },
  { label: 'Avg Response', value: '1.4s', change: '-0.3s', trend: 'up', color: 'warning' },
  { label: 'Errors Today', value: '3', change: '-71.4%', trend: 'up', color: 'danger' },
]

export default function Dashboard({ darkMode, toggleDarkMode }) {
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

        <AgentGrid />

        <div className="bottom-grid">
          <ActivityLog />
          <div className="side-panel">
            <PlatformStatus />
            <CommandPanel />
          </div>
        </div>
      </main>
    </div>
  )
}
