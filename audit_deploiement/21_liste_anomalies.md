# 21_liste_anomalies.md

## Anomalie 1 — Backend nécessite la BDD
- Description : Le backend renvoie des erreurs de connexion SQL si MySQL n'est pas configuré.
- Contexte : Démarrage du serveur sans variables `MYSQL_*` ou base non initialisée.
- Impact : Endpoints `/books`, `/auth/*`, `/orders` inaccessibles.
- Reproduit à chaque fois : Oui

## Anomalie 3 — .env potentiellement committé / uploads non ignorés
- Description : `.env` était absent du `.gitignore` initial et `uploads/` n'était pas exclu.
- Impact : Risque de fuite de secrets ou commit de fichiers binaires.
- Reproduit à chaque fois : Dépend de l'historique Git
