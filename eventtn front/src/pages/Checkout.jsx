import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, CreditCard, Minus, Plus } from 'lucide-react'
import toast from 'react-hot-toast'
import { eventService } from '../services/eventService'
import { paymentService } from '../services/paymentService'
import { ticketService } from '../services/ticketService'
import { useAuth } from '../context/AuthContext'
import Input from '../components/Input'
import Button from '../components/Button'
import Loading from '../components/Loading'

export default function Checkout() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: '',
    quantity: 1,
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    let active = true
    eventService
      .getEvent(id)
      .then((data) => active && setEvent(data))
      .catch(() => active && toast.error('Event not found.'))
      .finally(() => active && setLoading(false))
    return () => {
      active = false
    }
  }, [id])

  if (loading) return <Loading full />
  if (!event) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-20 text-center">
        <p className="font-display text-xl font-semibold">Event not found.</p>
        <Button className="mt-6" onClick={() => navigate('/events')}>
          Back to events
        </Button>
      </div>
    )
  }

  const remaining = event.totalTickets - event.ticketsSold
  const total = event.price * form.quantity

  function updateField(key, value) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  function adjustQty(delta) {
    setForm((f) => ({
      ...f,
      quantity: Math.min(Math.max(1, f.quantity + delta), Math.max(1, remaining)),
    }))
  }

  function validate() {
    const next = {}
    if (!form.fullName.trim()) next.fullName = 'Full name is required.'
    if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = 'Enter a valid email.'
    if (!form.phone.trim()) next.phone = 'Phone number is required.'
    if (form.quantity < 1) next.quantity = 'Quantity must be at least 1.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function handlePay(e) {
    e.preventDefault()
    if (!validate()) return
    if (remaining <= 0) {
      toast.error('This event is sold out.')
      return
    }
    setSubmitting(true)
    try {
      const payment = await paymentService.createPayment({
        eventId: event.id,
        amount: total,
        quantity: form.quantity,
      })
      if (!payment.success) throw new Error('Payment failed.')

      const ticket = await ticketService.buyTicket({
        eventId: event.id,
        fullName: form.fullName,
        email: form.email,
        phone: form.phone,
        quantity: form.quantity,
        userId: user?.id || `guest_${form.email}`,
      })

      toast.success('Payment successful — your ticket is ready!')
      navigate('/my-tickets', { state: { newTicketId: ticket.id } })
    } catch (err) {
      toast.error(err.message || 'Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-5 py-10">
      <Link
        to={`/events/${event.id}`}
        className="mb-6 flex w-fit items-center gap-1.5 text-sm text-paper-500 hover:text-orange-500"
      >
        <ArrowLeft size={15} /> Back to event
      </Link>

      <h1 className="font-display text-3xl font-bold">Checkout</h1>
      <p className="mt-1 text-paper-300">
        You're getting tickets for <span className="text-paper-50">{event.title}</span>
      </p>

      <form onSubmit={handlePay} className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-3">
        <div className="flex flex-col gap-5 md:col-span-2">
          <Input
            label="Full name"
            placeholder="Amira Ben Salah"
            value={form.fullName}
            onChange={(e) => updateField('fullName', e.target.value)}
            error={errors.fullName}
          />
          <Input
            label="Email"
            type="email"
            placeholder="amira@example.com"
            value={form.email}
            onChange={(e) => updateField('email', e.target.value)}
            error={errors.email}
          />
          <Input
            label="Phone"
            placeholder="+216 20 123 456"
            value={form.phone}
            onChange={(e) => updateField('phone', e.target.value)}
            error={errors.phone}
          />

          <div className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-paper-300">Quantity</span>
            <div className="flex w-fit items-center gap-4 rounded-lg border border-navy-600 bg-navy-800 px-4 py-2">
              <button
                type="button"
                onClick={() => adjustQty(-1)}
                className="text-paper-300 hover:text-orange-500"
                aria-label="Decrease quantity"
              >
                <Minus size={16} />
              </button>
              <span className="w-6 text-center font-mono-num">{form.quantity}</span>
              <button
                type="button"
                onClick={() => adjustQty(1)}
                className="text-paper-300 hover:text-orange-500"
                aria-label="Increase quantity"
              >
                <Plus size={16} />
              </button>
            </div>
            {errors.quantity && <span className="text-xs text-red-400">{errors.quantity}</span>}
            <span className="text-xs text-paper-500">{remaining} tickets available</span>
          </div>
        </div>

        <div className="md:col-span-1">
          <div className="sticky top-24 rounded-2xl border border-navy-600 bg-navy-800 p-6">
            <h2 className="font-display text-lg font-semibold">Order summary</h2>
            <div className="mt-4 flex items-center justify-between text-sm text-paper-300">
              <span>Ticket price</span>
              <span className="font-mono-num">
                {event.price === 0 ? 'Free' : `${event.price} TND`}
              </span>
            </div>
            <div className="mt-2 flex items-center justify-between text-sm text-paper-300">
              <span>Quantity</span>
              <span className="font-mono-num">&times;{form.quantity}</span>
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-navy-600 pt-4">
              <span className="font-semibold text-paper-50">Total</span>
              <span className="font-mono-num text-xl font-bold text-orange-500">
                {total === 0 ? 'Free' : `${total} TND`}
              </span>
            </div>

            <Button type="submit" className="mt-6 w-full" loading={submitting}>
              <CreditCard size={16} /> Pay now
            </Button>
            <p className="mt-3 text-center text-xs text-paper-500">
              Payments are simulated in this MVP. No real charge occurs.
            </p>
          </div>
        </div>
      </form>
    </div>
  )
}
