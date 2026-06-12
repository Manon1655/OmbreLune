# 05_points_bloquants.md

## Point bloquant 1
- Problème : Le backend dépend d'une base MySQL non fournie et de variables d'environnement (`MYSQL_*`, `SECRET`).
- Impact : Certaines routes (auth, livres, commandes) ne fonctionnent pas sans DB; tests et import échoueront.
- Action prévue : Fournir un `.env.example`, documenter la création de la base MySQL (schéma) ou ajouter un script d'initialisation / Docker Compose fonctionnel.

## Point bloquant 2
- Problème : README contient des références inconsistantes (mention de Spring Boot) et manque d'une section d'installation backend complète.
- Impact : Confusion pour le déploiement local et CI/CD ; on risque d'exécuter les mauvaises commandes.
- Action prévue : Corriger le README pour décrire l'architecture réelle (React + Node/Express), commandes d'installation et variables d'environnement.

## Point bloquant 3
- Problème : Gestion des secrets et fichiers d'uploads non sécurisée (fallback `SECRET` codé, dossier `uploads/` non listé dans `.gitignore`).
- Impact : Risque d'exposition de données sensibles dans le dépôt, commits d'uploads binaires.
- Action prévue : Ajouter `.env` et `uploads/` à `.gitignore`, supprimer les secrets committés, utiliser `process.env.SECRET` uniquement et fournir `.env.example`.

## Point bloquant 4
- Problème : Absence de la documentation pour la structure de la base (tables attendues : users, books, cart, orders, favorites, user_books, order_items, etc.).
- Impact : Difficulté pour créer la base et faire fonctionner les fonctionnalités d'import / tests.
- Action prévue : Ajouter un script SQL d'initialisation et/ou documenter les migrations nécessaires.
