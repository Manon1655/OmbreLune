/**
 * Tests unitaires — Catalogue de livres
 *
 * Ces tests vérifient la logique de filtrage, recherche et tri
 * telle qu'elle est utilisée dans les pages Library / Home.
 *
 * Aucun import de composant requis ici — on teste les fonctions pures.
 */

import { describe, it, expect } from 'vitest'

// ─── Catalogue de test (extrait de books.json) ────────────────────────────────
const LIVRES = [
  { id: 1,  title: "L'Alchimiste",            author: 'Paulo Coelho',   price: 18.9,  originalPrice: 22.9,  category: 'Roman',          rating: 4.5, reviews: 2341, isBestseller: true  },
  { id: 2,  title: 'Dune',                     author: 'Frank Herbert',  price: 24.9,  originalPrice: 24.9,  category: 'Science-Fiction', rating: 5,   reviews: 1567, isBestseller: true  },
  { id: 3,  title: 'Le Seigneur des Anneaux',  author: 'J.R.R. Tolkien', price: 32.9,  originalPrice: 39.9,  category: 'Fantasy',         rating: 5,   reviews: 6789, isBestseller: true  },
  { id: 4,  title: 'Orgueil & Préjugés',       author: 'Jane Austen',    price: 15.5,  originalPrice: 15.5,  category: 'Classique',       rating: 4.5, reviews: 1200, isBestseller: false },
  { id: 5,  title: 'Harry Potter',             author: 'J.K. Rowling',   price: 15.99, originalPrice: 15.99, category: 'Fantasy',         rating: 4.8, reviews: 5432, isBestseller: false },
  { id: 6,  title: 'The Prince',               author: 'N. Machiavel',   price: 15.5,  originalPrice: 15.5,  category: 'Classique',       rating: 4.5, reviews: 1200, isBestseller: false },
  { id: 7,  title: 'Stupore e Tremori',        author: 'Amélie Nothomb', price: 13.9,  originalPrice: 13.9,  category: 'Roman',           rating: 4,   reviews: 987,  isBestseller: false },
  { id: 8,  title: 'Gone Girl',                author: 'Gillian Flynn',  price: 21.9,  originalPrice: 21.9,  category: 'Thriller',        rating: 4.5, reviews: 892,  isBestseller: false },
  { id: 9,  title: '1984',                     author: 'George Orwell',  price: 12.99, originalPrice: 12.99, category: 'Classique',       rating: 4.7, reviews: 3421, isBestseller: false },
  { id: 10, title: 'Le Comte de Monte-Cristo', author: 'Alexandre Dumas',price: 19.9,  originalPrice: 24.9,  category: 'Classique',       rating: 4.8, reviews: 4120, isBestseller: false },
]

// ─── Fonctions utilitaires (à extraire dans src/utils/bookUtils.js) ───────────
const filterByCategory  = (livres, cat)     => cat ? livres.filter(l => l.category === cat) : livres
const filterBestsellers = (livres)           => livres.filter(l => l.isBestseller)
const searchBooks       = (livres, query)    => {
  const q = query.toLowerCase().trim()
  if (!q) return livres
  return livres.filter(l =>
    l.title.toLowerCase().includes(q) ||
    l.author.toLowerCase().includes(q)
  )
}
const sortByPrice       = (livres, asc = true)  => [...livres].sort((a, b) => asc ? a.price - b.price : b.price - a.price)
const sortByRating      = (livres)               => [...livres].sort((a, b) => b.rating  - a.rating)
const sortByReviews     = (livres)               => [...livres].sort((a, b) => b.reviews - a.reviews)
const hasDiscount       = (livre)                => livre.price < livre.originalPrice
const discountPercent   = (livre)                => Math.round((1 - livre.price / livre.originalPrice) * 100)


// ─── Filtrage par catégorie ───────────────────────────────────────────────────
describe('filterByCategory', () => {
  it('retourne tous les livres si aucune catégorie', () => {
    expect(filterByCategory(LIVRES, '')).toHaveLength(LIVRES.length)
  })

  it('filtre les livres "Fantasy"', () => {
    const result = filterByCategory(LIVRES, 'Fantasy')
    expect(result).toHaveLength(2)
    result.forEach(l => expect(l.category).toBe('Fantasy'))
  })

  it('filtre les livres "Classique"', () => {
    const result = filterByCategory(LIVRES, 'Classique')
    expect(result).toHaveLength(4)
  })

  it('retourne un tableau vide si catégorie inconnue', () => {
    expect(filterByCategory(LIVRES, 'Manga')).toHaveLength(0)
  })
})


// ─── Filtrage bestsellers ─────────────────────────────────────────────────────
describe('filterBestsellers', () => {
  it('retourne uniquement les bestsellers', () => {
    const result = filterBestsellers(LIVRES)
    expect(result.length).toBeGreaterThan(0)
    result.forEach(l => expect(l.isBestseller).toBe(true))
  })

  it('retourne 3 bestsellers dans le catalogue de test', () => {
    expect(filterBestsellers(LIVRES)).toHaveLength(3)
  })
})


