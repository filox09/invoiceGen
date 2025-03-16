function enregistrerDonnees() {
    const fields = [
        'companyNomPrenom', 'companyNomEntreprise', 'companyAdresse', 'companyEmail', 'companyTva', 'companySiret',
        'nomPrenom', 'nomEntreprise', 'adresse', 'email', 'tva', 'siret', 'devisName', 'devisNumero', 'logoUrl',
        'devisDate', 'iban', 'bic'
    ];

    fields.forEach(field => {
        let value = document.getElementById(field)?.value;
        if (field === 'devisDate') value = new Date(value).toISOString().split('T')[0];
        localStorage.setItem(field, value);
    });

    Swal.fire({
        title: 'Données enregistrées !',
        icon: 'success',
        showConfirmButton: false,
        timer: 2000
    });
}
// Affichage de la méthode de paiement sélectionnée
document.addEventListener("DOMContentLoaded", function () {
    const paymentSelect = document.querySelector("select[name='paymentType']");

    paymentSelect.addEventListener("change", function () {
        localStorage.setItem("selectedPaymentType", this.value);
    });

    // Vérifier si un choix a déjà été enregistré et sélectionner la bonne option
    const savedPaymentType = localStorage.getItem("selectedPaymentType");
    if (savedPaymentType) {
        paymentSelect.value = savedPaymentType;
    }
});

function chargerDonnees() {
    const forms = [document.getElementById('clientForm2'), document.getElementById('clientForm')];
    const defaultValues = { iban: 'FR76 1234 5678 9012 3456 7890 123', bic: 'ABCDEFGHXXX' };

    Object.keys(localStorage).forEach(key => {
        let value = localStorage.getItem(key);
        try { value = JSON.parse(value); } catch (e) {}

        forms.forEach(form => {
            if (form?.elements[key]) form.elements[key].value = value;
        });
    });

    Object.entries(defaultValues).forEach(([key, val]) => {
        if (!localStorage.getItem(key)) document.getElementById(key).textContent = val;
    });
}

document.addEventListener('DOMContentLoaded', chargerDonnees);


