export default function Input({ label, error, className = '', id, textarea, ...props }) {
  const inputId = id || props.name
  const Component = textarea ? 'textarea' : 'input'

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-paper-300">
          {label}
        </label>
      )}
      <Component
        id={inputId}
        className={`w-full rounded-lg border border-navy-600 bg-navy-800 px-3.5 py-2.5 text-sm text-paper-50 placeholder:text-paper-500 outline-none transition focus:border-orange-500 ${
          textarea ? 'min-h-[100px] resize-y' : ''
        } ${className}`}
        {...props}
      />
      {error && <span className="text-xs text-red-400">{error}</span>}
    </div>
  )
}
