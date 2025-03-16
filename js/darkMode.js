document.addEventListener("DOMContentLoaded", () => {
    const toggleSwitch = document.getElementById("darkModeToggle");
    const body = document.body;
    const toggleText = document.querySelector(".toggle-text");
    const sidebar = document.getElementById("sidebar");

    const updateDarkMode = isDark => {
        body.classList.toggle("dark-mode", isDark);
        toggleSwitch.checked = isDark;
        toggleText.textContent = isDark ? "☀️" : "🌙";
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
        if (!file) return Swal.fire({ title: "Erreur", text: "Veuillez sélectionner un fichier JSON.", icon: "error", showConfirmButton: false, timer: 3000 });

        const reader = new FileReader();
        reader.onload = event => {
            try {
                Object.entries(JSON.parse(event.target.result)).forEach(([key, value]) =>
                    localStorage.setItem(key, typeof value === "string" ? value : JSON.stringify(value))
                );
                Swal.fire({ title: "Données importées !", icon: "success", showConfirmButton: false, timer: 2000 }).then(() => location.reload());
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

            Swal.fire({ 
                title: "Enregistrer le fichier JSON ?", 
                text: fileName, 
                icon: "question", 
                showCancelButton: true, 
                cancelButtonText: "Annuler" 
            }).then(result => {
                if (result.isConfirmed) {
                    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
                    Object.assign(document.createElement("a"), { href: URL.createObjectURL(blob), download: fileName }).click();
                    Swal.fire("Fichier enregistré avec succès", "", "success");
                }
            });
    };

    document.getElementById("reinitialisation").addEventListener("click", () => {
        Swal.fire({
            title: "Êtes-vous sûr de vouloir réinitialiser ?",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Oui",
            cancelButtonText: "Annuler"
        }).then((result) => {
            if (result.isConfirmed) {
                localStorage.clear();
                window.location.reload();
            }
        });
    });
    document.getElementById("print-btn").addEventListener("click", () => {
        const body = document.body;
        const toggleSwitch = document.getElementById("darkModeToggle"); // Sélectionne le toggle
        const darkModeEnabled = body.classList.contains("dark-mode");
    
        if (darkModeEnabled) {
            body.classList.remove("dark-mode");
            toggleSwitch.checked = false; // Désactive le switch
        }
    
        setTimeout(() => {
            window.print();
    
            if (darkModeEnabled) {
                body.classList.add("dark-mode");
                toggleSwitch.checked = true; // Réactive le switch
            }
        }, 100);
    });
    
    document.getElementById("save-json-btn").addEventListener("click", enregistrerJson);
    const typeRedirect = (page) => {
        const isGithubPages = window.location.hostname.includes("github.io");
        const isLocal = window.location.hostname === "localhost" || window.location.protocol.includes("file");
        
        let repoName = "";
        if (isGithubPages) {
            repoName = `/${window.location.pathname.split('/')[1]}`;
        }
        
        const newPath = isLocal ? `/${page}.html` : `${repoName}/${page}.html`;
        window.location.href = newPath;
    };
    
    window.formHeader = () => typeRedirect("html/formulaire");
    window.addLines = () => typeRedirect("html/addLines");
    window.newInvoice = () => typeRedirect("html/newInvoice");
    window.goToIndex = () => typeRedirect("index");
    
    

    window.toggleSidebar = toggleSidebar;
    window.importerJson = importerJson;
});
