import './QuickActions.css'

const actions = [
  { label: 'New Report', icon: '📊', desc: 'Generate analytics report' },
  { label: 'Add User', icon: '👤', desc: 'Invite team member' },
  { label: 'Export Data', icon: '📥', desc: 'Download as CSV' },
  { label: 'View Logs', icon: '📋', desc: 'System activity logs' },
]

export default function QuickActions() {
  return (
    <div className="quick-card">
      <h2 className="quick-title">Quick Actions</h2>
      <div className="quick-list">
        {actions.map(({ label, icon, desc }) => (
          <button key={label} className="quick-action">
            <span className="quick-icon">{icon}</span>
            <div className="quick-text">
              <span className="quick-label">{label}</span>
              <span className="quick-desc">{desc}</span>
            </div>
            <svg className="quick-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </button>
        ))}
      </div>
    </div>
  )
}
