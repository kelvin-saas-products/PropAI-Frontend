'use client'
import { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react'
import type { AuthUser } from '@/lib/types'
import { getMe, logout as apiLogout, refreshAccessToken } from '@/lib/auth'

interface AuthContextValue {
  user: AuthUser | null
  accessToken: string | null
  loading: boolean
  login: (token: string, user: AuthUser) => void
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

const TOKEN_KEY = 'propai_access_token'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser]               = useState<AuthUser | null>(null)
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [loading, setLoading]         = useState(true)
  const refreshTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Schedule a silent token refresh before expiry
  const scheduleRefresh = useCallback((expiresInSeconds: number) => {
    if (refreshTimer.current) clearTimeout(refreshTimer.current)
    const ms = (expiresInSeconds - 60) * 1000 // refresh 60s before expiry
    if (ms <= 0) return
    refreshTimer.current = setTimeout(async () => {
      try {
        const res = await refreshAccessToken()
        setAccessToken(res.access_token)
        setUser(res.user)
        sessionStorage.setItem(TOKEN_KEY, res.access_token)
        scheduleRefresh(res.expires_in)
      } catch {
        // Refresh failed — user needs to log in again
        setUser(null)
        setAccessToken(null)
        sessionStorage.removeItem(TOKEN_KEY)
      }
    }, ms)
  }, [])

  // On mount: try to restore session via refresh token cookie
  useEffect(() => {
    async function restore() {
      const stored = sessionStorage.getItem(TOKEN_KEY)
      if (stored) {
        try {
          const profile = await getMe(stored)
          setUser(profile)
          setAccessToken(stored)
          scheduleRefresh(14 * 60) // assume ~14 min remaining
        } catch {
          // Stored token expired — try silent refresh
          try {
            const res = await refreshAccessToken()
            setUser(res.user)
            setAccessToken(res.access_token)
            sessionStorage.setItem(TOKEN_KEY, res.access_token)
            scheduleRefresh(res.expires_in)
          } catch {
            sessionStorage.removeItem(TOKEN_KEY)
          }
        }
      } else {
        try {
          const res = await refreshAccessToken()
          setUser(res.user)
          setAccessToken(res.access_token)
          sessionStorage.setItem(TOKEN_KEY, res.access_token)
          scheduleRefresh(res.expires_in)
        } catch {
          sessionStorage.removeItem(TOKEN_KEY)
        }
      }
      setLoading(false)
    }
    restore()
    return () => { if (refreshTimer.current) clearTimeout(refreshTimer.current) }
  }, [scheduleRefresh])

  const login = useCallback((token: string, userData: AuthUser) => {
    setAccessToken(token)
    setUser(userData)
    sessionStorage.setItem(TOKEN_KEY, token)
    scheduleRefresh(14 * 60)
  }, [scheduleRefresh])

  const logout = useCallback(async () => {
    if (accessToken) {
      await apiLogout(accessToken).catch(() => {})
    }
    setUser(null)
    setAccessToken(null)
    sessionStorage.removeItem(TOKEN_KEY)
    if (refreshTimer.current) clearTimeout(refreshTimer.current)
  }, [accessToken])

  const refreshUser = useCallback(async () => {
    if (!accessToken) return
    const profile = await getMe(accessToken)
    setUser(profile)
  }, [accessToken])

  return (
    <AuthContext.Provider value={{ user, accessToken, loading, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
