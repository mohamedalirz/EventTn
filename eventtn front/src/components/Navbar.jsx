import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Ticket, Menu, X, LogOut, LayoutDashboard, User } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const navLinkClass = ({ isActive }) =>
  `text-sm font-medium transition-colors ${
    isActive ? 'text-orange-500' : 'text-paper-300 hover:text-paper-50'
  }`

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  function handleLogout() {
    logout()
    setOpen(false)
    navigate('/')
  }

  const dashboardPath =
    user?.role === 'ORGANIZER'
      ? '/organizer'
      : user?.role === 'SPONSOR'
      ? '/sponsor'
      : '/my-tickets'

  return (
    <header className="sticky top-0 z-50 border-b border-navy-600 bg-navy-950/85 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
        <Link to="/" className="flex items-center gap-2 font-display text-lg font-bold">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-500 text-navy-950">
            <Ticket size={20} strokeWidth={2.5} />
          </span>
          Event<span className="text-orange-500">TN</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <NavLink to="/" end className={navLinkClass}>
            Home
          </NavLink>
          <NavLink to="/events" className={navLinkClass}>
            Events
          </NavLink>
          {user && (
            <NavLink to={dashboardPath} className={navLinkClass}>
              {user.role === 'ORGANIZER' ? 'Dashboard' : user.role === 'SPONSOR' ? 'Sponsor Hub' : 'My Tickets'}
            </NavLink>
          )}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <>
              <span className="flex items-center gap-2 rounded-full bg-navy-800 px-3 py-1.5 text-sm text-paper-300">
                <User size={14} />
                {user.name.split(' ')[0]}
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 rounded-full border border-navy-600 px-4 py-1.5 text-sm font-medium text-paper-100 transition hover:border-orange-500 hover:text-orange-500"
              >
                <LogOut size={14} /> Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm font-medium text-paper-300 hover:text-paper-50"
              >
                Log in
              </Link>
              <Link
                to="/register"
                className="rounded-full bg-orange-500 px-4 py-2 text-sm font-semibold text-navy-950 transition hover:bg-orange-400"
              >
                Sign up
              </Link>
            </>
          )}
        </div>

        <button
          className="text-paper-50 md:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-navy-600 bg-navy-900 px-5 py-4 md:hidden">
          <div className="flex flex-col gap-4">
            <NavLink to="/" end onClick={() => setOpen(false)} className={navLinkClass}>
              Home
            </NavLink>
            <NavLink to="/events" onClick={() => setOpen(false)} className={navLinkClass}>
              Events
            </NavLink>
            {user ? (
              <>
                <NavLink to={dashboardPath} onClick={() => setOpen(false)} className={navLinkClass}>
                  <span className="flex items-center gap-2">
                    <LayoutDashboard size={16} />
                    {user.role === 'ORGANIZER' ? 'Dashboard' : user.role === 'SPONSOR' ? 'Sponsor Hub' : 'My Tickets'}
                  </span>
                </NavLink>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-left text-sm font-medium text-paper-300"
                >
                  <LogOut size={16} /> Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setOpen(false)} className="text-sm font-medium text-paper-300">
                  Log in
                </Link>
                <Link
                  to="/register"
                  onClick={() => setOpen(false)}
                  className="w-fit rounded-full bg-orange-500 px-4 py-2 text-sm font-semibold text-navy-950"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
