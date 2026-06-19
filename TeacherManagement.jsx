import { useMemo, useState } from 'react'
import { getName, useNotifications } from './NotificationContext.jsx'

function StudentDashboard() {
  const { timetable, subjects, teachers, rooms, days, slots, notifications } = useNotifications()
  const [subjectQuery, setSubjectQuery] = useState('')
  const [teacherQuery, setTeacherQuery] = useState('')

  const filteredEntries = useMemo(() => {
    return timetable.filter((entry) => {
      const subject = getName(subjects, entry.subjectId, '').toLowerCase()
      const teacher = getName(teachers, entry.teacherId, '').toLowerCase()
      return subject.includes(subjectQuery.toLowerCase()) && teacher.includes(teacherQuery.toLowerCase())
    })
  }, [subjectQuery, teacherQuery, subjects, teachers, timetable])

  return (
    <section className="page">
      <div className="page-header"><div><p className="eyebrow">Learner view</p><h1>Student Dashboard</h1></div></div>
      <div className="filter-row">
        <label>Search subjects<input value={subjectQuery} onChange={(event) => setSubjectQuery(event.target.value)} placeholder="Data Structures" /></label>
        <label>Search teachers<input value={teacherQuery} onChange={(event) => setTeacherQuery(event.target.value)} placeholder="Dr. Asha" /></label>
      </div>
      <div className="panel timetable-week">
        {days.map((day) => (
          <div className="day-column" key={day}>
            <h2>{day}</h2>
            {slots.map((slot) => {
              const entry = filteredEntries.find((item) => item.day === day && item.slot === slot)
              return (
                <div className={entry ? 'class-block' : 'class-block empty'} key={slot}>
                  <span>{slot}</span>
                  {entry ? <><strong>{getName(subjects, entry.subjectId)}</strong><p>{getName(teachers, entry.teacherId)} - {getName(rooms, entry.roomId)}</p></> : <p>No class</p>}
                </div>
              )
            })}
          </div>
        ))}
      </div>
      <div className="panel">
        <div className="panel-heading"><h2>Notifications</h2><span>{notifications.length}</span></div>
        <div className="activity-list">{notifications.slice(0, 5).map((note) => <div className="activity-item" key={note.id}><span className={`dot ${note.type}`}></span><div><strong>{note.title}</strong><p>{note.message}</p></div></div>)}</div>
      </div>
    </section>
  )
}

export default StudentDashboard
