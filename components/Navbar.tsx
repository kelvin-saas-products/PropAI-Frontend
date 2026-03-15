'use client'
import Link from 'next/link'
import { useState } from 'react'

export default function Navbar() {
  const [open, setOpen] = useState(false)
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
            <Link key={item} href="#" className="text-sm text-muted hover:text-ink font-medium transition-colors">{item}</Link>
          ))}
        </nav>

        {/* Auth */}
        <div className="hidden md:flex items-center gap-3">
          <Link href="#" className="text-sm font-medium text-ink hover:text-muted transition-colors">Sign In</Link>
          <Link href="#" className="bg-ink text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-ink/80 transition-colors">Join</Link>
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
          {['Buy','Rent','Sold','New Homes','Find Agents','Loans','Sign In'].map(item => (
            <Link key={item} href="#" className="block text-sm text-muted font-medium">{item}</Link>
          ))}
          <Link href="#" className="block bg-ink text-white text-sm font-semibold px-4 py-2.5 rounded-lg text-center">Join</Link>
        </div>
      )}
    </header>
  )
}
