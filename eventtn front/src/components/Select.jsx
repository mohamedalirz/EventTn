import { ChevronDown } from 'lucide-react'

export default function Select({ label, error, className = '', id, children, ...props }) {
  const selectId = id || props.name

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={selectId} className="text-sm font-medium text-paper-300">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          id={selectId}
          className={`w-full appearance-none rounded-lg border border-navy-600 bg-navy-800 px-3.5 py-2.5 text-sm text-paper-50 outline-none transition focus:border-orange-500 ${className}`}
          {...props}
        >
          {children}
        </select>
        <ChevronDown
          size={16}
          className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-paper-500"
        />
      </div>
      {error && <span className="text-xs text-red-400">{error}</span>}
    </div>
  )
}
