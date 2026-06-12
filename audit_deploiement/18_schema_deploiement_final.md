# 18_schema_deploiement_final.md

## Architecture applicative en production (proposition)

Front-end (Vercel)
https://mon-projet.vercel.app
        ↓  requêtes HTTPS / Axios
Back-end API (Render)
https://mon-api.onrender.com
        ↓  connexion sécurisée
Base de données (Railway / PlanetScale)
mysql://...:3306/nom_de_la_base

## Chaîne de déploiement

GitHub (code source)
    ↓  push sur main
Render (rebuild automatique)
    ↓  déploie le back
Vercel (rebuild automatique)
    ↓  déploie le front
Utilisateur final
    ↓  accède à l'URL front

## Variables d'environnement par service

| Variable      | Render (back) | Vercel (front) |
|---------------|---------------|----------------|
| NODE_ENV      | production    | —              |
| MYSQL_HOST    | ✅            | —              |
| MYSQL_USER    | ✅            | —              |
| MYSQL_PASSWORD| ✅            | —              |
| MYSQL_DATABASE| ✅            | —              |
| SECRET        | ✅            | —              |
| FRONTEND_URL  | ✅            | —              |
| VITE_API_URL  | —             | ✅             |

## URL publique finale (à définir après déploiement)
- Front : (ex) https://mon-projet.vercel.app
- API   : (ex) https://mon-api.onrender.com

## Remarques
- Prévoir une routine de sauvegarde de la BDD et des sauvegardes pour les uploads si ceux-ci restent stockés localement (préférer un stockage cloud en prod).