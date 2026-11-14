import { useState } from 'react'
import Login from './pages/Login.jsx'
import Dashboard from './pages/Dashboard.jsx'
import { clearSession, getSession, setSession } from './api.js'

function App() {
  const [user, setUser] = useState(() => getSession())

  function handleLogin(session) {
    setSession(session)
    setUser(session)
  }

  function handleLogout() {
    clearSession()
    setUser(null)
  }

  if (!user?.token) {
    return <Login onLogin={handleLogin} />
  }

  return <Dashboard user={user} onLogout={handleLogout} />
}

export default App
