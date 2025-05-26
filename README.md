<p align="center">
  <img src="assets/logo.png" alt="Logo" width="100px">
</p>

# Projet Devis/Facture

Ce projet est une application web simple permettant de générer des devis et des factures dynamiques. L'application permet de personnaliser les informations de l'en-tête et d'ajouter des lignes de services avec des descriptions, des heures et des prix. Les données sont stockées dans le `localStorage` du navigateur pour une utilisation ultérieure.

## Fonctionnalités

- Personnalisation des informations de l'en-tête du devis/facture.
- Ajout dynamique de lignes de services avec description, heures et prix.
- Calcul automatique du total HT.
- Stockage des données dans le `localStorage` pour une utilisation ultérieure.
- Modification, suppression et réorganisation interactives des lignes de service.
- Interface utilisateur avec mode sombre.

## Fichiers principaux

- `index.html` : Page d'accueil.
- `html/newInvoice.html` : Page principale pour afficher le devis/facture généré.
- `html/formulaire.html` : Page pour personnaliser les informations de l'entreprise et du client.
- `html/addLines.html` : Page pour ajouter et gérer les lignes de services/produits.
- `js/commonApp.js` : Script JavaScript partagé pour la génération de la barre latérale et la navigation.
- `js/addLines.js` : Script pour la logique de la page "Ajouter des Services".
- `js/formHeader.js` : Script pour la logique de la page "Personnalisation des informations".
- `js/newInvoice.js` : Script pour la logique de la page d'affichage du devis/facture.
- `js/darkMode.js` : Script pour la gestion du mode sombre.
- `css/` : Répertoire contenant les fichiers CSS pour le style des pages.

## Utilisation

### Personnalisation de l'en-tête

1.  Accédez à la page "✏️ ┃ Modification des Informations" depuis la barre latérale.
2.  Remplissez les champs du formulaire avec les informations de votre entreprise (émetteur) et celles de votre client. Cela inclut les noms, adresses, informations fiscales (N° TVA, SIRET), coordonnées bancaires (IBAN, BIC), le nom et numéro du devis/facture, la date et l'URL de votre logo.
3.  Cliquez sur le bouton "Enregistrer" pour sauvegarder les informations dans le `localStorage` du navigateur. Ces informations seront ensuite utilisées pour peupler automatiquement l'aperçu du devis/facture.

### Ajouter des lignes

Pour ajouter des services ou des articles à votre devis/facture :

1.  **Navigation :** Accédez à la page "➕ ┃ Ajouter des Services" via le lien dans la barre latérale.
2.  **Remplir les champs du service :**
    *   **Service :** Entrez le nom ou le titre du service (par exemple, "Développement Web", "Consultation Graphique").
    *   **Description :** Fournissez une description plus détaillée du service.
    *   **Heures :** Saisissez le nombre d'heures ou la quantité. Ce champ accepte les valeurs décimales (ex: `2.5`).
    *   **Prix :** Indiquez le prix du service ou de l'article. Ce champ accepte également les valeurs décimales (ex: `50.75`).
3.  **Ajouter le service :** Cliquez sur le bouton "Ajouter un service". Le service apparaîtra comme une nouvelle ligne dans le tableau situé sous le formulaire.
4.  **Visualisation des services :** Le tableau affiche tous les services ajoutés. Le montant total (HT - Hors Taxes), visible en bas du tableau, se met à jour automatiquement à chaque ajout, modification ou suppression de ligne.

**Gestion des lignes de service :**

*   **Modifier une ligne :**
    1.  Double-cliquez sur n'importe quelle cellule de la ligne que vous souhaitez modifier.
    2.  Les champs de la ligne deviendront éditables.
    3.  Modifiez les informations souhaitées.
    4.  Pour sauvegarder, cliquez sur l'icône de sauvegarde (💾) qui apparaît à la fin de la ligne en mode édition, ou cliquez simplement n'importe où en dehors de la ligne.
*   **Supprimer une ligne :**
    1.  Cliquez sur l'icône de corbeille (🗑️) située à l'extrémité droite de la ligne de service que vous voulez enlever.
    2.  La ligne sera supprimée et le total sera recalculé.
*   **Réorganiser les lignes :**
    1.  Cliquez sur une ligne de service et maintenez le bouton de la souris enfoncé.
    2.  Faites glisser la ligne vers le haut ou vers le bas jusqu'à la position désirée dans le tableau.
    3.  Relâchez le bouton de la souris. L'ordre des lignes sera mis à jour et sauvegardé automatiquement.

### Aperçu et Export

- **Aperçu :** Naviguez vers "🔍 ┃ Aperçu de la Facture / Devis" pour voir le document avec toutes les informations et lignes saisies.
- **Importer JSON :** Utilisez le bouton "📂 Choisir un fichier JSON" puis "📥 Importer JSON" dans la barre latérale pour charger des données préalablement sauvegardées.
- **Enregistrer en JSON :** Cliquez sur "💾 Enregistrer en JSON" pour sauvegarder l'ensemble des données (informations de l'entreprise, du client, et lignes de service) dans un fichier JSON sur votre ordinateur.
- **Imprimer en PDF :** Utilisez "📄 Imprimer en PDF" pour générer une version PDF de votre devis/facture (utilise la fonction d'impression du navigateur).
- **Réinitialiser :** Le bouton "🗑️ Réinitialiser" (disponible sur certaines pages comme "Ajouter des Services" ou via la barre latérale) permet d'effacer les données stockées (selon la page, cela peut concerner les lignes de service ou toutes les données).

### Mode Sombre

Un interrupteur "Mode Sombre" est disponible en haut de la barre latérale pour basculer entre le thème clair et le thème sombre de l'application.
