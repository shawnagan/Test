import './PlatformStatus.css'

const platforms = [
  { id: 1, name: 'OpenAI',     color: 'openai',     status: 'online',    latency: '142ms', requests: '1,284', quota: 72 },
  { id: 2, name: 'Anthropic',  color: 'anthropic',  status: 'online',    latency: '198ms', requests: '847',   quota: 45 },
  { id: 3, name: 'Google AI',  color: 'google',     status: 'online',    latency: '210ms', requests: '2,103', quota: 88 },
  { id: 4, name: 'Meta AI',    color: 'meta',       status: 'online',    latency: '165ms', requests: '432',   quota: 31 },
  { id: 5, name: 'Mistral',    color: 'mistral',    status: 'degraded',  latency: '840ms', requests: '291',   quota: 20 },
  { id: 6, name: 'Perplexity', color: 'perplexity', status: 'online',    latency: '320ms', requests: '678',   quota: 56 },
]

export default function PlatformStatus() {
  return (
    <div className="platform-status">
      <div className="ps-header">
        <h2 className="section-title">Platform Health</h2>
        <p className="section-subtitle">API connectivity & quota</p>
      </div>
      <div className="ps-list">
        {platforms.map(p => (
          <div key={p.id} className="ps-row">
            <div className={`ps-dot ps-dot--${p.status}`}></div>
            <div className={`ps-name ps-name--${p.color}`}>{p.name}</div>
            <div className="ps-latency">{p.latency}</div>
            <div className="ps-quota-wrap">
              <div className="ps-quota-bar">
                <div
                  className={`ps-quota-fill ${p.quota > 80 ? 'ps-quota-fill--high' : ''}`}
                  style={{ width: `${p.quota}%` }}
                ></div>
              </div>
              <span className="ps-quota-pct">{p.quota}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
