# Guide de démarrage — Projet Ombrelune

## Prérequis

- **Node.js** (v16 ou supérieur)
- **MySQL Workbench** avec la base `projet_ecole_final` créée et les tables importées
- **MySQL** démarré sur `localhost:3306` avec l'utilisateur `root / root`

---

## Étape 1 — Préparer la base de données

Ouvrez MySQL Workbench et exécutez le fichier `database_setup.sql` situé à la racine du projet.  
Ce script crée les tables manquantes (notamment `subscriptions`) sans toucher aux données existantes.

```sql
-- Dans MySQL Workbench : File > Open SQL Script > database_setup.sql
-- Puis exécutez (Ctrl+Shift+Enter)
```

---

## Étape 2 — Démarrer le backend

Ouvrez un **premier terminal** :

```bash
cd Projet-Ecole2.0-main/backend
npm install
npm start
```

Le backend démarre sur **http://localhost:8080**

Pour vérifier que la connexion MySQL fonctionne :
```
http://localhost:8080/health
```
Vous devez voir : `{"status":"ok","database":"connected",...}`

---

## Étape 3 — Démarrer le frontend

Ouvrez un **deuxième terminal** :

```bash
cd Projet-Ecole2.0-main
npm install
npm run dev
```

Le site est accessible sur **http://localhost:5173**

---

## Résumé des corrections effectuées

| Problème | Correction |
|---|---|
| Backend ne répondait plus | `server.js` entièrement réécrit avec MySQL et toutes les routes |
| `loading` manquant dans `AuthContext` | Ajout de `loading` avec vérification du token JWT au démarrage |
| `firstName/lastName` absents du user | Récupération du profil complet après login |
| `ProtectedRoute` plantait | Utilise maintenant `loading` correctement |
| Routes dupliquées dans `App.jsx` | Route `/order-tracking` dédupliquée |
| `SubscriptionContext` cassé | Réécrit pour aligner avec le backend |
| `ImageCaptcha` import incorrect | Corrigé (casse du nom) |
| `vite.config.js` incomplet | Ajout du proxy et fermeture de la parenthèse manquante |
| Mega-menu Navbar utilisait `?genre=` | Inchangé (cohérent avec le reste de l'app) |
| `BookCard` URL image incorrecte | Gestion des URLs absolues et relatives |
| Table `subscriptions` manquante | Ajoutée dans `database_setup.sql` |

---

## Comptes de test

Si votre base de données contient déjà des utilisateurs, utilisez leurs identifiants.  
Sinon, créez un compte via la page `/register`.

Pour créer un compte **ADMIN** manuellement dans MySQL :
```sql
UPDATE users SET role = 'ADMIN' WHERE email = 'votre@email.com';
```
