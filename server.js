const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createPool({
  host: 'db-bank-sampah-living-lab.a.aivencloud.com',
  port: 10930,
  user: 'avnadmin',
  password: 'AVNS_yZywdfugfIAbTlBzkjy',
  database: 'defaultdb',
  ssl: { rejectUnauthorized: false }, 
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});
// Endpoint Test Server
app.get('/', (req, res) => {
  res.send('API Bank Sampah Berjalan Online!');
});

// Endpoint Login
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const [rows] = await db.query(
      'SELECT id, nama, username, role FROM users WHERE username = ? AND password = ?',
      [username, password]
    );
    if (rows.length === 0) {
      return res.status(401).json({ status: 'error', message: 'Username atau password salah' });
    }
    res.json({ status: 'success', message: 'Login berhasil', user: rows[0] });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Endpoint Register
app.post('/api/masyarakat/register', async (req, res) => {
  const { nama, username, password, nik } = req.body;
  try {
    const [result] = await db.query(
      'INSERT INTO users (nama, username, password, role, nik) VALUES (?, ?, ?, ?, ?)',
      [nama, username, password, 'masyarakat', nik]
    );
    res.status(201).json({
      status: 'success',
      message: 'Registrasi berhasil',
      data: { id: result.insertId, nama, username, role: 'masyarakat', nik }
    });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ status: 'error', message: 'Username sudah digunakan' });
    }
    res.status(500).json({ status: 'error', message: error.message });
  }
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// WAJIB Ditambahkan untuk Vercel Serverless:
module.exports = app;