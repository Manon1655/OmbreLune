# 15_urls_et_connexions.md

## URLs locales
- Front-end : http://localhost:5173 (Vite)
- Back-end / API : http://localhost:8080 (Express)
- Base de données : localhost:3306 (MySQL)

## Endpoints API critiques à vérifier
| Route                         | Méthode | Description                           | Fonctionne en local ? |
|-------------------------------|---------|---------------------------------------|------------------------|
| /books                        | GET     | Récupérer la liste des livres         | ✅ / ❌               |
| /auth/register                | POST    | Inscription utilisateur               | ✅ / ❌               |
| /auth/login                   | POST    | Connexion utilisateur                 | ✅ / ❌               |
| /auth/user/:id                | GET     | Récupérer profil utilisateur          | ✅ / ❌               |
| /auth/user/:id/favorites      | GET/POST/DELETE | Gestion favoris                | ✅ / ❌               |
| /auth/user/:id/cart           | GET     | Récupérer panier                      | ✅ / ❌               |
| /orders                       | POST    | Créer une commande                    | ✅ / ❌               |

## URLs de production prévues
- Front-end : (ex) https://mon-projet.vercel.app
- Back-end  : (ex) https://mon-api.onrender.com
- BDD       : hébergée sur Railway / PlanetScale / RDS

## Points de vigilance CORS
Le back-end doit autoriser l'URL du front en production via la variable `FRONTEND_URL` (utilisée dans `backend/server.js` pour `cors.origin`). Vérifier que la valeur en production correspond exactement à l'URL front.