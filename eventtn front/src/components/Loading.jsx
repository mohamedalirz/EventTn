import { Loader2 } from 'lucide-react'

export default function Loading({ full = false, label = 'Loading...' }) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 text-paper-500 ${
        full ? 'min-h-[60vh]' : 'py-16'
      }`}
    >
      <Loader2 size={28} className="animate-spin text-orange-500" />
      <p className="text-sm">{label}</p>
    </div>
  )
}
