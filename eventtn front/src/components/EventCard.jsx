import { Link } from 'react-router-dom'
import { CalendarDays, MapPin, Ticket } from 'lucide-react'

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export default function EventCard({ event }) {
  const remaining = event.totalTickets - event.ticketsSold
  const soldOut = remaining <= 0
  const priceLabel = event.price === 0 ? 'Free' : `${event.price} TND`

  return (
    <Link
      to={`/events/${event.id}`}
      className="ticket-stub group flex flex-col transition duration-200 hover:-translate-y-1 hover:border-orange-500/60 hover:shadow-lg hover:shadow-orange-500/5"
    >
      <div className="relative overflow-hidden rounded-t-[16px]">
        <img
          src={event.banner}
          alt={event.title}
          className="h-44 w-full object-cover transition duration-300 group-hover:scale-105"
          loading="lazy"
        />
        <span className="absolute left-3 top-3 rounded-full bg-navy-950/80 px-3 py-1 text-xs font-semibold text-orange-400 backdrop-blur">
          {event.category}
        </span>
        {soldOut && (
          <span className="absolute right-3 top-3 rounded-full bg-red-500/90 px-3 py-1 text-xs font-bold text-white">
            Sold out
          </span>
        )}
      </div>

      <div className="ticket-stub__perforation" />

      <div className="flex flex-1 flex-col gap-3 p-5">
        <h3 className="font-display text-lg font-semibold leading-snug text-paper-50 group-hover:text-orange-400">
          {event.title}
        </h3>

        <div className="flex flex-col gap-1.5 text-sm text-paper-300">
          <span className="flex items-center gap-2">
            <CalendarDays size={15} className="text-orange-500" />
            {formatDate(event.date)}
          </span>
          <span className="flex items-center gap-2">
            <MapPin size={15} className="text-orange-500" />
            {event.venue}, {event.city}
          </span>
        </div>

        <div className="mt-auto flex items-center justify-between border-t border-navy-600 pt-3">
          <span className="font-mono-num text-base font-semibold text-paper-50">{priceLabel}</span>
          <span className="flex items-center gap-1.5 text-xs text-paper-500">
            <Ticket size={13} />
            {soldOut ? 'None left' : `${remaining} left`}
          </span>
        </div>
      </div>
    </Link>
  )
}
