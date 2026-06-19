/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useMemo, useState } from 'react'

const NotificationContext = createContext(null)

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
const slots = ['09:00-10:00', '10:00-11:00', '11:15-12:15', '13:00-14:00', '14:15-15:15']

const seedData = {
  rooms: [
    { id: 'room-1', name: 'A-101', capacity: 60, type: 'Lecture Hall' },
    { id: 'room-2', name: 'Lab-204', capacity: 32, type: 'Computer Lab' },
    { id: 'room-3', name: 'Seminar-3', capacity: 24, type: 'Seminar Room' },
  ],
  teachers: [
    { id: 'teacher-1', name: 'Dr. Asha Mehta', department: 'Computer Science', email: 'asha.mehta@campus.edu' },
    { id: 'teacher-2', name: 'Prof. Raj Iyer', department: 'Mathematics', email: 'raj.iyer@campus.edu' },
    { id: 'teacher-3', name: 'Ms. Nisha Rao', department: 'Electronics', email: 'nisha.rao@campus.edu' },
  ],
  subjects: [
    { id: 'subject-1', name: 'Data Structures', code: 'CS201', credits: 4, department: 'Computer Science' },
    { id: 'subject-2', name: 'Discrete Mathematics', code: 'MA203', credits: 3, department: 'Mathematics' },
    { id: 'subject-3', name: 'Digital Circuits', code: 'EC205', credits: 4, department: 'Electronics' },
  ],
  availability: {
    'teacher-1': [{ day: 'Monday', slot: '09:00-10:00' }, { day: 'Wednesday', slot: '10:00-11:00' }],
    'teacher-2': [{ day: 'Tuesday', slot: '11:15-12:15' }],
    'teacher-3': [{ day: 'Thursday', slot: '13:00-14:00' }],
  },
  timetable: [
    { id: 'entry-1', day: 'Monday', slot: '09:00-10:00', roomId: 'room-1', teacherId: 'teacher-1', subjectId: 'subject-1', section: 'CSE-A' },
    { id: 'entry-2', day: 'Tuesday', slot: '11:15-12:15', roomId: 'room-2', teacherId: 'teacher-2', subjectId: 'subject-2', section: 'CSE-A' },
  ],
  notifications: [
    { id: 'note-1', type: 'info', title: 'Timetable ready', message: 'Base weekly timetable has been loaded.', date: '2026-06-17', read: false },
    { id: 'note-2', type: 'warning', title: 'Review availability', message: 'Some teachers need updated preferred slots.', date: '2026-06-17', read: false },
  ],
  users: [],
}

