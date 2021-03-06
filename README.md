# Tutoriel pour la création d'une API de données à partir de données existantes grâce à l'outil Datasette
## Notre exemple : création d’une API pour les données des organisations de data.gouv.fr reliées à Wikidata

### Datasette
[Datasette](https://datasette.readthedocs.io) est un outil pour explorer et publier des données. Il permet de générer une API interactive à partir de données de toutes formes et de toutes tailles.

[L'écosystème d'outils Datasette](https://datasette.readthedocs.io/en/stable/ecosystem.html#ecosystem)  permet, entres autres, de générer très facilement et rapidement une base de données SQLite à partir de fichiers .csv, .json, ou bien à partir d'une autre base de données (MySQL, PostgreSQL, Oracle ...).

Dans ce tutoriel, nous allons construire une API avec Datasette à partir de fichiers `.csv`. Nous allons d'abord expliquer comment installer l'outil Datasette, ensuite nous verrons comment générer une base de données SQLite grâce à  `csvs-to-sqlite`, et enfin nous lancerons notre serveur pour afficher notre API. Pour finir, nous expliquerons comment personnaliser notre API grâce aux métadonnées, aux templates et aux plugins. Nous allons notamment nous intéresser au plugin `datasette-cluster-map` qui permet d'afficher les données géographiques de nos `csv` sur une carte.  

[Démo de l'API construite avec Datasette dans ce tutoriel.](http://demo-api-datasette.eig-forever.org)

### 1. Installations prérequises
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
$ datasette nom_de_la_base_de_données
```
L'API est consultable à l'adresse https://localhost:8001.

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
Pour cela, on crée un répertoire `templates` et on y place nos templates. Les templates par défaut utilisés par datasette se trouvent dans `/usr/local/lib/python3.6/dist-packages/datasette/templates`.
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
$ datasette nom_de_la_base_de_données.db --metadata metadata.json --template-dir=templates/

```

En utilisant les templates créés à partir de https://template.data.gouv.fr on obtient cet affichage :

![Capture d’écran de 2019-08-07 13-08-13](https://user-images.githubusercontent.com/14167172/62618536-c78e7f80-b914-11e9-909d-8a5f99dbe3d9.png)

![Capture d’écran de 2019-08-07 13-08-28](https://user-images.githubusercontent.com/14167172/62618537-c78e7f80-b914-11e9-9e26-951808488037.png)

![Capture d’écran de 2019-08-07 13-08-34](https://user-images.githubusercontent.com/14167172/62618538-c78e7f80-b914-11e9-9a2b-2e9a0c7159c0.png)

![Capture d’écran de 2019-08-07 13-08-40](https://user-images.githubusercontent.com/14167172/62618540-c8271600-b914-11e9-8957-da00be0d8bc5.png)


### Le plugin datasette-cluster-map

Il existe de nombreux plugins dans l'ecosystème Datasette, la liste complète est disponible [ici](https://datasette.readthedocs.io/en/stable/ecosystem.html).

Nous allons nous intéresser au plugin [datasette-cluster-map](https://github.com/simonw/datasette-cluster-map) qui permet d'afficher une carte dès qu'il repère une table qui contient une colonne `latitude` et une colonne `longitude`.

Pour l'exemple, je vais utiliser une liste de recensement des tiers lieux disponibles [ici](https://github.com/cget-carto/mission_coworking) et créer la base de données grâce à `csvs-to-sqlite` comme à l'étape 2.

**Attention, il faut bien veiller à ce que les colonnes concernant les coordonnées géographiques soient nommées `latitude` et `longitude`.**

#### Sans utiliser de templates personnalisées

Pour installer le plugin, on lance la commande :
```
$ pip3 install datasette-cluster-map
```

Et c'est tout ! Maintenant lorsqu'on affiche la page de la table, on obtient une carte interactive :

![Capture d’écran de 2019-08-23 15-35-44](https://user-images.githubusercontent.com/14167172/63596608-e733d200-c5bb-11e9-95a3-fc0a3677d138.png)

#### En utilisant des templates personnalisés

Si on utilise des templates personnalisés, les choses sont un peu plus compliquées. En effet, les composants HTML de nos templates n'ont pas forcément les mêmes identifiants que ceux qui étaient par défaut créés par Datasette.

Il faut d'abord récupérer le script `datasette-cluster-map.js` disponible [ici](https://github.com/simonw/datasette-cluster-map/tree/master/datasette_cluster_map/static).
Ensuite, il faut modifier ce script pour mettre le nom de vos éléments HTML *( 3 lignes à modifier )*:
```javascript
...
6       document.querySelectorAll('.table th'),
...
122     let facets= document.querySelector('.suggested-facets');
123     facets.parentNode.insertBefore(el, facets.nextSibling);
...
```

*Remarque : si vous utilisez les templates fournis par ce tutoriel vous pouvez simplement récupérer le fichier `datasette-cluster-map.js` dans `plugins/`*.

Pour intégrer le script à notre site web, on va d'abord l'héberger sur internet, par exemple sur [yourjavascript.com](yourjavascript.com) .

On ajoute le lien obtenu dans notre fichier `templates/header.html` :
``` html
<script type="text/javascript" src="http://yourjavascript.com/18830190220/datasette-cluster-map.js"></script>
```
Et voilà le résultat :

![Capture d’écran de 2019-08-23 15-50-54](https://user-images.githubusercontent.com/14167172/63597508-e7cd6800-c5bd-11e9-8332-b138a0e516e0.png)

### Conclusion

Comme on a pu le voir, Datasette est un outil facile à prendre en main, et qui permet de générer une API avec de nombreuses fonctionnalités en très peu de temps.
Grâce aux systèmes de templates et de plugins, il est possible de créer des APIs très complètes pour correspondre à n'importe quels types de données.
La limite de cet outil est qu'il ne permet pas de créer des APIs dont les données sont modifiables par les utilisateurs. Pour créer une telle API, on pourrait par exemple utiliser [API Platform](https://github.com/GaelleMarais/tuto-fr-apiplatform).
Enfin, si l'on ne dispose pas de serveurs pour héberger notre API, on peut utiliser [Netlify](https://github.com/GaelleMarais/tuto-fr-api-netlify) qui permet d'héberger gratuitement des applications web.

### Licence

2019 Direction interministérielle du numérique et du système
d'information et de communication de l'État. <br/>

2019 Les contributeurs accessibles via l'historique du dépôt. <br/>

Les contenus accessibles dans ce dépôt sont placés sous [Licence
Ouverte 2.0](LO.md).  Vous êtes libre de réutiliser les contenus de ce dépôt
sous les conditions précisées dans cette licence. </br>

Ce document est écrit par Gaëlle Marais à Etalab.
