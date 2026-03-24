import { useAgents } from '../context/AgentContext'
import './PlatformStatus.css'

function derivePlatforms(agents) {
  const map = {}

  for (const agent of agents) {
    const key = agent.platformColor
    if (!map[key]) {
      map[key] = {
        name: agent.platform,
        color: agent.platformColor,
        agents: [],
      }
    }
    map[key].agents.push(agent)
  }

  return Object.values(map).map(({ name, color, agents: group }) => {
    const total   = group.length
    const active  = group.filter(a => a.status === 'active').length
    const errored = group.filter(a => a.status === 'error').length
    const withRt  = group.filter(a => a.responseTimeMs != null)
    const avgRt   = withRt.length
      ? Math.round(withRt.reduce((s, a) => s + a.responseTimeMs, 0) / withRt.length)
      : null

    let status
    if (errored === total) status = 'offline'
    else if (errored > 0)  status = 'degraded'
    else                   status = 'online'

    const utilPct = total > 0 ? Math.round((active / total) * 100) : 0

    return { name, color, status, avgRt, active, total, utilPct }
  })
}

export default function PlatformStatus() {
  const { agents } = useAgents()
  const platforms = derivePlatforms(agents)

  return (
    <div className="platform-status">
      <div className="ps-header">
        <h2 className="section-title">Platform Health</h2>
        <p className="section-subtitle">Agent utilisation per platform</p>
      </div>
      <div className="ps-list">
        {platforms.map(p => (
          <div key={p.color} className="ps-row">
            <div className={`ps-dot ps-dot--${p.status}`}></div>
            <div className={`ps-name ps-name--${p.color}`}>{p.name}</div>
            <div className="ps-latency">
              {p.avgRt != null ? `${p.avgRt}ms` : `${p.active}/${p.total}`}
            </div>
            <div className="ps-quota-wrap">
              <div className="ps-quota-bar">
                <div
                  className={`ps-quota-fill${p.utilPct > 80 ? ' ps-quota-fill--high' : ''}`}
                  style={{ width: `${p.utilPct}%` }}
                />
              </div>
              <span className="ps-quota-pct">{p.utilPct}%</span>
            </div>
          </div>
        ))}
        {platforms.length === 0 && (
          <p className="ps-empty">No agents deployed</p>
        )}
      </div>
    </div>
  )
}
