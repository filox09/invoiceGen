console.log("commonApp.js loaded");

function createSidebar() {
    const sidebarHTML = `
        <!-- Bouton du menu burger -->
        <button type="button" class="burger-menu" aria-label="Toggle menu" onclick="toggleSidebar(this)">
            <svg class="burger-icon" viewBox="0 0 24 24" width="24" height="24">
                <path d="M3 6h18M3 12h18M3 18h18" stroke="#292929" stroke-width="2" stroke-linecap="round" />
            </svg>
            <svg class="close-icon" viewBox="0 0 24 24" width="24" height="24">
                <path d="M6 6l12 12M6 18L18 6" stroke="#ffffff" stroke-width="2" stroke-linecap="round" />
            </svg>
        </button>

        <!-- Barre latérale -->
        <div id="sidebar" class="sidebar">
            <div class="dark-mode-toggle">
                <span class="toggle-text">Mode Sombre</span>
                <label class="switch">
                    <input type="checkbox" id="darkModeToggle">
                    <span class="slider"></span>
                </label>
            </div>
            <a role="button" tabindex="0" onclick="goToIndex()">🏠 ┃ Accueil</a>
            <a role="button" tabindex="0" onclick="newInvoice()">🔍 ┃ Aperçu de la Facture / Devis</a>
            <a role="button" tabindex="0" onclick="formHeader()">✏️ ┃ Modification des Informations</a>
            <a role="button" tabindex="0" onclick="addLines()">➕ ┃ Ajouter des Services</a>
            <div class="upload-container">
                <input type="file" id="uploadJson" accept=".json" class="file-input">
                <label for="uploadJson" class="file-label">📂 Choisir un fichier JSON</label>
                <button class="md-button" onclick="importerJson()">📥 Importer JSON</button>
                <button class="md-button" id="reinitialisation">🗑️ Réinitialiser</button>
                <button id="save-json-btn">💾 Enregistrer en JSON</button>
                <button id="print-btn">📄 Imprimer en PDF</button>
            </div>
        </div>
    `;
    // Prepend the sidebar to the body. This way, we don't need a dedicated container.
    document.body.insertAdjacentHTML('afterbegin', sidebarHTML);
}

function toggleSidebar(element) {
    const sidebar = document.getElementById('sidebar');
    const burgerMenu = document.querySelector('.burger-menu'); // Burger menu
    if (sidebar.style.width === '250px') {
        sidebar.style.width = '0';
        // Additional style for burger menu when sidebar is closed
        burgerMenu.classList.remove('open'); 
    } else {
        sidebar.style.width = '250px';
        // Additional style for burger menu when sidebar is open
        burgerMenu.classList.add('open');
    }
}

function goToIndex() {
  if (window.location.pathname.includes('/html/')) {
    window.location.href = '../index.html';
  } else {
    window.location.href = 'index.html';
  }
}

function newInvoice() {
  if (window.location.pathname.includes('/html/')) {
    window.location.href = 'newInvoice.html'; // Already in html folder
  } else {
    window.location.href = 'html/newInvoice.html';
  }
}

function formHeader() {
  if (window.location.pathname.includes('/html/')) {
    window.location.href = 'formulaire.html'; // Already in html folder
  } else {
    window.location.href = 'html/formulaire.html';
  }
}

function addLines() {
  if (window.location.pathname.includes('/html/')) {
    window.location.href = 'addLines.html'; // Already in html folder
  } else {
    window.location.href = 'html/addLines.html';
  }
}
