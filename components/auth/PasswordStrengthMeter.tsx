'use client'
import { validatePasswordStrength } from '@/lib/auth'

const RULES = [
  { re: /.{8,}/,                   label: '8+ characters' },
  { re: /[A-Z]/,                   label: 'Uppercase letter' },
  { re: /[a-z]/,                   label: 'Lowercase letter' },
  { re: /\d/,                      label: 'Number' },
  { re: /[!@#$%^&*(),.?":{}|<>]/, label: 'Special character' },
]

export default function PasswordStrengthMeter({ password }: { password: string }) {
  if (!password) return null

  const errors = validatePasswordStrength(password)
  const strength = RULES.length - errors.length
  const pct = (strength / RULES.length) * 100

  const color =
    strength <= 2 ? 'bg-red-500' :
    strength <= 3 ? 'bg-orange' :
    strength <= 4 ? 'bg-yellow-400' :
    'bg-teal'

  const label =
    strength <= 2 ? 'Weak' :
    strength <= 3 ? 'Fair' :
    strength <= 4 ? 'Good' :
    'Strong'

  return (
    <div className="mt-2 space-y-2">
      {/* Bar */}
      <div className="flex items-center gap-2">
        <div className="flex-1 h-1.5 bg-subtle rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-300 ${color}`}
            style={{ width: `${pct}%` }}
          />
        </div>
        <span className={`text-xs font-semibold ${
          strength <= 2 ? 'text-red-500' :
          strength <= 3 ? 'text-orange' :
          strength <= 4 ? 'text-yellow-500' :
          'text-teal'
        }`}>{label}</span>
      </div>
      {/* Rule checklist */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-1">
        {RULES.map(r => {
          const passed = r.re.test(password)
          return (
            <div key={r.label} className="flex items-center gap-1.5">
              <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center flex-shrink-0 ${
                passed ? 'bg-teal' : 'bg-subtle'
              }`}>
                {passed && (
                  <svg className="w-2 h-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/>
                  </svg>
                )}
              </span>
              <span className={`text-xs ${passed ? 'text-muted line-through' : 'text-muted'}`}>{r.label}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
