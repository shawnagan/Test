import { useState } from 'react'
import Dashboard from './components/Dashboard'
import { AgentProvider } from './context/AgentContext'
import { ToastProvider } from './components/Toaster'
import './App.css'

function App() {
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem('mc-darkmode') !== 'false'
  )

  function toggleDarkMode() {
    setDarkMode(d => {
      localStorage.setItem('mc-darkmode', String(!d))
      return !d
    })
  }

  return (
    <AgentProvider>
      <ToastProvider>
        <div className={`app ${darkMode ? 'dark' : 'light'}`}>
          <Dashboard darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
        </div>
      </ToastProvider>
    </AgentProvider>
  )
}

export default App
