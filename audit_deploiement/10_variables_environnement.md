# 10_variables_environnement.md

## Variables identifiées dans le projet

| Variable              | Utilisée où ?                  | Sensible ? | Dans .env.example ? |
|-----------------------|-------------------------------|------------|----------------------|
| MYSQL_HOST            | `backend/server.js`           | Oui        | ✅                   |
| MYSQL_USER            | `backend/server.js`           | Oui        | ✅                   |
| MYSQL_PASSWORD        | `backend/server.js`           | Oui        | ✅                   |
| MYSQL_DATABASE        | `backend/server.js`           | Oui        | ✅                   |
| SECRET                | `backend/server.js` (JWT)     | Oui        | ✅                   |
| FRONTEND_URL          | `backend/server.js` (CORS)    | Non        | ✅                   |
| PORT                  | `backend/server.js`           | Non        | ✅                   |

## .env.example créé
Oui — fichier `.env.example` ajouté à la racine de ce dépôt contenant les variables listées (sans valeurs réelles).

## .env protégé par .gitignore
Oui — `.env` et `uploads/` ont été ajoutés à `.gitignore` par ce patch.