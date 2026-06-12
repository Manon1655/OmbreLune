import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import React from 'react'
import { SubscriptionProvider, useSubscription } from '../context/SubscriptionContext'
import { AuthProvider } from '../context/AuthContext'

/* =========================
   MOCK AUTH (user connecté)
========================= */

const mockUser = { id: 1, email: 'test@test.com' }

vi.mock('../context/AuthContext', async () => {
  return {
    useAuth: () => ({ user: mockUser }),
    AuthProvider: ({ children }) => children
  }
})

/* =========================
   WRAPPER
========================= */

const wrapper = ({ children }) => (
  <AuthProvider>
    <SubscriptionProvider>{children}</SubscriptionProvider>
  </AuthProvider>
)

/* =========================
   DATA
========================= */

const planMensuel = { id: 1, name: 'Mensuel', price: 9.99, duration: 'monthly' }
const planAnnuel = { id: 2, name: 'Annuel', price: 79.99, duration: 'yearly' }

/* =========================
   RESET
========================= */

beforeEach(() => {
  vi.restoreAllMocks()
})


// =========================
// ÉTAT INITIAL
// =========================
describe('État initial', () => {

  it('démarre sans abonnement si API vide', async () => {

    vi.spyOn(global, 'fetch').mockResolvedValue({
      json: async () => null
    })

    const { result } = renderHook(() => useSubscription(), { wrapper })

    // attendre le useEffect
    await act(async () => {})

    expect(result.current.subscription).toBeNull()
  })

})


// =========================
// SUBSCRIBE
// =========================
describe('subscribe', () => {

  it('active un abonnement', async () => {

    vi.spyOn(global, 'fetch').mockResolvedValue({
      json: async () => planMensuel
    })

    const { result } = renderHook(() => useSubscription(), { wrapper })

    await act(async () => {
      await result.current.subscribe(planMensuel)
    })

    expect(result.current.subscription).toEqual(planMensuel)
  })

  it('remplace un abonnement existant', async () => {

    vi.spyOn(global, 'fetch').mockResolvedValue({
      json: async () => planAnnuel
    })

    const { result } = renderHook(() => useSubscription(), { wrapper })

    await act(async () => {
      await result.current.subscribe(planMensuel)
      await result.current.subscribe(planAnnuel)
    })

    expect(result.current.subscription).toEqual(planAnnuel)
  })

})


// =========================
// UNSUBSCRIBE
// =========================
describe('unsubscribe', () => {

  it('résilie un abonnement', async () => {

    vi.spyOn(global, 'fetch').mockResolvedValue({
      json: async () => null
    })

    const { result } = renderHook(() => useSubscription(), { wrapper })

    await act(async () => {
      await result.current.subscribe(planMensuel)
      await result.current.unsubscribe()
    })

    expect(result.current.subscription).toBeNull()
  })

  it('ne plante pas sans abonnement', async () => {

    vi.spyOn(global, 'fetch').mockResolvedValue({
      json: async () => null
    })

    const { result } = renderHook(() => useSubscription(), { wrapper })

    await act(async () => {
      await result.current.unsubscribe()
    })

    expect(result.current.subscription).toBeNull()
  })

})


// =========================
// RÉDUCTION
// =========================
describe('Réduction abonnement', () => {

  const applySubscriptionDiscount = (price, subscription) => {
    if (!subscription) return price
    return parseFloat((price * 0.9).toFixed(2))
  }

  it('applique -10%', () => {
    expect(applySubscriptionDiscount(24.9, planMensuel)).toBeCloseTo(22.41)
  })

  it('pas de réduction sans abonnement', () => {
    expect(applySubscriptionDiscount(24.9, null)).toBe(24.9)
  })

  it('fonctionne sur panier', () => {
    const panier = [
      { price: 18.9, quantity: 1 },
      { price: 24.9, quantity: 2 }
    ]

    const total = panier.reduce((sum, l) => sum + l.price * l.quantity, 0)
    const totalReduit = applySubscriptionDiscount(total, planAnnuel)

    expect(totalReduit).toBeCloseTo(61.83)
  })

})