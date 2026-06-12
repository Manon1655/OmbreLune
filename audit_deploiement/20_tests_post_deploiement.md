# 20_tests_post_deploiement.md

## URL testée
https://(front_deployed) (ou http://localhost:5173 pour test local)

## Tests effectués (exécution manuelle)

| Vérification                            | OK | KO | Commentaire                        |
|-----------------------------------------|----|----|------------------------------------|
| L'application s'ouvre                   | ☐  | ☐  |                                    |
| La page d'accueil s'affiche             | ☐  | ☐  |                                    |
| La navigation fonctionne                | ☐  | ☐  |                                    |
| Le formulaire de login fonctionne       | ☐  | ☐  | Tester `/auth/login` avec un user  |
| Le formulaire d'inscription fonctionne  | ☐  | ☐  | Tester `/auth/register`            |
| Les appels API critiques répondent      | ☐  | ☐  | `/books`, `/auth/user/:id`, `/orders` |
| Les données s'affichent correctement    | ☐  | ☐  | Vérifier listes et détails livre   |
| Aucune erreur visible dans la console   | ☐  | ☐  | Console navigateur                 |
| Endpoints renvoient 2xx pour cas valides| ☐  | ☐  | Utiliser Postman / curl            |

## Commandes utiles pour tester localement

```bash
# Lancer front
npm run dev

# Lancer back
cd backend
npm start

# Tester endpoint avec curl
curl http://localhost:8080/books
```

## Résultat global
Remplir après exécution des tests de bout en bout.
# 20_tests_post_deploiement.md

## URL testée
https://mon-projet.vercel.app (ou http://localhost:5000 en simulation)

## Tests effectués

| Vérification                            | OK | KO | Commentaire                        |
|-----------------------------------------|----|----|------------------------------------|
| L'application s'ouvre                   | ☐  | ☐  |                                    |
| La page d'accueil s'affiche             | ☐  | ☐  |                                    |
| La navigation fonctionne                | ☐  | ☐  |                                    |
| Le formulaire de login fonctionne       | ☐  | ☐  |                                    |
| Le formulaire d'inscription fonctionne  | ☐  | ☐  |                                    |
| Les appels API répondent                | ☐  | ☐  |                                    |
| Les données s'affichent correctement    | ☐  | ☐  |                                    |
| Aucune erreur visible dans la console   | ☐  | ☐  |                                    |
| Les pages 404 sont gérées               | ☐  | ☐  |                                    |
| Les erreurs 500 sont gérées             | ☐  | ☐  |                                    |
| Responsive mobile / tablette            | ☐  | ☐  |                                    |

## Comment ouvrir la console pour tester
1. Ouvrir le navigateur sur ton URL
2. F12 → onglet "Console" → chercher les erreurs en rouge
3. F12 → onglet "Network" → chercher les requêtes en rouge (4xx, 5xx)

## Résultat global
✅ Tout fonctionne / ⚠️ Quelques anomalies / ❌ Bloquant