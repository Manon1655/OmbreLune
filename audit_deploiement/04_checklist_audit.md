# 04_checklist_audit.md

| Élément à vérifier                  | Oui | Non | Partiel | Commentaire |
|--------------------------------------|-----|-----|---------|-------------|
| Le projet se lance en local          |     |     |   X     | Front OK (Vite). Back : nécessite MySQL / variables d'env |
| La structure est compréhensible      |  X  |     |         | Arborescence front / back claire |
| Les dépendances sont identifiées     |  X  |     |         | `package.json` (root + backend) listent dépendances |
| Les scripts sont présents            |  X  |     |         | `npm run dev`, `npm start` (backend) et scripts de test |
| Le README existe                     |  X  |     |         | README présent mais contient des références inexactes (Spring Boot mentionné) |
| Les variables sont repérées          |     |     |   X     | Variables attendues : `MYSQL_*`, `SECRET`, `FRONTEND_URL` — pas de `.env.example` fourni |
| Les fichiers sensibles sont isolés   |     |  X  |         | `.gitignore` existe mais ne mentionne pas `.env` ni `uploads/` clairement |
| Le projet semble publiable           |     |     |   X     | Nécessite documentation de déploiement et gestion des secrets / DB |