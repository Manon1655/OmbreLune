# 08_etat_git.md

## Dépôt Git
Déjà initialisé : Oui

## Remote configuré
origin → https://github.com/Manon1655/Projet-Ecole2.0.git

## Branche principale
Default branch : `main` — branche courante dans le workspace : `dev`

## Nombre de commits
À vérifier localement. Exécuter :
```
git rev-list --count HEAD
```

## Dernier commit
À vérifier localement. Exécuter :
```
git log -1 --pretty=%B
```

## Pull request active
Il existe une PR active liée : https://github.com/Manon1655/Projet-Ecole2.0/pull/1

## Fichiers non suivis (git status)
À récupérer localement avec :
```
git status --porcelain
```

Remarque : les commandes ci-dessus doivent être lancées dans le terminal du dépôt pour obtenir des valeurs précises (nombre de commits, dernier message, fichiers unstaged).