# 17_plan_mise_en_ligne.md

## Hébergeurs recommandés (projet)

### Front-end → Vercel
- Avantage : déploiement simple de sites React/Vite, intégration GitHub automatique.
- Commande de build : `npm run build` (root)
- Dossier de sortie : `dist/`

### Back-end → Render (ou Render / Heroku)
- Avantage : déploiement facile pour Node/Express, variables d'env dans UI.
- Start command : `npm start` (depuis `backend/`)

### Base de données → Railway / PlanetScale / RDS
- Fournit une instance MySQL et les credentials à copier dans Render.

## Étapes détaillées de déploiement

### Étape 1 — Préparer la base de données
1. Créer un projet sur Railway (ou autre provider) et provisionner une base MySQL.
2. Récupérer l'hôte, utilisateur, mot de passe et nom de base.

### Étape 2 — Déployer le back-end
1. Créer un service web sur Render.
2. Connecter le repo GitHub et définir le `Root Directory` sur `backend/`.
3. Build Command : `npm install` (Render installera les dépendances).
4. Start Command : `npm start`.
5. Configurer les variables d'environnement sur Render :
   - `NODE_ENV=production`
   - `MYSQL_HOST`, `MYSQL_USER`, `MYSQL_PASSWORD`, `MYSQL_DATABASE`
   - `SECRET` (JWT)
   - `FRONTEND_URL` (URL fournie par Vercel)

### Étape 3 — Déployer le front-end
1. Créer un projet sur Vercel et connecter le repo.
2. Root Directory : racine du repo (ou spécifier si nécessaire).
3. Build Command : `npm run build`.
4. Output Directory : `dist`.
5. Ajouter la variable `VITE_API_URL` pointant vers l'URL du back (Render).

### Étape 4 — Validation post-déploiement
1. Mettre à jour `FRONTEND_URL` côté Render pour autoriser CORS.
2. Tester les endpoints critiques et le flux d'authentification.

## Option alternative : Docker Compose
- Fournir un `docker-compose.yml` pour exécuter MySQL, backend et servir le front en prod derrière Nginx ou en statique.

## Notes
- Documenter les migrations ou scripts SQL pour créer les tables attendues avant tests/fonctionnement.