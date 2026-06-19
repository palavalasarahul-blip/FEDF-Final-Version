import { useState } from 'react'
import { useNotifications } from './NotificationContext.jsx'

const emptySubject = { id: '', name: '', code: '', credits: 3, department: '' }

function SubjectManagement() {
  const { subjects, upsertItem, deleteItem } = useNotifications()
  const [form, setForm] = useState(emptySubject)

  function submit(event) {
    event.preventDefault()
    upsertItem('subjects', { ...form, credits: Number(form.credits) }, 'subject')
    setForm(emptySubject)
  }

  return (
    <section className="page">
      <div className="page-header"><div><p className="eyebrow">Curriculum</p><h1>Subject Management</h1></div></div>
      <div className="management-grid">
        <form className="panel form-panel" onSubmit={submit}>
          <h2>{form.id ? 'Edit subject' : 'Add subject'}</h2>
          <label>Subject name<input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required /></label>
          <label>Code<input value={form.code} onChange={(event) => setForm({ ...form, code: event.target.value })} required /></label>
          <label>Credits<input type="number" min="1" max="6" value={form.credits} onChange={(event) => setForm({ ...form, credits: event.target.value })} required /></label>
          <label>Department<input value={form.department} onChange={(event) => setForm({ ...form, department: event.target.value })} required /></label>
          <button className="primary-btn" type="submit">Save subject</button>
        </form>
        <div className="panel table-wrap">
          <table>
            <thead><tr><th>Subject</th><th>Code</th><th>Credits</th><th>Department</th><th>Actions</th></tr></thead>
            <tbody>
              {subjects.map((subject) => (
                <tr key={subject.id}>
                  <td>{subject.name}</td><td>{subject.code}</td><td>{subject.credits}</td><td>{subject.department}</td>
                  <td className="action-cell"><button onClick={() => setForm(subject)} type="button">Edit</button><button className="danger" onClick={() => deleteItem('subjects', subject.id, 'Subject')} type="button">Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}

export default SubjectManagement
