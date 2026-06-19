import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useNotifications } from './NotificationContext.jsx'

function LoginPage({ onLogin }) {
  const navigate = useNavigate()
  const { addNotification, users } = useNotifications()
  const [form, setForm] = useState({ email: '', password: '', role: 'Admin' })
  const [error, setError] = useState('')

  function submit(event) {
    event.preventDefault()
    const user = users.find(
      (account) =>
        account.email.toLowerCase() === form.email.toLowerCase() &&
        account.password === form.password &&
        account.role === form.role,
    )

    if (!user) {
      setError('Account not found. Please register first or check your email, password, and role.')
      addNotification('warning', 'Login blocked', `No registered ${form.role.toLowerCase()} account matches ${form.email}.`)
      return
    }

    setError('')
    addNotification('success', 'Login successful', `${user.role} session started for ${user.email}.`)
    onLogin(user)
    navigate(user.role === 'Student' ? '/student' : '/dashboard')
  }

  return (
    <section className="auth-page">
      <form className="auth-card" onSubmit={submit}>
        <p className="eyebrow">Secure access</p>
        <h1>Login</h1>
        <label>
          Email
          <input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required />
        </label>
        <label>
          Password
          <input type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} required />
        </label>
        <label>
          Role
          <select value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value })}>
            <option>Admin</option>
            <option>Teacher</option>
            <option>Student</option>
          </select>
        </label>
        {error ? <p className="form-error">{error}</p> : null}
        <button className="primary-btn" type="submit">Sign in</button>
        <p className="auth-switch">
          New user? <a href="/register">Create an account</a>
        </p>
      </form>
    </section>
  )
}

export default LoginPage
