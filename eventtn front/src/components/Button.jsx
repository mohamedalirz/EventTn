import { Loader2 } from 'lucide-react'

const variants = {
  primary: 'bg-orange-500 text-navy-950 hover:bg-orange-400 disabled:bg-orange-500/40',
  secondary: 'bg-navy-700 text-paper-50 hover:bg-navy-600 border border-navy-600',
  outline: 'border border-navy-600 text-paper-100 hover:border-orange-500 hover:text-orange-500',
  danger: 'bg-red-500/15 text-red-400 hover:bg-red-500/25 border border-red-500/30',
  ghost: 'text-paper-300 hover:text-paper-50',
}

export default function Button({
  children,
  variant = 'primary',
  loading = false,
  disabled = false,
  className = '',
  type = 'button',
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed ${variants[variant]} ${className}`}
      {...props}
    >
      {loading && <Loader2 size={16} className="animate-spin" />}
      {children}
    </button>
  )
}
