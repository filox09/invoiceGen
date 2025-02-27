function enregistrerDonnees() {
    // Récupérer les valeurs des champs de formulaire
    const companyNomPrenom = document.getElementById('companyNomPrenom').value;
    const companyNomEntreprise = document.getElementById('companyNomEntreprise').value;
    const companyAdresse = document.getElementById('companyAdresse').value;
    const companyEmail = document.getElementById('companyEmail').value;
    const companyTva = document.getElementById('companyTva').value;
    const companySiret = document.getElementById('companySiret').value;
    const nomPrenom = document.getElementById('nomPrenom').value;
    const nomEntreprise = document.getElementById('nomEntreprise').value;
    const adresse = document.getElementById('adresse').value;
    const email = document.getElementById('email').value;
    const tva = document.getElementById('tva').value;
    const siret = document.getElementById('siret').value;
    const devisName = document.getElementById('devisName').value;
    const devisNumero = document.getElementById('devisNumero').value;
    const logoUrl = document.getElementById('logoUrl').value;
    const devisDate = document.getElementById('devisDate').value;
    const iban = document.getElementById('iban').value;
    const bic = document.getElementById('bic').value;

    // Afficher les valeurs récupérées dans la console pour débogage
    //console.log('logoUrl:', logoUrl);

    // Stocker les données dans le localStorage
    localStorage.setItem('companyNomPrenom', companyNomPrenom);
    localStorage.setItem('companyNomEntreprise', companyNomEntreprise);
    localStorage.setItem('companyAdresse', companyAdresse);
    localStorage.setItem('companyEmail', companyEmail);
    localStorage.setItem('companyTva', companyTva);
    localStorage.setItem('companySiret', companySiret);
    localStorage.setItem('nomPrenom', nomPrenom);
    localStorage.setItem('nomEntreprise', nomEntreprise);
    localStorage.setItem('adresse', adresse);
    localStorage.setItem('email', email);
    localStorage.setItem('tva', tva);
    localStorage.setItem('siret', siret);
    localStorage.setItem('devisName', devisName);
    localStorage.setItem('devisNumero', devisNumero);
    localStorage.setItem('logoUrl', logoUrl);
    localStorage.setItem('devisDate', devisDate);
    localStorage.setItem('iban', iban);
    localStorage.setItem('bic', bic);

    alert('Données enregistrées !');
}

function addLines() {
    // Rediriger vers la page addLines.html
    window.location.href = 'addLines.html';
}

function newInvoice() {
    // Rediriger vers la page newInvoice.html
    window.location.href = 'newInvoice.html';
}

function goToIndex() {
    window.location.href = 'index.html';
}
