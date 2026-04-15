const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname.replace(/\s+/g, '_'));
  }
});
const upload = multer({ storage: storage });

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Database configuration untuk XAMPP
// Default port XAMPP MySQL adalah 3306, akun 'root' tanpa password.
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: ''
};

let pool;

async function initDB() {
  try {
    // 1. Buat koneksi awal tanpa menspesifikkan database
    const connection = await mysql.createConnection(dbConfig);
    
    // 2. Buat database siakad_db jika belum ada di phpMyAdmin
    await connection.query('CREATE DATABASE IF NOT EXISTS siakad_db');
    console.log("✅ Database 'siakad_db' terhubung / berhasil dibuat!");
    
    // 3. Gunakan database tsb
    await connection.query('USE siakad_db');
    
    // 4. Inisiasi Tabel Otomatis
    // Tabel Users
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
         id VARCHAR(50) PRIMARY KEY,
         password VARCHAR(255) NOT NULL,
         role VARCHAR(20) NOT NULL,
         nama VARCHAR(150),
         prodi VARCHAR(100),
         foto VARCHAR(255),
         email VARCHAR(255),
         noHp VARCHAR(20),
         alamat TEXT,
         kota VARCHAR(100),
         tempatLahir VARCHAR(100),
         tanggalLahir VARCHAR(50),
         nik VARCHAR(50),
         namaIbu VARCHAR(100),
         NIP VARCHAR(50),
         jabatanAkademik VARCHAR(100),
         pendidikanSelesai VARCHAR(100),
         emailInstitusi VARCHAR(150)
      )
    `);

    // Tabel Matkuls
    await connection.query(`
      CREATE TABLE IF NOT EXISTS matkuls (
         id VARCHAR(50) PRIMARY KEY,
         nama VARCHAR(150),
         sks INT,
         semester INT,
         dosenId VARCHAR(50),
         ruang VARCHAR(50),
         jadwal VARCHAR(100)
      )
    `);

    // Tabel KRS (Bentuk Penyimpanan JSON Array String)
    await connection.query(`
      CREATE TABLE IF NOT EXISTS krs (
         id INT AUTO_INCREMENT PRIMARY KEY,
         userId VARCHAR(50),
         matkuls JSON,
         status VARCHAR(50)
      )
    `);

    // Tabel Nilai Akumulasi
    await connection.query(`
      CREATE TABLE IF NOT EXISTS nilai (
         userId_matkulId VARCHAR(100) PRIMARY KEY,
         tugas FLOAT,
         uts FLOAT,
         uas FLOAT,
         huruf VARCHAR(5)
      )
    `);

    // Tabel Absensi
    await connection.query(`
      CREATE TABLE IF NOT EXISTS absensi (
         userId_matkulId VARCHAR(100) PRIMARY KEY,
         pertemuan JSON,
         uts VARCHAR(2),
         uas VARCHAR(2)
      )
    `);

    // Tabel Tickets Pusat Bantuan Helpdesk
    await connection.query(`
      CREATE TABLE IF NOT EXISTS tickets (
         id VARCHAR(50) PRIMARY KEY,
         senderId VARCHAR(50),
         senderName VARCHAR(100),
         isGuest BOOLEAN,
         message TEXT,
         reply TEXT,
         status VARCHAR(20)
      )
    `);

    // Tabel Pustaka Ebooks
    await connection.query(`
      CREATE TABLE IF NOT EXISTS ebooks (
         id VARCHAR(50) PRIMARY KEY,
         judul VARCHAR(255),
         matkul VARCHAR(100),
         url TEXT,
         size VARCHAR(20),
         uploaderRole VARCHAR(20),
         timestamp VARCHAR(50)
      )
    `);

    // Tabel Indeks Keaktifan Mahasiswa (IKM - Points)
    await connection.query(`
      CREATE TABLE IF NOT EXISTS ikm_activities (
         id VARCHAR(50) PRIMARY KEY,
         nim VARCHAR(50),
         tanggal VARCHAR(50),
         smt VARCHAR(20),
         kategori VARCHAR(100),
         kegiatan VARCHAR(100),
         deskripsi TEXT,
         peringkat VARCHAR(50),
         fileSertifikat TEXT,
         fileFoto TEXT,
         poinAwal INT,
         poinValid INT,
         status VARCHAR(20),
         timestamp VARCHAR(50)
      )
    `);

    // Tabel Keuangan (SPP/UKT)
    await connection.query(`
      CREATE TABLE IF NOT EXISTS keuangan (
         id VARCHAR(50) PRIMARY KEY,
         nim VARCHAR(50),
         bulan VARCHAR(50),
         tagihan INT,
         status VARCHAR(20),
         jatuhTempo VARCHAR(50)
      )
    `);

    // Tabel Pengajuan (Submissions) CNP & TA
    await connection.query(`
      CREATE TABLE IF NOT EXISTS submissions (
         id VARCHAR(50) PRIMARY KEY,
         nim VARCHAR(50),
         kategori VARCHAR(50),
         tipe VARCHAR(150),
         fileUrl TEXT,
         status VARCHAR(20),
         timestamp VARCHAR(50)
      )
    `);

    // Tabel Log Bimbingan
    await connection.query(`
      CREATE TABLE IF NOT EXISTS bimbingan_logs (
         id VARCHAR(50) PRIMARY KEY,
         nim VARCHAR(50),
         kategori VARCHAR(50),
         tanggal VARCHAR(50),
         catatan TEXT,
         status VARCHAR(20),
         timestamp VARCHAR(50)
      )
    `);

    // Injeksi Default Super Admin "admin"
    const [adminRows] = await connection.query('SELECT id FROM users WHERE id = "admin"');
    if (adminRows.length === 0) {
       await connection.query(`INSERT INTO users (id, password, role, nama, prodi) VALUES ('admin', 'admin', 'admin', 'Super Admin IT', 'Sistem Informasi')`);
    }

    // Injeksi Default Dosen
    const [dosenRows] = await connection.query('SELECT id FROM users WHERE role = "dosen"');
    if(dosenRows.length === 0) {
       await connection.query(`INSERT INTO users (id, password, role, nama, prodi, jabatanAkademik) VALUES 
         ('dosen1', '123', 'dosen', 'Supriyadi, M.Kom.', 'Dosen Tetap', 'Lektor'),
         ('dosen2', '123', 'dosen', 'Rina, S.T., M.T.', 'Dosen Praktisi', 'Asisten Ahli')
       `);
    }

    // Injeksi Default Mahasiswa
    const [mhsRows] = await connection.query('SELECT id FROM users WHERE role = "mahasiswa"');
    if(mhsRows.length === 0) {
       await connection.query(`INSERT INTO users (id, password, role, nama, prodi, alamat, kota, tanggalLahir) VALUES 
         ('202301001', '123', 'mahasiswa', 'Bunga Citra', 'Manajemen Informatika', 'Jl. Merdeka No 1', 'Bandung', '2001-05-12'),
         ('202301002', '123', 'mahasiswa', 'Andi Nugroho', 'Komputerisasi Akuntansi', 'Jl. Sudirman No 4', 'Jakarta', '2002-11-20')
       `);
    }

    // Injeksi Default Keuangan
    const [keuanganRows] = await connection.query('SELECT id FROM keuangan');
    if(keuanganRows.length === 0) {
       await connection.query(`INSERT INTO keuangan (id, nim, bulan, tagihan, status, jatuhTempo) VALUES 
         ('KEU001', '202301001', 'September 2025', 1500000, 'Nunggak', '2025-09-10'),
         ('KEU002', '202301001', 'Oktober 2025', 1500000, 'Belum Lunas', '2025-10-10'),
         ('KEU003', '202301002', 'September 2025', 1500000, 'Lunas', '2025-09-10')
       `);
    }

    // Buat Pool Koneksi Fix (Lebih Optimal untuk Express Router)
    pool = mysql.createPool({
       host: 'localhost',
       user: 'root',
       password: '',
       database: 'siakad_db',
       waitForConnections: true,
       connectionLimit: 10,
       queueLimit: 0
    });

    console.log("✅ Tabel-tabel berhasil diverifikasi & terinisialisasi.");
  } catch (err) {
    console.error("❌ Gagal terhubung ke XAMPP MySQL. Tolong aktifkan service Apache dan MySQL di XAMPP Control Panel!");
    console.error(err);
  }
}

initDB();

// ========================
// API ENDPOINTS
// ========================

app.get('/', (req, res) => {
  res.send('API Backend Siakad Reborn Aktif!');
});

// -- USERS --
app.get('/api/users', async (req, res) => {
  if(!pool) return res.status(500).json({ error: 'DB_DISCONNECTED' });
  const [rows] = await pool.query('SELECT * FROM users');
  res.json(rows);
});

app.post('/api/users', async (req, res) => {
   const data = req.body;
   try {
     const keys = Object.keys(data).join(', ');
     const values = Object.values(data);
     const placeholders = values.map(() => '?').join(', ');
     await pool.query(`INSERT INTO users (${keys}) VALUES (${placeholders})`, values);
     res.json({ success: true, data });
   } catch(e) { res.status(500).json({error: e.message}); }
});

app.put('/api/users/:id', async (req, res) => {
   const data = req.body;
   const {id} = req.params;
   try {
     const keys = Object.keys(data);
     const updates = keys.map(k => `${k} = ?`).join(', ');
     const values = [...Object.values(data), id];
     if(keys.length === 0) return res.json({success:true});
     await pool.query(`UPDATE users SET ${updates} WHERE id = ?`, values);
     res.json({ success: true });
   } catch (e) { res.status(500).json({error: e.message}); }
});

app.delete('/api/users/:id', async (req, res) => {
   await pool.query('DELETE FROM users WHERE id = ?', [req.params.id]);
   res.json({ success: true });
});

// -- MATKULS --
app.get('/api/matkuls', async (req, res) => {
  if(!pool) return res.json([]);
  const [r] = await pool.query('SELECT * FROM matkuls');
  res.json(r);
});
app.post('/api/matkuls', async (req, res) => {
   const {id, nama, sks, semester, dosenId, ruang, jadwal} = req.body;
   await pool.query(`INSERT INTO matkuls (id,nama,sks,semester,dosenId,ruang,jadwal) VALUES (?,?,?,?,?,?,?)`, [id,nama,sks,semester,dosenId,ruang,jadwal]);
   res.json({success:true});
});
app.put('/api/matkuls/:id', async (req, res) => {
   const { nama, sks, semester, dosenId, ruang, jadwal } = req.body;
   await pool.query('UPDATE matkuls SET nama=?, sks=?, semester=?, dosenId=?, ruang=?, jadwal=? WHERE id=?', [nama,sks,semester,dosenId,ruang,jadwal, req.params.id]);
   res.json({success:true});
});
app.delete('/api/matkuls/:id', async (req, res) => {
   await pool.query('DELETE FROM matkuls WHERE id=?', [req.params.id]);
   res.json({success:true});
});

// -- KRS --
app.get('/api/krs', async (req, res) => {
   if(!pool) return res.json({});
   const [r] = await pool.query('SELECT * FROM krs');
   const krsObj = {};
   r.forEach(row => {
      // row.matkuls is JSON, handle safely
      krsObj[row.userId] = { 
         matkuls: typeof row.matkuls === 'string' ? JSON.parse(row.matkuls) : row.matkuls, 
         status: row.status 
      };
   });
   res.json(krsObj);
});
app.post('/api/krs/:userId', async (req, res) => {
   const {userId} = req.params;
   const data = req.body; 
   const matkulsJson = JSON.stringify(data.matkuls);
   const [exist] = await pool.query('SELECT id FROM krs WHERE userId=?', [userId]);
   if(exist.length > 0) {
      await pool.query('UPDATE krs SET matkuls=?, status=? WHERE userId=?', [matkulsJson, data.status, userId]);
   } else {
      await pool.query('INSERT INTO krs (userId, matkuls, status) VALUES (?,?,?)', [userId, matkulsJson, data.status]);
   }
   res.json({success:true});
});

// -- NILAI --
app.get('/api/nilai', async (req, res) => {
   if(!pool) return res.json({});
   const [r] = await pool.query('SELECT * FROM nilai');
   const nilaiObj = {};
   r.forEach(row => {
     nilaiObj[row.userId_matkulId] = { tugas: row.tugas, uts: row.uts, uas: row.uas, huruf: row.huruf };
   });
   res.json(nilaiObj);
});
app.post('/api/nilai/:uid_mid', async (req, res) => {
   const key = req.params.uid_mid;
   const {tugas, uts, uas, huruf} = req.body;
   const [exist] = await pool.query('SELECT userId_matkulId FROM nilai WHERE userId_matkulId=?', [key]);
   if(exist.length > 0) {
      await pool.query('UPDATE nilai SET tugas=?, uts=?, uas=?, huruf=? WHERE userId_matkulId=?', [tugas,uts,uas,huruf,key]);
   } else {
      await pool.query('INSERT INTO nilai (userId_matkulId, tugas, uts, uas, huruf) VALUES (?,?,?,?,?)', [key,tugas,uts,uas,huruf]);
   }
   res.json({success:true});
});

// -- ABSENSI --
app.get('/api/absensi', async (req, res) => {
   if(!pool) return res.json({});
   const [r] = await pool.query('SELECT * FROM absensi');
   const absObj = {};
   r.forEach(row => {
     absObj[row.userId_matkulId] = { pertemuan: typeof row.pertemuan === 'string' ? JSON.parse(row.pertemuan) : row.pertemuan, uts: row.uts, uas: row.uas };
   });
   res.json(absObj);
});
app.post('/api/absensi/:uid_mid', async (req, res) => {
   const key = req.params.uid_mid;
   const {pertemuan, uts, uas} = req.body;
   const pertemuanJson = JSON.stringify(pertemuan);
   const [exist] = await pool.query('SELECT userId_matkulId FROM absensi WHERE userId_matkulId=?', [key]);
   if(exist.length > 0) {
      await pool.query('UPDATE absensi SET pertemuan=?, uts=?, uas=? WHERE userId_matkulId=?', [pertemuanJson,uts,uas,key]);
   } else {
      await pool.query('INSERT INTO absensi (userId_matkulId, pertemuan, uts, uas) VALUES (?,?,?,?)', [key,pertemuanJson,uts,uas]);
   }
   res.json({success:true});
});

// -- TICKETS (HELPDESK) --
app.get('/api/tickets', async (req, res) => {
   if(!pool) return res.json([]);
   const [r] = await pool.query('SELECT * FROM tickets');
   res.json(r);
});
app.post('/api/tickets', async (req, res) => {
   const {id, senderId, senderName, isGuest, message, status} = req.body;
   await pool.query('INSERT INTO tickets (id, senderId, senderName, isGuest, message, status) VALUES (?,?,?,?,?,?)', [id,senderId,senderName,isGuest,message,status]);
   res.json({success:true});
});
app.put('/api/tickets/:id/reply', async (req, res) => {
   const {replyMessage} = req.body;
   await pool.query('UPDATE tickets SET reply=?, status="closed" WHERE id=?', [replyMessage, req.params.id]);
   res.json({success:true});
});
app.delete('/api/tickets/:id', async (req, res) => {
   await pool.query('DELETE FROM tickets WHERE id=?', [req.params.id]);
   res.json({success:true});
});

// -- EBOOKS --
app.get('/api/ebooks', async (req, res) => {
   if(!pool) return res.json([]);
   const [r] = await pool.query('SELECT * FROM ebooks');
   res.json(r);
});
app.post('/api/ebooks', upload.single('file'), async (req, res) => {
   const {id, judul, matkul, uploaderRole, timestamp} = req.body;
   let url = req.body.url;
   let size = req.body.size;

   if (req.file) {
       url = 'http://localhost:5000/uploads/' + req.file.filename;
       size = (req.file.size / 1024 / 1024).toFixed(2) + ' MB';
   }

   await pool.query('INSERT INTO ebooks (id, judul, matkul, url, size, uploaderRole, timestamp) VALUES (?,?,?,?,?,?,?)', [id,judul,matkul,url,size,uploaderRole,timestamp]);
   res.json({success:true, data: {url, size}});
});
app.delete('/api/ebooks/:id', async (req, res) => {
   await pool.query('DELETE FROM ebooks WHERE id=?', [req.params.id]);
   res.json({success:true});
});

// -- IKM ACTIVITIES --
app.get('/api/ikm_activities', async (req, res) => {
   if(!pool) return res.json([]);
   const [r] = await pool.query('SELECT * FROM ikm_activities');
   res.json(r);
});
app.post('/api/ikm_activities', upload.fields([{name: 'sertifikat', maxCount: 1}, {name: 'foto', maxCount: 1}]), async (req, res) => {
   const {id, nim, tanggal, smt, kategori, kegiatan, deskripsi, peringkat, poinAwal, poinValid, status, timestamp} = req.body;
   
   let fileSertifikat = req.body.fileSertifikat || '';
   let fileFoto = req.body.fileFoto || '';

   if (req.files) {
       if(req.files['sertifikat']) fileSertifikat = 'http://localhost:5000/uploads/' + req.files['sertifikat'][0].filename;
       if(req.files['foto']) fileFoto = 'http://localhost:5000/uploads/' + req.files['foto'][0].filename;
   }

   await pool.query('INSERT INTO ikm_activities (id, nim, tanggal, smt, kategori, kegiatan, deskripsi, peringkat, fileSertifikat, fileFoto, poinAwal, poinValid, status, timestamp) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)', 
   [id,nim,tanggal,smt,kategori,kegiatan,deskripsi,peringkat,fileSertifikat,fileFoto,poinAwal,poinValid,status,timestamp]);
   
   res.json({success:true, data: { fileSertifikat, fileFoto }});
});
app.put('/api/ikm_activities/:id', async (req, res) => {
   const { status, poinValid } = req.body;
   await pool.query('UPDATE ikm_activities SET status=?, poinValid=? WHERE id=?', [status, poinValid, req.params.id]);
   res.json({success:true});
});
app.delete('/api/ikm_activities/:id', async (req, res) => {
   await pool.query('DELETE FROM ikm_activities WHERE id=?', [req.params.id]);
   res.json({success:true});
});

// -- KEUANGAN --
app.get('/api/keuangan', async (req, res) => {
   if(!pool) return res.json([]);
   const [r] = await pool.query('SELECT * FROM keuangan');
   res.json(r);
});
app.post('/api/keuangan', async (req, res) => {
   const {id, nim, bulan, tagihan, status, jatuhTempo} = req.body;
   await pool.query('INSERT INTO keuangan (id, nim, bulan, tagihan, status, jatuhTempo) VALUES (?,?,?,?,?,?)', [id,nim,bulan,tagihan,status,jatuhTempo]);
   res.json({success:true});
});
app.put('/api/keuangan/:id', async (req, res) => {
   const { status, tagihan } = req.body;
   await pool.query('UPDATE keuangan SET status=?, tagihan=? WHERE id=?', [status, tagihan, req.params.id]);
   res.json({success:true});
});
app.delete('/api/keuangan/:id', async (req, res) => {
   await pool.query('DELETE FROM keuangan WHERE id=?', [req.params.id]);
   res.json({success:true});
});

// -- SUBMISSIONS (CNP & TA) --
app.get('/api/submissions', async (req, res) => {
   if(!pool) return res.json([]);
   const [r] = await pool.query('SELECT * FROM submissions');
   res.json(r);
});
app.post('/api/submissions', upload.single('file'), async (req, res) => {
   const {id, nim, kategori, tipe, timestamp} = req.body;
   let fileUrl = req.body.fileUrl || '';
   let status = req.body.status || 'Pending';

   if (req.file) {
       fileUrl = 'http://localhost:5000/uploads/' + req.file.filename;
   }

   await pool.query('INSERT INTO submissions (id, nim, kategori, tipe, fileUrl, status, timestamp) VALUES (?,?,?,?,?,?,?)', [id,nim,kategori,tipe,fileUrl,status,timestamp]);
   res.json({success:true, data: { fileUrl }});
});
app.put('/api/submissions/:id', async (req, res) => {
   const { status } = req.body;
   await pool.query('UPDATE submissions SET status=? WHERE id=?', [status, req.params.id]);
   res.json({success:true});
});
app.delete('/api/submissions/:id', async (req, res) => {
   await pool.query('DELETE FROM submissions WHERE id=?', [req.params.id]);
   res.json({success:true});
});

// -- BIMBINGAN LOGS --
app.get('/api/bimbingan_logs', async (req, res) => {
   if(!pool) return res.json([]);
   const [r] = await pool.query('SELECT * FROM bimbingan_logs');
   res.json(r);
});
app.post('/api/bimbingan_logs', async (req, res) => {
   const {id, nim, kategori, tanggal, catatan, status, timestamp} = req.body;
   await pool.query('INSERT INTO bimbingan_logs (id, nim, kategori, tanggal, catatan, status, timestamp) VALUES (?,?,?,?,?,?,?)', [id,nim,kategori,tanggal,catatan,status,timestamp]);
   res.json({success:true});
});
app.put('/api/bimbingan_logs/:id', async (req, res) => {
   const { status } = req.body;
   await pool.query('UPDATE bimbingan_logs SET status=? WHERE id=?', [status, req.params.id]);
   res.json({success:true});
});
app.delete('/api/bimbingan_logs/:id', async (req, res) => {
   await pool.query('DELETE FROM bimbingan_logs WHERE id=?', [req.params.id]);
   res.json({success:true});
});

const PORT = 5000;
app.listen(PORT, () => {
   console.log(`\n========================================`);
   console.log(`🚀 Siakad Backend berjalan tangguh di http://localhost:${PORT}`);
   console.log(`🔌 Terkoneksi otomatis secara Realtime XAMPP`);
   console.log(`========================================\n`);
});
