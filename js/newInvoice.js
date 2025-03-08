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

    // Ajouter les lignes du devis
    const lignesDevis = JSON.parse(localStorage.getItem('lignesDevis')) || [];
    const tbody = document.querySelector('#tableauDevis tbody');
    lignesDevis.forEach(({ service, description, heures, prix }) => {
        const row = tbody.insertRow();
        [service, description, heures.toFixed(1), prix.toFixed(2)].forEach(text => row.insertCell().textContent = text);
    });
    
    calculerTotal();
};

function calculerTotal() {
    let total = [...document.querySelectorAll('#tableauDevis tbody tr')]
        .reduce((sum, row) => sum + parseFloat(row.cells[3].textContent || 0), 0);
    document.getElementById('totalAmount').textContent = `${total.toFixed(2)} €`;
}

function goToIndex() {
    window.location.href = '../index.html';
}

function importerJson() {
    const file = document.getElementById('uploadJson').files[0];
    if (!file) return Swal.fire('Erreur', 'Veuillez sélectionner un fichier JSON.', 'error');
    
    const reader = new FileReader();
    reader.onload = event => {
        try {
            const data = JSON.parse(event.target.result);
            Object.entries(data).forEach(([key, value]) =>
                localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value))
            );
            Swal.fire('Succès', 'Données importées avec succès !', 'success').then(() => location.reload());
        } catch (error) {
            Swal.fire('Erreur', 'Erreur lors de la lecture du fichier JSON.', 'error');
        }
    };
    reader.readAsText(file);
}

function enregistrerJson() {
    const keys = [
        'companyNomPrenom', 'companyNomEntreprise', 'companyAdresse', 'companyEmail', 'companyTva', 'companySiret',
        'nomPrenom', 'nomEntreprise', 'adresse', 'email', 'tva', 'siret', 'devisName', 'devisNumero', 'devisDate', 'logoUrl',
        'iban', 'bic', 'lignesDevis'
    ];
    
    const data = Object.fromEntries(keys.map(key => [key, localStorage.getItem(key)]));
    const fileName = `${data.devisName?.replace(/\s+/g, '_') || 'Devis'}-${data.devisNumero?.replace(/\s+/g, '_') || 'Sans_Numéro'}.json`;

    Swal.fire({ title: 'Enregistrer le fichier JSON ?', text: fileName, icon: 'question', showCancelButton: true })
        .then(result => {
            if (result.isConfirmed) {
                const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                const a = Object.assign(document.createElement('a'), { href: URL.createObjectURL(blob), download: fileName });
                a.click();
                Swal.fire('Succès !', 'Le fichier a été enregistré avec succès.', 'success');
            }
        });
}

document.getElementById('print-btn').addEventListener('click', () => window.print());
document.getElementById('save-json-btn').addEventListener('click', enregistrerJson);
