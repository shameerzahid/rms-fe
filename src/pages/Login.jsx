import { useState } from 'react'
import { FiLock, FiMail, FiStar } from 'react-icons/fi'
import { api } from '../api.js'
import './Login.css'

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const trimmed = email.trim()
      if (!trimmed || !password) throw new Error('Enter email and password.')
      if (!trimmed.includes('@')) throw new Error('Enter a valid email.')

      const data = await api.login(trimmed, password)
      onLogin({ email: data.user.email, token: data.token })
    } catch (err) {
      setError(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login">
      <div className="login__panel">
        <div className="login__hero">
          <span className="login__mark">
            <FiStar />
          </span>
          <h1>RMS Admin</h1>
          <p>
            Manage product reviews, assign them to store pages, and keep ratings
            accurate — ready for Shopify when you connect.
          </p>
        </div>

        <form className="login__card" onSubmit={handleSubmit}>
          <h2>Sign in</h2>
          <p className="login__hint">Use your admin email and password</p>

          <label>
            Email
            <span className="login__field">
              <FiMail />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                autoComplete="username"
              />
            </span>
          </label>

          <label>
            Password
            <span className="login__field">
              <FiLock />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </span>
          </label>

          {error && <p className="login__error">{error}</p>}

          <button type="submit" disabled={loading}>
            {loading ? 'Signing in…' : 'Continue to dashboard'}
          </button>
        </form>
      </div>
    </div>
  )
}
