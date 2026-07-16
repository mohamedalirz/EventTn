import { QRCodeSVG } from 'qrcode.react'
import { CalendarDays, MapPin, CheckCircle2 } from 'lucide-react'

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-GB', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export default function TicketCard({ ticket }) {
  return (
    <div className="ticket-stub flex flex-col overflow-hidden md:flex-row">
      <div className="relative md:w-2/5">
        <img
          src={ticket.banner}
          alt={ticket.eventTitle}
          className="h-40 w-full object-cover md:h-full"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-transparent to-transparent md:bg-gradient-to-r" />
      </div>

      <div className="hidden w-px shrink-0 md:block">
        <div className="mx-auto h-full border-l-2 border-dashed border-navy-600" />
      </div>
      <div className="ticket-stub__perforation md:hidden" />

      <div className="flex flex-1 flex-col justify-between gap-4 p-5">
        <div>
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-display text-lg font-semibold text-paper-50">
              {ticket.eventTitle}
            </h3>
            <span className="flex items-center gap-1 rounded-full bg-green-500/15 px-2.5 py-1 text-xs font-semibold text-green-400">
              <CheckCircle2 size={13} />
              {ticket.status}
            </span>
          </div>
          <div className="mt-2 flex flex-col gap-1.5 text-sm text-paper-300">
            <span className="flex items-center gap-2">
              <CalendarDays size={14} className="text-orange-500" />
              {formatDate(ticket.eventDate)}
            </span>
            <span className="flex items-center gap-2">
              <MapPin size={14} className="text-orange-500" />
              {ticket.eventVenue}, {ticket.eventCity}
            </span>
          </div>
          <p className="mt-2 font-mono-num text-xs text-paper-500">
            Ticket #{ticket.code} &middot; Qty {ticket.quantity} &middot; {ticket.total} TND
          </p>
        </div>

        <div className="flex items-center gap-4 border-t border-navy-600 pt-4">
          <div className="rounded-lg bg-white p-2">
            <QRCodeSVG value={ticket.code} size={64} bgColor="#ffffff" fgColor="#0B1220" />
          </div>
          <div className="text-xs text-paper-500">
            <p className="text-paper-300">Scan this code at the entrance.</p>
            <p>Held by {ticket.fullName}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
