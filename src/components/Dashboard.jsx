import Navbar from './Navbar'
import StatCard from './StatCard'
import RecentActivity from './RecentActivity'
import Chart from './Chart'
import QuickActions from './QuickActions'
import './Dashboard.css'

const stats = [
  { label: 'Total Revenue', value: '$48,295', change: '+12.5%', trend: 'up', color: 'accent' },
  { label: 'Active Users', value: '3,842', change: '+8.1%', trend: 'up', color: 'success' },
  { label: 'Pending Orders', value: '127', change: '-3.2%', trend: 'down', color: 'warning' },
  { label: 'Support Tickets', value: '24', change: '+2', trend: 'up', color: 'danger' },
]

export default function Dashboard({ darkMode, toggleDarkMode }) {
  return (
    <div className="dashboard">
      <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      <main className="dashboard-main">
        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-title">Overview</h1>
            <p className="dashboard-subtitle">Welcome back! Here's what's happening today.</p>
          </div>
          <span className="dashboard-date">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </span>
        </div>

        <div className="stats-grid">
          {stats.map(stat => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </div>

        <div className="content-grid">
          <Chart />
          <QuickActions />
        </div>

        <RecentActivity />
      </main>
    </div>
  )
}
