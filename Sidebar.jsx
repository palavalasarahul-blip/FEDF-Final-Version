import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useNotifications } from './NotificationContext.jsx'

const emptyUser = { name: '', email: '', password: '', role: 'Student' }

function RegisterPage() {
  const navigate = useNavigate()
  const { registerUser, users, addNotification } = useNotifications()
  const [form, setForm] = useState(emptyUser)
  const [error, setError] = useState('')

  function submit(event) {
    event.preventDefault()
    const exists = users.some((user) => user.email.toLowerCase() === form.email.toLowerCase())

    if (exists) {
      setError('An account with this email already exists. Please sign in instead.')
      addNotification('warning', 'Registration blocked', `${form.email} is already registered.`)
      return
    }

    setError('')
    registerUser(form)
    setForm(emptyUser)
    navigate('/login')
  }

  return (
    <section className="auth-page">
      <form className="auth-card" onSubmit={submit}>
        <p className="eyebrow">New account</p>
        <h1>Register</h1>
        <label>
          Full name
          <input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required />
        </label>
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
            <option>Student</option>
            <option>Teacher</option>
            <option>Admin</option>
          </select>
        </label>
        {error ? <p className="form-error">{error}</p> : null}
        <button className="primary-btn" type="submit">Create account</button>
        <p className="auth-switch">
          Already registered? <a href="/login">Sign in</a>
        </p>
      </form>
    </section>
  )
}

export default RegisterPage
