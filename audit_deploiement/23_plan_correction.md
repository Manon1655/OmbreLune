# 23_plan_correction.md

## Plan de correction

| Anomalie                    | Priorité | Cause possible              | Correction prévue                        | Redéploiement nécessaire |
|-----------------------------|----------|-----------------------------|------------------------------------------|--------------------------|
| Backend sans DB             | 🔴       | Pas de BDD/migrations       | Fournir `init.sql` ou `docker-compose`   | Oui                      |
| Secrets exposés / .env      | 🔴       | `.env` committé / non ignoré | `git rm --cached .env`, ajouter à `.gitignore`, révoquer clés | Oui |
| CORS mal configuré          | 🔴       | FRONTEND_URL non défini     | Restreindre `cors` à `FRONTEND_URL`      | Oui                      |
| URLs en dur                 | 🟠       | baseURL codée dans le client| Remplacer par `import.meta.env.VITE_API_URL` | Oui                  |


## Corrections à ne PAS toucher sans backup
- La logique d'authentification (risque de casser le login)
- Les migrations de base de données (irréversibles)
- Les fichiers de config de l'hébergeur

## Avant chaque correction
```bash
git add .
git commit -m "backup: avant correction [nom anomalie]"
```
→ Comme ça, tu peux revenir en arrière si ça casse.