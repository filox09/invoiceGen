window.onload = function() {
    // Récupérer les lignes du localStorage
    const lignesDevis = JSON.parse(localStorage.getItem('lignesDevis')) || [];

    // Récupérer le tbody du tableau d'aperçu
    const previewBody = document.getElementById('previewBody');

    // Function to fetch SVG content
    function fetchSVG() {
        return fetch('assets/trashIcon.svg')
            .then(response => response.text());
    }

    // Function to update the total price
    function updateTotal() {
        const totalPrice = lignesDevis.reduce((total, ligne) => total + ligne.prix, 0);
        document.getElementById('totalPrice').textContent = `${totalPrice.toFixed(2)} €`;
    }

    // Ajouter chaque ligne au tableau
    lignesDevis.forEach((ligne, index) => {
        const nouvelleLigne = previewBody.insertRow();
        nouvelleLigne.insertCell(0).textContent = ligne.service;
        nouvelleLigne.insertCell(1).textContent = ligne.description;
        nouvelleLigne.insertCell(2).textContent = ligne.heures.toFixed(1);
        nouvelleLigne.insertCell(3).textContent = `${ligne.prix.toFixed(2)} €`; // Ajouter le symbole €

        // Créer une cellule pour le bouton supprimer
        const deleteCell = nouvelleLigne.insertCell(4);
        deleteCell.className = 'delete-cell';
        const deleteButton = document.createElement('button');
        deleteButton.className = 'delete-button';

        // Fetch and set the SVG content
        fetchSVG().then(svgContent => {
            deleteButton.innerHTML = svgContent;
        });

        deleteButton.onclick = function() {
            supprimerLigne(nouvelleLigne);
        };
        deleteCell.appendChild(deleteButton);
    });

    // Initial update of the total price
    updateTotal();
};

function ajouterLigne() {
    // Récupérer les valeurs des champs de formulaire
    const service = document.getElementById('service').value;
    const description = document.getElementById('description').value;
    const heures = parseFloat(document.getElementById('heures').value);
    const prix = parseFloat(document.getElementById('prix').value);

    if (service && description && !isNaN(heures) && !isNaN(prix)) {
        // Récupérer les lignes existantes du localStorage ou initialiser un tableau vide
        let lignesDevis = JSON.parse(localStorage.getItem('lignesDevis')) || [];

        // Ajouter la nouvelle ligne
        lignesDevis.push({ service, description, heures, prix });

        // Stocker les lignes mises à jour dans le localStorage
        localStorage.setItem('lignesDevis', JSON.stringify(lignesDevis));

        // Réinitialiser les champs du formulaire
        document.getElementById('service').value = '';
        document.getElementById('description').value = '';
        document.getElementById('heures').value = '';
        document.getElementById('prix').value = '';

        // Recharger la page pour mettre à jour l'aperçu
        window.location.reload();
    } else {
        alert('Veuillez remplir tous les champs avec des valeurs valides.');
    }
}

function supprimerLigne(ligne) {
    // Récupérer l'index de la ligne à supprimer
    const ligneIndex = ligne.rowIndex - 1; // -1 car rowIndex est basé sur l'index dans le tbody

    // Récupérer les lignes du localStorage
    let lignesDevis = JSON.parse(localStorage.getItem('lignesDevis')) || [];

    // Supprimer la ligne du tableau
    lignesDevis.splice(ligneIndex, 1);

    // Mettre à jour le localStorage
    localStorage.setItem('lignesDevis', JSON.stringify(lignesDevis));

    // Supprimer la ligne de l'aperçu
    ligne.remove();

    // Mettre à jour le total
    window.location.reload();
    updateTotal();
    
}

function viderLocalStorage() {
    // Vider le localStorage
    localStorage.clear();
    Swal.fire({
        title: 'Succès!',
        text: 'Mémoire vidée avec succès!',
        icon: 'success',
        draggable: true,
        showConfirmButton: false,
        timer: 1000
    }).then(() => {
        window.location.reload();
    });
}

function newInvoice() {
    // Rediriger vers la page newInvoice.html
    window.location.href = 'newInvoice.html';
}

function goToIndex() {
    // Rediriger vers la page index.html
    window.location.href = 'index.html';
}
