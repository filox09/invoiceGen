window.onload = function() {
    // Récupérer les données du localStorage et les afficher sans guillemets
    const keys = [
        "companyNomPrenom", "companyNomEntreprise", "companyAdresse", "companyEmail", "companyTva", "companySiret",
        "nomPrenom", "nomEntreprise", "adresse", "email", "tva", "siret", "devisName", "devisNumero", "devisDate", "logoUrl",
        "iban", "bic", "lignesDevis"
    ];
    
    const data = {};
    keys.forEach(key => {
        data[key] = JSON.parse(localStorage.getItem(key));
    });

    // Mettre à jour les éléments HTML avec les données
    Object.keys(data).forEach(key => {
        const element = document.getElementById(key);
        if (element) {
            if (key === "logoUrl") {
                element.src = data[key];
            } else {
                element.textContent = data[key];
            }
        }
    });

    // Formater la date
    const dateElement = document.getElementById("devisDate");
    if (dateElement && data.devisDate) {
        const dateParts = data.devisDate.split("/");
        const date = new Date(`${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`);
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        dateElement.textContent = date.toLocaleDateString('fr-FR', options);
    }

    // Ajouter les lignes au tableau
    const tableauDevis = document.getElementById('tableauDevis').getElementsByTagName('tbody')[0];
    if (data.lignesDevis) {
        data.lignesDevis.forEach(ligne => {
            const nouvelleLigne = tableauDevis.insertRow();
            nouvelleLigne.insertCell(0).textContent = ligne.service;
            nouvelleLigne.insertCell(1).textContent = ligne.description;
            nouvelleLigne.insertCell(2).textContent = ligne.heures.toFixed(1);
            nouvelleLigne.insertCell(3).textContent = ligne.prix.toFixed(2);
        });
    }

    // Calculer le total
    calculerTotal();
};

function calculerTotal() {
    const lignes = document.querySelectorAll('#tableauDevis tbody tr');
    let total = 0;
    lignes.forEach(ligne => {
        const prix = parseFloat(ligne.cells[3].textContent);
        if (!isNaN(prix)) {
            total += prix;
        }
    });
    document.getElementById('totalAmount').textContent = total.toFixed(2) + ' €';
}

function importerJson() {
    const input = document.getElementById('uploadJson');
    const file = input.files[0];
    if (!file) {
        Swal.fire({ title: 'Erreur', text: 'Veuillez sélectionner un fichier JSON.', icon: 'error', confirmButtonText: 'OK' });
        return;
    }

    const reader = new FileReader();
    reader.onload = function(event) {
        try {
            const data = JSON.parse(event.target.result);
            Object.keys(data).forEach(key => localStorage.setItem(key, JSON.stringify(data[key])));
            Swal.fire({ title: 'Succès', text: 'Données importées avec succès !', icon: 'success', confirmButtonText: 'OK' })
                .then(() => location.reload());
        } catch (error) {
            Swal.fire({ title: 'Erreur', text: 'Erreur lors de la lecture du fichier JSON.', icon: 'error', confirmButtonText: 'OK' });
            console.error(error);
        }
    };
    reader.readAsText(file);
}

function enregistrerJson() {
    const keys = [
        "companyNomPrenom", "companyNomEntreprise", "companyAdresse", "companyEmail", "companyTva", "companySiret",
        "nomPrenom", "nomEntreprise", "adresse", "email", "tva", "siret", "devisName", "devisNumero", "devisDate", "logoUrl",
        "iban", "bic", "lignesDevis"
    ];
    
    const data = {};
    keys.forEach(key => {
        data[key] = JSON.parse(localStorage.getItem(key));
    });

    // Générer un nom de fichier dynamique : "TitreDuDevis-NuméroDevis.json"
    const devisName = data.devisName ? data.devisName.replace(/\s+/g, '_') : "Devis";
    const devisNumero = data.devisNumero ? data.devisNumero.replace(/\s+/g, '_') : "Sans_Numéro";
    const fileName = `${devisName}-${devisNumero}.json`;

    // Afficher l'alerte de confirmation avant l'enregistrement
    Swal.fire({
        title: "Enregistrer le fichier JSON ?",
        text: `"${fileName}" `,
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Oui",
        cancelButtonText: "Annuler"
    }).then((result) => {
        if (result.isConfirmed) {
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
            const a = document.createElement("a");
            a.href = URL.createObjectURL(blob);
            a.download = fileName;
            a.click();

            Swal.fire({
                title: "Succès !",
                text: "Le fichier a été enregistré avec succès.",
                icon: "success",
                showConfirmButton: false,
                timer: 1000
            });
        }
    });
}

document.getElementById('print-btn').addEventListener('click', () => window.print());
document.getElementById('save-json-btn').addEventListener('click', enregistrerJson);