function createId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`
}

function loadInitialData() {
  try {
    const stored = localStorage.getItem('timetable-management-data')
    return stored ? JSON.parse(stored) : seedData
  } catch {
    return seedData
  }
}

function isSameSchedule(a, b) {
  return a.day === b.day && a.slot === b.slot
}

function withNotification(nextData, type, title, message) {
  const notification = {
    id: createId('note'),
    type,
    title,
    message,
    date: new Date().toISOString().slice(0, 10),
    read: false,
  }

  return { ...nextData, notifications: [notification, ...nextData.notifications] }
}

export function getName(collection, id, fallback = 'Not selected') {
  return collection.find((item) => item.id === id)?.name || fallback
}

export function detectTimetableConflicts(timetable, availability = {}, rooms = [], teachers = [], subjects = []) {
  const conflicts = []

  timetable.forEach((entry, index) => {
    const teacherSlots = availability[entry.teacherId] || []
    const teacherName = getName(teachers, entry.teacherId, 'Teacher')
    const roomName = getName(rooms, entry.roomId, 'Room')
    const subjectName = getName(subjects, entry.subjectId, 'Subject')

    if (entry.teacherId && !teacherSlots.some((slot) => isSameSchedule(slot, entry))) {
      conflicts.push({
        id: `availability-${entry.id}`,
        type: 'Teacher unavailable',
        day: entry.day,
        slot: entry.slot,
        details: `${teacherName} is not marked available for ${entry.day} at ${entry.slot}.`,
      })
    }

    timetable.slice(index + 1).forEach((other) => {
      if (!isSameSchedule(entry, other)) return

      if (entry.roomId && entry.roomId === other.roomId) {
        conflicts.push({
          id: `room-${entry.id}-${other.id}`,
          type: 'Room clash',
          day: entry.day,
          slot: entry.slot,
          details: `${roomName} is assigned to multiple classes at the same time.`,
        })
      }

      if (entry.teacherId && entry.teacherId === other.teacherId) {
        conflicts.push({
          id: `teacher-${entry.id}-${other.id}`,
          type: 'Teacher clash',
          day: entry.day,
          slot: entry.slot,
          details: `${teacherName} is assigned to multiple rooms at the same time.`,
        })
      }

      if (entry.section && entry.section === other.section) {
        conflicts.push({
          id: `section-${entry.id}-${other.id}`,
          type: 'Section clash',
          day: entry.day,
          slot: entry.slot,
          details: `${entry.section} has overlapping classes including ${subjectName}.`,
        })
      }
    })
  })

  return conflicts
}

export function NotificationProvider({ children }) {
  const [data, setData] = useState(loadInitialData)

  function persist(nextData) {
    setData(nextData)
    localStorage.setItem('timetable-management-data', JSON.stringify(nextData))
  }

  function updateData(key, value) {
    persist({ ...data, [key]: value })
  }

  function addNotification(type, title, message) {
    persist(withNotification(data, type, title, message))
  }

  function markNotificationRead(id) {
    updateData(
      'notifications',
      data.notifications.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification,
      ),
    )
  }

  function clearNotifications() {
    updateData('notifications', [])
  }

  function upsertItem(key, item, prefix) {
    const exists = Boolean(item.id)
    const nextItem = exists ? item : { ...item, id: createId(prefix) }
    const nextList = exists
      ? data[key].map((current) => (current.id === item.id ? nextItem : current))
      : [nextItem, ...data[key]]
    persist(withNotification({ ...data, [key]: nextList }, 'success', `${exists ? 'Updated' : 'Added'} ${prefix}`, `${nextItem.name || nextItem.code} has been saved.`))
  }

  function deleteItem(key, id, label) {
    persist(withNotification({
      ...data,
      [key]: data[key].filter((item) => item.id !== id),
    }, 'warning', `${label} deleted`, `The selected ${label.toLowerCase()} was removed.`))
  }

  function saveAvailability(teacherId, selectedSlots) {
    persist(withNotification(
      { ...data, availability: { ...data.availability, [teacherId]: selectedSlots } },
      'info',
      'Availability updated',
      'Teacher availability slots were saved.',
    ))
  }

  function saveTimetableEntry(entry) {
    const exists = Boolean(entry.id)
    const nextEntry = exists ? entry : { ...entry, id: createId('entry') }
    const nextTimetable = exists
      ? data.timetable.map((item) => (item.id === entry.id ? nextEntry : item))
      : [nextEntry, ...data.timetable]
    const conflicts = detectTimetableConflicts(nextTimetable, data.availability, data.rooms, data.teachers, data.subjects)
    const entryConflicts = conflicts.filter((conflict) => conflict.id.includes(nextEntry.id))

    if (entryConflicts.length) {
      persist(withNotification(
        data,
        'warning',
        'Class not saved',
        `${entryConflicts.length} conflict${entryConflicts.length > 1 ? 's' : ''} must be fixed first.`,
      ))
      return entryConflicts
    }

    persist(withNotification(
      { ...data, timetable: nextTimetable },
      conflicts.length ? 'info' : 'success',
      conflicts.length ? 'Class saved with existing warnings' : 'Timetable updated',
      conflicts.length ? 'The new class is valid, but older timetable conflicts still need review.' : 'The class was added successfully.',
    ))
    return []
  }

  function deleteTimetableEntry(id) {
    persist(withNotification({
      ...data,
      timetable: data.timetable.filter((entry) => entry.id !== id),
    }, 'info', 'Class removed', 'A timetable entry was deleted.'))
  }

  function registerUser(user) {
    persist(withNotification(
      { ...data, users: [{ ...user, id: createId('user') }, ...data.users] },
      'success',
      'Registration saved',
      `${user.name} can now access the system.`,
    ))
  }

  const conflicts = useMemo(
    () => detectTimetableConflicts(data.timetable, data.availability, data.rooms, data.teachers, data.subjects),
    [data],
  )

  const value = {
    ...data,
    days,
    slots,
    conflicts,
    addNotification,
    markNotificationRead,
    clearNotifications,
    upsertItem,
    deleteItem,
    saveAvailability,
    saveTimetableEntry,
    deleteTimetableEntry,
    registerUser,
  }

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>
}

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotifications must be used inside NotificationProvider')
  }
  return context
}
