import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useNotifications } from './NotificationContext.jsx'

const adminLinks = [
  { to: '/dashboard', icon: 'DB', label: 'Dashboard' },
  { to: '/rooms', icon: 'RM', label: 'Rooms' },
  { to: '/teachers', icon: 'TR', label: 'Teachers' },
  { to: '/subjects', icon: 'SB', label: 'Subjects' },
  { to: '/availability', icon: 'AV', label: 'Availability' },
  { to: '/builder', icon: 'TB', label: 'Timetable Builder' },
  { to: '/student', icon: 'ST', label: 'Student Dashboard' },
  { to: '/reports', icon: 'RP', label: 'Reports' },
  { to: '/profile', icon: 'PR', label: 'Profile' },
  { to: '/notifications', icon: 'NT', label: 'Notifications' },
]

const teacherLinks = [
  { to: '/dashboard', icon: 'DB', label: 'Dashboard' },
  { to: '/availability', icon: 'AV', label: 'Teacher Availability' },
  { to: '/student', icon: 'ST', label: 'Weekly Timetable' },
  { to: '/profile', icon: 'PR', label: 'Profile' },
  { to: '/notifications', icon: 'NT', label: 'Notifications' },
]

const studentLinks = [
  { to: '/student', icon: 'ST', label: 'My Timetable' },
  { to: '/profile', icon: 'PR', label: 'Profile' },
  { to: '/notifications', icon: 'NT', label: 'Notifications' },
]

function getLinks(role) {
  if (role === 'Teacher') return teacherLinks
  if (role === 'Student') return studentLinks
  return adminLinks
}

function Sidebar({ onLogout, currentUser }) {
  const [open, setOpen] = useState(false)
  const { notifications, conflicts } = useNotifications()
  const unread = notifications.filter((notification) => !notification.read).length
  const links = getLinks(currentUser?.role)

  return (
    <>
      <button className="mobile-menu" type="button" onClick={() => setOpen((current) => !current)}>
        Menu
      </button>
      <aside className={`sidebar ${open ? 'is-open' : ''}`}>
        <div className="brand">
          <div className="brand-mark">{currentUser?.name?.slice(0, 2).toUpperCase() || 'TS'}</div>
          <div>
            <strong>{currentUser?.name || 'TimeSync'}</strong>
            <span>{currentUser?.role || 'Admin'} Console</span>
          </div>
        </div>
        <nav className="nav-list" aria-label="Main navigation">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} onClick={() => setOpen(false)} className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
              <span className="nav-icon">{link.icon}</span>
              <span>{link.label}</span>
              {link.to === '/notifications' && unread > 0 ? <small>{unread}</small> : null}
              {link.to === '/builder' && conflicts.length > 0 ? <small>{conflicts.length}</small> : null}
            </NavLink>
          ))}
        </nav>
        <button className="logout-btn" type="button" onClick={onLogout}>
          Logout
        </button>
      </aside>
    </>
  )
}

export default Sidebar
