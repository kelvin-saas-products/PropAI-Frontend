'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import AuthCard from '@/components/auth/AuthCard'
import FormField from '@/components/auth/FormField'
import ProgressSteps from '@/components/auth/ProgressSteps'
import PasswordStrengthMeter from '@/components/auth/PasswordStrengthMeter'
import { registerBuyer, registerAgent } from '@/lib/auth'
import type { UserRole } from '@/lib/types'

// ── Persona config ─────────────────────────────────────────────────
const PERSONAS: { role: UserRole; icon: string; title: string; desc: string; bg: string }[] = [
  { role: 'buyer',    icon: '🔍', title: 'Property Seeker', desc: 'Searching to buy or rent',        bg: 'bg-purple-light' },
  { role: 'owner',    icon: '🏡', title: 'Property Owner',  desc: 'Track value & equity',            bg: 'bg-blue-light' },
  { role: 'agent',    icon: '💼', title: 'Real Estate Agent', desc: 'List & manage properties',      bg: 'bg-orange-light' },
  { role: 'investor', icon: '📈', title: 'Investor',         desc: 'Portfolio & rental yields',      bg: 'bg-purple-light' },
]

const STATES = ['NSW','VIC','QLD','WA','SA','TAS','ACT','NT']
const PLANS  = [
  { id: 'starter', name: 'Starter', price: '$99', period: '/mo', listings: '5 listings', features: ['Basic analytics','Email support','Public profile'] },
  { id: 'pro',     name: 'Pro',     price: '$249', period: '/mo', listings: '25 listings', features: ['AI match insights','Lead management','Priority support','Social boost'], popular: true },
  { id: 'agency',  name: 'Agency',  price: '$599', period: '/mo', listings: 'Unlimited',   features: ['Team seats','CRM integration','White-label reports','Dedicated manager'] },
]

// ── Buyer steps ────────────────────────────────────────────────────
const BUYER_STEPS  = ['Account type', 'Your details', 'Preferences']
const AGENT_STEPS  = ['Account type', 'Your details', 'Branding',   'Subscription']

type Plan = 'starter' | 'pro' | 'agency'

interface FormState {
  // Step 1 — persona
  role: UserRole | null
  // Step 2 — account
  first_name: string; last_name: string; email: string; phone: string
  password: string; confirm_password: string
  // Step 3 buyer — preferences
  intent: string[]; min_budget: string; max_budget: string
  preferred_suburbs: string; property_types: string[]; min_beds: string
  email_alerts: boolean; ai_recommendations: boolean
  // Step 3 agent — professional
  agency_name: string; abn: string; licence_number: string; licence_state: string
  // Step 4 agent — branding
  bio: string; specialist_suburbs: string
  // Step 5 agent — plan
  plan: Plan
}

const INIT: FormState = {
  role: null,
  first_name: '', last_name: '', email: '', phone: '',
  password: '', confirm_password: '',
  intent: ['buy'], min_budget: '', max_budget: '',
  preferred_suburbs: '', property_types: [], min_beds: '',
  email_alerts: true, ai_recommendations: true,
  agency_name: '', abn: '', licence_number: '', licence_state: '',
  bio: '', specialist_suburbs: '',
  plan: 'pro',
}

