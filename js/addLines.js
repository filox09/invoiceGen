window.onload = function() {
    // Récupérer les lignes du localStorage
    const lignesDevis = JSON.parse(localStorage.getItem('lignesDevis')) || [];

    // Récupérer le tbody du tableau d'aperçu
    const previewBody = document.getElementById('previewBody');

    // Ajouter chaque ligne au tableau
    lignesDevis.forEach((ligne, index) => {
        const nouvelleLigne = previewBody.insertRow();
        nouvelleLigne.insertCell(0).textContent = ligne.service;
        nouvelleLigne.insertCell(1).textContent = ligne.description;
        nouvelleLigne.insertCell(2).textContent = ligne.heures.toFixed(1);
        nouvelleLigne.insertCell(3).textContent = ligne.prix.toFixed(2);

        const deleteCell = nouvelleLigne.insertCell(4);
        const deleteButton = document.createElement('button');
        deleteButton.className = 'delete-button';
        deleteButton.textContent = 'Supprimer';
        deleteButton.onclick = function() {
            supprimerLigne(nouvelleLigne);
        };
        deleteCell.appendChild(deleteButton);
    });
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

        // Ajouter la ligne à l'aperçu
        const previewBody = document.getElementById('previewBody');
        const nouvelleLigne = previewBody.insertRow();
        nouvelleLigne.insertCell(0).textContent = service;
        nouvelleLigne.insertCell(1).textContent = description;
        nouvelleLigne.insertCell(2).textContent = heures.toFixed(1);
        nouvelleLigne.insertCell(3).textContent = prix.toFixed(2);

        const deleteCell = nouvelleLigne.insertCell(4);
        const deleteButton = document.createElement('button');
        deleteButton.className = 'delete-button';
        deleteButton.textContent = 'Supprimer';
        deleteButton.onclick = function() {
            supprimerLigne(nouvelleLigne);
        };
        deleteCell.appendChild(deleteButton);

        // Réinitialiser les champs du formulaire
        document.getElementById('service').value = '';
        document.getElementById('description').value = '';
        document.getElementById('heures').value = '';
        document.getElementById('prix').value = '';
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
}

function viderLocalStorage() {
    // Vider le localStorage
    localStorage.clear();
    window.location.reload();
}

function newInvoice() {
    // Rediriger vers la page newInvoice.html
    window.location.href = 'newInvoice.html';
}

function goToIndex() {
    // Rediriger vers la page index.html
    window.location.href = 'index.html';
}
