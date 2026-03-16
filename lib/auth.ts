import type { AuthUser, TokenResponse, BuyerPreferences, AgentProfile } from './types'

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000'

async function authFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options.headers },
    credentials: 'include', // send httpOnly refresh token cookie
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body?.detail ?? `Request failed: ${res.status}`)
  }
  return res.json()
}

// ── Registration ───────────────────────────────────────────────────
export async function registerBuyer(data: {
  email: string
  password: string
  first_name: string
  last_name: string
  phone?: string
  role: 'buyer' | 'owner' | 'investor'
  preferences?: Partial<BuyerPreferences>
}): Promise<{ message: string }> {
  return authFetch('/auth/register/buyer', { method: 'POST', body: JSON.stringify(data) })
}

export async function registerAgent(data: {
  email: string
  password: string
  first_name: string
  last_name: string
  phone?: string
  agent_profile: Partial<AgentProfile>
}): Promise<{ message: string }> {
  return authFetch('/auth/register/agent', { method: 'POST', body: JSON.stringify(data) })
}

// ── Login / logout ─────────────────────────────────────────────────
export async function login(email: string, password: string): Promise<TokenResponse> {
  return authFetch('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) })
}

export async function logout(accessToken: string): Promise<void> {
  await authFetch('/auth/logout', {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}` },
  })
}

export async function refreshAccessToken(): Promise<TokenResponse> {
  return authFetch('/auth/refresh', { method: 'POST' })
}

// ── Profile ────────────────────────────────────────────────────────
export async function getMe(accessToken: string): Promise<AuthUser> {
  return authFetch('/auth/me', {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
}

// ── Email verification ─────────────────────────────────────────────
export async function verifyEmail(token: string): Promise<{ message: string }> {
  return authFetch(`/auth/verify-email?token=${encodeURIComponent(token)}`, { method: 'POST' })
}

export async function resendVerification(email: string): Promise<{ message: string }> {
  return authFetch('/auth/resend-verification', { method: 'POST', body: JSON.stringify({ email }) })
}

// ── Password reset ─────────────────────────────────────────────────
export async function requestPasswordReset(email: string): Promise<{ message: string }> {
  return authFetch('/auth/password-reset', { method: 'POST', body: JSON.stringify({ email }) })
}

export async function confirmPasswordReset(token: string, new_password: string): Promise<{ message: string }> {
  return authFetch('/auth/password-reset/confirm', { method: 'POST', body: JSON.stringify({ token, new_password }) })
}

export async function changePassword(
  accessToken: string,
  current_password: string,
  new_password: string,
): Promise<{ message: string }> {
  return authFetch('/auth/password', {
    method: 'PUT',
    headers: { Authorization: `Bearer ${accessToken}` },
    body: JSON.stringify({ current_password, new_password }),
  })
}

// ── Password strength (client-side mirror of backend rules) ───────
export function validatePasswordStrength(password: string): string[] {
  const rules: [RegExp, string][] = [
    [/.{8,}/,                   'At least 8 characters'],
    [/[A-Z]/,                   'At least one uppercase letter'],
    [/[a-z]/,                   'At least one lowercase letter'],
    [/\d/,                      'At least one number'],
    [/[!@#$%^&*(),.?":{}|<>]/, 'At least one special character'],
  ]
  return rules.filter(([re]) => !re.test(password)).map(([, msg]) => msg)
}
