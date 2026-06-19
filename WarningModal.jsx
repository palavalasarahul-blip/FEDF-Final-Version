import { useMemo, useState } from 'react'
import { useNotifications } from './NotificationContext.jsx'

function TeacherAvailability() {
  const { teachers, availability, days, slots, saveAvailability } = useNotifications()
  const [teacherId, setTeacherId] = useState(teachers[0]?.id || '')
  const selected = useMemo(() => availability[teacherId] || [], [availability, teacherId])

  function toggle(day, slot) {
    const exists = selected.some((item) => item.day === day && item.slot === slot)
    const next = exists ? selected.filter((item) => item.day !== day || item.slot !== slot) : [...selected, { day, slot }]
    saveAvailability(teacherId, next)
  }

  return (
    <section className="page">
      <div className="page-header"><div><p className="eyebrow">Scheduling rules</p><h1>Teacher Availability</h1></div></div>
      <div className="availability-page-grid">
        <aside className="panel availability-summary">
          <p className="eyebrow">Selected teacher</p>
          <label className="inline-select">Teacher<select value={teacherId} onChange={(event) => setTeacherId(event.target.value)}>{teachers.map((teacher) => <option key={teacher.id} value={teacher.id}>{teacher.name}</option>)}</select></label>
          <div className="availability-count">
            <strong>{selected.length}</strong>
            <span>available slots selected</span>
          </div>
          <p className="muted">Choose the days and time slots this teacher can be assigned in the timetable builder.</p>
        </aside>

        <div className="availability-days">
          {days.map((day) => (
            <article className="panel availability-day-card" key={day}>
              <div className="day-card-header">
                <h2>{day}</h2>
                <span>{selected.filter((item) => item.day === day).length} selected</span>
              </div>
              <div className="slot-list">
                {slots.map((slot) => {
                  const checked = selected.some((item) => item.day === day && item.slot === slot)
                  return <button className={checked ? 'slot-btn selected' : 'slot-btn'} type="button" key={slot} onClick={() => toggle(day, slot)}><span>{slot}</span><strong>{checked ? 'Available' : 'Set available'}</strong></button>
                })}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default TeacherAvailability
