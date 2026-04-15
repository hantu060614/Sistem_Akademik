import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, RefreshCcw, AlertCircle, 
  CheckCircle, Info, BookOpen, Clock
} from 'lucide-react';

const PerbaikanNilai = () => {
  const [semesterFilter, setSemesterFilter] = useState('1');
  
  // State untuk melacak mata kuliah yang sudah didaftarkan untuk perbaikan
  const [registeredList, setRegisteredList] = useState([]);

  // DATA DUMMY (Terhubung secara logis dengan halaman KHS)
  // Hanya menampilkan nilai C, D, atau E yang memenuhi syarat perbaikan
  const dataPerbaikan = [
    { 
      id: 'MI102', 
      matkul: 'Algorithma dan Pemrograman', 
      sks: 4, 
      semester: 1, 
      nilaiLama: 'C',
      biaya: 'Rp 150.000' // Tambahan detail biaya perbaikan (opsional, tapi bikin realistis)
    }
  ];

  const handleDaftar = (id) => {
    // Simulasi mendaftar perbaikan
    if (!registeredList.includes(id)) {
      setRegisteredList([...registeredList, id]);
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
            <h2 className="text-3xl font-extrabold text-gray-800 tracking-tight flex items-center">
              <RefreshCcw size={28} className="mr-3 text-orange-500" /> 
              Perbaikan Nilai (Her)
            </h2>
            <p className="text-gray-500 text-sm mt-1">Daftar mata kuliah yang memenuhi syarat untuk ujian perbaikan.</p>
          </div>
        </div>
      </div>

      {/* BANNER INFORMASI / ATURAN */}
      <div className="bg-orange-50 border border-orange-200 rounded-2xl p-5 mb-8 flex items-start shadow-sm">
        <Info size={24} className="text-orange-500 mr-4 flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="font-bold text-orange-800 mb-1">Ketentuan Perbaikan Nilai</h4>
          <ul className="text-sm text-orange-700 space-y-1 list-disc list-inside">
            <li>Hanya mata kuliah dengan nilai <span className="font-bold border-b border-orange-400">C, D, dan E</span> yang dapat diperbaiki.</li>
            <li>Nilai maksimal yang bisa didapatkan setelah ujian perbaikan (Her) adalah <span className="font-bold border-b border-orange-400">B</span>.</li>
            <li>Status pendaftaran akan diverifikasi setelah pembayaran divalidasi oleh Bagian Keuangan.</li>
          </ul>
        </div>
      </div>

      {/* FILTER SEMESTER */}
      <div className="bg-slate-900 rounded-t-2xl p-4 flex flex-col sm:flex-row justify-between items-center border-b border-slate-700 gap-4">
        <h3 className="text-white font-bold flex items-center">
          <BookOpen size={18} className="mr-2 text-blue-400" /> Daftar Mata Kuliah
        </h3>
        <div className="flex items-center bg-slate-800 rounded-xl px-3 py-1.5 border border-slate-700">
          <span className="text-xs font-bold text-slate-400 mr-2">Semester:</span>
          <select 
            value={semesterFilter}
            onChange={(e) => setSemesterFilter(e.target.value)}
            className="bg-transparent text-white font-bold outline-none cursor-pointer text-sm"
          >
            <option value="1" className="text-gray-800">Semester 1 (Ganjil)</option>
            <option value="2" className="text-gray-800">Semester 2 (Genap)</option>
          </select>
        </div>
      </div>

      {/* RENDER KONDISIONAL BERDASARKAN SEMESTER */}
      <div className="bg-white rounded-b-2xl border-x border-b border-gray-200 p-6 shadow-sm min-h-[300px]">
        
        {semesterFilter === '2' ? (
          // STATE KOSONG (SEMESTER 2)
          <div className="flex flex-col items-center justify-center h-full py-10 text-center animate-fade-in">
            <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-4">
              <CheckCircle size={40} />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Bebas Perbaikan!</h3>
            <p className="text-gray-500 text-sm max-w-sm">
              Tidak ada mata kuliah di Semester 2 yang perlu diperbaiki, atau nilai belum diterbitkan oleh Dosen.
            </p>
          </div>
        ) : (
          // STATE ADA DATA (SEMESTER 1)
          <div className="space-y-4 animate-fade-in">
            {dataPerbaikan.map((mk) => {
              const isRegistered = registeredList.includes(mk.id);

              return (
                <div key={mk.id} className={`flex flex-col md:flex-row md:items-center justify-between p-5 rounded-2xl border-2 transition-all ${isRegistered ? 'border-blue-200 bg-blue-50/50' : 'border-gray-100 hover:border-orange-300 hover:shadow-md'}`}>
                  
                  {/* Info Kiri */}
                  <div className="flex items-start mb-4 md:mb-0">
                    <div className="w-14 h-14 rounded-xl flex items-center justify-center font-black text-2xl flex-shrink-0 mr-4 bg-amber-100 text-amber-600 border border-amber-200">
                      {mk.nilaiLama}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-[10px] font-extrabold text-gray-500 bg-gray-100 px-2 py-0.5 rounded tracking-wider">{mk.id}</span>
                        <span className="text-[10px] font-extrabold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">{mk.sks} SKS</span>
                      </div>
                      <h4 className="font-extrabold text-gray-800 text-lg leading-tight">{mk.matkul}</h4>
                      <p className="text-xs text-gray-500 mt-1 font-medium flex items-center">
                        <AlertCircle size={12} className="mr-1 text-orange-500" /> Disarankan untuk diperbaiki
                      </p>
                    </div>
                  </div>

                  {/* Tombol Kanan */}
                  <div className="flex flex-col md:items-end">
                    {isRegistered ? (
                      // TOMBOL JIKA SUDAH DAFTAR
                      <div className="flex flex-col items-center md:items-end animate-fade-in">
                        <span className="bg-blue-100 text-blue-700 border border-blue-200 px-4 py-2.5 rounded-xl font-bold text-sm flex items-center">
                          <Clock size={16} className="mr-2" /> Menunggu Validasi Keuangan
                        </span>
                        <p className="text-[10px] text-gray-400 font-bold mt-2">ID Trx: #HER-{mk.id}-991</p>
                      </div>
                    ) : (
                      // TOMBOL JIKA BELUM DAFTAR
                      <div className="flex flex-col items-center md:items-end">
                        <p className="text-xs font-bold text-gray-500 mb-2">Biaya: <span className="text-orange-600">{mk.biaya}</span></p>
                        <button 
                          onClick={() => handleDaftar(mk.id)}
                          className="w-full md:w-auto px-6 py-2.5 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/30 flex items-center justify-center"
                        >
                          Daftar Perbaikan
                        </button>
                      </div>
                    )}
                  </div>
                  
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
};

export default PerbaikanNilai;