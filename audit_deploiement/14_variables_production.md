# 14_variables_production.md

## Tableau des variables (projet)

| Variable             | Valeur locale                    | Valeur production attendue                  | Obligatoire |
|----------------------|----------------------------------|---------------------------------------------|-------------|
| NODE_ENV             | development                      | production                                   | Oui         |
| PORT                 | 8080                             | Fournie par l'hébergeur / 8080              | Non         |
| MYSQL_HOST           | localhost                        | host fourni par l'hébergeur (Railway, RDS)  | Oui         |
| MYSQL_USER           | root                             | utilisateur DB                               | Oui         |
| MYSQL_PASSWORD       | root                             | mot de passe DB                               | Oui         |
| MYSQL_DATABASE       | projet_ecole_final               | nom de la base                                | Oui         |
| SECRET               | SECRET_KEY (fallback)            | chaîne aléatoire forte                       | Oui         |
| FRONTEND_URL         | http://localhost:5173            | URL du front en production (ex: Vercel)     | Oui         |
| VITE_API_URL         | http://localhost:8080            | URL publique de l'API                        | Oui         |

## Variables à ne JAMAIS mettre dans le code source
- `SECRET`, `MYSQL_PASSWORD`, clés d'API tierces, tokens.

## Comment elles seront injectées en production
Via le panneau de configuration des variables d'environnement du fournisseur (Render / Vercel / Railway / Heroku). Ne pas committer `.env` dans le repo.