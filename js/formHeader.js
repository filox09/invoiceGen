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

    // Convertir la date en format ISO 8601 (YYYY-MM-DD)
    const formattedDate = new Date(devisDate).toISOString().split('T')[0];

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
    localStorage.setItem('devisDate', formattedDate); // Utiliser la date formatée
    localStorage.setItem('iban', iban);
    localStorage.setItem('bic', bic);

    // Utiliser SweetAlert2 pour afficher une popup avec un bouton personnalisé
    Swal.fire({
        title: 'Succès!',
        text: 'Données enregistrées avec succès!',
        icon: 'success',
        draggable: true,
        showConfirmButton: false,
        timer: 1000
    });
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

function viderLocalStorage() {
    // Vider le localStorage
    localStorage.clear();
    Swal.fire({
        title: 'Succès!',
        text: 'Réinitialisation réussie !',
        icon: 'success',
        draggable: true,
        showConfirmButton: false,
        timer: 1000
    }).then(() => {
        window.location.reload();
    });
}

function chargerDonnees() {
    const form1 = document.getElementById('clientForm2');
    const form2 = document.getElementById('clientForm');

    // Définir les valeurs par défaut
    const defaultValues = {
        iban: 'FR76 1234 5678 9012 3456 7890 123',
        bic: 'ABCDEFGHXXX'
    };

    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        let value = localStorage.getItem(key);

        // Vérifier si la valeur est un objet JSON stringifié
        try {
            const parsedValue = JSON.parse(value);
            // Si la valeur est un objet ou tableau, on utilise le parsedValue
            value = parsedValue;
        } catch (e) {
            // Si l'analyse échoue, cela signifie que la valeur est une simple chaîne
        }

        // Mettre la valeur dans le formulaire
        if (form1.elements[key]) {
            form1.elements[key].value = value;
        }

        if (form2.elements[key]) {
            form2.elements[key].value = value;
        }
    }

    // Appliquer les valeurs par défaut si elles ne sont pas dans le localStorage
    if (!localStorage.getItem('iban')) {
        document.getElementById('iban').textContent = defaultValues.iban;
    }
    if (!localStorage.getItem('bic')) {
        document.getElementById('bic').textContent = defaultValues.bic;
    }
}

document.addEventListener('DOMContentLoaded', chargerDonnees);
