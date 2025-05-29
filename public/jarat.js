const jaratArray = [];
const jaratTable = document.getElementById('jaratTable');

document.getElementById('jaratForm').addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const jaratData = Object.fromEntries(formData);

    jaratData.jarat_id = parseInt(jaratData.jarat_id);

    // Küldés a szervernek
    fetch('/jarat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(jaratData)
    })
    .then(res => res.text())
    .then(msg => {
        alert(msg);
        // Hozzáadás a táblázathoz
        jaratArray.push(jaratData);
        renderTable();
        e.target.reset();
    })
    .catch(err => {
        console.error('Hiba történt:', err);
        alert('Hiba történt a mentés során.');
    });
});

function renderTable() {
    jaratTable.innerHTML = jaratArray.map((jarat, index) => `
        <tr>
            <td>${index + 1}</td>
            <td>${jarat.jarat_id}</td>
            <td>${jarat.jarat_szam}</td>
            <td>${jarat.indulasi_hely}</td>
            <td>${jarat.erkezesi_hely}</td>
            <td>${jarat.indulasi_ido.replace('T', ' ')}</td>
            <td>${jarat.erkezesi_ido.replace('T', ' ')}</td>
        </tr>
    `).join('');
}

// Opció: induláskor lekérni az eddigi adatokat
fetch('/jarat')
    .then(res => res.json())
    .then(data => {
        jaratArray.push(...data);
        renderTable();
    })
    .catch(console.error);
