import { useNotifications } from './NotificationContext.jsx'

function NotificationCenter({ limit, fullPage = false }) {
  const { notifications, markNotificationRead, clearNotifications } = useNotifications()
  const visible = limit ? notifications.slice(0, limit) : notifications

  return (
    <section className={fullPage ? 'page' : 'panel notification-panel'}>
      <div className="panel-heading page-header-small">
        <div>
          {fullPage ? <p className="eyebrow">System messages</p> : null}
          <h2>{fullPage ? 'Notifications' : 'Notification Center'}</h2>
        </div>
        <button type="button" onClick={clearNotifications}>Clear all</button>
      </div>
      <div className="notification-list">
        {visible.length === 0 ? <p className="muted">No notifications yet.</p> : null}
        {visible.map((notification) => (
          <article className={`notification-card ${notification.read ? 'read' : ''}`} key={notification.id}>
            <span className={`dot ${notification.type}`}></span>
            <div>
              <strong>{notification.title}</strong>
              <p>{notification.message}</p>
              <small>{notification.date}</small>
            </div>
            {!notification.read ? <button type="button" onClick={() => markNotificationRead(notification.id)}>Mark read</button> : null}
          </article>
        ))}
      </div>
    </section>
  )
}

export default NotificationCenter
