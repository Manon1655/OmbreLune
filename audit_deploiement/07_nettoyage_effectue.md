# 07_nettoyage_effectue.md

## Fichiers/dossiers supprimés
- node_modules/ (client + server) → recréés avec npm install
- .DS_Store → fichiers système 
- *.log → fichiers de logs

## Fichiers renommés ou réorganisés
- (ex: test2_final_VRAI.js → renommé en utils.js)
- Aucun / ...

## État après nettoyage
Le projet est plus propre. node_modules sera recréé à l'installation.

## Actions réalisées durant l'audit
- Suppression des dossiers `node_modules` et des logs recommandée.
- ajout de `.env.example` et d'ajout de `.env` + `uploads/` dans `.gitignore` pour protéger les secrets et éviter de committer des fichiers binaires.
- Recommandation : exécuter `npm install` côté front et `cd backend && npm install` côté backend après le nettoyage.
