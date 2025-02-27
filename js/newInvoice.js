window.onload = function() {

    // Récupérer les données du localStorage
    const companyNomPrenom = localStorage.getItem('companyNomPrenom');
    const companyNomEntreprise = localStorage.getItem('companyNomEntreprise');
    const companyAdresse = localStorage.getItem('companyAdresse');
    const companyEmail = localStorage.getItem('companyEmail');
    const companyTva = localStorage.getItem('companyTva');
    const companySiret = localStorage.getItem('companySiret');
    const nomPrenom = localStorage.getItem('nomPrenom');
    const nomEntreprise = localStorage.getItem('nomEntreprise');
    const adresse = localStorage.getItem('adresse');
    const email = localStorage.getItem('email');
    const tva = localStorage.getItem('tva');
    const siret = localStorage.getItem('siret');
    const devisName = localStorage.getItem('devisName');
    const devisNumero = localStorage.getItem('devisNumero');
    const lignesDevis = JSON.parse(localStorage.getItem('lignesDevis')) || [];
    const logoUrl = localStorage.getItem('logoUrl');
    const devisDate = localStorage.getItem('devisDate');
    const iban = localStorage.getItem('iban');
    const bic = localStorage.getItem('bic');

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

function allerAuBackOffice() {
    window.location.href = 'formulaire.html';
}

function goToIndex() {
    // Rediriger vers la page index.html
    window.location.href = 'index.html';
}

document.getElementById('print-btn').addEventListener('click', function () {
    window.print();
});