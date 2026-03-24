import { createContext, useContext, useState, useCallback } from 'react'

const AgentContext = createContext(null)

function nowTs() {
  return new Date().toTimeString().slice(0, 8)
}

function makeEvent(agent, level, msg) {
  return { id: crypto.randomUUID(), ts: nowTs(), agent, level, msg }
}

// ── Initial data ────────────────────────────────────────────────────────────

const INITIAL_AGENTS = [
  {
    id: '1',
    name: 'GPT-Analyst',
    type: 'mock',
    platform: 'OpenAI',
    platformColor: 'openai',
    model: 'GPT-4o',
    status: 'active',
    userPaused: false,
    task: 'Analyzing Q4 Financial Reports',
    progress: 67,
    tasksCompleted: 142,
    uptime: '14h 32m',
    avatar: 'GA',
    messageInterface: null,
    apiKey: null,
    gatewayUrl: null,
    responseTimeMs: null,
    createdAt: new Date(),
  },
  {
    id: '2',
    name: 'Claude-Writer',
    type: 'mock',
    platform: 'Anthropic',
    platformColor: 'anthropic',
    model: 'Claude 3.5 Sonnet',
    status: 'active',
    userPaused: false,
    task: 'Drafting Technical Blog Posts',
    progress: 34,
    tasksCompleted: 89,
    uptime: '8h 17m',
    avatar: 'CW',
    messageInterface: null,
    apiKey: null,
    gatewayUrl: null,
    responseTimeMs: null,
    createdAt: new Date(),
  },
  {
    id: '3',
    name: 'Gemini-Coder',
    type: 'mock',
    platform: 'Google',
    platformColor: 'google',
    model: 'Gemini 1.5 Pro',
    status: 'idle',
    userPaused: false,
    task: 'Awaiting Instructions',
    progress: 0,
    tasksCompleted: 201,
    uptime: '22h 08m',
    avatar: 'GC',
    messageInterface: null,
    apiKey: null,
    gatewayUrl: null,
    responseTimeMs: null,
    createdAt: new Date(),
  },
  {
    id: '4',
    name: 'Llama-Researcher',
    type: 'mock',
    platform: 'Meta',
    platformColor: 'meta',
    model: 'Llama 3.1 70B',
    status: 'active',
    userPaused: false,
    task: 'Web Research: AI Industry Trends',
    progress: 91,
    tasksCompleted: 56,
    uptime: '3h 44m',
    avatar: 'LR',
    messageInterface: null,
    apiKey: null,
    gatewayUrl: null,
    responseTimeMs: null,
    createdAt: new Date(),
  },
  {
    id: '5',
    name: 'Mistral-Support',
    type: 'mock',
    platform: 'Mistral',
    platformColor: 'mistral',
    model: 'Mistral Large',
    status: 'error',
    userPaused: false,
    task: 'Rate Limit Exceeded',
    progress: 0,
    tasksCompleted: 33,
    uptime: '1h 22m',
    avatar: 'MS',
    messageInterface: null,
    apiKey: null,
    gatewayUrl: null,
    responseTimeMs: null,
    createdAt: new Date(),
  },
  {
    id: '6',
    name: 'Perplexity-Scout',
    type: 'mock',
    platform: 'Perplexity',
    platformColor: 'perplexity',
    model: 'pplx-70b-online',
    status: 'active',
    userPaused: false,
    task: 'Market Intelligence Gathering',
    progress: 22,
    tasksCompleted: 78,
    uptime: '6h 55m',
    avatar: 'PS',
    messageInterface: null,
    apiKey: null,
    gatewayUrl: null,
    responseTimeMs: null,
    createdAt: new Date(),
  },
]

const INITIAL_EVENTS = [
  { id: 'e1',  ts: '14:32:07', agent: 'GPT-Analyst',       level: 'info',    msg: 'Started task: Analyzing Q4 Financial Reports (batch 3/5)' },
  { id: 'e2',  ts: '14:31:44', agent: 'Claude-Writer',     level: 'success', msg: 'Completed draft: "The Future of Agentic AI" — 1,840 words' },
  { id: 'e3',  ts: '14:31:22', agent: 'Llama-Researcher',  level: 'info',    msg: 'Fetched 12 sources from arXiv — processing embeddings' },
  { id: 'e4',  ts: '14:30:58', agent: 'Mistral-Support',   level: 'error',   msg: 'Rate limit hit on Mistral API — queued retry in 28s' },
  { id: 'e5',  ts: '14:30:41', agent: 'Perplexity-Scout',  level: 'info',    msg: 'Scanning competitor pricing pages (7 of 32)' },
  { id: 'e6',  ts: '14:30:15', agent: 'GPT-Analyst',       level: 'success', msg: 'Batch 2/5 complete — anomaly detected in Oct revenue data' },
  { id: 'e7',  ts: '14:29:53', agent: 'Claude-Writer',     level: 'warning', msg: 'Token budget 78% used — switching to concise output mode' },
  { id: 'e8',  ts: '14:29:31', agent: 'Gemini-Coder',      level: 'warning', msg: 'No task assigned — idle timeout in 15 minutes' },
  { id: 'e9',  ts: '14:29:10', agent: 'Llama-Researcher',  level: 'success', msg: 'Knowledge graph updated with 340 new entity relationships' },
  { id: 'e10', ts: '14:28:47', agent: 'Perplexity-Scout',  level: 'info',    msg: 'Initiated real-time search: "AI agent frameworks 2025"' },
  { id: 'e11', ts: '14:28:22', agent: 'GPT-Analyst',       level: 'info',    msg: 'Loaded 3 data sources: Salesforce, Stripe, QuickBooks' },
  { id: 'e12', ts: '14:27:59', agent: 'Mistral-Support',   level: 'error',   msg: 'Auth token expired — attempting silent refresh' },
]

