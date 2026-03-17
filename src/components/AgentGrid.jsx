import './AgentGrid.css'

const agents = [
  {
    id: 1,
    name: 'GPT-Analyst',
    model: 'GPT-4o',
    platform: 'OpenAI',
    platformColor: 'openai',
    status: 'active',
    task: 'Analyzing Q4 Financial Reports',
    progress: 67,
    tasksCompleted: 142,
    uptime: '14h 32m',
    avatar: 'GA',
  },
  {
    id: 2,
    name: 'Claude-Writer',
    model: 'Claude 3.5 Sonnet',
    platform: 'Anthropic',
    platformColor: 'anthropic',
    status: 'active',
    task: 'Drafting Technical Blog Posts',
    progress: 34,
    tasksCompleted: 89,
    uptime: '8h 17m',
    avatar: 'CW',
  },
  {
    id: 3,
    name: 'Gemini-Coder',
    model: 'Gemini 1.5 Pro',
    platform: 'Google',
    platformColor: 'google',
    status: 'idle',
    task: 'Awaiting Instructions',
    progress: 0,
    tasksCompleted: 201,
    uptime: '22h 08m',
    avatar: 'GC',
  },
  {
    id: 4,
    name: 'Llama-Researcher',
    model: 'Llama 3.1 70B',
    platform: 'Meta',
    platformColor: 'meta',
    status: 'active',
    task: 'Web Research: AI Industry Trends',
    progress: 91,
    tasksCompleted: 56,
    uptime: '3h 44m',
    avatar: 'LR',
  },
  {
    id: 5,
    name: 'Mistral-Support',
    model: 'Mistral Large',
    platform: 'Mistral',
    platformColor: 'mistral',
    status: 'error',
    task: 'Rate Limit Exceeded',
    progress: 0,
    tasksCompleted: 33,
    uptime: '1h 22m',
    avatar: 'MS',
  },
  {
    id: 6,
    name: 'Perplexity-Scout',
    model: 'pplx-70b-online',
    platform: 'Perplexity',
    platformColor: 'perplexity',
    status: 'active',
    task: 'Market Intelligence Gathering',
    progress: 22,
    tasksCompleted: 78,
    uptime: '6h 55m',
    avatar: 'PS',
  },
]

function AgentCard({ agent }) {
  return (
    <div className={`agent-card agent-card--${agent.status}`}>
      <div className="agent-card-header">
        <div className={`agent-avatar agent-avatar--${agent.platformColor}`}>{agent.avatar}</div>
        <div className="agent-info">
          <div className="agent-name-row">
            <span className="agent-name">{agent.name}</span>
            <span className={`status-badge status-badge--${agent.status}`}>
              <span className="status-pulse"></span>
              {agent.status}
            </span>
          </div>
          <div className="agent-meta">
            <span className={`platform-tag platform-tag--${agent.platformColor}`}>{agent.platform}</span>
            <span className="agent-model">{agent.model}</span>
          </div>
        </div>
      </div>

      <div className="agent-task">
        <span className="task-label">Current Task</span>
        <span className="task-name">{agent.task}</span>
      </div>

      {agent.status === 'active' && (
        <div className="agent-progress">
          <div className="progress-header">
            <span>Progress</span>
            <span>{agent.progress}%</span>
          </div>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${agent.progress}%` }}></div>
          </div>
        </div>
      )}

      {agent.status === 'error' && (
        <div className="agent-error">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
          Connection error — retrying in 28s
        </div>
      )}

      {agent.status === 'idle' && (
        <div className="agent-idle">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          Agent standing by
        </div>
      )}

      <div className="agent-footer">
        <div className="agent-stat">
          <span className="af-value">{agent.tasksCompleted}</span>
          <span className="af-label">Tasks Done</span>
        </div>
        <div className="agent-stat">
          <span className="af-value">{agent.uptime}</span>
          <span className="af-label">Uptime</span>
        </div>
        <div className="agent-btns">
          <button className="agent-btn" title={agent.status === 'active' ? 'Pause' : 'Resume'}>
            {agent.status === 'active' ? (
              <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
            ) : (
              <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
            )}
          </button>
          <button className="agent-btn agent-btn--stop" title="Stop">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><rect x="4" y="4" width="16" height="16" rx="2"/></svg>
          </button>
          <button className="agent-btn agent-btn--details" title="View Details">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

export default function AgentGrid() {
  const activeCount = agents.filter(a => a.status === 'active').length
  return (
    <section className="agent-grid-section">
      <div className="section-header">
        <div>
          <h2 className="section-title">Deployed Agents</h2>
          <p className="section-subtitle">{activeCount} active · {agents.length - activeCount} idle or degraded · {agents.length} total</p>
        </div>
        <button className="deploy-btn">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Deploy Agent
        </button>
      </div>
      <div className="agent-grid">
        {agents.map(agent => (
          <AgentCard key={agent.id} agent={agent} />
        ))}
      </div>
    </section>
  )
}
