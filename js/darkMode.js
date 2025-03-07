document.addEventListener("DOMContentLoaded", function () {
    const toggleSwitch = document.getElementById("darkModeToggle");
    const body = document.body;

    // Vérifie si le mode sombre est activé dans le localStorage
    if (localStorage.getItem("darkMode") === "enabled") {
        body.classList.add("dark-mode");
        toggleSwitch.checked = true;
    }

    toggleSwitch.addEventListener("change", function () {
        if (toggleSwitch.checked) {
            body.classList.add("dark-mode");
            localStorage.setItem("darkMode", "enabled");
        } else {
            body.classList.remove("dark-mode");
            localStorage.setItem("darkMode", "disabled");
        }
    });
});
