import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Import Landing Page
import LandingPage from './pages/LandingPage';

// ==========================================
// IMPORT PANEL ADMIN & DOSEN (BARU)
// ==========================================
import AdminMahasiswa from './pages/AdminMahasiswa';
import AdminMatkul from './pages/AdminMatkul';
import AdminValidasiKrs from './pages/AdminValidasiKrs';
import AdminValidasiBerkas from './pages/AdminValidasiBerkas';
import AdminDosen from './pages/AdminDosen';
import AdminKeuangan from './pages/AdminKeuangan';

import DosenJadwal from './pages/DosenJadwal';
import DosenNilai from './pages/DosenNilai';
import DosenAbsensi from './pages/DosenAbsensi';
import DosenBimbingan from './pages/DosenBimbingan';
import Helpdesk from './pages/Helpdesk';
import AdminHelpdesk from './pages/AdminHelpdesk';

// Import Halaman Utama Mahasiswa
import Dashboard from './pages/Dashboard';
import Profil from './pages/Profil';
import Akademik from './pages/Akademik'; 
import Keuangan from './pages/Keuangan';
import Cnp from './pages/Cnp';
import TugasAkhir from './pages/TugasAkhir';

// Import Halaman Sidebar Bawah
import Ebook from './pages/Ebook';
import Surat from './pages/Surat';
import UploadFile from './pages/UploadFile';
import Panduan from './pages/Panduan';

// Import Sub-Menu Akademik
import Krs from './pages/Krs';
import Jadwal from './pages/Jadwal'; 
import Kehadiran from './pages/Kehadiran';
import Nilai from './pages/Nilai';
import PerbaikanNilai from './pages/PerbaikanNilai';
import Uts from './pages/Uts';
import Uas from './pages/Uas';
import HistoryUjian from './pages/HistoryUjian';
import DigitalLiteracy from './pages/DigitalLiteracy';
import Ikm from './pages/Ikm';

import Layout from './components/Layout';

function App() {
  return (
    <Router>
      <Routes>
        {/* Rute Awal */}
        <Route path="/" element={<LandingPage />} />

        {/* ========================================== */}
        {/* RUTE APLIKASI UTAMA (Menggunakan Sidebar Layout) */}
        {/* ========================================== */}
        <Route path="/app" element={<Layout />}>
          {/* Rute Umum */}
          <Route path="dashboard" element={<Dashboard />} />

          {/* Akses Role Admin */}
          <Route path="admin/mahasiswa" element={<AdminMahasiswa />} />
          <Route path="admin/dosen" element={<AdminDosen />} />
          <Route path="admin/matkul" element={<AdminMatkul />} />
          <Route path="admin/keuangan" element={<AdminKeuangan />} />
          <Route path="admin/validasi-krs" element={<AdminValidasiKrs />} />
          <Route path="admin/validasi-berkas" element={<AdminValidasiBerkas />} />
          <Route path="admin/helpdesk" element={<AdminHelpdesk />} />

          {/* Akses Role Dosen */}
          <Route path="dosen/jadwal" element={<DosenJadwal />} />
          <Route path="dosen/nilai" element={<DosenNilai />} />
          <Route path="dosen/absensi" element={<DosenAbsensi />} />
          <Route path="dosen/bimbingan" element={<DosenBimbingan />} />

          {/* Akses Role Mahasiswa */}
          <Route path="profil" element={<Profil />} />
          <Route path="akademik" element={<Akademik />} />
          <Route path="keuangan" element={<Keuangan />} />
          <Route path="cnp" element={<Cnp />} />
          <Route path="tugas-akhir" element={<TugasAkhir />} />
          
          <Route path="ebook" element={<Ebook />} />
          <Route path="surat" element={<Surat />} />
          <Route path="upload-file" element={<UploadFile />} />
          <Route path="panduan" element={<Panduan />} />
          <Route path="helpdesk" element={<Helpdesk />} />

          {/* Rute Sub-Menu Akademik */}
          <Route path="krs" element={<Krs />} />
          <Route path="jadwal" element={<Jadwal />} />
          <Route path="kehadiran" element={<Kehadiran />} />
          <Route path="nilai" element={<Nilai />} />
          <Route path="perbaikan-nilai" element={<PerbaikanNilai />} />
          <Route path="uts" element={<Uts />} />
          <Route path="uas" element={<Uas />} />
          <Route path="history-ujian" element={<HistoryUjian />} />
          <Route path="digital-literacy" element={<DigitalLiteracy />} />
          <Route path="ikm" element={<Ikm />} />
        </Route>

        {/* Jika URL tidak ditemukan, kembalikan ke Landing Page */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;