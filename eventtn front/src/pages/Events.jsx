import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SlidersHorizontal, X, Search } from 'lucide-react'
import { eventService } from '../services/eventService'
import { mockDb } from '../services/mockDb'
import EventCard from '../components/EventCard'
import Select from '../components/Select'
import Input from '../components/Input'
import Button from '../components/Button'
import Loading from '../components/Loading'

export default function Events() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)

  const category = searchParams.get('category') || ''
  const city = searchParams.get('city') || ''
  const date = searchParams.get('date') || ''
  const search = searchParams.get('search') || ''

  useEffect(() => {
    let active = true
    async function load() {
      setLoading(true)
      const data = await eventService.getEvents({ category, city, date, search })
      if (active) {
        setEvents(data)
        setLoading(false)
      }
    }
    load()
    return () => {
      active = false
    }
  }, [category, city, date, search])

  function updateFilter(key, value) {
    const next = new URLSearchParams(searchParams)
    if (value) next.set(key, value)
    else next.delete(key)
    setSearchParams(next)
  }

  function clearFilters() {
    setSearchParams({})
  }

  const hasFilters = category || city || date || search

  return (
    <div className="mx-auto max-w-7xl px-5 py-12">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold md:text-4xl">All events</h1>
        <p className="mt-2 text-paper-300">Browse everything happening across Tunisia.</p>
      </div>

      <div className="mb-10 rounded-2xl border border-navy-600 bg-navy-800 p-5">
        <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-paper-100">
          <SlidersHorizontal size={16} className="text-orange-500" />
          Filters
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="relative">
            <Search size={15} className="pointer-events-none absolute left-3.5 top-[38px] text-paper-500" />
            <Input
              label="Search"
              placeholder="Event or city..."
              value={search}
              onChange={(e) => updateFilter('search', e.target.value)}
              className="pl-9"
            />
          </div>
          <Select
            label="Category"
            value={category}
            onChange={(e) => updateFilter('category', e.target.value)}
          >
            <option value="">All categories</option>
            {mockDb.CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>
          <Select label="City" value={city} onChange={(e) => updateFilter('city', e.target.value)}>
            <option value="">All cities</option>
            {mockDb.CITIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>
          <Input
            label="Date"
            type="date"
            value={date}
            onChange={(e) => updateFilter('date', e.target.value)}
          />
        </div>
        {hasFilters && (
          <button
            onClick={clearFilters}
            className="mt-4 flex items-center gap-1.5 text-xs font-medium text-paper-500 hover:text-orange-500"
          >
            <X size={13} /> Clear all filters
          </button>
        )}
      </div>

      {loading ? (
        <Loading />
      ) : events.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-navy-600 py-20 text-center">
          <p className="font-display text-lg font-semibold text-paper-100">No events match these filters</p>
          <p className="mt-1 text-sm text-paper-500">Try widening your search or clearing filters.</p>
          {hasFilters && (
            <Button variant="outline" className="mt-5" onClick={clearFilters}>
              Clear filters
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  )
}
