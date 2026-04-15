import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, Printer, Award, BookOpen, 
  CheckCircle, AlertCircle, TrendingUp, Info 
} from 'lucide-react';

const Nilai = () => {
  const userName = localStorage.getItem('userName') || 'Hamami Hamzah';
  const userNIM = '202301001'; // Data dummy
  
  const [semesterFilter, setSemesterFilter] = useState('1');

  // DATA DUMMY SEMESTER 1 (Persis seperti Screenshot)
  const dataNilaiSem1 = [
    { kode: 'MI101', matkul: 'Dasar-dasar Komputer', sks: 2, nilaiHuruf: 'B', bobot: 3 },
    { kode: 'MI102', matkul: 'Algorithma dan Pemrograman', sks: 4, nilaiHuruf: 'C', bobot: 2 },
    { kode: 'MI103', matkul: 'Aplikasi Komputer-1', sks: 2, nilaiHuruf: 'A', bobot: 4 },
    { kode: 'MI104', matkul: 'Aplikasi Komputer-2', sks: 2, nilaiHuruf: 'A', bobot: 4 },
    { kode: 'MI105', matkul: 'Pengenalan Web', sks: 2, nilaiHuruf: 'B', bobot: 3 },
    { kode: 'MI106', matkul: 'Bahasa Indonesia', sks: 2, nilaiHuruf: 'A', bobot: 4 },
  ];

  // Hitung Total SKS dan IP otomatis
  const totalSKSSem1 = dataNilaiSem1.reduce((acc, curr) => acc + curr.sks, 0);
  const totalSKSBobotSem1 = dataNilaiSem1.reduce((acc, curr) => acc + (curr.sks * curr.bobot), 0);
  const ipsSem1 = (totalSKSBobotSem1 / totalSKSSem1).toFixed(2);
  const ipkGlobal = ipsSem1; // Karena baru semester 1, IPS = IPK

  // FUNGSI PEWARNAAN NILAI HURUF (UX Upgrade)
  const getBadgeColor = (nilai) => {
    switch (nilai) {
      case 'A': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'B': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'C': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'D': 
      case 'E': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="animate-fade-in pb-10">
      
      {/* HEADER NAVIGASI */}
      <div className="mb-6 border-b border-gray-100 pb-4">
        <Link to="/app/akademik" className="inline-flex items-center text-sm font-bold text-blue-600 hover:text-blue-800 mb-4 transition-colors">
          <ArrowLeft size={16} className="mr-1" /> Kembali ke Akademik
        </Link>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-800 tracking-tight">Informasi Nilai (KHS & Transkrip)</h2>
            <p className="text-gray-500 text-sm mt-1">Rekapitulasi nilai akademik per semester</p>
          </div>
          
          <button className="flex items-center justify-center bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30">
            <Printer size={18} className="mr-2" /> Cetak KHS PDF
          </button>
        </div>
      </div>

      {/* KARTU PROFIL MAHASISWA */}
      <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm mb-6 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-md">
            <Award size={32} />
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-gray-800">{userName}</h3>
            <div className="flex items-center text-sm text-gray-500 mt-1 font-medium">
              <span className="text-blue-600 font-bold mr-2">{userNIM}</span> • 
              <span className="mx-2">Manajemen Informatika (D3)</span>
            </div>
          </div>
        </div>
        <div className="flex space-x-6 text-center divide-x divide-gray-100">
          <div className="px-4">
            <p className="text-xs text-gray-400 font-bold mb-1">Status</p>
            <span className="bg-emerald-50 text-emerald-600 font-extrabold px-3 py-1 rounded-lg text-sm border border-emerald-100">Aktif</span>
          </div>
          <div className="px-4">
            <p className="text-xs text-gray-400 font-bold mb-1">Total SKS</p>
            <p className="text-xl font-black text-gray-800">{totalSKSSem1}</p>
          </div>
          <div className="px-4">
            <p className="text-xs text-gray-400 font-bold mb-1">IPK Saat Ini</p>
            <p className="text-xl font-black text-blue-600">{ipkGlobal}</p>
          </div>
        </div>
      </div>

      {/* FILTER SEMESTER */}
      <div className="bg-slate-900 rounded-t-2xl p-4 flex flex-col sm:flex-row justify-between items-center border-b border-slate-700 gap-4 mt-8">
        <h3 className="text-white font-bold flex items-center">
          <BookOpen size={18} className="mr-2 text-blue-400" /> Detail Kartu Hasil Studi (KHS)
        </h3>
        <div className="flex items-center bg-slate-800 rounded-xl px-3 py-1.5 border border-slate-700">
          <span className="text-xs font-bold text-slate-400 mr-2">Pilih Semester:</span>
          <select 
            value={semesterFilter}
            onChange={(e) => setSemesterFilter(e.target.value)}
            className="bg-transparent text-white font-bold outline-none cursor-pointer text-sm"
          >
            <option value="1" className="text-gray-800">Semester 1 (Ganjil)</option>
            <option value="2" className="text-gray-800">Semester 2 (Genap) - Berjalan</option>
          </select>
        </div>
      </div>

      {/* RENDER KONDISIONAL BERDASARKAN SEMESTER */}
      {semesterFilter === '2' ? (
        // STATE: SEMESTER 2 (KRS SEDANG BERJALAN)
        <div className="bg-white rounded-b-2xl border-x border-b border-gray-200 p-12 text-center shadow-sm">
          <div className="w-20 h-20 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle size={40} />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Nilai Belum Tersedia</h3>
          <p className="text-gray-500 max-w-md mx-auto text-sm">
            Anda sedang menempuh Semester 2. Nilai akan muncul setelah Dosen mengunggah hasil Ujian Akhir Semester (UAS). 
            Silakan cek menu <Link to="/app/krs" className="text-blue-600 font-bold hover:underline">KRS</Link> atau <Link to="/app/jadwal" className="text-blue-600 font-bold hover:underline">Jadwal</Link>.
          </p>
        </div>
      ) : (
        // STATE: SEMESTER 1 (DATA NILAI MUNCUL)
        <div className="bg-white rounded-b-2xl border-x border-b border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-600">
              <thead className="text-xs text-gray-500 uppercase bg-gray-50/50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 font-extrabold">Kode</th>
                  <th className="px-6 py-4 font-extrabold">Mata Kuliah</th>
                  <th className="px-6 py-4 font-extrabold text-center">SKS</th>
                  <th className="px-6 py-4 font-extrabold text-center">Nilai Mutu</th>
                  <th className="px-6 py-4 font-extrabold text-center">Bobot</th>
                  <th className="px-6 py-4 font-extrabold text-center">NxK (Total)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {dataNilaiSem1.map((item, index) => (
                  <tr key={index} className="hover:bg-blue-50/30 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-500 text-xs">{item.kode}</td>
                    <td className="px-6 py-4 font-bold text-gray-800">{item.matkul}</td>
                    <td className="px-6 py-4 text-center font-medium">{item.sks}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center justify-center w-8 h-8 rounded-lg font-black border ${getBadgeColor(item.nilaiHuruf)}`}>
                        {item.nilaiHuruf}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center font-medium">{item.bobot}</td>
                    <td className="px-6 py-4 text-center font-extrabold text-gray-800">{item.sks * item.bobot}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* FOOTER STATISTIK KHS */}
          <div className="bg-slate-50 p-6 border-t border-gray-200 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
              <span className="text-xs font-bold text-gray-500 uppercase">Jumlah Matkul</span>
              <span className="text-lg font-black text-gray-800">{dataNilaiSem1.length}</span>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
              <span className="text-xs font-bold text-gray-500 uppercase">Total SKS Diambil</span>
              <span className="text-lg font-black text-gray-800">{totalSKSSem1}</span>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
              <span className="text-xs font-bold text-gray-500 uppercase">Total SKS x Bobot</span>
              <span className="text-lg font-black text-gray-800">{totalSKSBobotSem1}</span>
            </div>
            <div className="bg-blue-600 p-4 rounded-xl shadow-md flex items-center justify-between text-white">
              <div className="flex items-center">
                <TrendingUp size={18} className="mr-2 text-blue-200" />
                <span className="text-xs font-bold uppercase">IPS Semester 1</span>
              </div>
              <span className="text-xl font-black">{ipsSem1}</span>
            </div>
          </div>

        </div>
      )}

      {/* CATATAN AKADEMIK */}
      <div className="mt-6 flex items-start bg-blue-50 p-4 rounded-xl border border-blue-100 text-sm text-blue-800">
        <Info size={18} className="mr-3 flex-shrink-0 mt-0.5 text-blue-600" />
        <p className="leading-relaxed">
          <strong className="font-extrabold">Catatan:</strong> Jika terdapat ketidaksesuaian nilai, mahasiswa diberikan waktu selambat-lambatnya 14 hari kerja setelah KHS diterbitkan untuk melakukan konfirmasi melalui menu <strong className="font-extrabold text-blue-600">Perbaikan Nilai</strong> atau menghubungi Dosen Pengampu mata kuliah bersangkutan.
        </p>
      </div>

    </div>
  );
};

export default Nilai;