window.onload = function () {
    const lignesDevis = JSON.parse(localStorage.getItem('lignesDevis')) || [];
    const previewBody = document.getElementById('previewBody');
    const emptyMessage = document.getElementById('emptyMessage');
    let editingRow = null;

    function fetchSVG(url) {
        return fetch(url).then(response => response.text());
    }

    function updateTotal() {
        const totalPrice = lignesDevis.reduce((total, ligne) => total + ligne.prix, 0);
        document.getElementById('totalPrice').textContent = `${totalPrice.toFixed(2)} €`;
    }

    function checkEmptyTable() {
        emptyMessage.style.display = lignesDevis.length === 0 ? 'block' : 'none';
    }

    function handleDragStart(e) {
        if (editingRow) return;
        e.dataTransfer.setData('text/plain', e.target.dataset.index);
        e.target.classList.add('dragging');
    }

    function handleDragOver(e) {
        e.preventDefault();
        const draggingRow = document.querySelector('.dragging');
        const rows = Array.from(previewBody.querySelectorAll('tr'));
        const currentRow = e.target.closest('tr');
        const currentRowIndex = rows.indexOf(currentRow);
        const draggingRowIndex = rows.indexOf(draggingRow);

        if (currentRowIndex > draggingRowIndex) {
            previewBody.insertBefore(draggingRow, currentRow.nextSibling);
        } else {
            previewBody.insertBefore(draggingRow, currentRow);
        }
    }

    function handleDragEnd(e) {
        e.target.classList.remove('dragging');
        const rows = Array.from(previewBody.querySelectorAll('tr'));
        const newOrder = rows.map(row => lignesDevis[row.dataset.index]);
        localStorage.setItem('lignesDevis', JSON.stringify(newOrder));
        window.location.reload();
    }

    function editLigne(index) {
        if (editingRow !== null) return;
        editingRow = index;
        const row = previewBody.rows[index];
        const cells = row.cells;

        row.draggable = false;

        for (let i = 0; i < cells.length - 1; i++) {
            const cell = cells[i];
            const input = document.createElement('input');
            input.type = 'text';
            input.value = cell.textContent;
            input.classList.add('editable-field');
            cell.textContent = '';
            cell.appendChild(input);
        }
    }

    function saveLigne(index) {
        const row = previewBody.rows[index];
        const cells = row.cells;

        const updatedLigne = {
            service: cells[0].querySelector('input').value,
            description: cells[1].querySelector('input').value,
            heures: parseFloat(cells[2].querySelector('input').value),
            prix: parseFloat(cells[3].querySelector('input').value)
        };

        lignesDevis[index] = updatedLigne;
        localStorage.setItem('lignesDevis', JSON.stringify(lignesDevis));
        window.location.reload();
    }

    document.addEventListener('dblclick', function (e) {
        if (editingRow !== null) {
            const row = previewBody.rows[editingRow];
            if (!row.contains(e.target)) {
                saveLigne(editingRow);
                editingRow = null;
            }
        }
    });

    lignesDevis.forEach((ligne, index) => {
        const nouvelleLigne = previewBody.insertRow();
        nouvelleLigne.dataset.index = index;
        nouvelleLigne.draggable = true;
        nouvelleLigne.innerHTML = `
            <td>${ligne.service}</td>
            <td>${ligne.description}</td>
            <td>${ligne.heures.toFixed(1)}</td>
            <td>${ligne.prix.toFixed(2)} €</td>
            <td class="actions-cell">
                <button class="delete-button"></button>
            </td>
        `;

        fetchSVG('../assets/trashIcon.svg').then(svgContent => {
            nouvelleLigne.querySelector('.delete-button').innerHTML = svgContent;
        });

        nouvelleLigne.querySelector('.delete-button').onclick = () => supprimerLigne(index);
        nouvelleLigne.addEventListener('dblclick', () => editLigne(index));
        nouvelleLigne.addEventListener('dragstart', handleDragStart);
        nouvelleLigne.addEventListener('dragover', handleDragOver);
        nouvelleLigne.addEventListener('dragend', handleDragEnd);
    });

    updateTotal();
    checkEmptyTable();
    // Vérifier si une ligne a été ajoutée avant le rechargement
    if (localStorage.getItem('ligneAjoutee') === 'true') {
        let lignesDevis = JSON.parse(localStorage.getItem('lignesDevis')) || [];
        let lignesCount = lignesDevis.length;

        // Définir les seuils où les notifications doivent apparaître
        if (lignesCount === 1 || lignesCount === 5 || lignesCount === 10) {
            showToast(
                "Cliquez deux fois sur une ligne pour la modifier.", 
                "info", 
                5000, 
                () => showToast("Modifiez l’ordre de vos services en les faisant glisser", "info", 5000)
            );
        }

        // Supprimer l'indicateur d'ajout de ligne
        localStorage.removeItem('ligneAjoutee');
    }

    
};

