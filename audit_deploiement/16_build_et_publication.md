# 16_build_et_publication.md

## Build front-end
- Commande : `npm run build` (depuis la racine)
- Résultat attendu : build Vite dans `dist/` (à vérifier)
- Vérifier la sortie : taille du dossier `dist/` et erreurs dans la console

## Démarrage back-end en mode production
- Commande :
```bash
NODE_ENV=production npm start
```
ou (Windows PowerShell)
```powershell
$env:NODE_ENV='production'; npm start
```
- Résultat attendu : serveur Express démarre sur `PORT` (8080 par défaut)

## Points bloquants détectés / points de vigilance
- Variables d'environnement non définies (MYSQL_*, SECRET) empêcheront le back de fonctionner.
- Le build front doit être servi par un hébergeur statique (Vercel) ou intégré au serveur de production.
- Uploads : vérifier que le dossier `uploads/` n'est pas exposé publiquement sans contrôle d'accès.

## Procédure de vérification après publication
1. Déployer et vérifier que `VITE_API_URL` pointe vers l'URL de l'API en production.
2. Tester les endpoints critiques listés dans `15_urls_et_connexions.md`.
3. Vérifier les logs serveur pour erreurs et les règles CORS.