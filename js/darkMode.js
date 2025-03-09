document.addEventListener("DOMContentLoaded", function () {
    const toggleSwitch = document.getElementById("darkModeToggle");
    const body = document.body;
    const toggleText = document.querySelector(".toggle-text");

    function updateDarkMode(isDark) {
        body.classList.toggle("dark-mode", isDark);
        toggleSwitch.checked = isDark;
        toggleText.textContent = isDark ? "Mode Clair" : "Mode Sombre";
    }

    // Vérifie le mode enregistré dans localStorage
    let darkMode = localStorage.getItem("darkMode");
    if (darkMode === null) {
        // Pas de préférence enregistrée, on suit la préférence système
        darkMode = window.matchMedia("(prefers-color-scheme: dark)").matches ? "enabled" : "disabled";
    }

    updateDarkMode(darkMode === "enabled");

    // Écouteur sur le toggle switch
    toggleSwitch.addEventListener("change", function () {
        const newMode = toggleSwitch.checked ? "enabled" : "disabled";
        localStorage.setItem("darkMode", newMode);
        updateDarkMode(toggleSwitch.checked);
    });
});

// Sidebar
function toggleSidebar(x) {
    var sidebar = document.getElementById("sidebar");
    if (sidebar.style.width === "300px") {
        sidebar.style.width = "0";
    } else {
        sidebar.style.width = "300px";
    }
    x.classList.toggle("change");
}

function importerJson() {
    const file = document.getElementById('uploadJson').files[0];
    if (!file) return Swal.fire({ title: "Erreur", text: "Veuillez sélectionner un fichier JSON.", icon: "error", showConfirmButton: false, timer: 2000 });

    
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