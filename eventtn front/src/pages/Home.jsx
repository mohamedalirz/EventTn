import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, ArrowRight, Sparkles } from 'lucide-react'
import { eventService } from '../services/eventService'
import EventCard from '../components/EventCard'
import Button from '../components/Button'
import Loading from '../components/Loading'
import InstallButton from '../components/InstallButton'

const SPONSORS = ['Orange Tunisie', 'Tunisair', 'Delice Holding', 'Ooredoo', 'Attijari Bank', 'Poulina Group']

export default function Home() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [featured, setFeatured] = useState([])
  const [latest, setLatest] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    async function load() {
      setLoading(true)
      const [featuredEvents, allEvents] = await Promise.all([
        eventService.getFeaturedEvents(),
        eventService.getEvents(),
      ])
      if (!active) return
      setFeatured(featuredEvents)
      setLatest(allEvents.slice(0, 4))
      setLoading(false)
    }
    load()
    return () => {
      active = false
    }
  }, [])

  function handleSearch(e) {
    e.preventDefault()
    navigate(query ? `/events?search=${encodeURIComponent(query)}` : '/events')
  }

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-navy-600">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-8 px-5 py-20 text-center md:py-28">
          <span className="animate-fade-up flex items-center gap-2 rounded-full border border-navy-600 bg-navy-800 px-4 py-1.5 text-xs font-medium text-orange-400">
            <Sparkles size={14} /> Tunisia's events, all in one place
          </span>
          <h1
            className="animate-fade-up max-w-3xl font-display text-4xl font-bold leading-tight md:text-6xl"
            style={{ animationDelay: '80ms' }}
          >
            Find your next event.
            <br />
            <span className="text-orange-500">Buy the ticket in seconds.</span>
          </h1>
          <p
            className="animate-fade-up max-w-xl text-paper-300 md:text-lg"
            style={{ animationDelay: '160ms' }}
          >
            Concerts, conferences, festivals and meetups across Tunis, Sfax, Sousse and beyond —
            discover what's on and walk in with a QR ticket on your phone.
          </p>

          <form
            onSubmit={handleSearch}
            className="animate-fade-up flex w-full max-w-xl items-center gap-2 rounded-full border border-navy-600 bg-navy-800 p-2 shadow-lg"
            style={{ animationDelay: '240ms' }}
          >
            <Search size={18} className="ml-3 shrink-0 text-paper-500" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search events, cities, venues..."
              className="w-full bg-transparent text-sm text-paper-50 outline-none placeholder:text-paper-500"
            />
            <Button type="submit" className="shrink-0">
              Search
            </Button>
          </form>
          <div
  className="animate-fade-up mt-6 flex flex-col items-center gap-4 sm:flex-row"
  style={{ animationDelay: '320ms' }}
>
  <Button onClick={() => navigate('/events')} size="lg">
    Browse Events
    <ArrowRight size={18} />
  </Button>

  <InstallButton />
</div>
        </div>
      </section>

      {loading ? (
        <Loading full />
      ) : (
        <>
          {/* Featured */}
          {featured.length > 0 && (
            <section className="mx-auto max-w-7xl px-5 py-16">
              <div className="mb-8 flex items-end justify-between">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wide text-orange-500">
                    Handpicked
                  </span>
                  <h2 className="font-display text-2xl font-bold md:text-3xl">Featured events</h2>
                </div>
                <Button variant="ghost" onClick={() => navigate('/events')}>
                  View all <ArrowRight size={15} />
                </Button>
              </div>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {featured.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            </section>
          )}

          {/* Latest */}
          <section className="mx-auto max-w-7xl px-5 py-16">
            <div className="mb-8 flex items-end justify-between">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wide text-orange-500">
                  Just announced
                </span>
                <h2 className="font-display text-2xl font-bold md:text-3xl">Latest events</h2>
              </div>
              <Button variant="ghost" onClick={() => navigate('/events')}>
                View all <ArrowRight size={15} />
              </Button>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {latest.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </section>

          {/* Sponsors */}
          <section className="border-t border-navy-600 bg-navy-900">
            <div className="mx-auto max-w-7xl px-5 py-14">
              <p className="mb-8 text-center text-xs font-semibold uppercase tracking-wide text-paper-500">
                Trusted by sponsors across Tunisia
              </p>
              <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
                {SPONSORS.map((name) => (
                  <span
                    key={name}
                    className="font-display text-lg font-semibold text-paper-500 opacity-70 transition hover:text-orange-400 hover:opacity-100"
                  >
                    {name}
                  </span>
                ))}
              </div>
            </div>
          </section>
        </>
      )}
     
    </div>
  )
}
