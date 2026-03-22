'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { useI18n, Country } from '@/lib/i18n'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const { user, logout } = useAuth()
  const router = useRouter()
  const initials = user ? `${user.first_name[0]}${user.last_name[0]}`.toUpperCase() : ''
  const { country, setCountry, language, setLanguage, t } = useI18n()
  const countries: Country[] = ['Australia', 'Thailand', 'Philippines']

  async function handleLogout() {
    await logout()
    router.push('/')
    setUserMenuOpen(false)
  }

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-subtle">
      <div className="max-w-7xl mx-auto px-5 lg:px-8 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <Image src="/logo.svg" alt="Prop.AI" width={120} height={35} priority/>
        </Link>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-7">
          {['Buy','Rent','Sold','New Homes','Find Agents','Loans'].map(item => (
            <Link key={item} href="#" className="text-sm text-muted hover:text-ink font-medium transition-colors">{t(item)}</Link>

          ))}
        </nav>

        {/* Auth & Settings */}
        <div className="hidden md:flex items-center gap-3">
{user ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(o => !o)}
                className="flex items-center gap-2 hover:bg-surface px-3 py-1.5 rounded-xl transition-colors border border-transparent hover:border-subtle"
              >
                {/* Gradient avatar */}
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg,#20D3B3,#3B82F6,#8B5CF6)' }}>
                  {initials}
                </div>
                <span className="text-sm font-semibold text-ink">{user.first_name}</span>
                <svg className="w-3.5 h-3.5 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
                </svg>
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl border border-subtle shadow-float py-1.5 animate-fadeIn">
                  <div className="px-4 py-2.5 border-b border-subtle">
                    <p className="text-xs font-bold text-ink">{user.first_name} {user.last_name}</p>
                    <p className="text-xs text-muted truncate">{user.email}</p>
                    <span className="inline-block mt-1 text-[10px] font-semibold bg-surface text-muted px-2 py-0.5 rounded-full uppercase tracking-wider">
                      {user.role}
                    </span>
                  </div>
                  {[
                    { href: user.role === 'agent' ? '/dashboard/agent' : '/dashboard', label: user.role === 'agent' ? 'Agent dashboard' : 'My dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
                    { href: '/dashboard/saved', label: 'Saved properties', icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' },
                    { href: '/account/settings', label: 'Account settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z' },
                  ].map(item => (
                    <Link key={item.href} href={item.href} onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-muted hover:text-ink hover:bg-surface transition-colors">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon}/>
                      </svg>
                      {item.label}
                    </Link>
                  ))}
                  <div className="border-t border-subtle mt-1 pt-1">
                    <button onClick={handleLogout}
                      className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                      </svg>
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              {/* Country Selector */}
          <select 
            value={country} 
            onChange={(e) => setCountry(e.target.value as Country)}
            className="text-sm bg-bg border border-subtle rounded-md px-2 py-1 text-ink outline-none"
          >
            {countries.map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          {/* Language Toggle (only show if Thailand) */}
          {country === 'Thailand' && (
            <div className="flex bg-bg rounded-md p-0.5 border border-subtle">
              <button 
                onClick={() => setLanguage('en')}
                className={`text-xs px-2 py-1 rounded-sm transition-colors ${language === 'en' ? 'bg-white shadow-sm text-ink font-semibold' : 'text-muted hover:text-ink'}`}
              >
                EN
              </button>
              <button 
                onClick={() => setLanguage('th')}
                className={`text-xs px-2 py-1 rounded-sm transition-colors ${language === 'th' ? 'bg-white shadow-sm text-ink font-semibold' : 'text-muted hover:text-ink'}`}
              >
                TH
              </button>
            </div>
          )}

              <Link href="/auth/sign-in"
                className="text-sm font-semibold text-ink2 hover:text-ink transition-colors">
                Sign in
              </Link>
              <Link href="/auth/register"
                className="text-sm font-semibold text-white px-4 py-2 rounded-xl transition-all hover:opacity-90 hover:shadow-glow"
                style={{ background: 'linear-gradient(135deg,#20D3B3,#3B82F6,#8B5CF6)' }}>
                Join free
              </Link>
            </>
          )}          
          
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden text-ink" onClick={() => setOpen(!open)}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {open
              ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
              : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/>
            }
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-white border-t border-subtle px-5 py-4 space-y-3">
          {['Buy','Rent','Sold','New Homes','Find Agents','Loans'].map(item => (
            <Link key={item} href="#" className="block text-sm text-muted font-medium">{item}</Link>
          ))}
          <div className="border-t border-subtle pt-3 space-y-2">
            {user ? (
              <>
                <p className="text-xs text-muted">Signed in as <strong>{user.email}</strong></p>
                <Link href="/dashboard" className="block text-sm font-medium text-ink">My dashboard</Link>
                <button onClick={handleLogout} className="block text-sm font-medium text-red-500">Sign out</button>
              </>
            ) : (
              <>
                <Link href="/auth/sign-in" className="block text-sm font-semibold text-ink">Sign in</Link>
                <Link href="/auth/register"
                  className="block text-white text-sm font-semibold px-4 py-2.5 rounded-xl text-center"
                  style={{ background: 'linear-gradient(135deg,#20D3B3,#3B82F6,#8B5CF6)' }}>
                  Join free
                </Link>
              </>
            )}
          </div>
           <div className="flex flex-col gap-2 mb-3 pb-3 border-b border-subtle">
             <label className="text-xs font-semibold text-muted uppercase">Location & Language</label>
             <select 
                value={country} 
                onChange={(e) => setCountry(e.target.value as Country)}
                className="text-sm bg-bg border border-subtle rounded-md px-2 py-2 text-ink outline-none w-full"
              >
                {countries.map(c => <option key={c} value={c}>{c}</option>)}
              </select>

             {country === 'Thailand' && (
               <div className="flex bg-bg rounded-md p-0.5 border border-subtle mt-1">
                  <button 
                    onClick={() => setLanguage('en')}
                    className={`flex-1 text-sm py-1.5 rounded-sm transition-colors ${language === 'en' ? 'bg-white shadow-sm text-ink font-semibold' : 'text-muted hover:text-ink'}`}
                  >English</button>
                  <button 
                    onClick={() => setLanguage('th')}
                    className={`flex-1 text-sm py-1.5 rounded-sm transition-colors ${language === 'th' ? 'bg-white shadow-sm text-ink font-semibold' : 'text-muted hover:text-ink'}`}
                  >ภาษาไทย</button>
               </div>
             )}
           </div>

          {['Buy','Rent','Sold','New Homes','Find Agents','Loans','Sign In'].map(item => (
            <Link key={item} href="#" className="block text-sm text-muted font-medium">{t(item)}</Link>
          ))}
          <Link href="#" className="block bg-ink text-white text-sm font-semibold px-4 py-2.5 rounded-lg text-center">{t('Join')}</Link>
        </div>
      )}
    </header>
  )
}
