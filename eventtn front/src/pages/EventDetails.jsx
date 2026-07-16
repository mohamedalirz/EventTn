import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { CalendarDays, MapPin, Ticket, User, ArrowLeft, Building2 } from 'lucide-react'
import { eventService } from '../services/eventService'
import Button from '../components/Button'
import Loading from '../components/Loading'
import toast from 'react-hot-toast'

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-GB', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function EventDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    setLoading(true)
    eventService
      .getEvent(id)
      .then((data) => active && setEvent(data))
      .catch((err) => active && setError(err.message))
      .finally(() => active && setLoading(false))
    return () => {
      active = false
    }
  }, [id])

  if (loading) return <Loading full />

  if (error || !event) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-20 text-center">
        <p className="font-display text-xl font-semibold">{error || 'Event not found.'}</p>
        <Button className="mt-6" onClick={() => navigate('/events')}>
          Back to events
        </Button>
      </div>
    )
  }

  const remaining = event.totalTickets - event.ticketsSold
  const soldOut = remaining <= 0

  function handleBuy() {
    if (soldOut) {
      toast.error('This event is sold out.')
      return
    }
    navigate(`/checkout/${event.id}`)
  }

  return (
    <div className="mx-auto max-w-5xl px-5 py-10">
      <Link
        to="/events"
        className="mb-6 flex w-fit items-center gap-1.5 text-sm text-paper-500 hover:text-orange-500"
      >
        <ArrowLeft size={15} /> Back to events
      </Link>

      <div className="overflow-hidden rounded-2xl border border-navy-600">
        <img src={event.banner} alt={event.title} className="h-64 w-full object-cover md:h-96" />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-10 md:grid-cols-3">
        <div className="md:col-span-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-orange-500">
            {event.category}
          </span>
          <h1 className="mt-2 font-display text-3xl font-bold md:text-4xl">{event.title}</h1>

          <div className="mt-5 flex flex-wrap gap-x-8 gap-y-3 text-sm text-paper-300">
            <span className="flex items-center gap-2">
              <CalendarDays size={16} className="text-orange-500" /> {formatDate(event.date)}
            </span>
            <span className="flex items-center gap-2">
              <MapPin size={16} className="text-orange-500" /> {event.venue}, {event.city}
            </span>
            <span className="flex items-center gap-2">
              <User size={16} className="text-orange-500" /> {event.organizerName}
            </span>
          </div>

          <div className="mt-8 border-t border-navy-600 pt-6">
            <h2 className="mb-3 font-display text-lg font-semibold">About this event</h2>
            <p className="leading-relaxed text-paper-300">{event.description}</p>
          </div>

          {event.sponsors?.length > 0 && (
            <div className="mt-8 border-t border-navy-600 pt-6">
              <h2 className="mb-4 font-display text-lg font-semibold">Sponsored by</h2>
              <div className="flex flex-wrap gap-3">
                {event.sponsors.map((s) => (
                  <span
                    key={s}
                    className="flex items-center gap-2 rounded-full border border-navy-600 bg-navy-800 px-4 py-2 text-sm text-paper-100"
                  >
                    <Building2 size={14} className="text-orange-500" /> {s}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="md:col-span-1">
          <div className="sticky top-24 rounded-2xl border border-navy-600 bg-navy-800 p-6">
            <div className="flex items-baseline justify-between">
              <span className="text-sm text-paper-500">Ticket price</span>
              <span className="font-mono-num text-2xl font-bold text-paper-50">
                {event.price === 0 ? 'Free' : `${event.price} TND`}
              </span>
            </div>
            <div className="mt-3 flex items-center justify-between text-sm">
              <span className="flex items-center gap-1.5 text-paper-500">
                <Ticket size={14} /> Availability
              </span>
              <span className={soldOut ? 'text-red-400' : 'text-green-400'}>
                {soldOut ? 'Sold out' : `${remaining} of ${event.totalTickets} left`}
              </span>
            </div>

            <Button className="mt-6 w-full" onClick={handleBuy} disabled={soldOut}>
              {soldOut ? 'Sold out' : 'Buy ticket'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
