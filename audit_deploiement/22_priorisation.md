# 22_priorisation.md

## Définition des niveaux

| Niveau         | Définition                                           |
|----------------|------------------------------------------------------|
| 🔴 Bloquante   | Empêche l'utilisation principale (ex: login cassé)   |
| 🟠 Importante  | Fonctionnalité dégradée mais contournable            |
| 🟡 Mineure     | Problème visuel ou UX mineur                         |
| 🟢 Amélioration| Amélioration souhaitable, non urgente                |

## Tableau de priorisation (adapté au projet)

| Anomalie / zone concernée                                         | Niveau       | Justification et fichiers concernés                                                       |
|-------------------------------------------------------------------|--------------|-------------------------------------------------------------------------------------------|
| Erreur CORS / login API                                            | 🔴 Bloquante | Empêche l'authentification des utilisateurs → impact critique. Fichiers: [backend/server.js](backend/server.js), [context/AuthContext.jsx](src/context/AuthContext.jsx) |
| Images de couverture qui ne s'affichent (book-covers)             | 🟠 Importante| Rupture visuelle importante pour la librairie. Fichiers: [public/book-covers](public/book-covers), [src/pages/Book.jsx](src/pages/Book.jsx) |
| Paiement / checkout non fiable ou non testé                       | 🟠 Importante| Blocage potentiel du tunnel d'achat. Fichiers: [src/pages/Checkout.jsx](src/pages/Checkout.jsx), backend endpoints |
| Persistance de session / token manquante ou expiration mal gérée  | 🔴 Bloquante | Peut provoquer déconnexions et pertes de panier. Fichiers: [src/context/AuthContext.jsx](src/context/AuthContext.jsx), [backend/server.js](backend/server.js) |
| Recherche / affichage bibliothèque incorrect (résultats vides)     | 🟡 Mineure  | Dégrade l'expérience de navigation. Fichiers: [src/pages/Library.jsx](src/pages/Library.jsx), [src/data/books.js](src/data/books.js) |
| Alignements et responsive mobile (ex: texte/menus)                | 🟡 Mineure  | Problèmes UX sur petits écrans. Fichiers: [src/styles/global.css](src/styles/global.css), [src/styles/navbar.css](src/styles/navbar.css) |
| Boutons sans loader / feedback lors des actions (login, paiement) | 🟢 Amélioration | Amélioration UX simple à implémenter. Fichiers: `src/components/*`, styles CSS correspondants |

## Actions recommandées (courtes)
- 🔴 Bloquantes: reproduire, corriger CORS et gestion token, ajouter tests d'authentification.
- 🟠 Importantes: vérifier routes backend pour images et checkout, corriger permissions et endpoints.
- 🟡 Mineures: ajuster CSS responsive, valider sur écran mobile.
- 🟢 Améliorations: ajouter loaders et micro-interactions sur boutons critiques.

## Ordre de traitement
1. Corriger les 🔴 (auth/session) — tests d'intégration et vérification manuelle du login.
2. Corriger les 🟠 (images, checkout) — s'assurer que endpoints et chemins sont valides.
3. Corriger les 🟡 (responsive, affichage) — tests sur mobile et corrections CSS.
4. Planifier les 🟢 (loaders, petites améliorations) pour une itération future.

---
