document.addEventListener("DOMContentLoaded", () => {
    const toggleSwitch = document.getElementById("darkModeToggle");
    const body = document.body;
    const toggleText = document.querySelector(".toggle-text");
    const sidebar = document.getElementById("sidebar");

    const updateDarkMode = isDark => {
        body.classList.toggle("dark-mode", isDark);
        toggleSwitch.checked = isDark;
        toggleText.textContent = isDark ? "Mode Clair" : "Mode Sombre";
    };

    const darkMode = localStorage.getItem("darkMode") ?? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "enabled" : "disabled");
    updateDarkMode(darkMode === "enabled");

    toggleSwitch.addEventListener("change", () => {
        localStorage.setItem("darkMode", toggleSwitch.checked ? "enabled" : "disabled");
        updateDarkMode(toggleSwitch.checked);
    });

    // Sidebar
    const getSidebarTargetWidth = () => {
        sidebar.style.width = "auto";
        return (window.innerWidth <= 600 ? window.innerWidth : sidebar.scrollWidth) + "px";
    };

    const toggleSidebar = btn => {
        sidebar.classList.toggle("open");
        btn.classList.toggle("change");
        
        if (sidebar.classList.contains("open")) {
            sidebar.style.width = getSidebarTargetWidth();
            sidebar.style.transition = "0.3s ease-in-out";
        } else {
            sidebar.style.width = "0";
        }
    };

    window.addEventListener("resize", () => {
        if (sidebar.classList.contains("open")) {
            sidebar.style.width = getSidebarTargetWidth();
        }
    });

    // Gestion des fichiers JSON
    const importerJson = () => {
        const file = document.getElementById("uploadJson").files[0];
        if (!file) return Swal.fire({ title: "Erreur", text: "Veuillez sélectionner un fichier JSON.", icon: "error", timer: 2000 });

        const reader = new FileReader();
        reader.onload = event => {
            try {
                Object.entries(JSON.parse(event.target.result)).forEach(([key, value]) =>
                    localStorage.setItem(key, typeof value === "string" ? value : JSON.stringify(value))
                );
                Swal.fire("Données importées !", "", "success").then(() => location.reload());
            } catch {
                Swal.fire("Erreur", "Erreur lors de la lecture du fichier JSON.", "error");
            }
        };
        reader.readAsText(file);
    };

    const enregistrerJson = () => {
        const keys = ["companyNomPrenom", "companyNomEntreprise", "companyAdresse", "companyEmail", "companyTva", "companySiret", "nomPrenom", "nomEntreprise", "adresse", "email", "tva", "siret", "devisName", "devisNumero", "devisDate", "logoUrl", "iban", "bic", "lignesDevis"];
        const data = Object.fromEntries(keys.map(key => [key, localStorage.getItem(key)]));
        const fileName = `${data.devisName?.replace(/\s+/g, "_") || "Devis"}-${data.devisNumero?.replace(/\s+/g, "_") || "Sans_Numéro"}.json`;

        Swal.fire({ title: "Enregistrer le fichier JSON ?", text: fileName, icon: "question", showCancelButton: true })
            .then(result => {
                if (result.isConfirmed) {
                    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
                    Object.assign(document.createElement("a"), { href: URL.createObjectURL(blob), download: fileName }).click();
                    Swal.fire("Fichier enregistré avec succès", "", "success");
                }
            });
    };

    document.getElementById("reinitialisation").addEventListener("click", () => {
        localStorage.clear();
        Swal.fire({ title: "Réinitialisation réussie !", icon: "success", timer: 2000 }).then(() => window.location.reload());
    });
    document.getElementById("print-btn").addEventListener("click", () => window.print());
    document.getElementById("save-json-btn").addEventListener("click", enregistrerJson);

    const basePath = window.location.origin + window.location.pathname.split("/").slice(0, -1).join("/");
    const typeRedirect = page => window.location.href = `${basePath}/${page}.html`;
    
    window.formHeader = () => typeRedirect("html/formulaire");
    window.addLines = () => typeRedirect("html/addLines");
    window.newInvoice = () => typeRedirect("html/newInvoice");
    window.goToIndex = () => typeRedirect("index");
    

    window.toggleSidebar = toggleSidebar;
    window.importerJson = importerJson;
});
