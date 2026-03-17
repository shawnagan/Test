import './RecentActivity.css'

const activities = [
  { id: 1, user: 'Alice Chen', action: 'placed a new order', target: '#ORD-4821', time: '2 min ago', status: 'success', avatar: 'AC' },
  { id: 2, user: 'Bob Martinez', action: 'submitted a support ticket', target: '#TKT-291', time: '14 min ago', status: 'warning', avatar: 'BM' },
  { id: 3, user: 'Carol Singh', action: 'completed payment for', target: '#INV-8834', time: '1 hr ago', status: 'success', avatar: 'CS' },
  { id: 4, user: 'David Kim', action: 'reported an issue with', target: '#ORD-4799', time: '2 hr ago', status: 'danger', avatar: 'DK' },
  { id: 5, user: 'Eve Johnson', action: 'updated their profile', target: 'settings', time: '3 hr ago', status: 'accent', avatar: 'EJ' },
  { id: 6, user: 'Frank Liu', action: 'exported data from', target: 'Analytics', time: '5 hr ago', status: 'accent', avatar: 'FL' },
]

export default function RecentActivity() {
  return (
    <div className="activity-card">
      <div className="activity-header">
        <h2 className="activity-title">Recent Activity</h2>
        <button className="view-all">View all</button>
      </div>
      <div className="activity-list">
        {activities.map(({ id, user, action, target, time, status, avatar }) => (
          <div key={id} className="activity-item">
            <div className={`activity-avatar activity-avatar--${status}`}>{avatar}</div>
            <div className="activity-content">
              <p className="activity-text">
                <strong>{user}</strong> {action} <span className="activity-target">{target}</span>
              </p>
              <span className="activity-time">{time}</span>
            </div>
            <div className={`activity-dot activity-dot--${status}`} />
          </div>
        ))}
      </div>
    </div>
  )
}
