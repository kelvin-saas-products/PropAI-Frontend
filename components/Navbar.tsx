'use client'
import Link from 'next/link'
import { useState } from 'react'
import { useI18n, Country } from '@/lib/i18n'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { country, setCountry, language, setLanguage, t } = useI18n()

  const countries: Country[] = ['Australia', 'Thailand', 'Philippines']

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-subtle">
      <div className="max-w-7xl mx-auto px-5 lg:px-8 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-ink text-lg tracking-tight">
          <span className="w-8 h-8 bg-ink rounded-lg flex items-center justify-center text-white text-sm font-bold">P</span>
          PropAI
        </Link>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-7">
          {['Buy','Rent','Sold','New Homes','Find Agents','Loans'].map(item => (
            <Link key={item} href="#" className="text-sm text-muted hover:text-ink font-medium transition-colors">{t(item)}</Link>
          ))}
        </nav>

        {/* Auth & Settings */}
        <div className="hidden md:flex items-center gap-3">
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

          <Link href="#" className="text-sm font-medium text-ink hover:text-muted transition-colors">{t('Sign In')}</Link>
          <Link href="#" className="bg-ink text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-ink/80 transition-colors">{t('Join')}</Link>
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden text-ink" onClick={() => setOpen(!open)}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {open ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/>}
          </svg>
        </button>
      </div>
      {open && (
        <div className="md:hidden bg-white border-t border-subtle px-5 py-4 space-y-3">
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
