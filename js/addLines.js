// Global-like variables for the script
let lignesDevis = [];
let previewBody;
let emptyMessage;
let editingRow = null; // Index of the row currently being edited

// Utility to fetch SVG content
function fetchSVG(url) {
    return fetch(url).then(response => response.text()).catch(err => console.error("SVG Fetch Error:", err));
}

// Update total price display
function updateTotal() {
    const totalPrice = lignesDevis.reduce((total, ligne) => total + (parseFloat(ligne.prix) || 0), 0);
    if (document.getElementById('totalPrice')) {
        document.getElementById('totalPrice').textContent = `${totalPrice.toFixed(2)} €`;
    }
}

// Check if table is empty and show/hide message
function checkEmptyTable() {
    if (emptyMessage) {
        emptyMessage.style.display = lignesDevis.length === 0 ? 'block' : 'none';
    }
}

// Handle drag start event
function handleDragStart(e) {
    if (editingRow !== null) { // Don't allow dragging while editing
        e.preventDefault(); 
        return;
    }
    // Ensure the target is a draggable row directly
    if (!e.target.draggable || !e.target.classList.contains('draggable-row')) {
        e.preventDefault();
        return;
    }
    e.dataTransfer.setData('text/plain', e.target.dataset.index);
    e.target.classList.add('dragging');
}

// Handle drag over event
function handleDragOver(e) {
    e.preventDefault();
    const draggingRow = document.querySelector('.draggable-row.dragging'); // More specific selector
    if (!draggingRow) return;
    
    const currentHoverRow = e.target.closest('.draggable-row');
    if (!currentHoverRow || currentHoverRow === draggingRow) return;

    const rows = Array.from(previewBody.querySelectorAll('.draggable-row'));
    const hoverIndex = rows.indexOf(currentHoverRow);
    const draggingIndex = rows.indexOf(draggingRow);

    if (hoverIndex > draggingIndex) {
        previewBody.insertBefore(draggingRow, currentHoverRow.nextSibling);
    } else {
        previewBody.insertBefore(draggingRow, currentHoverRow);
    }
}

// Handle drag end event
function handleDragEnd(e) {
    const draggingRow = e.target.closest('.draggable-row.dragging');
    if (!draggingRow) return;
    
    draggingRow.classList.remove('dragging');
    
    const rows = Array.from(previewBody.querySelectorAll('.draggable-row'));
    const newOrderedDevis = [];
    rows.forEach(row => {
        // dataset.index should be updated by renderTable if it was called before drag end,
        // or it reflects the original index if renderTable was not called.
        const indexInCurrentLignesDevis = parseInt(row.dataset.index, 10);
        newOrderedDevis.push(lignesDevis[indexInCurrentLignesDevis]);
    });
    
    lignesDevis = newOrderedDevis;
    localStorage.setItem('lignesDevis', JSON.stringify(lignesDevis));
    renderTable(); 
}


// Allow editing a line
function editLigne(index) {
    if (editingRow !== null && editingRow !== index) {
        saveLigne(editingRow); 
    }
    if (editingRow === index && index !==null) return; // Already in edit mode for this row.

    editingRow = index;
    renderTable(); 
    
    const rowToEdit = previewBody.rows[index]; 
    if (rowToEdit && rowToEdit.cells[0] && rowToEdit.cells[0].querySelector('input.editable-field')) {
         rowToEdit.cells[0].querySelector('input.editable-field').focus();
    }
}

// Save an edited line
function saveLigne(index) {
    if (editingRow !== index || index === null) return; 

    const row = previewBody.rows[index]; 
    if (!row) { editingRow = null; renderTable(); return; } 

    const serviceInput = row.cells[0].querySelector('input.editable-field');
    const descriptionInput = row.cells[1].querySelector('input.editable-field');
    const heuresInput = row.cells[2].querySelector('input.editable-field');
    const prixInput = row.cells[3].querySelector('input.editable-field');

    if (!serviceInput) { 
        editingRow = null; 
        // If not in edit mode, no need to re-render unless state is inconsistent
        // renderTable(); 
        return;
    }

    const updatedLigne = {
        service: serviceInput.value,
        description: descriptionInput.value,
        heures: parseFloat(heuresInput.value) || 0,
        prix: parseFloat(prixInput.value) || 0
    };

    lignesDevis[index] = updatedLigne;
    localStorage.setItem('lignesDevis', JSON.stringify(lignesDevis));
    editingRow = null; 
    renderTable(); 
}

