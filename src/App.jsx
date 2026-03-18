import { useState } from 'react'
import Dashboard from './components/Dashboard'
import { AgentProvider } from './context/AgentContext'
import './App.css'

function App() {
  const [darkMode, setDarkMode] = useState(true)

  return (
    <AgentProvider>
      <div className={`app ${darkMode ? 'dark' : 'light'}`}>
        <Dashboard darkMode={darkMode} toggleDarkMode={() => setDarkMode(d => !d)} />
      </div>
    </AgentProvider>
  )
}

export default App
