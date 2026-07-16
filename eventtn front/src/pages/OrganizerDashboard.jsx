import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { CalendarCheck, Ticket, Banknote, Plus, ArrowRight } from 'lucide-react'
import { eventService } from '../services/eventService'
import { useAuth } from '../context/AuthContext'
import Loading from '../components/Loading'
import Button from '../components/Button'

function StatCard({ icon: Icon, label, value, accent }) {
  return (
    <div className="rounded-2xl border border-navy-600 bg-navy-800 p-6">
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-lg ${accent}`}
      >
        <Icon size={18} />
      </div>
      <p className="mt-4 font-mono-num text-3xl font-bold text-paper-50">{value}</p>
      <p className="mt-1 text-sm text-paper-500">{label}</p>
    </div>
  )
}

export default function OrganizerDashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState(null)
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    Promise.all([
      eventService.getOrganizerStats(user.id),
      eventService.getOrganizerEvents(user.id),
    ]).then(([s, e]) => {
      if (!active) return
      setStats(s)
      setEvents(e.slice(0, 4))
      setLoading(false)
    })
    return () => {
      active = false
    }
  }, [user.id])

  if (loading) return <Loading full />

  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-display text-3xl font-bold">Organizer dashboard</h1>
          <p className="mt-1 text-paper-300">Welcome back, {user.name.split(' ')[0]}.</p>
        </div>
        <Link to="/organizer/create">
          <Button>
            <Plus size={16} /> Create event
          </Button>
        </Link>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
        <StatCard
          icon={CalendarCheck}
          label="Total events"
          value={stats.totalEvents}
          accent="bg-orange-500/15 text-orange-500"
        />
        <StatCard
          icon={Ticket}
          label="Tickets sold"
          value={stats.ticketsSold}
          accent="bg-gold-400/15 text-gold-400"
        />
        <StatCard
          icon={Banknote}
          label="Revenue"
          value={`${stats.revenue} TND`}
          accent="bg-green-500/15 text-green-400"
        />
      </div>

      <div className="mt-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold">Recent events</h2>
          <Link
            to="/organizer/events"
            className="flex items-center gap-1 text-sm text-paper-300 hover:text-orange-500"
          >
            View all <ArrowRight size={14} />
          </Link>
        </div>

        {events.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-navy-600 py-16 text-center">
            <p className="font-display text-lg font-semibold text-paper-100">
              No events yet
            </p>
            <p className="mt-1 text-sm text-paper-500">Create your first event to get started.</p>
            <Link to="/organizer/create">
              <Button className="mt-5">
                <Plus size={16} /> Create event
              </Button>
            </Link>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-navy-600">
            <table className="w-full text-left text-sm">
              <thead className="bg-navy-800 text-paper-500">
                <tr>
                  <th className="px-5 py-3 font-medium">Event</th>
                  <th className="px-5 py-3 font-medium">Date</th>
                  <th className="px-5 py-3 font-medium">Sold</th>
                  <th className="px-5 py-3 font-medium">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {events.map((e) => (
                  <tr key={e.id} className="border-t border-navy-600">
                    <td className="px-5 py-3 font-medium text-paper-100">{e.title}</td>
                    <td className="px-5 py-3 text-paper-300">
                      {new Date(e.date).toLocaleDateString('en-GB')}
                    </td>
                    <td className="px-5 py-3 font-mono-num text-paper-300">
                      {e.ticketsSold}/{e.totalTickets}
                    </td>
                    <td className="px-5 py-3 font-mono-num text-paper-300">
                      {e.ticketsSold * e.price} TND
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
