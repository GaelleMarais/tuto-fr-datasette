# Tutoriel pour la création d'une API de données à partir de données existantes grâce à l'outil Datasette
## Notre exemple : création d’une API pour les données des organisations de data.gouv.fr reliées à Wikidata

### Datasette
[Datasette](https://datasette.readthedocs.io) est un outil pour explorer et publier des données. Il permet de générer une API interactive à partir de données de toutes formes et de toutes tailles.

[L'écosystème d'outils Datasette](https://datasette.readthedocs.io/en/stable/ecosystem.html#ecosystem)  permet, entre autre, de générer très facilement et rapidement une base données SQLite à partir de fichiers .csv, .json, ou bien à partir d'une autre base de données (MySQL, PostgreSQL, Oracle ...).

### 1. Installations pré-requises
#### Python 3.5 ou plus récent
[Documentation officielle en français](https://docs.python.org/fr/3/using/index.html)
#### pip et pip3
`
$ sudo apt install python3-pip 

$ sudo apt install python-pip
`
#### Datasette
Pour installer Datasette, on lance la commande :
```
$ sudo -H pip3 install --prefix /usr/local datasette
```
Ensuite, on va installer l'outil qui nous permet de générer une base de données SQLite à partir de fichier csv  [`csvs-to-sqlite`](https://github.com/simonw/csvs-to-sqlite) :

```
$ sudo -H pip install --prefix /usr/local csvs-to-sqlite
```

### 2. Création de la base de données

Pour créer la base de données à partir des fichiers csv, on lance simplement :
```
$ csvs-to-sqlite fichier1.csv fichier2.csv nom-de-la-base-de-données.db
```
On peut également utiliser des métacaractères ou des URLS :
```
$ csvs-to-sqlite *.csv  nom-de-la-base-de-données.db
$ csvs-to-sqlite https://exemple.fr/fichier1.csv  nom-de-la-base-de-données.db
```

### 3. Lancement du server
Pour lancer le serveur web, on utilise :
```
$ datasette nom_de_la_base_de_données
```
L'API est consultable à l'adresse https://localhost:8001
Un petit aperçu du résultat :
![Capture d’écran de 2019-07-29 07-48-24](https://user-images.githubusercontent.com/14167172/62035543-5baf6700-b1f0-11e9-81e1-714dbea7dcde.png)

![Capture d’écran de 2019-07-29 07-48-38](https://user-images.githubusercontent.com/14167172/62035546-5d792a80-b1f0-11e9-9c78-4bf5708dd84c.png)

![Capture d’écran de 2019-07-29 07-48-43](https://user-images.githubusercontent.com/14167172/62035549-5f42ee00-b1f0-11e9-9184-4e31c1bf5698.png)

![Capture d’écran de 2019-07-29 07-49-09](https://user-images.githubusercontent.com/14167172/62035560-60741b00-b1f0-11e9-9420-ddb7b2898e3b.png)



### Licence

2019 Direction interministérielle du numérique et du système
d'information et de communication de l'État. <br/>

2019 Les contributeurs accessibles via l'historique du dépôt. <br/>

Les contenus accessibles dans ce dépôt sont placés sous [Licence
Ouverte 2.0](LO.md).  Vous êtes libre de réutiliser les contenus de ce dépôt
sous les conditions précisées dans cette licence. </br>

Ce document est écrit par Gaëlle Marais à Etalab.