// ─── Recherche ────────────────────────────────────────────────────────────────
describe('searchBooks', () => {
  it('trouve un livre par titre exact', () => {
    const result = searchBooks(LIVRES, 'Dune')
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe(2)
  })

  it('trouve un livre par titre partiel (insensible à la casse)', () => {
    const result = searchBooks(LIVRES, 'seigneur')
    expect(result).toHaveLength(1)
    expect(result[0].title).toBe('Le Seigneur des Anneaux')
  })

  it('trouve un livre par auteur', () => {
    const result = searchBooks(LIVRES, 'Tolkien')
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe(3)
  })

  it('retourne tous les livres si la recherche est vide', () => {
    expect(searchBooks(LIVRES, '')).toHaveLength(LIVRES.length)
  })

  it('retourne un tableau vide si aucun résultat', () => {
    expect(searchBooks(LIVRES, 'xxxxxxx')).toHaveLength(0)
  })

  it('ignore les espaces en début/fin de la recherche', () => {
    const result = searchBooks(LIVRES, '  Dune  ')
    expect(result).toHaveLength(1)
  })

  it('trouve plusieurs résultats si plusieurs livres correspondent', () => {
    // "e" est dans presque tous les titres, mais testons un cas précis
    const result = searchBooks(LIVRES, 'or')  // Orgueil, George Orwell…
    expect(result.length).toBeGreaterThan(1)
  })
})


// ─── Tri par prix ─────────────────────────────────────────────────────────────
describe('sortByPrice', () => {
  it('trie par prix croissant', () => {
    const result = sortByPrice(LIVRES, true)
    for (let i = 0; i < result.length - 1; i++) {
      expect(result[i].price).toBeLessThanOrEqual(result[i + 1].price)
    }
  })

  it('trie par prix décroissant', () => {
    const result = sortByPrice(LIVRES, false)
    for (let i = 0; i < result.length - 1; i++) {
      expect(result[i].price).toBeGreaterThanOrEqual(result[i + 1].price)
    }
  })

  it('ne modifie pas le tableau d\'origine', () => {
    const original = [...LIVRES]
    sortByPrice(LIVRES, true)
    expect(LIVRES[0].id).toBe(original[0].id)
  })
})


// ─── Tri par note ─────────────────────────────────────────────────────────────
describe('sortByRating', () => {
  it('trie par note décroissante (meilleur en premier)', () => {
    const result = sortByRating(LIVRES)
    for (let i = 0; i < result.length - 1; i++) {
      expect(result[i].rating).toBeGreaterThanOrEqual(result[i + 1].rating)
    }
  })

  it('place les livres notés 5 en tête', () => {
    const result = sortByRating(LIVRES)
    expect(result[0].rating).toBe(5)
  })
})


// ─── Tri par avis ─────────────────────────────────────────────────────────────
describe('sortByReviews', () => {
  it('trie par nombre d\'avis décroissant', () => {
    const result = sortByReviews(LIVRES)
    for (let i = 0; i < result.length - 1; i++) {
      expect(result[i].reviews).toBeGreaterThanOrEqual(result[i + 1].reviews)
    }
  })
})


// ─── Logique des réductions ───────────────────────────────────────────────────
describe('Réductions sur les livres', () => {
  it('détecte qu\'un livre est en promotion', () => {
    const livreEnPromo = LIVRES.find(l => l.price < l.originalPrice) // L'Alchimiste
    expect(hasDiscount(livreEnPromo)).toBe(true)
  })

  it('détecte qu\'un livre n\'est pas en promotion', () => {
    const livreNormal = LIVRES.find(l => l.price === l.originalPrice) // Dune
    expect(hasDiscount(livreNormal)).toBe(false)
  })

  it('calcule le bon pourcentage de réduction', () => {
    // L'Alchimiste : 18.9 / 22.9 → ~17%
    const alchimiste = LIVRES[0]
    expect(discountPercent(alchimiste)).toBe(17)
  })

  it('calcule 0% de réduction si pas de promo', () => {
    const dune = LIVRES[1]
    expect(discountPercent(dune)).toBe(0)
  })
})


// ─── Recherche + filtre combinés ──────────────────────────────────────────────
describe('Combinaison recherche + catégorie', () => {
  it('filtre par catégorie puis recherche dans le résultat', () => {
    const fantasy = filterByCategory(LIVRES, 'Fantasy')
    const result  = searchBooks(fantasy, 'harry')
    expect(result).toHaveLength(1)
    expect(result[0].title).toBe('Harry Potter')
  })

  it('ne retourne rien si la recherche ne correspond pas à la catégorie', () => {
    const fantasy = filterByCategory(LIVRES, 'Fantasy')
    const result  = searchBooks(fantasy, 'Dumas')
    expect(result).toHaveLength(0)
  })
})