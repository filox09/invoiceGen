window.onload = function () {
    const elements = {
        companyNomPrenom: 'companyNomPrenom',
        companyNomEntreprise: ['companyNomEntreprise', 'footerCompanyNomEntreprise'],
        companyAdresse: 'companyAdresse',
        companyEmail: ['companyEmail', 'footerCompanyEmail'],
        companyTva: 'companyTva',
        companySiret: 'companySiret',
        nomPrenom: 'nomPrenom',
        nomEntreprise: 'nomEntreprise',
        adresse: 'adresseEntreprise',
        email: 'emailEntreprise',
        tva: 'tvaEntreprise',
        siret: 'siretEntreprise',
        devisName: 'devisName',
        devisNumero: 'devisNumero',
        logoUrl: 'logoAdd',
        devisDate: 'devisDate',
        iban: 'iban',
        bic: 'bic'
    };

    // Mettre à jour les éléments HTML avec les données du localStorage
    Object.entries(elements).forEach(([key, ids]) => {
        const value = localStorage.getItem(key);
        if (value) {
            (Array.isArray(ids) ? ids : [ids]).forEach(id => {
                const element = document.getElementById(id);
                if (element) {
                    if (id === 'companyEmail' || id === 'footerCompanyEmail') {
                        element.href = `mailto:${value}`;
                    }
                    element.textContent = value;
                }
            });
        }
    });

    // Afficher le logo
    const logoUrl = localStorage.getItem('logoUrl');
    if (logoUrl) document.getElementById('logoAdd').src = logoUrl;

    // Formater et afficher la date
    const dateElement = document.getElementById('devisDate');
    if (dateElement && dateElement.textContent) {
        const [day, month, year] = dateElement.textContent.split('/');
        dateElement.textContent = new Date(`${year}-${month}-${day}`).toLocaleDateString('fr-FR', {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
        });
    }

    // Ajouter les lignes du devis avec "Offert" si prix = 0
    const lignesDevis = JSON.parse(localStorage.getItem('lignesDevis')) || [];
    const tbody = document.querySelector('#tableauDevis tbody');

    lignesDevis.forEach(({ service, description, heures, prix }) => {
        const row = tbody.insertRow();
        row.insertCell().textContent = service;
        row.insertCell().textContent = description;
        row.insertCell().textContent = heures.toFixed(1);
        row.insertCell().textContent = (prix === 0 || prix === "0.00") ? "Offert" : prix.toFixed(2) + " €";
    });

    calculerTotal();
};

function calculerTotal() {
    let total = [...document.querySelectorAll('#tableauDevis tbody tr')].reduce((sum, row) => {
        let prixText = row.cells[3].textContent;
        let prix = prixText === "Offert" ? 0 : parseFloat(prixText.replace(" €", "")) || 0;
        return sum + prix;
    }, 0);

    // Met à jour le total
    document.getElementById('totalAmount').textContent = `${total.toFixed(2)} €`;

    // Calcul de l'acompte et du solde (moitié du total)
    let acompte = (total / 2).toFixed(2) + "€";
    let solde = (total / 2).toFixed(2) + "€";

    // Met à jour les spans correspondants
    document.getElementById('acompte').textContent = acompte;
    document.getElementById('solde').textContent = solde;
}

document.addEventListener("DOMContentLoaded", function () {
    const forfaitTerms = document.querySelector(".payment-terms-forfait");
    const devisTerms = document.querySelector(".payment-terms-devis");

    // Vérifier la valeur stockée dans le localStorage
    const savedPaymentType = localStorage.getItem("selectedPaymentType") || "devis"; // Valeur par défaut = devis

    if (savedPaymentType === "forfait") {
        forfaitTerms.style.display = "block";
        devisTerms.style.display = "none";
    } else {
        forfaitTerms.style.display = "none";
        devisTerms.style.display = "block";
    }
});

// Modalité de paement

document.addEventListener("DOMContentLoaded", function () {
    const forfaitTerms = document.querySelector(".payment-terms-forfait");
    const devisTerms = document.querySelector(".payment-terms-devis");

    // Vérifier la valeur stockée dans le localStorage
    const savedPaymentType = localStorage.getItem("selectedPaymentType") || "devis"; // Valeur par défaut = devis

    if (savedPaymentType === "forfait") {
        forfaitTerms.style.display = "block";
        devisTerms.style.display = "none";
    } else {
        forfaitTerms.style.display = "none";
        devisTerms.style.display = "block";
    }

    // Ajout d'un éditeur WYSIWYG au double-clic
    forfaitTerms.addEventListener("dblclick", function ()   {
        // Rendre la liste éditable
        forfaitTerms.contentEditable = true;
        forfaitTerms.focus();

        // Quand on quitte l'édition, on sauvegarde et désactive l'édition
        forfaitTerms.addEventListener("blur", function () {
            forfaitTerms.contentEditable = false;
            localStorage.setItem("forfaitTermsContent", forfaitTerms.innerHTML); // Sauvegarde
        });
    });

    // Charger les termes sauvegardés si existent
    const savedContent = localStorage.getItem("forfaitTermsContent");
    if (savedContent) {
        forfaitTerms.innerHTML = savedContent;
    }
});
