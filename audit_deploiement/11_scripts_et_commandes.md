# 11_scripts_et_commandes.md

## Scripts front-end (racine `package.json`)
- `npm run dev`      → Lance Vite en développement (port 5173)
- `npm run build`    → Génère le build production (Vite)
- `npm run lint`     → Lance ESLint
- `npm run test`     → Lance Jest (tests front et config de test)
- `npm run test:backend` → Lance les tests backend via Jest

## Scripts back-end (`backend/package.json`)
- `npm start`    → Lance le serveur Express (`node server.js`)
(Pas de script `dev`/`nodemon` dans `backend/package.json` — possible amélioration)

## Commandes recommandées pour tester localement
- Lancer le front :
```bash
npm install
npm run dev
```
- Lancer le back :
```bash
cd backend
node server.js
```

## Résultats attendus
- `npm run dev` : démarrage du serveur Vite et affichage de l'interface à `http://localhost:5173`.
- `cd backend && node server.js` : serveur Express écoute sur le port 8080 (ou `PORT` défini). Certaines routes renverront des erreurs si MySQL n'est pas configuré.

## Commandes testées réellement (à exécuter localement)
- `cd` dans la racine et `npm run dev` — vérifier que l'interface se charge.
- `cd backend && npm start` — vérifier que le serveur démarre et qu'il peut se connecter à la base MySQL.