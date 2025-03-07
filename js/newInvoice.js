window.onload = function() {

    // Récupérer les données du localStorage et les afficher sans guillemets
    const companyNomPrenom = JSON.parse(localStorage.getItem('companyNomPrenom'));
    const companyNomEntreprise = JSON.parse(localStorage.getItem('companyNomEntreprise'));
    const companyAdresse = JSON.parse(localStorage.getItem('companyAdresse'));
    const companyEmail = JSON.parse(localStorage.getItem('companyEmail'));
    const companyTva = JSON.parse(localStorage.getItem('companyTva'));
    const companySiret = JSON.parse(localStorage.getItem('companySiret'));
    const nomPrenom = JSON.parse(localStorage.getItem('nomPrenom'));
    const nomEntreprise = JSON.parse(localStorage.getItem('nomEntreprise'));
    const adresse = JSON.parse(localStorage.getItem('adresse'));
    const email = JSON.parse(localStorage.getItem('email'));
    const tva = JSON.parse(localStorage.getItem('tva'));
    const siret = JSON.parse(localStorage.getItem('siret'));
    const devisName = JSON.parse(localStorage.getItem('devisName'));
    const devisNumero = JSON.parse(localStorage.getItem('devisNumero'));
    const lignesDevis = JSON.parse(localStorage.getItem('lignesDevis')) || [];
    const logoUrl = JSON.parse(localStorage.getItem('logoUrl'));
    const devisDate = JSON.parse(localStorage.getItem('devisDate'));
    const iban = JSON.parse(localStorage.getItem('iban'));
    const bic = JSON.parse(localStorage.getItem('bic'));

    // Mettre à jour les informations dans le devis
    if (companyNomPrenom) document.getElementById('companyNomPrenom').textContent = companyNomPrenom;
    if (companyNomEntreprise) {
        document.getElementById('companyNomEntreprise').textContent = companyNomEntreprise;
        document.getElementById('footerCompanyNomEntreprise').textContent = companyNomEntreprise;
    }
    if (companyAdresse) document.getElementById('companyAdresse').textContent = companyAdresse;
    if (companyEmail) {
        document.getElementById('companyEmail').textContent = companyEmail;
        document.getElementById('footerCompanyEmail').textContent = companyEmail;
        document.getElementById('footerCompanyEmail').href = `mailto:${companyEmail}`;
    }
    if (companyTva) document.getElementById('companyTva').textContent = companyTva;
    if (companySiret) document.getElementById('companySiret').textContent = companySiret;
    if (nomPrenom) document.getElementById('nomPrenom').textContent = nomPrenom;
    if (nomEntreprise) document.getElementById('nomEntreprise').textContent = nomEntreprise;
    if (adresse) document.getElementById('adresseEntreprise').textContent = adresse;
    if (email) document.getElementById('emailEntreprise').textContent = email;
    if (tva) document.getElementById('tvaEntreprise').textContent = tva;
    if (siret) document.getElementById('siretEntreprise').textContent = siret;
    if (devisName) document.getElementById('devisName').textContent = devisName;
    if (devisNumero) document.getElementById('devisNumero').textContent = devisNumero;
    if (logoUrl) {
        const logoElement = document.getElementById('logoAdd');
        logoElement.src = logoUrl;
    }
    if (devisDate) document.getElementById('iban').textContent = iban;
    if (devisDate) document.getElementById('bic').textContent = bic;
    if (devisDate) document.getElementById('devisDate').textContent = devisDate;

    // Formater la date en toutes lettres en français
    const dateElement = document.getElementById('devisDate');
    const dateStr = dateElement.textContent;
    const dateParts = dateStr.split('/');
    const date = new Date(`${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`);

    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = date.toLocaleDateString('fr-FR', options);

    dateElement.textContent = formattedDate;

    // Ajouter les lignes au tableau
    const tableauDevis = document.getElementById('tableauDevis').getElementsByTagName('tbody')[0];
    lignesDevis.forEach(ligne => {
        const nouvelleLigne = tableauDevis.insertRow();
        nouvelleLigne.insertCell(0).textContent = ligne.service;
        nouvelleLigne.insertCell(1).textContent = ligne.description;
        nouvelleLigne.insertCell(2).textContent = ligne.heures.toFixed(1);
        nouvelleLigne.insertCell(3).textContent = ligne.prix.toFixed(2);
    });

    // Calculer le total initial
    calculerTotal();
};

function calculerTotal() {
    // Calculer le total des prix
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
        // Alerte SweetAlert2 pour indiquer l'absence de fichier
        Swal.fire({
            title: 'Erreur',
            text: 'Veuillez sélectionner un fichier JSON.',
            icon: 'error',
            confirmButtonText: 'OK'
        });
        return;
    }

    const reader = new FileReader();
    reader.onload = function(event) {
        try {
            const data = JSON.parse(event.target.result);

            // Enregistrer les données dans le localStorage sans les convertir en chaîne JSON
            Object.keys(data).forEach(key => {
                // On stocke directement les objets, sans utiliser JSON.stringify
                localStorage.setItem(key, JSON.stringify(data[key]));
            });

            // Alerte SweetAlert2 pour confirmer l'importation réussie
            Swal.fire({
                title: 'Succès',
                text: 'Données importées avec succès !',
                icon: 'success',
                showConfirmButton: false,
                timer: 1000
            }).then(() => {
                location.reload(); // Recharger la page pour appliquer les nouvelles données
            });
        } catch (error) {
            // Alerte SweetAlert2 pour indiquer une erreur lors de la lecture du fichier JSON
            Swal.fire({
                title: 'Erreur',
                text: 'Erreur lors de la lecture du fichier JSON.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
            console.error(error);
        }
    };

    reader.readAsText(file);
}

// Fonction pour rediriger vers index.html
function goToIndex() {
    window.location.href = 'index.html';
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