function ajouterLigne() {
    const service = document.getElementById('service').value;
    const description = document.getElementById('description').value;
    const heures = parseFloat(document.getElementById('heures').value);
    const prix = parseFloat(document.getElementById('prix').value);

    if (service && description && !isNaN(heures) && !isNaN(prix)) {
        let lignesDevis = JSON.parse(localStorage.getItem('lignesDevis')) || [];
        lignesDevis.push({ service, description, heures, prix });
        localStorage.setItem('lignesDevis', JSON.stringify(lignesDevis));

        // Stocker un indicateur avant de recharger la page
        localStorage.setItem('ligneAjoutee', 'true');

        // Recharger la page immédiatement
        location.reload();
    } else {
        Swal.fire({
            title: 'Erreur',
            text: 'Veuillez renseigner tous les champs correctement.',
            icon: 'error',
            confirmButtonText: 'OK',
            customClass: { confirmButton: 'custom-swal-button' }
        });
    }
}

function supprimerLigne(index) {
    let lignesDevis = JSON.parse(localStorage.getItem('lignesDevis')) || [];
    lignesDevis.splice(index, 1);
    localStorage.setItem('lignesDevis', JSON.stringify(lignesDevis));
    window.location.reload();
}

function showToast(message, type, duration, nextToast = null) {
    Swal.fire({
        toast: true,
        position: 'top-end',
        icon: type,
        title: message,
        showConfirmButton: false,
        timer: duration,
        timerProgressBar: true,
        background: "#292929",
        color: "#fff",
        allowOutsideClick: true,
        didOpen: (toast) => {
            toast.style.cursor = "pointer";
            toast.addEventListener("click", () => {
                Swal.close();
                if (nextToast) {
                    setTimeout(nextToast, 500); // Laisse le temps à l'animation de fermeture
                }
            });
        },
        didClose: () => { 
            if (nextToast) {
                setTimeout(nextToast, 800); // Ajoute un léger délai pour une transition fluide
            }
        },
        customClass: { 
            popup: 'custom-toast', 
            timerProgressBar: 'swal2-timer-progress-bar' 
        }
    });
}





// Ajout du style pour améliorer l'affichage des toasts
const toastStyle = document.createElement('style');
toastStyle.innerHTML = `
    .custom-toast {
        margin-top: 10px !important;
        border-radius: 8px !important;
        box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2) !important;
        cursor: pointer !important; /* Curseur pointeur partout */
    }
    .swal2-icon, .swal2-title {
        cursor: pointer !important; /* Curseur aussi sur l'icône et le texte */
    }
    .swal2-container {
        z-index: 9999 !important;
    }
    .swal2-timer-progress-bar {
        background: rgba(255, 255, 255, 0.7) !important; /* Barre plus claire pour le dark mode */
        height: 5px !important; /* Assure qu'elle est bien visible */
    }
`;
document.head.appendChild(toastStyle);
