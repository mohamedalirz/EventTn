import api, { USE_MOCK, mockDelay } from './api'
import { mockDb } from './mockDb'

async function getEvents(filters = {}) {
  if (USE_MOCK) {
    await mockDelay()
    const db = mockDb.load()
    let list = [...db.events]
    if (filters.category) list = list.filter((e) => e.category === filters.category)
    if (filters.city) list = list.filter((e) => e.city === filters.city)
    if (filters.date) {
      list = list.filter((e) => e.date.slice(0, 10) === filters.date)
    }
    if (filters.search) {
      const q = filters.search.toLowerCase()
      list = list.filter(
        (e) => e.title.toLowerCase().includes(q) || e.city.toLowerCase().includes(q)
      )
    }
    list.sort((a, b) => new Date(a.date) - new Date(b.date))
    return list
  }
  const { data } = await api.get('/events', { params: filters })
  return data
}

async function getFeaturedEvents() {
  if (USE_MOCK) {
    await mockDelay()
    const db = mockDb.load()
    return db.events.filter((e) => e.featured)
  }
  const { data } = await api.get('/events/featured')
  return data
}

async function getEvent(id) {
  if (USE_MOCK) {
    await mockDelay()
    const db = mockDb.load()
    const event = db.events.find((e) => e.id === id)
    if (!event) throw new Error('Event not found.')
    return event
  }
  const { data } = await api.get(`/events/${id}`)
  return data
}

async function createEvent(payload, organizer) {
  if (USE_MOCK) {
    await mockDelay()
    const db = mockDb.load()
    const event = {
      id: `evt_${Date.now()}`,
      ticketsSold: 0,
      featured: false,
      sponsors: [],
      organizerId: organizer?.id,
      organizerName: organizer?.name,
      createdAt: new Date().toISOString(),
      ...payload,
    }
    db.events.unshift(event)
    mockDb.save(db)
    return event
  }
  const { data } = await api.post('/events', payload)
  return data
}

async function updateEvent(id, payload) {
  if (USE_MOCK) {
    await mockDelay()
    const db = mockDb.load()
    const idx = db.events.findIndex((e) => e.id === id)
    if (idx === -1) throw new Error('Event not found.')
    db.events[idx] = { ...db.events[idx], ...payload }
    mockDb.save(db)
    return db.events[idx]
  }
  const { data } = await api.put(`/events/${id}`, payload)
  return data
}

async function deleteEvent(id) {
  if (USE_MOCK) {
    await mockDelay()
    const db = mockDb.load()
    db.events = db.events.filter((e) => e.id !== id)
    mockDb.save(db)
    return { success: true }
  }
  const { data } = await api.delete(`/events/${id}`)
  return data
}

async function getOrganizerEvents(organizerId) {
  if (USE_MOCK) {
    await mockDelay()
    const db = mockDb.load()
    return db.events.filter((e) => e.organizerId === organizerId)
  }
  const { data } = await api.get('/organizer/events')
  return data
}

async function getOrganizerStats(organizerId) {
  if (USE_MOCK) {
    await mockDelay()
    const db = mockDb.load()
    const events = db.events.filter((e) => e.organizerId === organizerId)
    const ticketsSold = events.reduce((sum, e) => sum + (e.ticketsSold || 0), 0)
    const revenue = events.reduce((sum, e) => sum + (e.ticketsSold || 0) * (e.price || 0), 0)
    return { totalEvents: events.length, ticketsSold, revenue }
  }
  const { data } = await api.get('/organizer/stats')
  return data
}

export const eventService = {
  getEvents,
  getFeaturedEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
  getOrganizerEvents,
  getOrganizerStats,
}
