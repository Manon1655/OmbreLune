# 19_bilan_mise_en_ligne.md

## Ce qui est prêt
- ✅ Architecture documentée
- ✅ Variables de production identifiées
- ✅ Plan de déploiement rédigé
- ✅ Fichiers d'audit complétés

## Ce qui est déployé
- Front-end : ⏳ Pas encore déployé
- Back-end  : ⏳ Pas encore déployé
- BDD       : ⏳ Pas encore déployé

## URLs en production
- Front : (à définir après déploiement)
- API   : (à définir après déploiement)

## Points bloquants restants
- Fournir le schéma SQL ou migrations pour initialiser la base MySQL.
- Configurer correctement les variables d'environnement en production (MYSQL_*, SECRET, VITE_API_URL, FRONTEND_URL).
- Décider d'une stratégie de stockage des uploads (Cloud vs stockage serveur) et gérer la sauvegarde.

## Ce qui reste pour la séance 4
1. Créer un `docker-compose.yml` ou scripts d'initialisation pour la BDD et lancer un déploiement test.
2. Déployer back sur Render et front sur Vercel, puis exécuter les tests de bout en bout.
3. Vérifier les logs, régler CORS et la sécurité des endpoints (vérifier tokens JWT, validations, limites d'upload).