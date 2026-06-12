import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import React from 'react'
import { AuthProvider, useAuth } from '../context/AuthContext'

const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>

const utilisateur = { email: 'alice@example.com', password: '1234' }

/* =========================
   MOCK JWT
========================= */

function createFakeToken(payload) {
  const base64 = (obj) => btoa(JSON.stringify(obj))
  return `header.${base64(payload)}.signature`
}

/* =========================
   RESET
========================= */

beforeEach(() => {
  localStorage.clear()
  vi.restoreAllMocks()
})

/* =========================
   État initial
========================= */

describe('État initial', () => {
  it('démarre sans utilisateur connecté', () => {
    const { result } = renderHook(() => useAuth(), { wrapper })
    expect(result.current.user).toBeNull()
  })

  it('restaure l’utilisateur depuis le token', () => {
    const token = createFakeToken({
      id: 1,
      email: 'alice@example.com',
      role: 'user',
      exp: Date.now() / 1000 + 1000
    })

    localStorage.setItem('token', token)

    const { result } = renderHook(() => useAuth(), { wrapper })

    expect(result.current.user).not.toBeNull()
    expect(result.current.user.email).toBe('alice@example.com')
  })
})

/* =========================
   LOGIN
========================= */

describe('login', () => {
  it('connecte un utilisateur', async () => {

    const fakeToken = createFakeToken({
      id: 1,
      email: 'alice@example.com',
      role: 'user',
      exp: Date.now() / 1000 + 1000
    })

    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({ token: fakeToken })
    })

    const { result } = renderHook(() => useAuth(), { wrapper })

    await act(async () => {
      await result.current.login(utilisateur)
    })

    expect(result.current.user).not.toBeNull()
    expect(result.current.user.email).toBe('alice@example.com')
  })

  it('sauvegarde le token dans le localStorage', async () => {

    const fakeToken = createFakeToken({
      id: 1,
      email: 'alice@example.com',
      role: 'user',
      exp: Date.now() / 1000 + 1000
    })

    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({ token: fakeToken })
    })

    const { result } = renderHook(() => useAuth(), { wrapper })

    await act(async () => {
      await result.current.login(utilisateur)
    })

    expect(localStorage.getItem('token')).toBe(fakeToken)
  })
})

/* =========================
   REGISTER
========================= */

describe('register', () => {
  it('inscrit et connecte un utilisateur', async () => {

    const fakeToken = createFakeToken({
      id: 1,
      email: 'alice@example.com',
      role: 'user',
      exp: Date.now() / 1000 + 1000
    })

    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({ token: fakeToken })
    })

    const { result } = renderHook(() => useAuth(), { wrapper })

    await act(async () => {
      await result.current.register(utilisateur)
    })

    expect(result.current.user).not.toBeNull()
    expect(result.current.user.email).toBe('alice@example.com')
  })
})

/* =========================
   LOGOUT
========================= */

describe('logout', () => {
  it('déconnecte l’utilisateur', async () => {

    const { result } = renderHook(() => useAuth(), { wrapper })

    act(() => {
      result.current.logout()
    })

    expect(result.current.user).toBeNull()
  })

  it('supprime le token du localStorage', () => {

    localStorage.setItem('token', 'fake')

    const { result } = renderHook(() => useAuth(), { wrapper })

    act(() => {
      result.current.logout()
    })

    expect(localStorage.getItem('token')).toBeNull()
  })
})

/* =========================
   useAuth hors provider
========================= */

describe('useAuth hors AuthProvider', () => {
  it('lève une erreur', () => {
    expect(() => renderHook(() => useAuth())).toThrow()
  })
})