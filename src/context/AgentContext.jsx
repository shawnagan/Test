import { createContext, useContext, useState } from 'react'

const AgentContext = createContext(null)

const INITIAL_AGENTS = [
  {
    id: '1',
    name: 'GPT-Analyst',
    type: 'mock',
    platform: 'OpenAI',
    platformColor: 'openai',
    model: 'GPT-4o',
    status: 'active',
    task: 'Analyzing Q4 Financial Reports',
    progress: 67,
    tasksCompleted: 142,
    uptime: '14h 32m',
    avatar: 'GA',
    messageInterface: null,
    apiKey: null,
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
    task: 'Drafting Technical Blog Posts',
    progress: 34,
    tasksCompleted: 89,
    uptime: '8h 17m',
    avatar: 'CW',
    messageInterface: null,
    apiKey: null,
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
    task: 'Awaiting Instructions',
    progress: 0,
    tasksCompleted: 201,
    uptime: '22h 08m',
    avatar: 'GC',
    messageInterface: null,
    apiKey: null,
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
    task: 'Web Research: AI Industry Trends',
    progress: 91,
    tasksCompleted: 56,
    uptime: '3h 44m',
    avatar: 'LR',
    messageInterface: null,
    apiKey: null,
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
    task: 'Rate Limit Exceeded',
    progress: 0,
    tasksCompleted: 33,
    uptime: '1h 22m',
    avatar: 'MS',
    messageInterface: null,
    apiKey: null,
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
    task: 'Market Intelligence Gathering',
    progress: 22,
    tasksCompleted: 78,
    uptime: '6h 55m',
    avatar: 'PS',
    messageInterface: null,
    apiKey: null,
    createdAt: new Date(),
  },
]

export function AgentProvider({ children }) {
  const [agents, setAgents] = useState(INITIAL_AGENTS)

  function addAgent({ name, messageInterface, apiKey }) {
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
      task: 'Awaiting Instructions',
      progress: 0,
      tasksCompleted: 0,
      uptime: '0m',
      avatar: initials,
      messageInterface,
      apiKey,
      createdAt: new Date(),
    }

    setAgents(prev => [...prev, newAgent])
  }

  return (
    <AgentContext.Provider value={{ agents, addAgent }}>
      {children}
    </AgentContext.Provider>
  )
}

export function useAgents() {
  return useContext(AgentContext)
}
