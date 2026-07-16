import api, { USE_MOCK, mockDelay } from './api'
import { mockDb } from './mockDb'

function generateTicketCode() {
  return `TN-${Date.now().toString(36).toUpperCase()}-${Math.random()
    .toString(36)
    .slice(2, 6)
    .toUpperCase()}`
}

async function buyTicket({ eventId, fullName, email, phone, quantity, userId }) {
  if (USE_MOCK) {
    await mockDelay(500)
    const db = mockDb.load()
    const event = db.events.find((e) => e.id === eventId)
    if (!event) throw new Error('Event not found.')
    const remaining = event.totalTickets - event.ticketsSold
    if (quantity > remaining) throw new Error(`Only ${remaining} tickets remaining.`)

    const ticket = {
      id: `tkt_${Date.now()}`,
      code: generateTicketCode(),
      eventId,
      eventTitle: event.title,
      eventDate: event.date,
      eventCity: event.city,
      eventVenue: event.venue,
      banner: event.banner,
      fullName,
      email,
      phone,
      quantity,
      unitPrice: event.price,
      total: event.price * quantity,
      status: 'CONFIRMED',
      userId,
      purchasedAt: new Date().toISOString(),
    }
    event.ticketsSold += quantity
    db.tickets.push(ticket)
    mockDb.save(db)
    return ticket
  }
  const { data } = await api.post('/tickets', { eventId, fullName, email, phone, quantity })
  return data
}

async function getMyTickets(userId) {
  if (USE_MOCK) {
    await mockDelay()
    const db = mockDb.load()
    return db.tickets
      .filter((t) => t.userId === userId)
      .sort((a, b) => new Date(b.purchasedAt) - new Date(a.purchasedAt))
  }
  const { data } = await api.get('/tickets/my')
  return data
}

async function getTicket(id) {
  if (USE_MOCK) {
    await mockDelay()
    const db = mockDb.load()
    const ticket = db.tickets.find((t) => t.id === id)
    if (!ticket) throw new Error('Ticket not found.')
    return ticket
  }
  const { data } = await api.get(`/tickets/${id}`)
  return data
}

export const ticketService = { buyTicket, getMyTickets, getTicket }