export default function RegisterPage() {
  const router = useRouter()
  const [step, setStep]     = useState(0)
  const [form, setForm]     = useState<FormState>(INIT)
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({})
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState('')

  const isAgent   = form.role === 'agent'
  const steps     = isAgent ? AGENT_STEPS : BUYER_STEPS
  const totalSteps = steps.length

  // ── Field helpers ─────────────────────────────────────────────────
  const set = (field: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [field]: e.target.value }))

  const toggleList = (field: 'intent' | 'property_types', val: string) =>
    setForm(f => ({
      ...f,
      [field]: (f[field] as string[]).includes(val)
        ? (f[field] as string[]).filter(v => v !== val)
        : [...(f[field] as string[]), val],
    }))

  // ── Validation ────────────────────────────────────────────────────
  function validateStep(): boolean {
    const e: typeof errors = {}
    if (step === 0 && !form.role) { setApiError('Please select an account type.'); return false }
    if (step === 1) {
      if (!form.first_name.trim()) e.first_name = 'Required'
      if (!form.last_name.trim())  e.last_name  = 'Required'
      if (!form.email.trim())      e.email      = 'Required'
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Invalid email address'
      if (!form.password)          e.password   = 'Required'
      if (form.password !== form.confirm_password) e.confirm_password = 'Passwords do not match'
    }
    if (isAgent && step === 2) {
      if (!form.agency_name.trim())    e.agency_name    = 'Required'
      if (!form.abn.trim())            e.abn            = 'Required'
      if (!form.licence_number.trim()) e.licence_number = 'Required'
      if (!form.licence_state)         e.licence_state  = 'Required'
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function next() {
    setApiError('')
    if (!validateStep()) return
    setStep(s => Math.min(s + 1, totalSteps - 1))
  }
  function back() { setStep(s => Math.max(s - 1, 0)) }

  // ── Submit ────────────────────────────────────────────────────────
  async function handleSubmit() {
    if (!validateStep()) return
    setLoading(true)
    setApiError('')
    try {
      if (isAgent) {
        await registerAgent({
          email: form.email, password: form.password,
          first_name: form.first_name, last_name: form.last_name,
          phone: form.phone || undefined,
          agent_profile: {
            agency_name: form.agency_name, abn: form.abn,
            licence_number: form.licence_number, licence_state: form.licence_state,
            bio: form.bio, subscription_plan: form.plan,
            specialist_suburbs: form.specialist_suburbs.split(',').map(s => s.trim()).filter(Boolean),
            verified: false,
          },
        })
      } else {
        await registerBuyer({
          email: form.email, password: form.password,
          first_name: form.first_name, last_name: form.last_name,
          phone: form.phone || undefined,
          role: form.role as 'buyer' | 'owner' | 'investor',
          preferences: {
            intent: form.intent,
            min_budget: form.min_budget ? parseInt(form.min_budget.replace(/\D/g,'')) : null,
            max_budget: form.max_budget ? parseInt(form.max_budget.replace(/\D/g,'')) : null,
            preferred_suburbs: form.preferred_suburbs.split(',').map(s => s.trim()).filter(Boolean),
            property_types: form.property_types,
            min_beds: form.min_beds ? parseInt(form.min_beds) : null,
            email_alerts: form.email_alerts,
            ai_recommendations: form.ai_recommendations,
          },
        })
      }
      router.push(`/auth/register/success?role=${form.role}`)
    } catch (err: any) {
      setApiError(err.message ?? 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const lastStep = step === totalSteps - 1

  // ── Tag button ────────────────────────────────────────────────────
  function Tag({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
          active ? 'bg-ink text-white border-ink' : 'bg-white text-muted border-subtle hover:border-ink/30'
        }`}
      >
        {children}
      </button>
    )
  }

  return (
    <div>
      <AuthCard
        title={
          step === 0 ? "Create your account" :
          step === 1 ? "Your details" :
          isAgent && step === 2 ? "Professional details" :
          isAgent && step === 3 ? "Agency branding" :
          isAgent && step === 4 ? "Choose your plan" :
          "Your preferences"
        }
        subtitle={
          step === 0 ? "Choose the account type that best describes you." :
          step === 1 ? "Your details are kept private and never shared without consent." :
          isAgent && step === 2 ? "These appear on your public agent profile and are verified against ABR." :
          isAgent && step === 3 ? "Your logo and headshot appear on listings and your profile page." :
          isAgent && step === 4 ? "All plans include a 14-day free trial. No credit card required." :
          "Help PropAI surface the most relevant properties for you."
        }
      >
        <ProgressSteps steps={steps} current={step} />

        {/* ── Step 0: Persona ── */}
        {step === 0 && (
          <div className="grid grid-cols-2 gap-3">
            {PERSONAS.map(p => (
              <button
                key={p.role}
                type="button"
                onClick={() => { setForm(f => ({ ...f, role: p.role })); setApiError('') }}
                className={`flex flex-col gap-2 p-4 rounded-2xl border-2 text-left transition-all ${
                  form.role === p.role
                    ? 'border-ink bg-ink/5 shadow-card'
                    : 'border-subtle hover:border-ink/30 bg-white'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${p.bg}`}>
                  {p.icon}
                </div>
                <div>
                  <p className="text-sm font-bold text-ink">{p.title}</p>
                  <p className="text-xs text-muted mt-0.5">{p.desc}</p>
                </div>
                {form.role === p.role && (
                  <div className="absolute top-2 right-2 w-4 h-4 rounded-full flex items-center justify-center">
                    <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/>
                    </svg>
                  </div>
                )}
              </button>
            ))}
          </div>
        )}

        {/* ── Step 1: Account details ── */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <FormField label="First name" placeholder="Jane" value={form.first_name} onChange={set('first_name')} error={errors.first_name} autoComplete="given-name"/>
              <FormField label="Last name"  placeholder="Smith" value={form.last_name}  onChange={set('last_name')}  error={errors.last_name}  autoComplete="family-name"/>
            </div>
            <FormField label="Email address" type="email" placeholder="jane@example.com" value={form.email} onChange={set('email')} error={errors.email} autoComplete="email"/>
            <FormField label="Phone number (optional)" type="tel" placeholder="+61 4XX XXX XXX" value={form.phone} onChange={set('phone')} autoComplete="tel"/>
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-ink/70 uppercase tracking-wide">Password</label>
              <div className="relative">
                <input
                  type="password" placeholder="Min. 8 characters"
                  value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  autoComplete="new-password"
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm text-ink placeholder:text-muted/60 outline-none transition-all ${errors.password ? 'border-red-400 bg-red-50' : 'border-subtle bg-bg focus:border-blue focus:bg-white focus:ring-2 focus:ring-blue/10'}`}
                />
              </div>
              {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
              <PasswordStrengthMeter password={form.password} />
            </div>
            <FormField label="Confirm password" type="password" placeholder="Re-enter password" value={form.confirm_password} onChange={set('confirm_password')} error={errors.confirm_password} autoComplete="new-password"/>
          </div>
        )}

        {/* ── Step 2 (agent): Professional details ── */}
        {isAgent && step === 2 && (
          <div className="space-y-4">
            <FormField label="Agency / company name" placeholder="Ray White Mosman" value={form.agency_name} onChange={set('agency_name')} error={errors.agency_name}/>
            <FormField
              label="ABN (Australian Business Number)"
              placeholder="12 345 678 901"
              value={form.abn} onChange={set('abn')} error={errors.abn}
              hint="Verified against the Australian Business Register. Required to list properties."
            />
            <div className="grid grid-cols-2 gap-3">
              <FormField label="Licence number" placeholder="e.g. 20151234" value={form.licence_number} onChange={set('licence_number')} error={errors.licence_number}/>
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-ink/70 uppercase tracking-wide">Licence state</label>
                <select value={form.licence_state} onChange={set('licence_state')}
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm text-ink outline-none transition-all ${errors.licence_state ? 'border-red-400 bg-red-50' : 'border-subtle bg-bg focus:border-blue focus:bg-white'}`}>
                  <option value="">Select…</option>
                  {STATES.map(s => <option key={s}>{s}</option>)}
                </select>
                {errors.licence_state && <p className="text-xs text-red-500">{errors.licence_state}</p>}
              </div>
            </div>
            <div className="bg-blue-light rounded-xl p-3.5 flex gap-3 text-sm text-muted">
              <svg className="w-4 h-4 text-blue flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              Your ABN and real estate licence are verified within 2 business hours before your profile goes live.
            </div>
          </div>
        )}

        {/* ── Step 3 (agent): Branding ── */}
        {isAgent && step === 3 && (
          <div className="space-y-4">
            {/* Logo upload */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-ink/70 uppercase tracking-wide">Agency logo</label>
              <div className="border-2 border-dashed border-subtle rounded-2xl p-6 text-center cursor-pointer hover:border-green hover:bg-purple-light/30 transition-all">
                <div className="text-3xl mb-2">🏢</div>
                <p className="text-sm font-medium text-ink">Click to upload your logo</p>
                <p className="text-xs text-muted mt-1">PNG or SVG · min 200×200px · max 5MB</p>
              </div>
            </div>
            {/* Headshot upload */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-ink/70 uppercase tracking-wide">Profile headshot</label>
              <div className="border-2 border-dashed border-subtle rounded-2xl p-6 text-center cursor-pointer hover:border-green hover:bg-purple-light/30 transition-all">
                <div className="text-3xl mb-2">👤</div>
                <p className="text-sm font-medium text-ink">Upload a professional photo</p>
                <p className="text-xs text-muted mt-1">JPG or PNG · square crop recommended</p>
              </div>
            </div>
            <FormField as="textarea" label="Agent bio" placeholder="Tell buyers about your experience, specialties, and the areas you cover…" value={form.bio} onChange={set('bio')} rows={3}/>
            <FormField label="Specialist suburbs (comma-separated)" placeholder="Mosman, Neutral Bay, Cremorne" value={form.specialist_suburbs} onChange={set('specialist_suburbs')}/>
          </div>
        )}

        {/* ── Step 4 (agent): Subscription ── */}
        {isAgent && step === 4 && (
          <div className="space-y-5">
            <div className="grid grid-cols-3 gap-3">
              {PLANS.map(p => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setForm(f => ({ ...f, plan: p.id as Plan }))}
                  className={`relative flex flex-col p-4 rounded-2xl border-2 text-left transition-all ${
                    form.plan === p.id ? 'border-ink shadow-card' : 'border-subtle hover:border-ink/30'
                  }`}
                >
                  {p.popular && (
                    <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-green text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full whitespace-nowrap">
                      Most popular
                    </span>
                  )}
                  <p className="text-xs font-bold text-muted uppercase tracking-wider mb-1">{p.name}</p>
                  <p className="text-2xl font-black text-ink">{p.price}<span className="text-xs font-normal text-muted">{p.period}</span></p>
                  <p className="text-xs text-green font-semibold mt-1 mb-3">{p.listings}</p>
                  <ul className="space-y-1">
                    {p.features.map(f => (
                      <li key={f} className="flex items-start gap-1.5 text-xs text-muted">
                        <svg className="w-3 h-3 text-green flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/>
                        </svg>
                        {f}
                      </li>
                    ))}
                  </ul>
                </button>
              ))}
            </div>
            <div className="bg-purple-light rounded-xl p-3.5 flex gap-3 text-sm text-muted">
              <svg className="w-4 h-4 text-green flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              14-day free trial on all plans. No credit card required to start.
            </div>
            <div className="space-y-2">
              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" defaultChecked className="mt-0.5 accent-violet" />
                <span className="text-xs text-muted">I agree to the <Link href="#" className="text-violet hover:underline">Terms of Service</Link> and <Link href="#" className="text-violet hover:underline">Agent Subscription Agreement</Link></span>
              </label>
            </div>
          </div>
        )}

        {/* ── Step 2 (buyer/owner/investor): Preferences ── */}
        {!isAgent && step === 2 && (
          <div className="space-y-5">
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-ink/70 uppercase tracking-wide">I'm looking to</label>
              <div className="flex flex-wrap gap-2">
                {['buy','rent','invest','research'].map(v => (
                  <Tag key={v} active={form.intent.includes(v)} onClick={() => toggleList('intent', v)}>
                    {v.charAt(0).toUpperCase() + v.slice(1)}
                  </Tag>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <FormField label="Min. budget" placeholder="$400,000" value={form.min_budget} onChange={set('min_budget')}/>
              <FormField label="Max. budget" placeholder="$1,200,000" value={form.max_budget} onChange={set('max_budget')}/>
            </div>
            <FormField label="Preferred suburbs / regions" placeholder="Mosman, Paddington, Inner West" value={form.preferred_suburbs} onChange={set('preferred_suburbs')} hint="Comma-separated. You can update this anytime."/>
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-ink/70 uppercase tracking-wide">Property type</label>
              <div className="flex flex-wrap gap-2">
                {['House','Apartment','Townhouse','Land','Acreage'].map(v => (
                  <Tag key={v} active={form.property_types.includes(v)} onClick={() => toggleList('property_types', v)}>
                    {v}
                  </Tag>
                ))}
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-ink/70 uppercase tracking-wide">Minimum bedrooms</label>
              <select value={form.min_beds} onChange={set('min_beds')}
                className="w-full px-4 py-2.5 rounded-xl border border-subtle bg-bg text-sm text-ink outline-none focus:border-blue focus:bg-white">
                <option value="">Any</option>
                {['1','2','3','4','5+'].map(n => <option key={n} value={n}>{n}+</option>)}
              </select>
            </div>
            <div className="border-t border-subtle pt-4 space-y-3">
              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" checked={form.email_alerts} onChange={e => setForm(f => ({ ...f, email_alerts: e.target.checked }))} className="mt-0.5 accent-violet"/>
                <div>
                  <p className="text-sm font-medium text-ink">Email alerts for matching properties</p>
                  <p className="text-xs text-muted">Get notified as soon as new listings match your criteria</p>
                </div>
              </label>
              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" checked={form.ai_recommendations} onChange={e => setForm(f => ({ ...f, ai_recommendations: e.target.checked }))} className="mt-0.5 accent-violet"/>
                <div>
                  <p className="text-sm font-medium text-ink">AI-powered recommendations</p>
                  <p className="text-xs text-muted">PropAI learns your preferences and surfaces hidden gems</p>
                </div>
              </label>
            </div>
          </div>
        )}

        {/* ── Error ── */}
        {apiError && (
          <div className="mt-4 flex items-start gap-2.5 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
            <svg className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <p className="text-sm text-red-600">{apiError}</p>
          </div>
        )}

        {/* ── Navigation ── */}
        <div className={`flex gap-3 mt-7 ${step === 0 ? 'justify-end' : 'justify-between'}`}>
          {step > 0 && (
            <button type="button" onClick={back}
              className="px-5 py-2.5 rounded-xl border border-subtle text-sm font-medium text-muted hover:text-ink hover:border-ink/30 transition-colors">
              Back
            </button>
          )}
          <button
            type="button"
            onClick={lastStep ? handleSubmit : next}
            disabled={loading}
            className="flex-1 text-white font-bold py-2.5 rounded-xl hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed" style={{background:'linear-gradient(135deg,#20D3B3,#3B82F6,#8B5CF6)'}}
          >
            {loading ? 'Creating account…' :
             lastStep ? (isAgent ? 'Start free trial →' : 'Create account →') :
             'Continue'}
          </button>
        </div>

        {step === 0 && (
          <p className="text-center text-sm text-muted mt-5">
            Already have an account?{' '}
            <Link href="/auth/sign-in" className="text-violet font-semibold hover:underline">Sign in</Link>
          </p>
        )}
      </AuthCard>
    </div>
  )
}
