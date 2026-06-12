# 02_verification_locale.md

## Commande de lancement
- Front (racine) : `npm install` puis `npm run dev` (Vite, port 5173)
- Back : `cd backend` puis `npm install` et `cd backend && node server.js` (serveur Express, port 8080 par défaut)

Si vous utilisez MySQL : démarrer MySQL et créer la base (`projet_ecole_final`) ou définir les variables d'environnement `MYSQL_HOST`, `MYSQL_USER`, `MYSQL_PASSWORD`, `MYSQL_DATABASE`.

## Le projet se lance correctement
Front : Oui (Vite) — testé par la présence de `src/` et `vite`.
Back : Partiel — le serveur démarre mais la plupart des routes nécessitent une base MySQL et variables d'environnement correctement renseignées.

## Routes principales testées
- `/` (front) → OK (interface React si Vite lancé)
- `/books` (GET) → OK si MySQL configurée (sinon erreur DB)
- `/auth/register` → OK si DB configurée
- `/auth/login` → OK si DB configurée

## Données s'affichent
Partiellement — le front fonctionne mais l'affichage des ressources backend dépend d'une base de données opérationnelle.

## Erreurs visibles dans le terminal
- Pas d'erreurs explicites dans le code lu, mais si MySQL n'est pas configuré : erreurs de connexion/SQL côté backend.

## Remarques
- Créer un fichier `.env.example` listant `MYSQL_HOST`, `MYSQL_USER`, `MYSQL_PASSWORD`, `MYSQL_DATABASE`, `SECRET`, `FRONTEND_URL`.
- Ajouter `uploads/` et `.env` au `.gitignore` si ce n'est pas déjà fait.