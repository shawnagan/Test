import { useState } from 'react'
import './ActivityLog.css'

const logs = [
  { id: 1, ts: '14:32:07', agent: 'GPT-Analyst', level: 'info',    msg: 'Started task: Analyzing Q4 Financial Reports (batch 3/5)' },
  { id: 2, ts: '14:31:44', agent: 'Claude-Writer', level: 'success', msg: 'Completed draft: "The Future of Agentic AI" — 1,840 words' },
  { id: 3, ts: '14:31:22', agent: 'Llama-Researcher', level: 'info', msg: 'Fetched 12 sources from arXiv — processing embeddings' },
  { id: 4, ts: '14:30:58', agent: 'Mistral-Support', level: 'error', msg: 'Rate limit hit on Mistral API — queued retry in 28s' },
  { id: 5, ts: '14:30:41', agent: 'Perplexity-Scout', level: 'info', msg: 'Scanning competitor pricing pages (7 of 32)' },
  { id: 6, ts: '14:30:15', agent: 'GPT-Analyst', level: 'success', msg: 'Batch 2/5 complete — anomaly detected in Oct revenue data' },
  { id: 7, ts: '14:29:53', agent: 'Claude-Writer', level: 'warning', msg: 'Token budget 78% used — switching to concise output mode' },
  { id: 8, ts: '14:29:31', agent: 'Gemini-Coder', level: 'warning', msg: 'No task assigned — idle timeout in 15 minutes' },
  { id: 9, ts: '14:29:10', agent: 'Llama-Researcher', level: 'success', msg: 'Knowledge graph updated with 340 new entity relationships' },
  { id: 10, ts: '14:28:47', agent: 'Perplexity-Scout', level: 'info', msg: 'Initiated real-time search: "AI agent frameworks 2025"' },
  { id: 11, ts: '14:28:22', agent: 'GPT-Analyst', level: 'info', msg: 'Loaded 3 data sources: Salesforce, Stripe, QuickBooks' },
  { id: 12, ts: '14:27:59', agent: 'Mistral-Support', level: 'error', msg: 'Auth token expired — attempting silent refresh' },
]

const FILTERS = ['All', 'Info', 'Success', 'Warning', 'Error']

export default function ActivityLog() {
  const [filter, setFilter] = useState('All')

  const filtered = filter === 'All'
    ? logs
    : logs.filter(l => l.level === filter.toLowerCase())

  return (
    <div className="activity-log">
      <div className="al-header">
        <div>
          <h2 className="section-title">Agent Activity Log</h2>
          <p className="section-subtitle">Live event stream from all agents</p>
        </div>
        <div className="al-filters">
          {FILTERS.map(f => (
            <button
              key={f}
              className={`al-filter ${filter === f ? 'al-filter--active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="al-terminal">
        {filtered.map(log => (
          <div key={log.id} className={`log-row log-row--${log.level}`}>
            <span className="log-ts">{log.ts}</span>
            <span className={`log-level log-level--${log.level}`}>{log.level.toUpperCase()}</span>
            <span className="log-agent">[{log.agent}]</span>
            <span className="log-msg">{log.msg}</span>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="log-empty">No {filter.toLowerCase()} events</div>
        )}
      </div>
    </div>
  )
}
