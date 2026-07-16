import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { CalendarPlus, Image as ImageIcon } from 'lucide-react'
import toast from 'react-hot-toast'
import { eventService } from '../services/eventService'
import { mockDb } from '../services/mockDb'
import { useAuth } from '../context/AuthContext'
import Input from '../components/Input'
import Select from '../components/Select'
import Button from '../components/Button'
import Loading from '../components/Loading'

const DEFAULT_BANNERS = [
  'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80',
  'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80',
  'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
  'https://images.unsplash.com/photo-1531058020387-3be344556be6?w=800&q=80',
]

const emptyForm = {
  title: '',
  description: '',
  banner: DEFAULT_BANNERS[0],
  category: mockDb.CATEGORIES[0],
  city: mockDb.CITIES[0],
  venue: '',
  date: '',
  price: '',
  totalTickets: '',
}

export default function CreateEvent() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { id } = useParams()
  const isEdit = Boolean(id)

  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(isEdit)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!isEdit) return
    eventService.getEvent(id).then((event) => {
      setForm({
        title: event.title,
        description: event.description,
        banner: event.banner,
        category: event.category,
        city: event.city,
        venue: event.venue,
        date: event.date.slice(0, 16),
        price: event.price,
        totalTickets: event.totalTickets,
      })
      setLoading(false)
    })
  }, [id, isEdit])

  function updateField(key, value) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  function validate() {
    const next = {}
    if (!form.title.trim()) next.title = 'Title is required.'
    if (!form.description.trim()) next.description = 'Description is required.'
    if (!form.venue.trim()) next.venue = 'Venue is required.'
    if (!form.date) next.date = 'Date is required.'
    if (form.price === '' || Number(form.price) < 0) next.price = 'Enter a valid price.'
    if (!form.totalTickets || Number(form.totalTickets) < 1)
      next.totalTickets = 'Enter at least 1 ticket.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!validate()) return
    setSubmitting(true)
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        totalTickets: Number(form.totalTickets),
        date: new Date(form.date).toISOString(),
      }
      if (isEdit) {
        await eventService.updateEvent(id, payload)
        toast.success('Event updated.')
      } else {
        await eventService.createEvent(payload, user)
        toast.success('Event created.')
      }
      navigate('/organizer/events')
    } catch (err) {
      toast.error(err.message || 'Could not save event.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <Loading full />

  return (
    <div className="mx-auto max-w-3xl px-5 py-10">
      <h1 className="font-display text-3xl font-bold">{isEdit ? 'Edit event' : 'Create event'}</h1>
      <p className="mt-1 text-paper-300">
        {isEdit ? 'Update the details for your event.' : 'Fill in the details to publish a new event.'}
      </p>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5">
        <Input
          label="Title"
          placeholder="Tunis Music Nights"
          value={form.title}
          onChange={(e) => updateField('title', e.target.value)}
          error={errors.title}
        />
        <Input
          label="Description"
          textarea
          placeholder="Describe your event..."
          value={form.description}
          onChange={(e) => updateField('description', e.target.value)}
          error={errors.description}
        />

        <div className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-paper-300">Banner</span>
          <div className="grid grid-cols-4 gap-3">
            {DEFAULT_BANNERS.map((b) => (
              <button
                type="button"
                key={b}
                onClick={() => updateField('banner', b)}
                className={`overflow-hidden rounded-lg border-2 transition ${
                  form.banner === b ? 'border-orange-500' : 'border-transparent'
                }`}
              >
                <img src={b} alt="Banner option" className="h-16 w-full object-cover" />
              </button>
            ))}
          </div>
          <span className="flex items-center gap-1.5 text-xs text-paper-500">
            <ImageIcon size={12} /> Pick a banner or paste a custom image URL below
          </span>
          <Input
            placeholder="https://..."
            value={form.banner}
            onChange={(e) => updateField('banner', e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Select
            label="Category"
            value={form.category}
            onChange={(e) => updateField('category', e.target.value)}
          >
            {mockDb.CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>
          <Select label="City" value={form.city} onChange={(e) => updateField('city', e.target.value)}>
            {mockDb.CITIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>
        </div>

        <Input
          label="Venue"
          placeholder="Cite de la Culture"
          value={form.venue}
          onChange={(e) => updateField('venue', e.target.value)}
          error={errors.venue}
        />

        <Input
          label="Date & time"
          type="datetime-local"
          value={form.date}
          onChange={(e) => updateField('date', e.target.value)}
          error={errors.date}
        />

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Input
            label="Ticket price (TND)"
            type="number"
            min="0"
            placeholder="0 for free"
            value={form.price}
            onChange={(e) => updateField('price', e.target.value)}
            error={errors.price}
          />
          <Input
            label="Total tickets"
            type="number"
            min="1"
            placeholder="100"
            value={form.totalTickets}
            onChange={(e) => updateField('totalTickets', e.target.value)}
            error={errors.totalTickets}
          />
        </div>

        <Button type="submit" className="mt-2 w-fit" loading={submitting}>
          <CalendarPlus size={16} /> {isEdit ? 'Save changes' : 'Create event'}
        </Button>
      </form>
    </div>
  )
}
