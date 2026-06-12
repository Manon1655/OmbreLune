# 09_gitignore_justification.md

## Exclusions ajoutées et justifications

| Fichier/Dossier     | Raison                                              |
|----------------------|-----------------------------------------------------|
| node_modules/        | Trop lourd, se réinstalle avec npm install          |
| .env                 | Contient des secrets (mots de passe, clés API)      |
| /client/build        | Généré automatiquement, inutile à versionner        |
| *.log                | Fichiers de debug temporaires                       |
| .DS_Store            | Fichier système Mac, rien à voir avec le code       |
| *.sqlite / *.db      | Base de données locale, ne doit pas être partagée   |
| uploads/             | Dossier d'uploads d'images — fichiers binaires à exclure |
| coverage/            | Rapports de test générés                            |
| dist/ build/         | Artéfacts de build à ne pas versionner              |

## .env était-il déjà suivi par Git ?
À vérifier localement. Si `.env` est committé : exécuter `git rm --cached .env` puis committer et révoquer toute clé exposée.

## Actions recommandées
- Ajouter `.env` et `uploads/` dans `.gitignore` (patch appliqué dans ce audit).
- Si des secrets ont été exposés, les révoquer et les remplacer.