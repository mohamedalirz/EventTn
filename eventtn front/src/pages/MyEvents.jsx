import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Plus, Pencil, Trash2, Calendar } from 'lucide-react'
import toast from 'react-hot-toast'
import { eventService } from '../services/eventService'
import { useAuth } from '../context/AuthContext'
import Loading from '../components/Loading'
import Button from '../components/Button'
import Modal from '../components/Modal'

export default function MyEvents() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [target, setTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    load()
  }, [])

  async function load() {
    setLoading(true)
    const data = await eventService.getOrganizerEvents(user.id)
    setEvents(data)
    setLoading(false)
  }

  async function confirmDelete() {
    if (!target) return
    setDeleting(true)
    try {
      await eventService.deleteEvent(target.id)
      toast.success('Event deleted.')
      setEvents((prev) => prev.filter((e) => e.id !== target.id))
      setTarget(null)
    } catch (err) {
      toast.error(err.message || 'Could not delete event.')
    } finally {
      setDeleting(false)
    }
  }

  if (loading) return <Loading full />

  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-display text-3xl font-bold">My events</h1>
          <p className="mt-1 text-paper-300">Manage everything you've created.</p>
        </div>
        <Link to="/organizer/create">
          <Button>
            <Plus size={16} /> Create event
          </Button>
        </Link>
      </div>

      {events.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-navy-600 py-20 text-center">
          <Calendar size={32} className="mx-auto text-paper-500" />
          <p className="mt-4 font-display text-lg font-semibold text-paper-100">
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
        <div className="mt-8 flex flex-col gap-4">
          {events.map((event) => (
            <div
              key={event.id}
              className="flex flex-col gap-4 rounded-2xl border border-navy-600 bg-navy-800 p-5 sm:flex-row sm:items-center"
            >
              <img
                src={event.banner}
                alt={event.title}
                className="h-24 w-full rounded-lg object-cover sm:w-36"
              />
              <div className="flex-1">
                <h3 className="font-display text-lg font-semibold text-paper-50">
                  {event.title}
                </h3>
                <p className="mt-1 text-sm text-paper-500">
                  {new Date(event.date).toLocaleDateString('en-GB')} &middot; {event.city}
                </p>
                <div className="mt-2 flex gap-6 text-sm text-paper-300">
                  <span>
                    <span className="font-mono-num font-semibold text-paper-50">
                      {event.ticketsSold}/{event.totalTickets}
                    </span>{' '}
                    sold
                  </span>
                  <span>
                    <span className="font-mono-num font-semibold text-paper-50">
                      {event.ticketsSold * event.price}
                    </span>{' '}
                    TND revenue
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  onClick={() => navigate(`/organizer/edit/${event.id}`)}
                >
                  <Pencil size={14} /> Edit
                </Button>
                <Button variant="danger" onClick={() => setTarget(event)}>
                  <Trash2 size={14} /> Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={!!target} onClose={() => setTarget(null)} title="Delete event">
        <p className="text-sm text-paper-300">
          Are you sure you want to delete <span className="text-paper-50">{target?.title}</span>?
          This can't be undone.
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="outline" onClick={() => setTarget(null)}>
            Cancel
          </Button>
          <Button variant="danger" loading={deleting} onClick={confirmDelete}>
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  )
}
