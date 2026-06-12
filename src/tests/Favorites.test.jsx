/**
 * Tests unitaires — Favoris (CartContext → favorites)
 *
 * Chemin du fichier à tester : src/contexts/CartContext.jsx
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import React from 'react'
import { CartProvider, useCart } from '../context/CartContext'

beforeEach(() => {
  localStorage.clear()
})

const wrapper = ({ children }) => <CartProvider>{children}</CartProvider>

const livreA = { id: 1, title: "L'Alchimiste", author: 'Paulo Coelho', price: 18.9 }
const livreB = { id: 2, title: 'Dune',          author: 'Frank Herbert', price: 24.9 }


// ─── addToFavorites ───────────────────────────────────────────────────────────
describe('addToFavorites', () => {
  it('ajoute un livre aux favoris', () => {
    const { result } = renderHook(() => useCart(), { wrapper })

    act(() => { result.current.addToFavorites(livreA) })

    expect(result.current.favorites).toHaveLength(1)
    expect(result.current.favorites[0].id).toBe(livreA.id)
  })

  it('ajoute plusieurs livres différents aux favoris', () => {
    const { result } = renderHook(() => useCart(), { wrapper })

    act(() => {
      result.current.addToFavorites(livreA)
      result.current.addToFavorites(livreB)
    })

    expect(result.current.favorites).toHaveLength(2)
  })

  it('retire le livre si déjà en favori (comportement toggle)', () => {
    const { result } = renderHook(() => useCart(), { wrapper })

    act(() => {
      result.current.addToFavorites(livreA)
      result.current.addToFavorites(livreA) // deuxième appel = toggle = retire
    })

    expect(result.current.favorites).toHaveLength(0)
  })

  it('sauvegarde les favoris dans le localStorage', () => {
    const { result } = renderHook(() => useCart(), { wrapper })

    act(() => { result.current.addToFavorites(livreA) })

    const stored = JSON.parse(localStorage.getItem('favorites'))
    expect(stored).toHaveLength(1)
    expect(stored[0].id).toBe(livreA.id)
  })
})


// ─── removeFromFavorites ──────────────────────────────────────────────────────
describe('removeFromFavorites', () => {
  it('retire un livre des favoris', () => {
    const { result } = renderHook(() => useCart(), { wrapper })

    act(() => {
      result.current.addToFavorites(livreA)
      result.current.addToFavorites(livreB)
      result.current.removeFromFavorites(livreA.id)
    })

    expect(result.current.favorites).toHaveLength(1)
    expect(result.current.favorites[0].id).toBe(livreB.id)
  })

  it('met à jour le localStorage après suppression', () => {
    const { result } = renderHook(() => useCart(), { wrapper })

    act(() => {
      result.current.addToFavorites(livreA)
      result.current.removeFromFavorites(livreA.id)
    })

    const stored = JSON.parse(localStorage.getItem('favorites'))
    expect(stored).toHaveLength(0)
  })

  it('ne fait rien si l\'id n\'existe pas dans les favoris', () => {
    const { result } = renderHook(() => useCart(), { wrapper })

    act(() => {
      result.current.addToFavorites(livreA)
      result.current.removeFromFavorites(999)
    })

    expect(result.current.favorites).toHaveLength(1)
  })
})


// ─── isFavorite ───────────────────────────────────────────────────────────────
describe('isFavorite', () => {
  it('retourne true si le livre est en favori', () => {
    const { result } = renderHook(() => useCart(), { wrapper })

    act(() => { result.current.addToFavorites(livreA) })

    expect(result.current.isFavorite(livreA.id)).toBe(true)
  })

  it('retourne false si le livre n\'est pas en favori', () => {
    const { result } = renderHook(() => useCart(), { wrapper })

    expect(result.current.isFavorite(livreA.id)).toBe(false)
  })

  it('retourne false après suppression du favori', () => {
    const { result } = renderHook(() => useCart(), { wrapper })

    act(() => {
      result.current.addToFavorites(livreA)
      result.current.removeFromFavorites(livreA.id)
    })

    expect(result.current.isFavorite(livreA.id)).toBe(false)
  })
})


// ─── Persistance localStorage ─────────────────────────────────────────────────
describe('Persistance des favoris (localStorage)', () => {
  it('restaure les favoris depuis le localStorage au montage', () => {
    localStorage.setItem('favorites', JSON.stringify([livreA]))

    const { result } = renderHook(() => useCart(), { wrapper })

    expect(result.current.favorites).toHaveLength(1)
    expect(result.current.isFavorite(livreA.id)).toBe(true)
  })
})