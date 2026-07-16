import { Link } from 'react-router-dom'
import { Ticket, Mail, MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="border-t border-navy-600 bg-navy-900">
      <div className="mx-auto max-w-7xl px-5 py-12">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          <div>
            <Link to="/" className="flex items-center gap-2 font-display text-lg font-bold">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-500 text-navy-950">
                <Ticket size={20} strokeWidth={2.5} />
              </span>
              Event<span className="text-orange-500">TN</span>
            </Link>
            <p className="mt-3 max-w-xs text-sm text-paper-500">
              Discover events across Tunisia, buy tickets in minutes, and manage everything
              from one place.
            </p>
          </div>

          <div>
            <h4 className="font-display text-sm font-semibold uppercase tracking-wide text-paper-300">
              Explore
            </h4>
            <ul className="mt-4 space-y-2 text-sm text-paper-500">
              <li><Link to="/events" className="hover:text-orange-500">All events</Link></li>
              <li><Link to="/register" className="hover:text-orange-500">Become an organizer</Link></li>
              <li><Link to="/register" className="hover:text-orange-500">Become a sponsor</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-sm font-semibold uppercase tracking-wide text-paper-300">
              Account
            </h4>
            <ul className="mt-4 space-y-2 text-sm text-paper-500">
              <li><Link to="/login" className="hover:text-orange-500">Log in</Link></li>
              <li><Link to="/register" className="hover:text-orange-500">Create account</Link></li>
              <li><Link to="/my-tickets" className="hover:text-orange-500">My tickets</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-sm font-semibold uppercase tracking-wide text-paper-300">
              Contact
            </h4>
            <ul className="mt-4 space-y-2 text-sm text-paper-500">
              <li className="flex items-center gap-2"><Mail size={14} /> hello@eventtn.tn</li>
              <li className="flex items-center gap-2"><MapPin size={14} /> Tunis, Tunisia</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-navy-600 pt-6 text-xs text-paper-500 md:flex-row">
          <p>&copy; {new Date().getFullYear()} EventTN. All rights reserved.</p>
          <p>Made for organizers, sponsors, and event-goers across Tunisia.</p>
        </div>
      </div>
    </footer>
  )
}