// Function to render a single line in the table
function renderLigne(ligne, index) {
    const nouvelleLigne = previewBody.insertRow();
    nouvelleLigne.dataset.index = index; 
    nouvelleLigne.classList.add('draggable-row'); 

    if (editingRow === index) {
        nouvelleLigne.draggable = false; 
        nouvelleLigne.innerHTML = `
            <td><input type="text" class="editable-field" value="${ligne.service || ''}"></td>
            <td><input type="text" class="editable-field" value="${ligne.description || ''}"></td>
            <td><input type="number" step="0.1" class="editable-field" value="${(typeof ligne.heures === 'number' ? ligne.heures.toFixed(1) : '0.0')}"></td>
            <td><input type="number" step="0.01" class="editable-field" value="${(typeof ligne.prix === 'number' ? ligne.prix.toFixed(2) : '0.00')}"></td>
            <td class="actions-cell">
                <button class="save-button" title="Enregistrer"></button>
            </td>
        `;
        fetchSVG('../assets/saveIcon.svg').then(svgContent => { 
            const saveButton = nouvelleLigne.querySelector('.save-button');
            if (saveButton) saveButton.innerHTML = svgContent;
        }).catch(e => {
            console.error("Error fetching save icon:", e);
            const saveButton = nouvelleLigne.querySelector('.save-button');
            if (saveButton) saveButton.textContent = "💾"; // Fallback text
        });
        
        const saveButton = nouvelleLigne.querySelector('.save-button');
        if (saveButton) {
            saveButton.onclick = (event) => {
                event.stopPropagation();
                saveLigne(index);
            };
        }
    } else {
        nouvelleLigne.draggable = true;
        nouvelleLigne.innerHTML = `
            <td title="Double-cliquez pour éditer">${ligne.service || ''}</td>
            <td title="Double-cliquez pour éditer">${ligne.description || ''}</td>
            <td title="Double-cliquez pour éditer">${(typeof ligne.heures === 'number' ? ligne.heures.toFixed(1) : '0.0')}</td>
            <td title="Double-cliquez pour éditer">${(typeof ligne.prix === 'number' ? ligne.prix.toFixed(2) + ' €' : '0.00 €')}</td>
            <td class="actions-cell">
                <button class="delete-button" title="Supprimer"></button>
            </td>
        `;
        fetchSVG('../assets/trashIcon.svg').then(svgContent => {
            const deleteButton = nouvelleLigne.querySelector('.delete-button');
            if (deleteButton) deleteButton.innerHTML = svgContent;
        }).catch(e => {
            console.error("Error fetching delete icon:", e);
            const deleteButton = nouvelleLigne.querySelector('.delete-button');
            if (deleteButton) deleteButton.textContent = "🗑️"; // Fallback text
        });

        const deleteButton = nouvelleLigne.querySelector('.delete-button');
        if (deleteButton) {
            deleteButton.onclick = (event) => {
                event.stopPropagation();
                supprimerLigne(index);
            };
        }
        nouvelleLigne.addEventListener('dblclick', () => editLigne(index));
    }
    
    nouvelleLigne.addEventListener('dragstart', handleDragStart);
    nouvelleLigne.addEventListener('dragover', handleDragOver);
    nouvelleLigne.addEventListener('dragend', handleDragEnd);
}

function renderTable() {
    if (!previewBody) return;
    const currentScrollTop = previewBody.scrollTop;
    previewBody.innerHTML = ''; 
    lignesDevis.forEach((ligne, index) => {
        renderLigne(ligne, index);
    });
    previewBody.scrollTop = currentScrollTop;
    updateTotal();
    checkEmptyTable();
}

