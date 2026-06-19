import { useNotifications } from './NotificationContext.jsx'

function ProfilePage({ currentUser }) {
  const { rooms, teachers, subjects, timetable, notifications } = useNotifications()

  return (
    <section className="page">
      <div className="page-header">
        <div>
          <p className="eyebrow">Account</p>
          <h1>Profile</h1>
        </div>
        <div className="status-pill">{currentUser?.role || 'User'}</div>
      </div>

      <div className="profile-grid">
        <div className="panel profile-card">
          <div className="profile-avatar">{currentUser?.name?.slice(0, 2).toUpperCase() || 'US'}</div>
          <div>
            <h2>{currentUser?.name || 'Signed in user'}</h2>
            <p>{currentUser?.email || 'No email saved'}</p>
          </div>
        </div>

        <div className="panel">
          <div className="panel-heading">
            <h2>Workspace Summary</h2>
            <span>Live data</span>
          </div>
          <div className="profile-summary">
            <div><strong>{rooms.length}</strong><span>Rooms</span></div>
            <div><strong>{teachers.length}</strong><span>Teachers</span></div>
            <div><strong>{subjects.length}</strong><span>Subjects</span></div>
            <div><strong>{timetable.length}</strong><span>Classes</span></div>
          </div>
        </div>
      </div>

      <div className="panel">
        <div className="panel-heading">
          <h2>Recent Account Activity</h2>
          <span>{notifications.length} alerts</span>
        </div>
        <div className="activity-list">
          {notifications.slice(0, 5).map((notification) => (
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

export default ProfilePage
