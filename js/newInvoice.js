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
        // Assuming date is stored as YYYY-MM-DD or DD/MM/YYYY from localStorage
        let dateValue = dateElement.textContent;
        let parts = dateValue.split('/'); // Try DD/MM/YYYY
        if (parts.length === 3) {
            dateValue = `${parts[2]}-${parts[1]}-${parts[0]}`; // Convert to YYYY-MM-DD for Date constructor
        }
        // else assume it's YYYY-MM-DD
        
        const dateObj = new Date(dateValue); // Ensure reliable parsing
        if (!isNaN(dateObj.getTime())) { // Check if date is valid
             dateElement.textContent = dateObj.toLocaleDateString('fr-FR', {
                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
            });
        } else {
            console.warn("Could not parse date:", dateElement.textContent);
        }
    }

    // Ajouter les lignes du devis avec "Offert" si prix = 0
    const lignesDevis = JSON.parse(localStorage.getItem('lignesDevis')) || [];
    const tbody = document.querySelector('#tableauDevis tbody');

    if (tbody) { // Check if tbody exists
        lignesDevis.forEach(({ service, description, heures, prix }) => {
            const row = tbody.insertRow();
            row.insertCell().textContent = service;
            row.insertCell().textContent = description;
            // Ensure heures is a number before calling toFixed
            row.insertCell().textContent = (typeof heures === 'number') ? heures.toFixed(1) : parseFloat(heures || 0).toFixed(1);
            // Use strict numerical check for prix === 0
            row.insertCell().textContent = (prix === 0) ? "Offert" : ((typeof prix === 'number') ? prix.toFixed(2) : parseFloat(prix || 0).toFixed(2)) + " €";
        });
    } else {
        console.error("#tableauDevis tbody not found!");
    }

    calculerTotal();
};

function calculerTotal() {
    const tbody = document.querySelector('#tableauDevis tbody');
    if (!tbody) {
      if(document.getElementById('totalAmount')) {
         document.getElementById('totalAmount').textContent = '0.00 €';
      }
      return;
    }

    let total = [...tbody.querySelectorAll('tr')] // Use tbody directly
        .reduce((sum, row) => {
            if (row.cells.length < 4) return sum; // Skip malformed rows
            let prixText = row.cells[3].textContent;
            let prix = 0;
            if (prixText === "Offert") {
                prix = 0;
            } else {
                // Remove currency symbol and any non-numeric characters except decimal point
                prix = parseFloat(prixText.replace(/[^\d.-]/g, '').replace(',', '.')) || 0;
            }
            return sum + prix;
        }, 0);

    if(document.getElementById('totalAmount')) {
        document.getElementById('totalAmount').textContent = `${total.toFixed(2)} €`;
    }
}
