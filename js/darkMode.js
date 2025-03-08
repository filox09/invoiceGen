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