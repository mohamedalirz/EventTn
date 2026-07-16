// Lightweight mock backend so the MVP works end-to-end without a real API.
// Swap USE_MOCK to false and set VITE_API_URL to point at a real backend
// implementing the documented REST endpoints — the service layer (api.js,
// authService.js, etc.) already speaks that contract.

const DB_KEY = 'eventtn_mock_db_v1'

const CATEGORIES = ['Music', 'Tech', 'Business', 'Sports', 'Arts', 'Food & Drink']
const CITIES = ['Tunis', 'Sfax', 'Sousse', 'Djerba', 'Hammamet', 'Bizerte']

const seedEvents = () => {
  const banners = [
    'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80',
    'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80',
    'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
    'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&q=80',
    'https://images.unsplash.com/photo-1531058020387-3be344556be6?w=800&q=80',
    'https://images.unsplash.com/photo-1522158637959-30385a09e0da?w=800&q=80',
    'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800&q=80',
    'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&q=80',
  ]
  const titles = [
    ['Tunis Music Nights', 'Music', 'An open-air night of live sets from Tunisia\'s best rising bands.'],
    ['Carthage Tech Summit', 'Tech', 'A day of talks on AI, startups, and the future of tech in North Africa.'],
    ['Sousse Founders Meetup', 'Business', 'Founders and investors connect over pitches and product demos.'],
    ['Djerba Beach Football Cup', 'Sports', 'A 5-a-side tournament on the sand, open to all skill levels.'],
    ['Sfax Contemporary Art Fair', 'Arts', 'Galleries and independent artists showcase new work across three halls.'],
    ['Hammamet Food & Wine Festival', 'Food & Drink', 'Local chefs and vineyards present tasting menus by the sea.'],
    ['Bizerte Jazz Evening', 'Music', 'An intimate jazz set in the old port, ticketed seating only.'],
    ['Tunis Startup Demo Day', 'Tech', 'Twelve startups demo live in front of a panel of regional investors.'],
  ]
  const now = Date.now()
  return titles.map((t, i) => {
    const total = 80 + i * 15
    const sold = Math.floor(total * (0.2 + (i % 5) * 0.15))
    return {
      id: `evt_${i + 1}`,
      title: t[0],
      category: t[1],
      description: t[2] + ' Doors open one hour before start. Bring a valid ID matching your ticket name.',
      city: CITIES[i % CITIES.length],
      venue: ['Cite de la Culture', 'Parc des Expositions', 'Medina Hall', 'Marina Amphitheatre'][i % 4],
      date: new Date(now + (i + 2) * 5 * 24 * 60 * 60 * 1000).toISOString(),
      price: [25, 60, 0, 15, 20, 45, 35, 0][i],
      totalTickets: total,
      ticketsSold: sold,
      banner: banners[i % banners.length],
      organizerId: 'org_1',
      organizerName: 'EventTN Productions',
      featured: i < 3,
      sponsors: i % 2 === 0 ? ['Orange Tunisie', 'Tunisair'] : ['Delice Holding'],
      createdAt: new Date(now - i * 86400000).toISOString(),
    }
  })
}

function load() {
  const raw = localStorage.getItem(DB_KEY)
  if (raw) return JSON.parse(raw)
  const seeded = {
    users: [],
    events: seedEvents(),
    tickets: [],
    sponsorshipRequests: [],
  }
  localStorage.setItem(DB_KEY, JSON.stringify(seeded))
  return seeded
}

function save(db) {
  localStorage.setItem(DB_KEY, JSON.stringify(db))
}

export const mockDb = { load, save, CATEGORIES, CITIES }
