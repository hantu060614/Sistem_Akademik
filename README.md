# Siakad Reborn (Sistem Informasi Akademik)

Sistem Informasi Akademik (SIAKAD) berbasis web yang modern dan responsif untuk mengelola berbagai kebutuhan administrasi akademik di lingkungan kampus. Proyek "Siakad Reborn" ini dibangun dengan teknologi React, Vite, dan Tailwind CSS untuk memberikan antarmuka pengguna yang terdepan, dinamis, dan mudah digunakan.

## ✨ Fitur Utama (Multi-Role)

Sistem ini mendukung pengelolaan data melalui 3 hak akses utama:

### 🎓 1. Mahasiswa
- **Dashboard & Profil Utama**: Menampilkan ringkasan status akademik dan data diri mahasiswa.
- **Administrasi Akademik**:
  - Kartu Rencana Studi (KRS): Pengisian, pengajuan, dan status persetujuan KRS.
  - Jadwal Perkuliahan
  - Riwayat Kehadiran / Presensi Kelas
  - Kartu Hasil Studi (KHS) & Nilai Mutu
- **Tugas Akhir**: Fasilitas pelaporan log bimbingan dan pengajuan sidang.
- **Layanan Kampus Lainnya**: 
  - **Keuangan**: Informasi tagihan, pembayaran, dan tunggakan kuliah.
  - **E-Book & Literasi Digital**: Modul akses ke perpustakaan pintar digital.
  - **IKM (Indeks Kepuasan Masyarakat)**: Form dan pengajuan penilaian kepuasan mahasiswa.
  - **Layanan Surat**: Pengajuan surat keterangan aktif dan administrasi lainnya.
  - **Helpdesk**: Tiket bantuan / tanya jawab langsung dengan Admin.

### 👨‍🏫 2. Dosen
- **Jadwal Mengajar**: Memantau jadwal perkuliahan hari ini atau mingguan.
- **Manajemen Absensi**: Perekaman tingkat kehadiran mahasiswa di kelas.
- **Input Nilai**: Mengelola nilai (Tugas, UTS, UAS) secara mandiri untuk tiap mata kuliah yang diampu.
- **Monitoring Bimbingan**: Melakukan pelacakan dan validasi aktivitas bimbingan mahasiswa tingkat akhir.

### 🛡️ 3. Admin & Staf Akademik
- **Manajemen Data Induk**: Pengelolaan penuh data Master Dosen, Mahasiswa, dan Mata Kuliah (CRUD).
- **Validasi Berkas & KRS**: Mengesahkan pengajuan rencana studi (KRS) dan dokumen lainnya dari mahasiswa.
- **Manajemen Keuangan**: Perekapan riwayat pelunasan biaya studi.
- **Respon Helpdesk**: Sistem tiket pelanggan (ticketing) untuk merespon permasalahan dari pengguna lain.

## 🛠️ Stack Teknologi

- **Frontend**: [React 19](https://react.dev/) + [Vite 5](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v3](https://tailwindcss.com/)
- **Backend**: Node.js + Express.js (REST API)
- **Database**: MySQL (via XAMPP)
- **Penyimpanan Berkas (Storage)**: Multer (Sistem upload fisik Multipart Form-Data)

## 🌟 Pembaruan Terbaru (Full-Stack 100%)
- **Upload Berkas Riil (Multer)**: Sistem unggah foto profil, lembar jawaban ujian (UTS & UAS), dan dokumen pendukung mahasiswa tidak lagi berskala prototipe/dummy. File fisik langsung terkirim dan disimpan rapi di *Endpoint* (`/backend/uploads`) server dan dicatat pada Database MySQL.
- **Keamanan & Autentikasi Lupa Sandi**: Modul _Lupa Sandi_ telah dikokohkan perlindungannya menggunakan prosedur kecocokan 2-Lapis (*NIM* & *Tanggal Lahir*) yang mem-verifikasi kecocokan entitas secara *Real-time* di Database sebelum mengizinkan *Reset Password*.

## 🚀 Panduan Menjalankan Secara Lokal

### Prasyarat Mutlak (Wajib)
- **Node.js** sudah ter-install di terminal Anda.
- **XAMPP Control Panel**: Anda WAJIB menyalakan (START) _Service_ **Apache** dan **MySQL** agar REST API Server & Multer tidak *Crash* (`ECONNREFUSED`).

### Instalasi & Menjalankan Server & Klien

Ikuti terminal secara paralel:

**1. Jalankan Backend Server (Port 5000)**
```bash
cd backend
npm install
node server.js
```

**2. Jalankan Frontend UI (Port 5173)**
Buka terminal baru di root folder proyek:
```bash
npm install
npm run dev
```

Secara default, Vite akan berjalan dan menyediakan link server lokal di terminal (biasanya berada di `http://localhost:5173/`).

### Build untuk Produksi
Gunakan perintah berikut jika Anda ingin me-render (build) proyek ini menghasilkan file statis ke dalam folder `dist/`:
```bash
npm run build
```
