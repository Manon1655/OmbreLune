# 01_fiche_projet.md

## Nom du projet
OmbreLune

## Objectif
Plateforme web de consultation et gestion d'une bibliothèque numérique : création et import de livres, gestion des utilisateurs (inscription / connexion), favoris, panier et commandes, profil utilisateur et upload de photos.

## Technologies
- Front-end : React (v19) + Vite
- Back-end : Node.js + Express
- Base de données : MySQL (via `mysql2`)
- Autres : JWT (auth), `bcrypt` (hash), `multer` (upload), `dotenv` (variables d'environnement), tests avec Jest

## État d'avancement
Fonctionnel en local côté front (Vite) ; le back-end Express est présent et expose les endpoints principaux mais nécessite une base MySQL et les variables d'environnement pour fonctionner pleinement. Des tests unitaires existent pour certaines parties.

## Présence du front-end
— dossier : `src/` (React + Vite)

## Présence du back-end
— dossier : `backend/` (serveur Express en `backend/server.js`)

## Présence d'une BDD
Oui — MySQL attendu (la connexion est réalisée via `mysql2` et variables `MYSQL_HOST`, `MYSQL_USER`, `MYSQL_PASSWORD`, `MYSQL_DATABASE`).