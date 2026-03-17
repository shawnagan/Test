import { useState } from 'react'
import Dashboard from './components/Dashboard'
import './App.css'

function App() {
  const [darkMode, setDarkMode] = useState(false)

  return (
    <div className={`app ${darkMode ? 'dark' : 'light'}`}>
      <Dashboard darkMode={darkMode} toggleDarkMode={() => setDarkMode(d => !d)} />
    </div>
  )
}

export default App
