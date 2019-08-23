# Tutoriel pour la création d'une API de données à partir de données existantes grâce à l'outil Datasette
## Notre exemple : création d’une API pour les données des organisations de data.gouv.fr reliées à Wikidata

### Datasette
[Datasette](https://datasette.readthedocs.io) est un outil pour explorer et publier des données. Il permet de générer une API interactive à partir de données de toutes formes et de toutes tailles.

[L'écosystème d'outils Datasette](https://datasette.readthedocs.io/en/stable/ecosystem.html#ecosystem)  permet, entres autres, de générer très facilement et rapidement une base de données SQLite à partir de fichiers .csv, .json, ou bien à partir d'une autre base de données (MySQL, PostgreSQL, Oracle ...).

[Démo de l'API construite avec Datasette dans ce tutoriel.](http://demo-api-datasette.eig-forever.org)

### 1. Installations prérequises
#### Python 3.5 ou plus récent
[Documentation officielle en français](https://docs.python.org/fr/3/using/index.html)
#### pip et pip3
```
$ sudo apt install python3-pip
$ sudo apt install python-pip
```
#### Datasette
Pour installer Datasette, on lance la commande :
```
$ sudo -H pip3 install --prefix /usr/local datasette
```
Ensuite, on va installer l'outil qui nous permet de générer une base de données SQLite à partir de fichiers csv  [`csvs-to-sqlite`](https://github.com/simonw/csvs-to-sqlite) :

```
$ sudo -H pip install --prefix /usr/local csvs-to-sqlite
```

### 2. Création de la base de données

Pour créer la base de données à partir des fichiers csv, on lance simplement :
```
$ csvs-to-sqlite fichier1.csv fichier2.csv nom-de-la-base-de-données.db
```
On peut également utiliser des métacaractères ou des URLs :
```
$ csvs-to-sqlite *.csv  nom-de-la-base-de-données.db
$ csvs-to-sqlite https://exemple.fr/fichier1.csv  nom-de-la-base-de-données.db
```
Pour notre exemple, nous utilisons [les données des organisations de data.gouv.fr reliées à Wikidata](https://www.data.gouv.fr/fr/datasets/organisations-de-data-gouv-fr-reliees-a-wikidata/).

### 3. Lancement du server
Pour lancer le serveur web, on utilise :
```
$ datasette nom_de_la_base_de_données1 nom_de_la_base_de_données2
```
L'API est consultable à l'adresse https://localhost:8001.
Remarque: Avec une seule instancde de Datasette, on peut servir plusieurs base de données différentes.

Un petit aperçu du résultat :

![Capture d’écran de 2019-07-29 07-48-24](https://user-images.githubusercontent.com/14167172/62035543-5baf6700-b1f0-11e9-81e1-714dbea7dcde.png)

![Capture d’écran de 2019-07-29 07-48-38](https://user-images.githubusercontent.com/14167172/62035546-5d792a80-b1f0-11e9-9c78-4bf5708dd84c.png)

![Capture d’écran de 2019-07-29 07-48-43](https://user-images.githubusercontent.com/14167172/62035549-5f42ee00-b1f0-11e9-9184-4e31c1bf5698.png)

![Capture d’écran de 2019-07-29 07-49-09](https://user-images.githubusercontent.com/14167172/62035560-60741b00-b1f0-11e9-9420-ddb7b2898e3b.png)

### 4. Personnalisation

Telles quelles, les pages web affichant l'API ne sont pas très jolies. Heureusement, nous pouvons personnaliser cette interface grâce aux métadonnées et aux templates.
À la racine du projet, on peut ajouter un fichier `metadata.json` qui permet de donner des informations supplémentaires pour l'API : un titre, une description, une licence, etc.

Voici à quoi peut ressembler le fichier `metadata.json` :
```JSON
{
    "title": "Organisations data.gouv.fr",
    "description": "Les données des organisations de data.gouv.fr reliées à Wikidata",
    "license": "Licence ouverte 2.0",
    "license_url": "https://github.com/etalab/licence-ouverte/blob/master/LO.md",
    "source": "www.data.gouv.fr",
    "source_url": "https://www.data.gouv.fr/fr/"
}
```

Plus d'informations sur la [documentation](https://datasette.readthedocs.io/en/stable/metadata.html).

Afin d'utiliser les métadonnées au lancement du serveur, on utilise la commande :
```
$ datasette nom_de_la_base_de_données.db --metadata metadata.json
```

Afin de personnaliser l'apparence de l'interface web, on peut également ajouter des templates `.html` et des fichiers `.css`.
Pour cela, on crée un répertoire `templates` et on y place nos templates. Les templates par défaut utilisées par datasette se trouvent dans `/usr/local/lib/python3.6/dist-packages/datasette/templates`.
Pour que nos templates remplacent les templates par défaut, il faut leur donner le nom adéquat :
<ul>
<li> index.html : Pour la page d'accueil</li>
<li> database.html : Pour la page d'une base de données</li>
<li> table.html : Pour la page d'une table de base de données</li>
<li> row.html : Pour la page d'une ligne de la base de données </li>
<li> query.html : Pour la page d'une table où l'on fait des requêtes SQL </li>
</ul>

[Voir la liste complète](https://datasette.readthedocs.io/en/stable/custom_templates.html) .

Pour lancer le serveur en utilisant ces templates, on utilise la commande :
```
$ datasette nom_de_la_base_de_données.db --metadata metadata.json --template-dir templates/

```

En utilisant les templates crées à partir de https://template.data.gouv.fr on obtient cet affichage :

![Capture d’écran de 2019-08-07 13-08-13](https://user-images.githubusercontent.com/14167172/62618536-c78e7f80-b914-11e9-909d-8a5f99dbe3d9.png)

![Capture d’écran de 2019-08-07 13-08-28](https://user-images.githubusercontent.com/14167172/62618537-c78e7f80-b914-11e9-9e26-951808488037.png)

![Capture d’écran de 2019-08-07 13-08-34](https://user-images.githubusercontent.com/14167172/62618538-c78e7f80-b914-11e9-9a2b-2e9a0c7159c0.png)

![Capture d’écran de 2019-08-07 13-08-40](https://user-images.githubusercontent.com/14167172/62618540-c8271600-b914-11e9-8957-da00be0d8bc5.png)

### Licence

2019 Direction interministérielle du numérique et du système
d'information et de communication de l'État. <br/>

2019 Les contributeurs accessibles via l'historique du dépôt. <br/>

Les contenus accessibles dans ce dépôt sont placés sous [Licence
Ouverte 2.0](LO.md).  Vous êtes libre de réutiliser les contenus de ce dépôt
sous les conditions précisées dans cette licence. </br>

Ce document est écrit par Gaëlle Marais à Etalab.
