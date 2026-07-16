import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Ticket, LogIn } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import Input from '../components/Input'
import Button from '../components/Button'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  function validate() {
    const next = {}
    if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = 'Enter a valid email.'
    if (!form.password) next.password = 'Password is required.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!validate()) return
    setSubmitting(true)
    try {
      const user = await login(form)
      toast.success(`Welcome back, ${user.name.split(' ')[0]}!`)
      const from = location.state?.from?.pathname
      navigate(from || (user.role === 'ORGANIZER' ? '/organizer' : user.role === 'SPONSOR' ? '/sponsor' : '/'))
    } catch (err) {
      toast.error(err.message || 'Login failed.')
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
        <h1 className="font-display text-2xl font-bold">Welcome back</h1>
        <p className="mt-1 text-sm text-paper-300">Log in to manage tickets and events.</p>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
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
            placeholder="••••••••"
            value={form.password}
            onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
            error={errors.password}
          />
          <Button type="submit" className="mt-2 w-full" loading={submitting}>
            <LogIn size={16} /> Log in
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-paper-500">
          Don't have an account?{' '}
          <Link to="/register" className="text-orange-500 hover:text-orange-400">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}
