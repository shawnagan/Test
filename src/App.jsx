import { useState } from 'react'
import Dashboard from './components/Dashboard'
import { AgentProvider } from './context/AgentContext'
import { ToastProvider } from './components/Toaster'
import './App.css'

function App() {
  const [darkMode, setDarkMode] = useState(true)

  return (
    <AgentProvider>
      <ToastProvider>
        <div className={`app ${darkMode ? 'dark' : 'light'}`}>
          <Dashboard darkMode={darkMode} toggleDarkMode={() => setDarkMode(d => !d)} />
        </div>
      </ToastProvider>
    </AgentProvider>
  )
}

export default App
