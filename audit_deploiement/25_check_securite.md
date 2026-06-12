# 25_check_securite.md

## Vérifications effectuées

| Point de sécurité                        | OK | KO | Commentaire                       |
|------------------------------------------|----|----|-----------------------------------|
| `.env` absent du dépôt Git               | ☐  | ☐  | Exécuter `git ls-files -- .env` pour vérifier |
| `.env` présent dans `.gitignore`         | ✅ |    | Ajouté par l'audit                 |
| `node_modules` absent du dépôt Git       | ✅ |    | `.gitignore` contient node_modules  |
| Aucun mot de passe en dur dans le code   | ☐  | ☐  | Rechercher `password` / `MYSQL_PASSWORD`  |
| Aucune clé API en dur dans le code       | ☐  | ☐  | Rechercher clefs possibles via grep  |
| `JWT_SECRET` défini via variable d'env   | ☐  | ☐  | Le code utilise `process.env.SECRET` par défaut fallback présent — remplacer le fallback en prod |
| CORS restreint à l'URL du front          | ☐  | ☐  | `backend/server.js` utilise `FRONTEND_URL` si défini |
| DB credentials définies via variable d'env | ☐ | ☐ | `backend/server.js` lit `MYSQL_*` vars  |
| Le site utilise HTTPS en production      | ☐  | ☐  | À vérifier après déploiement (Vercel/Render fournissent HTTPS) |
| Aucune route admin accessible sans auth  | ☐  | ☐  | Vérifier contrôles d'accès sur endpoints admin |

## Résultats des commandes grep (secrets en dur)
- Recherche "password" : exécuter localement `rg "password" -n` ou `grep -R "password" .`
- Recherche "secret" : exécuter localement `rg "secret" -n` ou `grep -R "secret" .`

## Problèmes de sécurité détectés
- Documentation et `.gitignore` corrigés.
- À vérifier : historique Git pour `.env` committé, et suppression/révocation si trouvé.

## Actions correctives appliquées
- Ajout de `.env` et `uploads/` dans `.gitignore`.
- Création de `.env.example`.

## Commandes recommandées pour audit rapide

```bash
# Vérifier si .env est dans l'index
git ls-files -- .env

# Rechercher occurrences de mots-clés sensibles
grep -R "password\|secret\|API_KEY\|TOKEN" -n . || true

# Vérifier les commits contenant .env
git log --all --pretty=format:%H -- . | xargs -I {} git grep -n "MYSQL_PASSWORD" {} || true
```
