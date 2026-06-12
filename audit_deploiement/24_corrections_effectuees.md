# 24_corrections_effectuees.md

## Correction 1 — `README.md` et documentation
- Fichier modifié : `README.md`
- Modification : correction de la stack (Express au lieu de Spring Boot), ajout des commandes d'installation, variables d'environnement et docker-compose d'exemple.
- Commit : docs: mise à jour README pour le projet

## Correction 2 — `.gitignore` et `.env.example`
- Fichier modifié : `.gitignore`, ajouté `.env` et `uploads/`, `coverage/`, `dist/`.
- Fichier ajouté : `.env.example` (variables listées).
- Commit : chore: .gitignore et .env.example

## Correction 3 — Variables d'environnement identifiées
- Fichier modifié : `audit_deploiement/10_variables_environnement.md` (mise à jour)
- Résultat : variables listées (MYSQL_*, SECRET, FRONTEND_URL)

## Bilan des corrections appliquées localement
- Anomalies résolues : documentation, gitignore, .env.example
- Anomalies restantes : initialisation de la BDD (fichier SQL ou docker-compose complet à fournir), vérification d'absence de `.env` committé dans l'historique Git (si présent, il faudra le retirer et révoquer les clés)