import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Ticket as TicketIcon } from 'lucide-react'
import { ticketService } from '../services/ticketService'
import { useAuth } from '../context/AuthContext'
import TicketCard from '../components/TicketCard'
import Loading from '../components/Loading'
import Button from '../components/Button'

export default function MyTickets() {
  const { user } = useAuth()
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    ticketService.getMyTickets(user.id).then((data) => {
      if (active) {
        setTickets(data)
        setLoading(false)
      }
    })
    return () => {
      active = false
    }
  }, [user.id])

  return (
    <div className="mx-auto max-w-4xl px-5 py-10">
      <h1 className="font-display text-3xl font-bold">My tickets</h1>
      <p className="mt-1 text-paper-300">Everything you've booked, ready to scan at the door.</p>

      {loading ? (
        <Loading />
      ) : tickets.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-navy-600 py-20 text-center">
          <TicketIcon size={32} className="mx-auto text-paper-500" />
          <p className="mt-4 font-display text-lg font-semibold text-paper-100">
            No tickets yet
          </p>
          <p className="mt-1 text-sm text-paper-500">
            Browse events and grab your first ticket.
          </p>
          <Link to="/events">
            <Button className="mt-5">Browse events</Button>
          </Link>
        </div>
      ) : (
        <div className="mt-8 flex flex-col gap-6">
          {tickets.map((ticket) => (
            <TicketCard key={ticket.id} ticket={ticket} />
          ))}
        </div>
      )}
    </div>
  )
}
