document.addEventListener("DOMContentLoaded", function () {
    const toggleSwitch = document.getElementById("darkModeToggle");
    const body = document.body;
    const toggleText = document.querySelector(".toggle-text");  // Récupère l'élément pour changer le texte

    // Fonction pour activer le mode sombre basé sur la préférence système
    function activateDarkModeBasedOnSystem() {
        if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
            body.classList.add("dark-mode");
            toggleSwitch.checked = true;
            toggleText.textContent = "Mode Clair";  // Texte quand le mode sombre est activé
        } else {
            toggleText.textContent = "Mode Sombre";  // Texte quand le mode clair est activé
        }
    }

    // Vérifie si le mode sombre est activé dans le localStorage
    if (localStorage.getItem("darkMode") === "enabled") {
        body.classList.add("dark-mode");
        toggleSwitch.checked = true;
        toggleText.textContent = "Mode Clair";  // Texte pour le mode clair
    } else if (localStorage.getItem("darkMode") === "disabled") {
        body.classList.remove("dark-mode");
        toggleSwitch.checked = false;
        toggleText.textContent = "Mode Sombre";  // Texte pour le mode sombre
    } else {
        // Si le mode n'est pas défini dans le localStorage, on applique la préférence système
        activateDarkModeBasedOnSystem();
    }

    // Écoute le changement de la préférence du mode sombre du système
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", function (e) {
        if (e.matches) {
            body.classList.add("dark-mode");
            localStorage.setItem("darkMode", "enabled");
            toggleSwitch.checked = true;
            toggleText.textContent = "Mode Clair";  // Texte pour le mode clair
        } else {
            body.classList.remove("dark-mode");
            localStorage.setItem("darkMode", "disabled");
            toggleSwitch.checked = false;
            toggleText.textContent = "Mode Sombre";  // Texte pour le mode sombre
        }
    });

    // Gestion du basculement manuel via le switch
    toggleSwitch.addEventListener("change", function () {
        if (toggleSwitch.checked) {
            body.classList.add("dark-mode");
            localStorage.setItem("darkMode", "enabled");
            toggleText.textContent = "Mode Clair";  // Texte pour le mode clair
        } else {
            body.classList.remove("dark-mode");
            localStorage.setItem("darkMode", "disabled");
            toggleText.textContent = "Mode Sombre";  // Texte pour le mode sombre
        }
    });
});
