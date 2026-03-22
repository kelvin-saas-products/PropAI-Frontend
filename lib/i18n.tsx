'use client'
import React, { createContext, useContext, useState, ReactNode } from 'react'

export type Country = 'Australia' | 'Thailand' | 'Philippines'
export type Language = 'en' | 'th'

interface I18nContextProps {
  country: Country
  setCountry: (c: Country) => void
  language: Language
  setLanguage: (l: Language) => void
  t: (key: string) => string
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
    'Discover properties that match your lifestyle, budget, and aspirations. Our AI analyses thousands of data points to find your perfect match.': 'ค้นพบอสังหาริมทรัพย์ที่ตรงกับไลฟ์สไตล์ งบประมาณ และความปรารถนาของคุณ AI ของเราวิเคราะห์ข้อมูลหลายพันจุดเพื่อหาคู่ที่สมบูรณ์แบบของคุณ',
    'Describe your ideal home...': 'บรรยายบ้านในอุดมคติของคุณ...',
    'Search': 'ค้นหา',
    '3-bedroom family home near good schools': 'บ้านสำหรับครอบครัว 3 ห้องนอนใกล้โรงเรียนดีๆ',
    'Modern apartment with city views under $800k': 'อพาร์ตเมนต์ทันสมัยพร้อมวิวเมืองราคาต่ำกว่า 800k',
    'Investment property with high rental yield': 'อสังหาริมทรัพย์เพื่อการลงทุนที่ให้ผลตอบแทนสูง',
    'Beach house with pool for weekend getaways': 'บ้านริมหาดพร้อมสระว่ายน้ำสำหรับวันหยุดพักผ่อน',
    'Properties': 'อสังหาริมทรัพย์',
    'Match Accuracy': 'ความแม่นยำในการจับคู่',
    'In Sales': 'ในยอดขาย',
    'AI Match': 'การจับคู่ด้วย AI',
    '98% Accuracy': 'ความแม่นยำ 98%',
    'New Listing': 'รายการใหม่',
    'Just added today': 'เพิ่งเพิ่มวันนี้',
    'How PropAI Works': 'PropAI ทำงานอย่างไร',
    'Three simple steps to your perfect property': 'สามขั้นตอนง่ายๆ สู่บ้านที่สมบูรณ์แบบของคุณ',
    'Describe Your Vision': 'บรรยายวิสัยทัศน์ของคุณ',
    "Tell our AI what you're looking for in natural language. 'A 3-bedroom family home near good schools with a garden.'": "บอก AI ของเราถึงสิ่งที่คุณกำลังมองหาด้วยภาษาธรรมชาติ 'บ้านสำหรับครอบครัว 3 ห้องนอนใกล้โรงเรียนดีๆ พร้อมสวน'",
    'Get AI Matches': 'รับการจับคู่จาก AI',
    'Our algorithm analyses 50+ factors across thousands of properties to find your perfect matches with 98% accuracy.': 'อัลกอริทึมของเราวิเคราะห์ปัจจัยกว่า 50+ ประการในอสังหาริมทรัพย์หลายพันแห่งเพื่อหาคู่ที่สมบูรณ์แบบของคุณด้วยความแม่นยำ 98%',
    'Make Informed Decisions': 'ตัดสินใจอย่างรอบรู้',
    'Access detailed insights on suburbs, schools, growth potential, and market trends to buy with confidence.': 'เข้าถึงข้อมูลเชิงลึกเกี่ยวกับย่านธุรกิจ โรงเรียน ศักยภาพการเติบโต และแนวโน้มตลาดเพื่อซื้ออย่างมั่นใจ',
    'AI Technology': 'เทคโนโลยี AI',
    'AI-Powered Intelligence': 'ความฉลาดด้วย AI',
    'Technology that understands what you need': 'เทคโนโลยีที่เข้าใจสิ่งที่คุณต้องการ',
    'Natural Language Search': 'การค้นหาด้วยภาษาธรรมชาติ',
    "Search like you're talking to a friend. No more complicated filters.": 'ค้นหาเหมือนคุณกำลังคุยกับเพื่อน ไม่มีฟิลเตอร์ที่ซับซ้อนอีกต่อไป',
    'Smart Matching Algorithm': 'อัลกอริทึมการจับคู่อัจฉริยะ',
    "Our AI learns your preferences and finds properties you'll love.": 'AI ของเราเรียนรู้ความชอบของคุณและค้นหาบ้านที่คุณจะรัก',
    'Predictive Analytics': 'การวิเคราะห์เชิงพยากรณ์',
    'Get ahead of the market with AI-driven price and growth forecasts.': 'นำหน้าตลาดด้วยการคาดการณ์ราคาและการเติบโตที่ขับเคลื่อนด้วย AI',
    'Vision Analysis': 'การวิเคราะห์ภาพ',
    'AI scans every photo to surface features the seller forgot to mention.': 'AI สแกนทุกภาพถ่ายเพื่อค้นหาคุณลักษณะที่ผู้ขายลืมพูดถึง',
    'Price Prediction': 'การคาดการณ์ราคา',
    'Growth forecast': 'แนวโน้มการเติบโต',
    'School Rating': 'เรตติ้งโรงเรียน',
    'Nearby schools': 'โรงเรียนใกล้เคียง',
    'Featured Properties': 'อสังหาริมทรัพย์แนะนำ',
    'Handpicked homes matched by our AI': 'บ้านที่คัดสรรมาตรงกับการจับคู่โดย AI ของเรา',
    'View All Properties →': 'ดูอสังหาริมทรัพย์ทั้งหมด →',
    'Market Insights': 'ข้อมูลเชิงลึกตลาด',
    'Data-driven intelligence for smarter decisions': 'ความฉลาดที่ขับเคลื่อนด้วยข้อมูลเพื่อการตัดสินใจที่ฉลาดขึ้น',
    'Avg. Annual Growth': 'การเติบโตเฉลี่ยรายปี',
    'New Listings This Week': 'รายการใหม่สัปดาห์นี้',
    'Hot Suburbs Identified': 'ระบุย่านขายดี',
    'Trending Suburbs': 'ทำเลยอดฮิต',
    'Median': 'ค่ากลาง',
    'Yield': 'ผลตอบแทน',
    'Safety': 'ความปลอดภัย',
    'Ready to find your perfect home?': 'พร้อมที่จะค้นหาบ้านที่สมบูรณ์แบบของคุณหรือยัง?',
    'Join 50,000+ Australians who found their home with PropAI': 'ร่วมกับชาวออสเตรเลียกว่า 50,000 คนที่พบจดหมกับ PropAI',
    'Start AI Search': 'เริ่มค้นหาด้วย AI',
    'Browse Listings': 'ดูรายการอสังหา',
  }
}

const I18nContext = createContext<I18nContextProps | undefined>(undefined)

export function I18nProvider({ children }: { children: ReactNode }) {
  const [country, setCountry] = useState<Country>('Australia')
  const [language, setLanguage] = useState<Language>('en')

  // Automatically switch to English if country is changed from Thailand to another
  const handleSetCountry = (newCountry: Country) => {
    setCountry(newCountry)
    if (newCountry !== 'Thailand' && language === 'th') {
      setLanguage('en')
    }
  }

  const t = (key: string) => {
    if (language === 'en') return key
    return translations[language]?.[key] || key
  }

  return (
    <I18nContext.Provider value={{ country, setCountry: handleSetCountry, language, setLanguage, t }}>
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