// ── Provider ────────────────────────────────────────────────────────────────

export function AgentProvider({ children }) {
  const [agents, setAgents] = useState(INITIAL_AGENTS)
  const [events, setEvents] = useState(INITIAL_EVENTS)

  function pushEvent(agent, level, msg) {
    setEvents(prev => [makeEvent(agent, level, msg), ...prev].slice(0, 500))
  }

  // Stable reference — used inside a useEffect dep array in AgentCard
  // Respects userPaused: polling cannot overwrite a manually-paused agent's status
  const updateAgentStatus = useCallback((id, status, responseTimeMs) => {
    setAgents(prev => prev.map(a => {
      if (a.id !== id) return a
      if (a.userPaused) return { ...a, responseTimeMs } // keep paused status, update RT only
      return { ...a, status, responseTimeMs }
    }))
  }, [])

  function addAgent({ name, messageInterface, apiKey, gatewayUrl }) {
    const initials = name
      .split(/\s+/)
      .map(w => w[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)

    const newAgent = {
      id: crypto.randomUUID(),
      name,
      type: 'openclaw',
      platform: 'OpenClaw',
      platformColor: 'openclaw',
      model: messageInterface,
      status: 'idle',
      userPaused: false,
      task: 'Awaiting Instructions',
      progress: 0,
      tasksCompleted: 0,
      uptime: '0m',
      avatar: initials,
      messageInterface,
      apiKey,
      gatewayUrl: gatewayUrl || null,
      responseTimeMs: null,
      createdAt: new Date(),
    }

    setAgents(prev => [...prev, newAgent])
    pushEvent(name, 'info', `Agent "${name}" added to Mission Control via ${messageInterface}`)
  }

  function pauseAgent(id) {
    const agent = agents.find(a => a.id === id)
    if (!agent) return
    setAgents(prev => prev.map(a => a.id === id ? { ...a, status: 'idle', userPaused: true } : a))
    pushEvent(agent.name, 'warning', 'Agent paused by operator')
  }

  function resumeAgent(id) {
    const agent = agents.find(a => a.id === id)
    if (!agent) return
    setAgents(prev => prev.map(a => a.id === id ? { ...a, status: 'active', userPaused: false } : a))
    pushEvent(agent.name, 'info', 'Agent resumed by operator')
  }

  function removeAgent(id) {
    const agent = agents.find(a => a.id === id)
    if (agent) pushEvent(agent.name, 'warning', `Agent "${agent.name}" removed from Mission Control`)
    setAgents(prev => prev.filter(a => a.id !== id))
  }

  function stopAllAgents() {
    const activeAgents = agents.filter(a => a.status === 'active')
    if (activeAgents.length === 0) return
    setAgents(prev => prev.map(a => a.status === 'active' ? { ...a, status: 'idle' } : a))
    pushEvent('System', 'warning', `All agents halted by operator — ${activeAgents.length} agent${activeAgents.length > 1 ? 's' : ''} stopped`)
  }

  function broadcastMessage(msg) {
    if (!msg.trim()) return
    const ts = nowTs()
    const newEvents = agents.map(a => ({
      id: crypto.randomUUID(),
      ts,
      agent: a.name,
      level: 'info',
      msg: `[Broadcast] ${msg.trim()}`,
    }))
    setEvents(prev => [...newEvents, ...prev].slice(0, 500))
  }

  // Notifications: most recent error events (shown in navbar)
  const notifications = events.filter(e => e.level === 'error').slice(0, 10)

  return (
    <AgentContext.Provider value={{
      agents,
      events,
      notifications,
      addAgent,
      updateAgentStatus,
      pauseAgent,
      resumeAgent,
      removeAgent,
      stopAllAgents,
      broadcastMessage,
    }}>
      {children}
    </AgentContext.Provider>
  )
}

export function useAgents() {
  return useContext(AgentContext)
}
