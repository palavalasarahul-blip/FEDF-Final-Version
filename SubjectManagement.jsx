import { useState } from 'react'
import { useNotifications } from './NotificationContext.jsx'

const emptyRoom = { id: '', name: '', capacity: 40, type: 'Lecture Hall' }

function RoomManagement() {
  const { rooms, upsertItem, deleteItem } = useNotifications()
  const [form, setForm] = useState(emptyRoom)

  function submit(event) {
    event.preventDefault()
    upsertItem('rooms', { ...form, capacity: Number(form.capacity) }, 'room')
    setForm(emptyRoom)
  }

  return (
    <section className="page">
      <div className="page-header">
        <div>
          <p className="eyebrow">Infrastructure</p>
          <h1>Room Management</h1>
        </div>
      </div>
      <div className="management-grid">
        <form className="panel form-panel" onSubmit={submit}>
          <h2>{form.id ? 'Edit room' : 'Add room'}</h2>
          <label>Room name<input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required /></label>
          <label>Capacity<input type="number" min="1" value={form.capacity} onChange={(event) => setForm({ ...form, capacity: event.target.value })} required /></label>
          <label>Type<select value={form.type} onChange={(event) => setForm({ ...form, type: event.target.value })}><option>Lecture Hall</option><option>Computer Lab</option><option>Seminar Room</option><option>Auditorium</option></select></label>
          <button className="primary-btn" type="submit">Save room</button>
        </form>
        <div className="panel table-wrap">
          <table>
            <thead><tr><th>Room</th><th>Capacity</th><th>Type</th><th>Actions</th></tr></thead>
            <tbody>
              {rooms.map((room) => (
                <tr key={room.id}>
                  <td>{room.name}</td><td>{room.capacity}</td><td>{room.type}</td>
                  <td className="action-cell"><button onClick={() => setForm(room)} type="button">Edit</button><button className="danger" onClick={() => deleteItem('rooms', room.id, 'Room')} type="button">Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}

export default RoomManagement
