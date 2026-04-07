'use client'
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { getCountryFromIp } from './api'

export type Country = 'Australia' | 'Thailand' | 'Philippines'
export type Language = 'en' | 'th'

const SUPPORTED_COUNTRIES: Country[] = ['Australia', 'Thailand', 'Philippines']
const STORAGE_KEY = 'propai_country'

function readCountryFromUrl(): Country | null {
  if (typeof window === 'undefined') return null

  const params = new URLSearchParams(window.location.search)
  const country = params.get('country')

  if (country && SUPPORTED_COUNTRIES.includes(country as Country)) {
    return country as Country
  }

  return null
}

interface I18nContextProps {
  country: Country
  setCountry: (c: Country) => void
  language: Language
  setLanguage: (l: Language) => void
  t: (key: string) => string
  countryReady: boolean
}

const translations: Record<Language, Record<string, string>> = {
  en: {},
  th: {
    'Buy': 'ซื้อ',
    'Rent': 'เช่า',
    'Sold': 'ขายแล้ว',
    'New Homes': 'บ้านใหม่',
    'Find Agents': 'ค้นหาตัวแทน',
    'Loans': 'สินเชื่อ',
    'Sign In': 'เข้าสู่ระบบ',
    'Join': 'เข้าร่วม',
    'All': 'ทั้งหมด',
    'No properties in this category.': 'ไม่มีอสังหาริมทรัพย์ในหมวดหมู่นี้',
    'Sell': 'ขาย',
    'Insights': 'ข้อมูลเชิงลึก',
    'Privacy': 'ความเป็นส่วนตัว',
    'Terms': 'ข้อกำหนด',
    'AI-Powered Property Search': 'ค้นหาอสังหาริมทรัพย์ด้วย AI',
    'Find Your Dream Home With AI Intelligence': 'ค้นหาบ้านในฝันของคุณด้วยความฉลาดของ AI',
    'Search': 'ค้นหา',
    'Browse Listings': 'ดูรายการอสังหา',
  }
}

const I18nContext = createContext<I18nContextProps | undefined>(undefined)

export function I18nProvider({ children }: { children: ReactNode }) {
  const [country, setCountryState] = useState<Country>('Australia')
  const [language, setLanguage] = useState<Language>('en')
  const [countryReady, setCountryReady] = useState(false)

  useEffect(() => {
    async function init() {
      const urlCountry = readCountryFromUrl()
      if (urlCountry) {
        setCountryState(urlCountry)
        setCountryReady(true)
        return
      }

      const saved = typeof window !== 'undefined'
        ? localStorage.getItem(STORAGE_KEY)
        : null

      if (saved && SUPPORTED_COUNTRIES.includes(saved as Country)) {
        setCountryState(saved as Country)
        setCountryReady(true)
        return
      }

      try {
        const geo = await getCountryFromIp()
        if (SUPPORTED_COUNTRIES.includes(geo.country as Country)) {
          setCountryState(geo.country as Country)
        }
      } catch {
        // Keep the default when geo lookup is unavailable.
      } finally {
        setCountryReady(true)
      }
    }

    void init()
  }, [])

  const setCountry = (newCountry: Country) => {
    setCountryState(newCountry)
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, newCountry)
    }
    if (newCountry !== 'Thailand' && language === 'th') {
      setLanguage('en')
    }
  }

  const t = (key: string) => {
    if (language === 'en') return key
    return translations[language]?.[key] || key
  }

  return (
    <I18nContext.Provider value={{ country, setCountry, language, setLanguage, t, countryReady }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (!context) throw new Error('useI18n must be used within an I18nProvider')
  return context
}

export function T({ k }: { k: string }) {
  const { t } = useI18n()
  return <>{t(k)}</>
}
