import './Chart.css'

const data = [
  { month: 'Jan', revenue: 32000, users: 2100 },
  { month: 'Feb', revenue: 28000, users: 2400 },
  { month: 'Mar', revenue: 35000, users: 2800 },
  { month: 'Apr', revenue: 31000, users: 2600 },
  { month: 'May', revenue: 42000, users: 3100 },
  { month: 'Jun', revenue: 38000, users: 3400 },
  { month: 'Jul', revenue: 45000, users: 3600 },
  { month: 'Aug', revenue: 48000, users: 3842 },
]

const maxRevenue = Math.max(...data.map(d => d.revenue))

export default function Chart() {
  return (
    <div className="chart-card">
      <div className="chart-header">
        <div>
          <h2 className="chart-title">Revenue & Users</h2>
          <p className="chart-subtitle">Monthly performance overview</p>
        </div>
        <div className="chart-legend">
          <span className="legend-item legend-item--revenue">Revenue</span>
          <span className="legend-item legend-item--users">Users</span>
        </div>
      </div>

      <div className="chart-body">
        <div className="bars">
          {data.map(({ month, revenue, users }) => {
            const revenueHeight = (revenue / maxRevenue) * 100
            const usersHeight = (users / maxRevenue) * 60

            return (
              <div key={month} className="bar-group">
                <div className="bar-pair">
                  <div
                    className="bar bar--revenue"
                    style={{ height: `${revenueHeight}%` }}
                    title={`Revenue: $${revenue.toLocaleString()}`}
                  />
                  <div
                    className="bar bar--users"
                    style={{ height: `${usersHeight}%` }}
                    title={`Users: ${users.toLocaleString()}`}
                  />
                </div>
                <span className="bar-label">{month}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
