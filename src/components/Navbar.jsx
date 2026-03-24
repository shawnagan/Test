import { useState, useEffect, useRef } from 'react'
import { useAgents } from '../context/AgentContext'
import './Navbar.css'

export default function Navbar({ darkMode, toggleDarkMode }) {
  const { notifications } = useAgents()
  const [notifOpen, setNotifOpen] = useState(false)
  const [seenCount, setSeenCount] = useState(0)
  const panelRef = useRef(null)

  const unreadCount = Math.max(0, notifications.length - seenCount)

  function openNotifications() {
    setNotifOpen(true)
    setSeenCount(notifications.length)
  }

  // Close panel on outside click
  useEffect(() => {
    if (!notifOpen) return
    function handleClick(e) {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setNotifOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [notifOpen])

  // Bump unread count when new notifications arrive while panel is closed
  // (seenCount stays where it was so the diff grows)

  const errorCount  = agents.filter(a => a.status === 'error').length
  const activeCount2 = agents.filter(a => a.status === 'active').length
  const sysLabel = errorCount > 0
    ? `${errorCount} agent error${errorCount > 1 ? 's' : ''}`
    : activeCount2 > 0
      ? `${activeCount2} agent${activeCount2 > 1 ? 's' : ''} running`
      : 'All Systems Nominal'
  const sysError = errorCount > 0

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <div className="brand-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2"/>
            <line x1="12" y1="2" x2="12" y2="22"/>
            <line x1="2" y1="8.5" x2="22" y2="8.5"/>
            <line x1="2" y1="15.5" x2="22" y2="15.5"/>
          </svg>
        </div>
        <div className="brand-text">
          <span className="brand-name">ShucyOS</span>
          <span className="brand-sub">Mission Control</span>
        </div>
      </div>

      <div className="navbar-links">
        <a href="#" className="nav-link active">Agents</a>
        <a href="#" className="nav-link">Platforms</a>
        <a href="#" className="nav-link">Workflows</a>
        <a href="#" className="nav-link">Logs</a>
        <a href="#" className="nav-link">Settings</a>
      </div>

      <div className="navbar-actions">
        <div className="sys-status">
          <span className={`sys-dot${sysError ? ' sys-dot--error' : ''}`}></span>
          <span className={`sys-label${sysError ? ' sys-label--error' : ''}`}>{sysLabel}</span>
        </div>

        {/* Notification bell */}
        <div className="notif-wrap" ref={panelRef}>
          <button
            className={`icon-btn${notifOpen ? ' icon-btn--active' : ''}`}
            aria-label="Notifications"
            onClick={notifOpen ? () => setNotifOpen(false) : openNotifications}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
            {unreadCount > 0 && (
              <span className="badge">{unreadCount > 9 ? '9+' : unreadCount}</span>
            )}
          </button>

          {notifOpen && (
            <div className="notif-panel">
              <div className="notif-panel-header">
                <span className="notif-panel-title">Alerts</span>
                <span className="notif-panel-count">{notifications.length} error{notifications.length !== 1 ? 's' : ''}</span>
              </div>
              {notifications.length === 0 ? (
                <div className="notif-empty">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
                  </svg>
                  <p>No errors — all clear</p>
                </div>
              ) : (
                <ul className="notif-list">
                  {notifications.map(n => (
                    <li key={n.id} className="notif-item">
                      <div className="notif-item-top">
                        <span className="notif-agent">{n.agent}</span>
                        <span className="notif-ts">{n.ts}</span>
                      </div>
                      <p className="notif-msg">{n.msg}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>

        <button
          className="theme-toggle"
          onClick={toggleDarkMode}
          aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {darkMode ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="5"/>
              <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
              <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>
          )}
          <span>{darkMode ? 'Light' : 'Dark'}</span>
        </button>

        <div className="avatar">OP</div>
      </div>
    </nav>
  )
}
