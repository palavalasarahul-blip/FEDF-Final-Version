import { getName, useNotifications } from './NotificationContext.jsx'

function Reports() {
  const { rooms, teachers, subjects, timetable, conflicts } = useNotifications()
  const roomUsage = rooms.map((room) => ({
    ...room,
    count: timetable.filter((entry) => entry.roomId === room.id).length,
  }))

  function exportCsv() {
    const rows = [
      ['Day', 'Slot', 'Subject', 'Teacher', 'Room', 'Section'],
      ...timetable.map((entry) => [
        entry.day,
        entry.slot,
        getName(subjects, entry.subjectId),
        getName(teachers, entry.teacherId),
        getName(rooms, entry.roomId),
        entry.section,
      ]),
    ]
    const csv = rows.map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'timetable-report.csv'
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <section className="page">
      <div className="page-header"><div><p className="eyebrow">Analytics</p><h1>Reports</h1></div><button className="primary-btn" type="button" onClick={exportCsv}>Export CSV</button></div>
      <div className="stats-grid">
        <article className="stat-card blue"><span>Total classes</span><strong>{timetable.length}</strong></article>
        <article className="stat-card green"><span>Rooms used</span><strong>{roomUsage.filter((room) => room.count > 0).length}</strong></article>
        <article className="stat-card violet"><span>Subjects covered</span><strong>{subjects.length}</strong></article>
        <article className="stat-card orange"><span>Conflicts</span><strong>{conflicts.length}</strong></article>
      </div>
      <div className="report-grid">
        <div className="panel table-wrap">
          <div className="panel-heading"><h2>Timetable Summary</h2><span>{timetable.length} rows</span></div>
          <table><thead><tr><th>Subject</th><th>Teacher</th><th>Room</th><th>When</th></tr></thead><tbody>{timetable.map((entry) => <tr key={entry.id}><td>{getName(subjects, entry.subjectId)}</td><td>{getName(teachers, entry.teacherId)}</td><td>{getName(rooms, entry.roomId)}</td><td>{entry.day}, {entry.slot}</td></tr>)}</tbody></table>
        </div>
        <div className="panel table-wrap">
          <div className="panel-heading"><h2>Room Utilization</h2><span>{rooms.length} rooms</span></div>
          <table><thead><tr><th>Room</th><th>Type</th><th>Capacity</th><th>Classes</th></tr></thead><tbody>{roomUsage.map((room) => <tr key={room.id}><td>{room.name}</td><td>{room.type}</td><td>{room.capacity}</td><td>{room.count}</td></tr>)}</tbody></table>
        </div>
      </div>
    </section>
  )
}

export default Reports
