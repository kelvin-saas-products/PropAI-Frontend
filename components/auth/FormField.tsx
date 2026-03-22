'use client'
import { InputHTMLAttributes, TextareaHTMLAttributes } from 'react'

interface BaseProps {
  label: string
  error?: string
  hint?: string
}

interface InputProps extends BaseProps, InputHTMLAttributes<HTMLInputElement> {
  as?: 'input'
}

interface TextareaProps extends BaseProps, TextareaHTMLAttributes<HTMLTextAreaElement> {
  as: 'textarea'
  rows?: number
}

type Props = InputProps | TextareaProps

export default function FormField({ label, error, hint, as = 'input', ...rest }: Props) {
  const baseClass = `w-full px-4 py-2.5 rounded-xl border text-sm text-ink placeholder:text-muted/60 outline-none transition-all duration-150 ${
    error
      ? 'border-red-400 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-100'
      : 'border-subtle bg-bg focus:border-blue focus:bg-white focus:ring-2 focus:ring-blue/10'
  }`

  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-semibold text-ink/70 uppercase tracking-wide">
        {label}
      </label>
      {as === 'textarea' ? (
        <textarea
          className={`${baseClass} resize-none`}
          rows={(rest as TextareaProps).rows ?? 3}
          {...(rest as TextareaHTMLAttributes<HTMLTextAreaElement>)}
        />
      ) : (
        <input
          className={baseClass}
          {...(rest as InputHTMLAttributes<HTMLInputElement>)}
        />
      )}
      {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
      {hint && !error && <p className="text-xs text-muted leading-relaxed">{hint}</p>}
    </div>
  )
}
