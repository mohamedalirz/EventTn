import api, { USE_MOCK, mockDelay } from './api'
import { mockDb } from './mockDb'

async function getSponsorableEvents() {
  if (USE_MOCK) {
    await mockDelay()
    const db = mockDb.load()
    return db.events
  }
  const { data } = await api.get('/sponsors/events')
  return data
}

async function sendRequest({ eventId, sponsorId, sponsorName, message, offer }) {
  if (USE_MOCK) {
    await mockDelay(400)
    const db = mockDb.load()
    const event = db.events.find((e) => e.id === eventId)
    const request = {
      id: `spr_${Date.now()}`,
      eventId,
      eventTitle: event?.title,
      organizerId: event?.organizerId,
      sponsorId,
      sponsorName,
      message,
      offer,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
    }
    db.sponsorshipRequests.push(request)
    mockDb.save(db)
    return request
  }
  const { data } = await api.post('/sponsorships', { eventId, message, offer })
  return data
}

async function getMyRequests(sponsorId) {
  if (USE_MOCK) {
    await mockDelay()
    const db = mockDb.load()
    return db.sponsorshipRequests
      .filter((r) => r.sponsorId === sponsorId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  }
  const { data } = await api.get('/sponsorships/my')
  return data
}

async function getOrganizerRequests(organizerId) {
  if (USE_MOCK) {
    await mockDelay()
    const db = mockDb.load()
    return db.sponsorshipRequests
      .filter((r) => r.organizerId === organizerId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  }
  const { data } = await api.get('/organizer/sponsorships')
  return data
}

async function updateRequestStatus(id, status) {
  if (USE_MOCK) {
    await mockDelay(300)
    const db = mockDb.load()
    const idx = db.sponsorshipRequests.findIndex((r) => r.id === id)
    if (idx === -1) throw new Error('Request not found.')
    db.sponsorshipRequests[idx].status = status
    mockDb.save(db)
    return db.sponsorshipRequests[idx]
  }
  const { data } = await api.patch(`/sponsorships/${id}/status`, { status })
  return data
}

export const sponsorshipService = {
  getSponsorableEvents,
  sendRequest,
  getMyRequests,
  getOrganizerRequests,
  updateRequestStatus,
}
