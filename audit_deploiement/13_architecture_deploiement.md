# 13_architecture_deploiement.md

## Architecture applicative (spécifique au projet)

### Front-end
- Technologie : React (v19) + Vite
- Dossier : `src/` à la racine du repo
- Port local : 5173 (dev server Vite)
- Build produit dans : `dist/` (sortie Vite)

### Back-end
- Technologie : Node.js + Express
- Dossier : `backend/`
- Port local : 8080 (par défaut, contrôlé par `PORT`)
- Point d'entrée : `backend/server.js`

### Base de données
- Type : MySQL (utilisé via `mysql2`)
- Hébergement : local pendant le développement (port 3306) ou service cloud (Railway / PlanetScale / RDS) en production

### Services externes
- Uploads stockés localement dans `backend/uploads/` (possibilité d'utiliser Cloudinary en production)

## Schéma de communication
Front-end (Vite :5173)
    ↓ requêtes HTTP (fetch / axios)
Back-end (Express :8080)
    ↓ requêtes SQL
Base de données (MySQL :3306)

## Dépendances entre les parties
- Le front consomme l'API exposée par le back.
- Le back a besoin d'une base MySQL fonctionnelle pour les endpoints d'auth, livres, commandes.
- L'authentification JWT dépend de la variable `SECRET`.

## Remarques d'architecture
- Il est possible de découpler le front en hébergement statique (Vercel) et le back sur Render/Heroku/Render, en exposant l'API via HTTPS et en configurant CORS (`FRONTEND_URL`).