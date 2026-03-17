import './CommandPanel.css'

const commands = [
  {
    label: 'Deploy Agent',
    desc: 'Launch a new agent',
    variant: 'accent',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
      </svg>
    ),
  },
  {
    label: 'Broadcast',
    desc: 'Message all agents',
    variant: 'success',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.65 3.4 2 2 0 0 1 3.62 1.24h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.96a16 16 0 0 0 6 6l.92-.92a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.73 16.92z"/>
      </svg>
    ),
  },
  {
    label: 'Export Logs',
    desc: 'Download activity log',
    variant: 'warning',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
      </svg>
    ),
  },
  {
    label: 'Stop All',
    desc: 'Halt all running agents',
    variant: 'danger',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <rect x="4" y="4" width="16" height="16" rx="2"/>
      </svg>
    ),
  },
]

export default function CommandPanel() {
  return (
    <div className="command-panel">
      <div className="cp-header">
        <h2 className="section-title">Quick Commands</h2>
        <p className="section-subtitle">Operator controls</p>
      </div>
      <div className="cp-grid">
        {commands.map(cmd => (
          <button key={cmd.label} className={`cp-btn cp-btn--${cmd.variant}`}>
            <span className="cp-icon">{cmd.icon}</span>
            <span className="cp-label">{cmd.label}</span>
            <span className="cp-desc">{cmd.desc}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
