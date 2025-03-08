window.onload = function () {
    const lignesDevis = JSON.parse(localStorage.getItem('lignesDevis')) || [];
    const previewBody = document.getElementById('previewBody');
    const emptyMessage = document.getElementById('emptyMessage');

    function fetchSVG() {
        return fetch('../assets/trashIcon.svg').then(response => response.text());
    }

    function updateTotal() {
        const totalPrice = lignesDevis.reduce((total, ligne) => total + ligne.prix, 0);
        document.getElementById('totalPrice').textContent = `${totalPrice.toFixed(2)} €`;
    }

    function checkEmptyTable() {
        emptyMessage.style.display = lignesDevis.length === 0 ? 'block' : 'none';
    }

    lignesDevis.forEach((ligne, index) => {
        const nouvelleLigne = previewBody.insertRow();
        nouvelleLigne.innerHTML = `
            <td>${ligne.service}</td>
            <td>${ligne.description}</td>
            <td>${ligne.heures.toFixed(1)}</td>
            <td>${ligne.prix.toFixed(2)} €</td>
            <td class="delete-cell"><button class="delete-button"></button></td>
        `;
        
        fetchSVG().then(svgContent => {
            nouvelleLigne.querySelector('.delete-button').innerHTML = svgContent;
        });
        
        nouvelleLigne.querySelector('.delete-button').onclick = () => supprimerLigne(index);
    });

    updateTotal();
    checkEmptyTable();
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
        window.location.reload();
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

const style = document.createElement('style');
style.innerHTML = `.custom-swal-button { background-color: #292929 !important; color: white !important; }`;
document.head.appendChild(style);

function supprimerLigne(index) {
    let lignesDevis = JSON.parse(localStorage.getItem('lignesDevis')) || [];
    lignesDevis.splice(index, 1);
    localStorage.setItem('lignesDevis', JSON.stringify(lignesDevis));
    window.location.reload();
}

function viderLocalStorage() {
    localStorage.clear();
    Swal.fire({
        title: 'Succès!',
        text: 'Réinitialisation réussie !',
        icon: 'success',
        showConfirmButton: false,
        timer: 1000
    }).then(() => window.location.reload());
}

function newInvoice() { window.location.href = '../html/newInvoice.html'; }
function goToIndex() { window.location.href = '../index.html'; }
