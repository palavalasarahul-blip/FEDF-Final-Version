import { useState } from 'react'
import ConflictTable from './ConflictTable.jsx'
import WarningModal from './WarningModal.jsx'
import { getName, useNotifications } from './NotificationContext.jsx'

const emptyEntry = { id: '', day: 'Monday', slot: '09:00-10:00', roomId: '', teacherId: '', subjectId: '', section: 'CSE-A' }

function TimetableBuilder() {
  const { rooms, teachers, subjects, days, slots, timetable, availability, conflicts, saveTimetableEntry, deleteTimetableEntry } = useNotifications()
  const [form, setForm] = useState(emptyEntry)
  const [modalConflicts, setModalConflicts] = useState([])

  const occupiedAtSlot = timetable.filter(
    (entry) => entry.id !== form.id && entry.day === form.day && entry.slot === form.slot,
  )
  const teacherOptions = teachers.map((teacher) => {
    const teacherSlots = availability[teacher.id] || []
    const isAvailable = teacherSlots.some((slot) => slot.day === form.day && slot.slot === form.slot)
    const isBusy = occupiedAtSlot.some((entry) => entry.teacherId === teacher.id)
    return { ...teacher, isAvailable, isBusy }
  })
  const availableRooms = rooms.filter((room) => !occupiedAtSlot.some((entry) => entry.roomId === room.id))
  const availableTeacherCount = teacherOptions.filter((teacher) => teacher.isAvailable && !teacher.isBusy).length

  function submit(event) {
    event.preventDefault()
    const newConflicts = saveTimetableEntry(form)
    if (newConflicts.length) {
      setModalConflicts(newConflicts)
      return
    }
    setForm(emptyEntry)
  }

  function changeDayOrSlot(updates) {
    setForm({ ...form, ...updates, teacherId: '', roomId: '' })
  }

  return (
    <section className="page">
      <div className="page-header"><div><p className="eyebrow">Schedule creation</p><h1>Timetable Builder</h1></div><div className="status-pill">{conflicts.length ? `${conflicts.length} conflicts` : 'No conflicts'}</div></div>
      <div className="management-grid">
        <form className="panel form-panel" onSubmit={submit}>
          <h2>{form.id ? 'Edit class' : 'Add class'}</h2>
          <label>Day<select value={form.day} onChange={(event) => changeDayOrSlot({ day: event.target.value })}>{days.map((day) => <option key={day}>{day}</option>)}</select></label>
          <label>Time slot<select value={form.slot} onChange={(event) => changeDayOrSlot({ slot: event.target.value })}>{slots.map((slot) => <option key={slot}>{slot}</option>)}</select></label>
          <label>Teacher<select value={form.teacherId} onChange={(event) => setForm({ ...form, teacherId: event.target.value })} required><option value="">Select teacher</option>{teacherOptions.map((teacher) => <option key={teacher.id} value={teacher.id} disabled={teacher.isBusy}>{teacher.name}{teacher.isBusy ? ' - busy' : teacher.isAvailable ? ' - available' : ' - not marked available'}</option>)}</select></label>
          <label>Subject<select value={form.subjectId} onChange={(event) => setForm({ ...form, subjectId: event.target.value })} required><option value="">Select subject</option>{subjects.map((subject) => <option key={subject.id} value={subject.id}>{subject.name}</option>)}</select></label>
          <label>Room<select value={form.roomId} onChange={(event) => setForm({ ...form, roomId: event.target.value })} required><option value="">Select free room</option>{availableRooms.map((room) => <option key={room.id} value={room.id}>{room.name} - {room.type}</option>)}</select></label>
          <label>Section<input value={form.section} onChange={(event) => setForm({ ...form, section: event.target.value })} required /></label>
          <div className="builder-hints">
            <span>{teacherOptions.length} teachers listed</span>
            <span>{availableTeacherCount} available for this slot</span>
            <span>{availableRooms.length} rooms free</span>
          </div>
          <button className="primary-btn" type="submit">Save class</button>
        </form>
        <div className="panel table-wrap">
          <table>
            <thead><tr><th>Day</th><th>Slot</th><th>Subject</th><th>Teacher</th><th>Room</th><th>Section</th><th>Actions</th></tr></thead>
            <tbody>
              {timetable.map((entry) => (
                <tr key={entry.id}>
                  <td>{entry.day}</td><td>{entry.slot}</td><td>{getName(subjects, entry.subjectId)}</td><td>{getName(teachers, entry.teacherId)}</td><td>{getName(rooms, entry.roomId)}</td><td>{entry.section}</td>
                  <td className="action-cell"><button onClick={() => setForm(entry)} type="button">Edit</button><button className="danger" onClick={() => deleteTimetableEntry(entry.id)} type="button">Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="panel"><div className="panel-heading"><h2>Conflict Table</h2><span>{conflicts.length} issues</span></div><ConflictTable conflicts={conflicts} /></div>
      <WarningModal conflicts={modalConflicts} onClose={() => setModalConflicts([])} />
    </section>
  )
}

export default TimetableBuilder
