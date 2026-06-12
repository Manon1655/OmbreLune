/**
 * Tests unitaires — CartContext (cart + favorites + orders)
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import React from 'react'
import { CartProvider, useCart } from '../context/CartContext'

beforeEach(() => {
  localStorage.clear()
})

const wrapper = ({ children }) => <CartProvider>{children}</CartProvider>

// DATA
const livreA = { id: 1, title: "L'Alchimiste", author: 'Paulo Coelho', price: 18.9 }
const livreB = { id: 2, title: 'Dune', author: 'Frank Herbert', price: 24.9 }
const livreC = { id: 3, title: 'LOTR', author: 'Tolkien', price: 32.9 }


// =========================
// CART
// =========================
describe('Cart', () => {

  it('ajoute un livre', () => {
    const { result } = renderHook(() => useCart(), { wrapper })

    act(() => result.current.addToCart(livreA))

    expect(result.current.cart).toHaveLength(1)
  })

  it('n’ajoute pas de doublon', () => {
    const { result } = renderHook(() => useCart(), { wrapper })

    act(() => {
      result.current.addToCart(livreA)
      result.current.addToCart(livreA)
    })

    expect(result.current.cart).toHaveLength(1)
  })

  it('retire un livre', () => {
    const { result } = renderHook(() => useCart(), { wrapper })

    act(() => {
      result.current.addToCart(livreA)
      result.current.removeFromCart(livreA.id)
    })

    expect(result.current.cart).toHaveLength(0)
  })

  it('vide le panier', () => {
    const { result } = renderHook(() => useCart(), { wrapper })

    act(() => {
      result.current.addToCart(livreA)
      result.current.addToCart(livreB)
      result.current.clearCart()
    })

    expect(result.current.cart).toHaveLength(0)
  })

})


// =========================
// CART TOTAL / COUNT
// =========================
describe('Cart calculs', () => {

  it('compte le nombre d’articles', () => {
    const { result } = renderHook(() => useCart(), { wrapper })

    act(() => {
      result.current.addToCart(livreA)
      result.current.addToCart(livreB)
    })

    expect(result.current.cartCount).toBe(2)
  })

  it('calcule le total', () => {
    const { result } = renderHook(() => useCart(), { wrapper })

    act(() => {
      result.current.addToCart(livreA)
      result.current.addToCart(livreB)
    })

    expect(result.current.cartTotal).toBeCloseTo(43.8)
  })

  it('retourne 0 si panier vide', () => {
    const { result } = renderHook(() => useCart(), { wrapper })

    expect(result.current.cartTotal).toBe(0)
  })

})


// =========================
// FAVORITES
// =========================
describe('Favorites', () => {

  it('ajoute un favori', () => {
    const { result } = renderHook(() => useCart(), { wrapper })

    act(() => result.current.addToFavorites(livreA))

    expect(result.current.favorites).toHaveLength(1)
  })

  it('toggle : retire si déjà présent', () => {
    const { result } = renderHook(() => useCart(), { wrapper })

    act(() => {
      result.current.addToFavorites(livreA)
      result.current.addToFavorites(livreA)
    })

    expect(result.current.favorites).toHaveLength(0)
  })

  it('isFavorite fonctionne', () => {
    const { result } = renderHook(() => useCart(), { wrapper })

    act(() => result.current.addToFavorites(livreA))

    expect(result.current.isFavorite(livreA.id)).toBe(true)
  })

  it('removeFromFavorites fonctionne', () => {
    const { result } = renderHook(() => useCart(), { wrapper })

    act(() => {
      result.current.addToFavorites(livreA)
      result.current.removeFromFavorites(livreA.id)
    })

    expect(result.current.favorites).toHaveLength(0)
  })

})


// =========================
// ORDERS
// =========================
describe('Orders', () => {

  it('ajoute une commande', () => {
    const { result } = renderHook(() => useCart(), { wrapper })

    act(() => {
      result.current.addToCart(livreA)
    })

    let order
    act(() => {
      order = result.current.addOrder(result.current.cart, result.current.cartTotal)
    })

    expect(result.current.orders).toHaveLength(1)
    expect(order.total).toBeCloseTo(18.9)
  })

  it('structure de la commande correcte', () => {
    const { result } = renderHook(() => useCart(), { wrapper })

    act(() => result.current.addToCart(livreA))

    let order
    act(() => {
      order = result.current.addOrder(result.current.cart, result.current.cartTotal)
    })

    expect(order).toHaveProperty('id')
    expect(order).toHaveProperty('created_at')
    expect(order).toHaveProperty('items')
  })

  it('clearOrders fonctionne', () => {
    const { result } = renderHook(() => useCart(), { wrapper })

    act(() => {
      result.current.addToCart(livreA)
      result.current.addOrder(result.current.cart, result.current.cartTotal)
      result.current.clearOrders()
    })

    expect(result.current.orders).toHaveLength(0)
  })

})


// =========================
// LOCALSTORAGE
// =========================
describe('LocalStorage', () => {

  it('sauvegarde le panier', () => {
    const { result } = renderHook(() => useCart(), { wrapper })

    act(() => result.current.addToCart(livreA))

    const stored = JSON.parse(localStorage.getItem('cart'))
    expect(stored).toHaveLength(1)
  })

  it('restaure le panier', () => {
    localStorage.setItem('cart', JSON.stringify([livreA]))

    const { result } = renderHook(() => useCart(), { wrapper })

    expect(result.current.cart).toHaveLength(1)
  })

})