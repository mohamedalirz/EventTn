import { useEffect, useState } from 'react'
import { Handshake, Send, Clock, CheckCircle2, XCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { sponsorshipService } from '../services/sponsorshipService'
import { useAuth } from '../context/AuthContext'
import Modal from '../components/Modal'
import Input from '../components/Input'
import Select from '../components/Select'
import Button from '../components/Button'
import Loading from '../components/Loading'

const STATUS_STYLES = {
  PENDING: { icon: Clock, className: 'bg-gold-400/15 text-gold-400' },
  ACCEPTED: { icon: CheckCircle2, className: 'bg-green-500/15 text-green-400' },
  DECLINED: { icon: XCircle, className: 'bg-red-500/15 text-red-400' },
}

export default function SponsorshipRequests() {
  const { user } = useAuth()
  const [events, setEvents] = useState([])
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [target, setTarget] = useState(null)
  const [form, setForm] = useState({ message: '', offer: '' })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    load()
  }, [])

  async function load() {
    setLoading(true)
    const [ev, reqs] = await Promise.all([
      sponsorshipService.getSponsorableEvents(),
      sponsorshipService.getMyRequests(user.id),
    ])
    setEvents(ev)
    setRequests(reqs)
    setLoading(false)
  }

  function openRequestModal(event) {
    setTarget(event)
    setForm({ message: '', offer: '' })
  }

  async function handleSend(e) {
    e.preventDefault()
    if (!form.message.trim() || !form.offer.trim()) {
      toast.error('Please fill in both fields.')
      return
    }
    setSubmitting(true)
    try {
      await sponsorshipService.sendRequest({
        eventId: target.id,
        sponsorId: user.id,
        sponsorName: user.name,
        message: form.message,
        offer: form.offer,
      })
      toast.success('Sponsorship request sent.')
      setTarget(null)
      const reqs = await sponsorshipService.getMyRequests(user.id)
      setRequests(reqs)
    } catch (err) {
      toast.error(err.message || 'Could not send request.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <Loading full />

  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <h1 className="font-display text-3xl font-bold">Sponsor hub</h1>
      <p className="mt-1 text-paper-300">Browse events and offer your support.</p>

      <section className="mt-8">
        <h2 className="mb-4 font-display text-xl font-semibold">Browse events</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <div key={event.id} className="rounded-2xl border border-navy-600 bg-navy-800 p-4">
              <img
                src={event.banner}
                alt={event.title}
                className="h-32 w-full rounded-lg object-cover"
              />
              <h3 className="mt-3 font-display font-semibold text-paper-50">{event.title}</h3>
              <p className="text-xs text-paper-500">
                {event.city} &middot; {new Date(event.date).toLocaleDateString('en-GB')}
              </p>
              <Button
                variant="secondary"
                className="mt-3 w-full"
                onClick={() => openRequestModal(event)}
              >
                <Handshake size={14} /> Sponsor this event
              </Button>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="mb-4 font-display text-xl font-semibold">Your requests</h2>
        {requests.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-navy-600 py-16 text-center">
            <p className="font-display text-lg font-semibold text-paper-100">No requests yet</p>
            <p className="mt-1 text-sm text-paper-500">
              Send your first sponsorship request above.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {requests.map((r) => {
              const { icon: Icon, className } = STATUS_STYLES[r.status] || STATUS_STYLES.PENDING
              return (
                <div
                  key={r.id}
                  className="flex flex-col gap-3 rounded-xl border border-navy-600 bg-navy-800 p-5 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-display font-semibold text-paper-50">{r.eventTitle}</p>
                    <p className="mt-1 text-sm text-paper-300">Offer: {r.offer}</p>
                    <p className="text-xs text-paper-500">{r.message}</p>
                  </div>
                  <span
                    className={`flex w-fit items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${className}`}
                  >
                    <Icon size={13} /> {r.status}
                  </span>
                </div>
              )
            })}
          </div>
        )}
      </section>

      <Modal open={!!target} onClose={() => setTarget(null)} title={`Sponsor ${target?.title || ''}`}>
        <form onSubmit={handleSend} className="flex flex-col gap-4">
          <Input
            label="Message"
            textarea
            placeholder="Tell the organizer why you'd like to sponsor this event..."
            value={form.message}
            onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
          />
          <Input
            label="Offer"
            placeholder="e.g. 2,000 TND + branded booth"
            value={form.offer}
            onChange={(e) => setForm((f) => ({ ...f, offer: e.target.value }))}
          />
          <div className="mt-2 flex justify-end gap-3">
            <Button variant="outline" type="button" onClick={() => setTarget(null)}>
              Cancel
            </Button>
            <Button type="submit" loading={submitting}>
              <Send size={14} /> Send request
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
