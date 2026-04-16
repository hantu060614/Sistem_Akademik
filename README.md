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

- **Frontend**: [React 19](https://react.dev/)
- **Build Tool**: [Vite 8](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Routing**: React Router DOM v7
- **Icons**: Lucide React
- **API Communication**: Fetch API (Koneksi ke backend lokal `http://localhost:5000/api`)

## 🚀 Panduan Menjalankan Secara Lokal

### Prasyarat
- [Node.js](https://nodejs.org/en/) sudah ter-install di perangkat Anda.
- (Opsional) Server Backend (Node.js/Express) dan Database MySQL dijalankan melalui XAMPP jika diperlukan koneksi data utuh agar API berjalan dengan baik. Jika backend tidak menyala, beberapa komponen membaca data dari *Global Cache* sementara.

### Instalasi & Menjalankan Frontend

Ikuti perintah di bawah ini dari area root terminal `siakad-reborn`:

```bash
# 1. Install semua dependencies
npm install

# 2. Nyalakan Development Server
npm run dev
```

Secara default, Vite akan berjalan dan menyediakan link server lokal di terminal (biasanya berada di `http://localhost:5173/`).

### Build untuk Produksi
Gunakan perintah berikut jika Anda ingin me-render (build) proyek ini menghasilkan file statis ke dalam folder `dist/`:
```bash
npm run build
```