window.onload = function () {
    lignesDevis = JSON.parse(localStorage.getItem('lignesDevis')) || [];
    previewBody = document.getElementById('previewBody');
    emptyMessage = document.getElementById('emptyMessage');
    
    renderTable();

    document.addEventListener('click', function(event) {
        if (editingRow !== null) {
            const editingRowElement = previewBody.rows[editingRow]; 
            if (editingRowElement && !editingRowElement.contains(event.target)) {
                if (!event.target.closest('.save-button') && !event.target.closest('.delete-button') && !event.target.closest('td[onclick^="editLigne"]')) {
                    // Check if the target is an input field within the editing row, allow interaction
                    if (!event.target.classList.contains('editable-field')) {
                        saveLigne(editingRow);
                    }
                }
            }
        }
    }, true); 
};

function ajouterLigne() {
    const serviceInput = document.getElementById('service');
    const descriptionInput = document.getElementById('description');
    const heuresInput = document.getElementById('heures');
    const prixInput = document.getElementById('prix');

    const service = serviceInput.value.trim();
    const description = descriptionInput.value.trim();
    const heures = parseFloat(heuresInput.value);
    const prix = parseFloat(prixInput.value);

    if (service && description && !isNaN(heures) && heures >= 0 && !isNaN(prix) && prix >= 0) {
        lignesDevis.push({ service, description, heures, prix });
        localStorage.setItem('lignesDevis', JSON.stringify(lignesDevis));
        
        renderTable(); 

        serviceInput.value = '';
        descriptionInput.value = '';
        heuresInput.value = '';
        prixInput.value = '';

        showToast("Service ajouté avec succès !", "success");
    } else {
        Swal.fire({
            title: 'Erreur',
            text: 'Veuillez renseigner tous les champs correctement. Les heures et prix doivent être des nombres positifs.',
            icon: 'error',
            confirmButtonText: 'OK',
            customClass: { confirmButton: 'custom-swal-button' }
        });
    }
}

function showToast(message, type) {
    Swal.fire({
        toast: true,
        position: 'top-end',
        icon: type,
        title: message,
        showConfirmButton: false,
        timer: 2500, 
        timerProgressBar: true,
        background: "#292929",
        color: "#fff",
        customClass: { 
            popup: 'custom-toast', 
            timerProgressBar: 'custom-progress-bar'
        }
    });
}

if (!document.getElementById('customToastStyle')) {
    const toastStyle = document.createElement('style');
    toastStyle.id = 'customToastStyle';
    toastStyle.innerHTML = `
        .custom-toast {
            margin-top: 10px !important;
            border-radius: 8px !important;
            box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2) !important;
        }
        .swal2-container {
            z-index: 9999 !important;
        }
        .swal2-timer-progress-bar {
            background: rgba(255, 255, 255, 0.7) !important; 
        }
    `;
    document.head.appendChild(toastStyle);
}

function supprimerLigne(index) {
    if (index >= 0 && index < lignesDevis.length) {
        lignesDevis.splice(index, 1);
        localStorage.setItem('lignesDevis', JSON.stringify(lignesDevis));
        // If deleting the row that was being edited, reset editingRow
        if (editingRow === index) {
            editingRow = null;
        }
        renderTable(); 
    } else {
        console.error("Invalid index for supprimerLigne:", index);
    }
}

function viderLocalStorage() {
    lignesDevis = []; 
    localStorage.setItem('lignesDevis', JSON.stringify(lignesDevis)); 
    editingRow = null; // Reset editing state as all rows are gone
    renderTable(); 
    Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: 'Réinitialisation réussie !',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
        background: "#292929",
        color: "#fff",
        customClass: { popup: 'custom-toast' }
    });
}

// Ensure SVGs are loaded, provide fallbacks if needed
document.addEventListener('DOMContentLoaded', () => {
    // This is just a conceptual check, actual SVG loading is async in renderLigne
    // You might want to pre-fetch SVGs or handle missing ones more gracefully.
    console.log("addLines.js DOMContentLoaded and script running.");
});
```
