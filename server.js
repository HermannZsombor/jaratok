const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

// GET '/' kiszolgálja a jarat.html-t
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'jarat.html'));
});

// Adatbázis létrehozása
const db = new sqlite3.Database('jaratdb.db');

db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS jarat (
            jarat_id INTEGER PRIMARY KEY,
            jarat_szam TEXT,
            indulasi_hely TEXT,
            erkezesi_hely TEXT,
            indulasi_ido TEXT,
            erkezesi_ido TEXT
        )
    `);
});

// POST: adatok mentése
app.post('/jarat', (req, res) => {
    const { jarat_id, jarat_szam, indulasi_hely, erkezesi_hely, indulasi_ido, erkezesi_ido } = req.body;

    const stmt = db.prepare(`
        INSERT INTO jarat (jarat_id, jarat_szam, indulasi_hely, erkezesi_hely, indulasi_ido, erkezesi_ido)
        VALUES (?, ?, ?, ?, ?, ?)
    `);
    stmt.run(jarat_id, jarat_szam, indulasi_hely, erkezesi_hely, indulasi_ido, erkezesi_ido, (err) => {
        if (err) {
            console.error('Hiba az adat mentésekor:', err);
            res.status(500).send('Adatbázis hiba.');
        } else {
            res.status(200).send('Sikeres mentés.');
        }
    });
    stmt.finalize();
});

// GET: összes járat lekérése
app.get('/jarat', (req, res) => {
    db.all('SELECT * FROM jarat', (err, rows) => {
        if (err) {
            res.status(500).send('Adatbázis lekérdezési hiba.');
        } else {
            res.json(rows);
        }
    });
});

app.listen(port, () => {
    console.log(`Szerver fut: http://localhost:${port}`);
});
