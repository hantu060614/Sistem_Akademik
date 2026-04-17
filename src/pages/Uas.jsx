import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, BookOpenCheck, Clock, Calendar as CalendarIcon, 
  Download, UploadCloud, CheckCircle, AlertOctagon, X 
} from 'lucide-react';
import { addSubmission, getUserSubmissions } from '../services/db';

const Uas = () => {
  const userId = localStorage.getItem('userId');
  const [submissions, setSubmissions] = useState([]);
  const [activeUploadId, setActiveUploadId] = useState(null);
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  React.useEffect(() => {
     if(userId) setSubmissions(getUserSubmissions(userId, 'uas'));
  }, [userId]);

  // Data Dummy UAS (Tanggalnya digeser ke akhir semester)
  const dataUas = [
    {
      id: 'MI301', matkul: 'Pemrograman Web Framework', dosen: 'Supriyadi, M.Kom.',
      tanggal: 'Senin, 20 Juli 2026', waktu: '08:00 - 10:30 WIB', durasi: '150 Menit',
      jenis: 'Final Project Presentasi', status: 'belum'
    },
    {
      id: 'MI302', matkul: 'Keamanan Jaringan (Cybersecurity)', dosen: 'Rina, S.T., M.T.',
      tanggal: 'Selasa, 21 Juli 2026', waktu: '13:00 - 15:00 WIB', durasi: '120 Menit',
      jenis: 'Pilihan Ganda & Studi Kasus', status: 'belum'
    },
    {
      id: 'MI303', matkul: 'Mobile Development', dosen: 'Ahmad, M.Kom.',
      tanggal: 'Kamis, 23 Juli 2026', waktu: '08:00 - 10:30 WIB', durasi: '150 Menit',
      jenis: 'Upload APK & Source Code', status: 'berlangsung'
    }
  ];

  const handleUploadSubmit = async (e) => {
     e.preventDefault();
     if(!file) return alert('Pilih file jawaban Anda terlebih dahulu!');
     setIsUploading(true);
     const data = { nim: userId, kategori: 'uas', tipe: activeUploadId, status: 'Terkumpul' };
     await addSubmission(data, file);
     setSubmissions(getUserSubmissions(userId, 'uas'));
     setIsUploading(false);
     setActiveUploadId(null);
     setFile(null);
     alert('File jawaban UAS berhasil diunggah! Semoga sukses!');
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
              <BookOpenCheck size={28} className="mr-3 text-red-500" /> 
              Ujian Akhir Semester (UAS)
            </h2>
            <p className="text-gray-500 text-sm mt-1">Portal evaluasi akhir semester Genap 2025/2026</p>
          </div>
        </div>
      </div>

      {/* BANNER INFORMASI */}
      <div className="bg-red-50 border border-red-200 rounded-2xl p-5 mb-8 flex items-start shadow-sm">
        <AlertOctagon size={24} className="text-red-500 mr-4 flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="font-bold text-red-800 mb-1">Syarat Mengikuti UAS</h4>
          <ul className="text-sm text-red-700 space-y-1 list-disc list-inside">
            <li>Telah melunasi seluruh kewajiban administrasi keuangan (UKT/Cicilan).</li>
            <li>Memenuhi persentase kehadiran tatap muka minimal <span className="font-bold border-b border-red-400">75%</span>.</li>
            <li>Segala bentuk kecurangan selama ujian online akan otomatis terekam oleh sistem pengawasan.</li>
          </ul>
        </div>
      </div>

      {/* GRID KARTU UJIAN */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {dataUas.map((ujian) => {
          const isUploaded = submissions.some(s => s.tipe === ujian.id) || ujian.status === 'selesai';
          const currentStatus = isUploaded ? 'selesai' : ujian.status;

          return (
            <div key={ujian.id} className={`bg-white rounded-3xl border-2 p-6 transition-all ${
              currentStatus === 'berlangsung' ? 'border-red-400 shadow-[0_0_20px_rgba(239,68,68,0.15)]' : 
              currentStatus === 'selesai' ? 'border-emerald-200 bg-emerald-50/30' : 
              'border-gray-100 opacity-80'
            }`}>
              
              <div className="flex justify-between items-start mb-4 border-b border-gray-100 pb-4">
                <div>
                  <span className="text-[10px] font-extrabold text-gray-500 bg-gray-100 px-2 py-0.5 rounded tracking-wider">{ujian.id}</span>
                  <h3 className="font-extrabold text-lg text-gray-800 mt-1 leading-tight">{ujian.matkul}</h3>
                  <p className="text-xs text-gray-500 mt-1 font-medium">{ujian.dosen}</p>
                </div>
                
                <div className={`px-3 py-1 rounded-full text-xs font-bold border ${
                  currentStatus === 'berlangsung' ? 'bg-red-100 text-red-700 border-red-200 animate-pulse' :
                  currentStatus === 'selesai' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' :
                  'bg-gray-100 text-gray-500 border-gray-200'
                }`}>
                  {currentStatus === 'berlangsung' ? 'Sedang Berjalan' : currentStatus === 'selesai' ? 'Selesai' : 'Belum Mulai'}
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center text-sm text-gray-600 font-medium">
                  <CalendarIcon size={16} className="text-blue-500 mr-3 flex-shrink-0" /> {ujian.tanggal}
                </div>
                <div className="flex items-center text-sm text-gray-600 font-medium">
                  <Clock size={16} className="text-amber-500 mr-3 flex-shrink-0" /> {ujian.waktu} <span className="ml-2 text-xs text-gray-400">({ujian.durasi})</span>
                </div>
                <div className="flex items-center text-sm text-gray-600 font-medium">
                  <BookOpenCheck size={16} className="text-purple-500 mr-3 flex-shrink-0" /> Jenis: {ujian.jenis}
                </div>
              </div>

              <div className="mt-auto pt-4 border-t border-gray-100 flex gap-3">
                {currentStatus === 'belum' && (
                  <button disabled className="w-full py-3 bg-gray-100 text-gray-400 font-bold rounded-xl cursor-not-allowed">
                    Soal Belum Dibuka
                  </button>
                )}

                {currentStatus === 'berlangsung' && (
                  <>
                    <button className="flex-1 py-3 bg-white border border-red-200 text-red-600 font-bold rounded-xl hover:bg-red-50 transition-colors flex items-center justify-center text-sm">
                      <Download size={16} className="mr-2" /> Download
                    </button>
                    <button 
                      onClick={() => setActiveUploadId(ujian.id)}
                      className="flex-1 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-colors shadow-lg shadow-red-500/30 flex items-center justify-center text-sm"
                    >
                      <UploadCloud size={16} className="mr-2" /> Upload
                    </button>
                  </>
                )}

                {currentStatus === 'selesai' && (
                  <button disabled className="w-full py-3 bg-emerald-100 text-emerald-600 font-bold rounded-xl flex items-center justify-center cursor-default">
                    <CheckCircle size={18} className="mr-2" /> Jawaban Terekam
                  </button>
                )}
              </div>

            </div>
          );
        })}
      </div>

      {/* MODAL UPLOAD UAS */}
      {activeUploadId && (
         <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden animate-slide-up">
               <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-red-50/50">
                  <h3 className="font-extrabold text-lg text-red-900 flex items-center"><UploadCloud size={18} className="mr-2"/> Upload Jawaban</h3>
                  <button onClick={() => {setActiveUploadId(null); setFile(null);}} className="text-slate-400 hover:text-red-500 transition-colors"><X size={20}/></button>
               </div>
               <form onSubmit={handleUploadSubmit} className="p-6 space-y-4">
                  <p className="text-xs font-medium text-slate-500 mb-2">Pilih file docx/pdf untuk mata kuliah {activeUploadId}. Pastikan format file sesuai instruksi Dosen pengampu UAS.</p>
                  <div>
                     <input type="file" accept=".pdf,.doc,.docx,.zip" onChange={(e) => setFile(e.target.files[0])} className="w-full text-xs text-slate-500 file:mr-2 file:py-2 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100 border border-slate-200 rounded-md bg-white cursor-pointer" />
                  </div>
                  <button type="submit" disabled={isUploading} className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold py-3 rounded-xl shadow-lg shadow-red-500/30 transition-all mt-4">
                     {isUploading ? 'Sedang Mengunggah...' : 'Submit Jawaban UAS'}
                  </button>
               </form>
            </div>
         </div>
      )}
    </div>
  );
};

export default Uas;