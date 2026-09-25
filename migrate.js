const mysql = require('mysql2/promise');

async function runMigration() {
  try {
    // 1. Koneksi ke Database Aiven
    const connection = await mysql.createConnection({
      host: 'db-bank-sampah-living-lab.a.aivencloud.com',      // contoh: mysql-xxxx.aivencloud.com
      port: 10930,      // contoh: 12345 (tanpa tanda petik)
      user: 'avnadmin',
      password: 'AVNS_yZywdfugfIAbTlBzkjy',
      database: 'defaultdb',
      ssl: { rejectUnauthorized: false }        // Wajib untuk Aiven
    });

    console.log(' Terhubung ke Database Aiven!');

    // 2. Query Pembuatan Tabel
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nama VARCHAR(100) NOT NULL,
        username VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role ENUM('admin_bank', 'masyarakat') NOT NULL,
        nik VARCHAR(20) NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // 3. Query Masukkan Data Awal
    const insertDataSQL = `
      INSERT IGNORE INTO users (nama, username, password, role, nik) VALUES
      ('Admin Bank', 'admin', '123', 'admin_bank', NULL),
      ('David Sean', 'warga1', '123', 'masyarakat', '167112345');
    `;

    // Eksekusi Query
    await connection.query(createTableSQL);
    console.log(' Tabel `users` berhasil dibuat!');

    await connection.query(insertDataSQL);
    console.log(' Data awal pengguna berhasil dimasukkan!');

    await connection.end();
    console.log(' Selesai!');
  } catch (error) {
    console.error(' Error:', error.message);
  }
}

runMigration();