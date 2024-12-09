### Contexte : Création d'exercice pour les apprenants (Évaluation) 
 L'utilisateur souhaite que les informations liées au **contexte "Création d'exercice pour les apprenants"** reçoivent des configurations spécifiques en mémoire. 
 Ce contexte pourra être utilisé dans plusieurs thématiques différentes. Par exemple, la thématique actuelle est *"compétences transversales et fondamentales du métier de développeur web"*, mais d'autres thématiques pourraient survenir à l'avenir sous ce même contexte. 
 - Les **réglages mémoires** du contexte *"Création d'exercice pour les apprenants"* s'appliqueront automatiquement à toutes les thématiques qui y sont associées. 
 - Les **éléments de discussion** seront référencés uniquement dans le fil de discussion correspondant à la **thématique** en cours, afin de maintenir la cohérence. 
  
L'utilisateur souhaite utiliser un fil de discussion distinct pour chaque **thématique abordée** dans le contexte *"Création d'exercice pour les apprenants"*.

gestion-recettes/                 # Dossier racine du projet
│
├── index.php                     # Point d'entrée de l'application, inclut le fichier de routage principal
│
├── style.css                     # Feuille de styles principale pour l'ensemble du site
├── script.js                     # Fichier JavaScript pour les interactions dynamiques (ajout dynamique de champs, affichage/masquage)
│
├── assets/                       # Dossier pour les fichiers multimédias
│   └── images/                   # Sous-dossier pour les images
│       └── logo.png              # Exemple de logo
│
├── views/                        # Dossier contenant les templates PHP (vues) - affichage des données
│   ├── header.phtml              # Template pour l'en-tête du site
│   ├── footer.phtml              # Template pour le pied de page du site
│   ├── recette-list.phtml        # Template affichant la liste des recettes
│   ├── recette-details.phtml     # Template affichant les détails d'une recette
│   └── form-add-recette.phtml    # Template pour le formulaire d'ajout de recette
│
├── models/                       # Dossier pour les modèles de données (interactions avec la base de données)
│   ├── RecetteModel.php          # Modèle pour la gestion des recettes
│   ├── UtilisateurModel.php      # Modèle pour la gestion des utilisateurs
│   └── CategorieModel.php        # Modèle pour la gestion des catégories
│
├── controllers/                  # Dossier contenant les contrôleurs (logique métier)
│   ├── RecetteController.php     # Contrôleur pour la gestion des recettes (affichage, ajout, modification, etc.)
│   ├── UtilisateurController.php # Contrôleur pour la gestion des utilisateurs (connexion, inscription)
│   └── CategorieController.php   # Contrôleur pour la gestion des catégories (affichage, ajout)
│
└── routes/                       # Dossier pour la gestion des routes
    └── routes.php                # Fichier définissant les routes et les contrôleurs associés
 
 


