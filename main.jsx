import ConflictTable from './ConflictTable.jsx'
import NotificationCenter from './NotificationCenter.jsx'
import { useNotifications } from './NotificationContext.jsx'

function Dashboard() {
  const { rooms, teachers, subjects, timetable, conflicts, notifications } = useNotifications()

  const stats = [
    { label: 'Total Rooms', value: rooms.length, tone: 'blue' },
    { label: 'Teachers', value: teachers.length, tone: 'green' },
    { label: 'Subjects', value: subjects.length, tone: 'violet' },
    { label: 'Timetable Status', value: conflicts.length ? 'Review' : 'Stable', tone: conflicts.length ? 'orange' : 'green' },
  ]

  return (
    <section className="page">
      <div className="page-header">
        <div>
          <p className="eyebrow">Academic planning</p>
          <h1>Dashboard</h1>
        </div>
        <div className="status-pill">{timetable.length} scheduled classes</div>
      </div>

      <div className="stats-grid">
        {stats.map((stat) => (
          <article className={`stat-card ${stat.tone}`} key={stat.label}>
            <span>{stat.label}</span>
            <strong>{stat.value}</strong>
          </article>
        ))}
      </div>

      <div className="dashboard-grid">
        <div className="panel">
          <div className="panel-heading">
            <h2>Conflict Detection</h2>
            <span>{conflicts.length} open</span>
          </div>
          <ConflictTable conflicts={conflicts} />
        </div>
        <NotificationCenter limit={5} />
      </div>

      <div className="panel">
        <div className="panel-heading">
          <h2>Recent Notifications</h2>
          <span>{notifications.length} total</span>
        </div>
        <div className="activity-list">
          {notifications.slice(0, 4).map((notification) => (
            <div className="activity-item" key={notification.id}>
              <span className={`dot ${notification.type}`}></span>
              <div>
                <strong>{notification.title}</strong>
                <p>{notification.message}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Dashboard
