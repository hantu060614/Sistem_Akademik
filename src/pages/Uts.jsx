import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, FileEdit, Clock, Calendar as CalendarIcon, 
  Download, UploadCloud, CheckCircle, AlertTriangle 
} from 'lucide-react';

const Uts = () => {
  // Simulasi state untuk file yang sudah di-upload
  const [uploadedExams, setUploadedExams] = useState([]);

  // Data Dummy UTS (Menggunakan matkul semester ini agar sinkron)
  const dataUts = [
    {
      id: 'MI301', matkul: 'Pemrograman Web Framework', dosen: 'Supriyadi, M.Kom.',
      tanggal: 'Senin, 18 Mei 2026', waktu: '08:00 - 10:30 WIB', durasi: '150 Menit',
      jenis: 'Take Home Project', status: 'berlangsung' // Status: belum, berlangsung, selesai
    },
    {
      id: 'MI302', matkul: 'Keamanan Jaringan (Cybersecurity)', dosen: 'Rina, S.T., M.T.',
      tanggal: 'Selasa, 19 Mei 2026', waktu: '13:00 - 15:00 WIB', durasi: '120 Menit',
      jenis: 'Pilihan Ganda & Essay (Online)', status: 'belum'
    },
    {
      id: 'MI303', matkul: 'Mobile Development', dosen: 'Ahmad, M.Kom.',
      tanggal: 'Kamis, 21 Mei 2026', waktu: '08:00 - 10:30 WIB', durasi: '150 Menit',
      jenis: 'Praktikum', status: 'selesai'
    }
  ];

  const handleUpload = (id) => {
    // Simulasi aksi upload file jawaban
    if (!uploadedExams.includes(id)) {
      setUploadedExams([...uploadedExams, id]);
      alert('File jawaban berhasil diunggah dan tersimpan di server!');
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
              <FileEdit size={28} className="mr-3 text-rose-500" /> 
              Ujian Tengah Semester (UTS)
            </h2>
            <p className="text-gray-500 text-sm mt-1">Portal pelaksanaan ujian semester Genap 2025/2026</p>
          </div>
        </div>
      </div>

      {/* BANNER INFORMASI */}
      <div className="bg-rose-50 border border-rose-200 rounded-2xl p-5 mb-8 flex items-start shadow-sm">
        <AlertTriangle size={24} className="text-rose-500 mr-4 flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="font-bold text-rose-800 mb-1">Perhatian Sebelum Ujian</h4>
          <ul className="text-sm text-rose-700 space-y-1 list-disc list-inside">
            <li>Pastikan koneksi internet Anda stabil saat mengunduh soal dan mengunggah jawaban.</li>
            <li>Batas waktu unggah jawaban (Upload) bersifat <span className="font-bold border-b border-rose-400">otomatis tertutup</span> oleh server. Keterlambatan tidak ditoleransi.</li>
          </ul>
        </div>
      </div>

      {/* GRID KARTU UJIAN */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {dataUts.map((ujian) => {
          // Logika untuk merubah status menjadi selesai jika sudah di-upload
          const isUploaded = uploadedExams.includes(ujian.id) || ujian.status === 'selesai';
          const currentStatus = isUploaded ? 'selesai' : ujian.status;

          return (
            <div key={ujian.id} className={`bg-white rounded-3xl border-2 p-6 transition-all ${
              currentStatus === 'berlangsung' ? 'border-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.15)]' : 
              currentStatus === 'selesai' ? 'border-emerald-200 bg-emerald-50/30' : 
              'border-gray-100 opacity-80'
            }`}>
              
              {/* Header Kartu */}
              <div className="flex justify-between items-start mb-4 border-b border-gray-100 pb-4">
                <div>
                  <span className="text-[10px] font-extrabold text-gray-500 bg-gray-100 px-2 py-0.5 rounded tracking-wider">{ujian.id}</span>
                  <h3 className="font-extrabold text-lg text-gray-800 mt-1 leading-tight">{ujian.matkul}</h3>
                  <p className="text-xs text-gray-500 mt-1 font-medium">{ujian.dosen}</p>
                </div>
                
                {/* Badge Status */}
                <div className={`px-3 py-1 rounded-full text-xs font-bold border ${
                  currentStatus === 'berlangsung' ? 'bg-blue-100 text-blue-700 border-blue-200 animate-pulse' :
                  currentStatus === 'selesai' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' :
                  'bg-gray-100 text-gray-500 border-gray-200'
                }`}>
                  {currentStatus === 'berlangsung' ? 'Sedang Berjalan' : currentStatus === 'selesai' ? 'Selesai' : 'Belum Mulai'}
                </div>
              </div>

              {/* Info Waktu & Detail */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center text-sm text-gray-600 font-medium">
                  <CalendarIcon size={16} className="text-blue-500 mr-3 flex-shrink-0" /> {ujian.tanggal}
                </div>
                <div className="flex items-center text-sm text-gray-600 font-medium">
                  <Clock size={16} className="text-amber-500 mr-3 flex-shrink-0" /> {ujian.waktu} <span className="ml-2 text-xs text-gray-400">({ujian.durasi})</span>
                </div>
                <div className="flex items-center text-sm text-gray-600 font-medium">
                  <FileEdit size={16} className="text-purple-500 mr-3 flex-shrink-0" /> Jenis: {ujian.jenis}
                </div>
              </div>

              {/* Area Aksi (Tombol) */}
              <div className="mt-auto pt-4 border-t border-gray-100 flex gap-3">
                {currentStatus === 'belum' && (
                  <button disabled className="w-full py-3 bg-gray-100 text-gray-400 font-bold rounded-xl cursor-not-allowed">
                    Soal Belum Dibuka
                  </button>
                )}

                {currentStatus === 'berlangsung' && (
                  <>
                    <button className="flex-1 py-3 bg-white border border-blue-200 text-blue-600 font-bold rounded-xl hover:bg-blue-50 transition-colors flex items-center justify-center text-sm">
                      <Download size={16} className="mr-2" /> Soal
                    </button>
                    <button 
                      onClick={() => handleUpload(ujian.id)}
                      className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30 flex items-center justify-center text-sm"
                    >
                      <UploadCloud size={16} className="mr-2" /> Jawab
                    </button>
                  </>
                )}

                {currentStatus === 'selesai' && (
                  <button disabled className="w-full py-3 bg-emerald-100 text-emerald-600 font-bold rounded-xl flex items-center justify-center cursor-default">
                    <CheckCircle size={18} className="mr-2" /> Jawaban Terkirim
                  </button>
                )}
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Uts;