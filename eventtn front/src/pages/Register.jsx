import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Ticket, UserPlus, User, Building2, Handshake } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import Input from '../components/Input'
import Button from '../components/Button'

const ROLES = [
  { value: 'USER', label: 'Attendee', icon: User, hint: 'Discover events & buy tickets' },
  { value: 'ORGANIZER', label: 'Organizer', icon: Building2, hint: 'Create & manage events' },
  { value: 'SPONSOR', label: 'Sponsor', icon: Handshake, hint: 'Support events' },
]

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'USER' })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  function validate() {
    const next = {}
    if (!form.name.trim()) next.name = 'Name is required.'
    if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = 'Enter a valid email.'
    if (form.password.length < 6) next.password = 'At least 6 characters.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!validate()) return
    setSubmitting(true)
    try {
      const user = await register(form)
      toast.success(`Account created — welcome, ${user.name.split(' ')[0]}!`)
      navigate(user.role === 'ORGANIZER' ? '/organizer' : user.role === 'SPONSOR' ? '/sponsor' : '/')
    } catch (err) {
      toast.error(err.message || 'Registration failed.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto flex max-w-md flex-col px-5 py-16">
      <Link to="/" className="mx-auto mb-6 flex items-center gap-2 font-display text-lg font-bold">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-500 text-navy-950">
          <Ticket size={20} strokeWidth={2.5} />
        </span>
        Event<span className="text-orange-500">TN</span>
      </Link>

      <div className="rounded-2xl border border-navy-600 bg-navy-800 p-8">
        <h1 className="font-display text-2xl font-bold">Create your account</h1>
        <p className="mt-1 text-sm text-paper-300">Join EventTN in less than a minute.</p>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
          <Input
            label="Full name"
            placeholder="Amira Ben Salah"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            error={errors.name}
          />
          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            error={errors.email}
          />
          <Input
            label="Password"
            type="password"
            placeholder="At least 6 characters"
            value={form.password}
            onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
            error={errors.password}
          />

          <div className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-paper-300">I want to join as</span>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              {ROLES.map(({ value, label, icon: Icon, hint }) => (
                <button
                  type="button"
                  key={value}
                  onClick={() => setForm((f) => ({ ...f, role: value }))}
                  className={`flex flex-col items-center gap-1.5 rounded-xl border p-3 text-center transition ${
                    form.role === value
                      ? 'border-orange-500 bg-orange-500/10'
                      : 'border-navy-600 hover:border-navy-500'
                  }`}
                >
                  <Icon
                    size={18}
                    className={form.role === value ? 'text-orange-500' : 'text-paper-500'}
                  />
                  <span className="text-xs font-semibold text-paper-100">{label}</span>
                  <span className="text-[10px] text-paper-500">{hint}</span>
                </button>
              ))}
            </div>
          </div>

          <Button type="submit" className="mt-2 w-full" loading={submitting}>
            <UserPlus size={16} /> Create account
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-paper-500">
          Already have an account?{' '}
          <Link to="/login" className="text-orange-500 hover:text-orange-400">
            Log in
          </Link>
        </p>
      </div>
    </div>
  )
}
