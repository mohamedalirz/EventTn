import { X } from 'lucide-react'
import { useEffect } from 'react'

export default function Modal({ open, onClose, title, children }) {
  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') onClose?.()
    }
    if (open) document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-navy-950/80 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative z-10 w-full max-w-md rounded-2xl border border-navy-600 bg-navy-800 p-6 shadow-xl animate-fade-up">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-display text-lg font-semibold">{title}</h3>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-paper-500 transition hover:bg-navy-700 hover:text-paper-50"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
