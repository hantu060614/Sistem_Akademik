import React, { useState, useEffect } from 'react';
import { GraduationCap, ArrowRight, BookOpen, Clock, CheckCircle, XCircle, ExternalLink, X, Calendar, Upload, FileText, Activity } from 'lucide-react';
import { getUserSubmissions, addSubmission, getUserBimbinganLogs, addBimbinganLog } from '../services/db';

const TugasAkhir = () => {
  const userId = localStorage.getItem('userId');
  const [riwayatBerkas, setRiwayatBerkas] = useState([]);
  const [riwayatBimbingan, setRiwayatBimbingan] = useState([]);

  // Modal State
  const [activeModal, setActiveModal] = useState(null); // 'upload', 'bimbingan', 'jadwal', 'tracker'
  const [selectedTipe, setSelectedTipe] = useState('');
  
  // Upload State
  const [fileUrl, setFileUrl] = useState('');
  const [file, setFile] = useState(null);
  
  // Bimbingan State
  const [tanggalBimbingan, setTanggalBimbingan] = useState('');
  const [catatanBimbingan, setCatatanBimbingan] = useState('');

  const menus = [
    { title: "Pengajuan Proposal Skripsi", type: 'upload' },
    { title: "Entri Proses Bimbingan", type: 'bimbingan' },
    { title: "Daftar Sidang Tugas Akhir", type: 'upload' },
    { title: "Verifikasi Kelayakan Sidang", type: 'tracker' },
    { title: "Jadwal Ujian Sidang", type: 'jadwal' },
    { title: "Upload Dokumen Revisi", type: 'upload' }
  ];

  const fetchData = () => {
     if(userId) {
        setRiwayatBerkas(getUserSubmissions(userId, 'tugas_akhir'));
        setRiwayatBimbingan(getUserBimbinganLogs(userId, 'tugas_akhir'));
     }
  };

  useEffect(() => {
     fetchData();
  }, [userId]);

  const handleMenuClick = (menu) => {
     setSelectedTipe(menu.title);
     setFileUrl('');
     setFile(null);
     setTanggalBimbingan('');
     setCatatanBimbingan('');
     setActiveModal(menu.type);
  };

  const submitUpload = async (e) => {
     e.preventDefault();
     if(!file && !fileUrl) return alert("Mohon lampirkan link/URL Draf atau Upload Dokumen PDF Anda.");
     const data = { nim: userId, kategori: 'tugas_akhir', tipe: selectedTipe, fileUrl: fileUrl, status: 'Pending' };
     await addSubmission(data, file);
     setActiveModal(null);
     fetchData();
  };

  const submitBimbingan = (e) => {
     e.preventDefault();
     const data = { nim: userId, kategori: 'tugas_akhir', tanggal: tanggalBimbingan, catatan: catatanBimbingan, status: 'Pending' };
     addBimbinganLog(data);
     setActiveModal(null);
     fetchData();
  };

  return (
    <div className="animate-fade-in pb-10">
      <div className="mb-8 border-b border-gray-100 pb-4">
        <h2 className="text-3xl font-extrabold text-gray-800 tracking-tight">Tugas Akhir / Skripsi</h2>
        <p className="text-gray-500 text-sm mt-1">Platform interaktif pendaftaran seminar, bimbingan berkala, hingga pasca-sidang.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
        {menus.map((menu, index) => (
          <div key={index} onClick={() => handleMenuClick(menu)} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:border-purple-200 transition-all cursor-pointer group flex flex-col justify-between">
            <div className={`p-3 rounded-xl w-fit mb-4 group-hover:scale-110 transition-transform ${menu.type === 'upload' ? 'bg-purple-50 text-purple-600' : menu.type === 'jadwal' ? 'bg-amber-50 text-amber-600' : menu.type === 'bimbingan' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'}`}>
               {menu.type === 'upload' ? <Upload size={20} /> : 
                menu.type === 'jadwal' ? <Calendar size={20} /> : 
                menu.type === 'bimbingan' ? <FileText size={20} /> : 
                <Activity size={20} />}
            </div>
            <h3 className="font-bold text-gray-800 mb-4">{menu.title}</h3>
            <div className={`flex justify-end transition-colors ${menu.type === 'upload' ? 'text-purple-200 group-hover:text-purple-600' : menu.type === 'jadwal' ? 'text-amber-200 group-hover:text-amber-600' : menu.type === 'bimbingan' ? 'text-blue-200 group-hover:text-blue-600' : 'text-emerald-200 group-hover:text-emerald-600'}`}>
              <ArrowRight size={18} />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-10 border-t border-gray-100 pt-8">
         <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-800 flex items-center">
               <Upload size={18} className="mr-2 text-purple-600"/> Histori Pengajuan Berkas TA
            </h3>
            <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-x-auto">
               <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 text-gray-500 text-[11px] uppercase tracking-wider">
                     <tr><th className="p-4 font-bold">Tanggal</th><th className="p-4 font-bold">Modul Pengajuan</th><th className="p-4 font-bold">Feedback Status</th></tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                     {riwayatBerkas.map(r => (
                        <tr key={r.id}>
                           <td className="p-4 text-xs font-medium text-gray-500 whitespace-nowrap">{new Date(r.timestamp).toLocaleDateString('id-ID')}</td>
                           <td className="p-4 font-bold text-gray-700 leading-tight">{r.tipe}</td>
                           <td className="p-4">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${r.status === 'Disetujui' ? 'bg-green-100 text-green-700' : r.status === 'Ditolak' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>{r.status}</span>
                           </td>
                        </tr>
                     ))}
                     {riwayatBerkas.length === 0 && <tr><td colSpan="3" className="p-8 text-center text-gray-400 font-medium">Belum ada history berkas Sidang/Tugas Akhir.</td></tr>}
                  </tbody>
               </table>
            </div>
         </div>

         <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-800 flex items-center">
               <FileText size={18} className="mr-2 text-purple-600"/> Buku Jurnal Bimbingan Dosen
            </h3>
            <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-x-auto">
               <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 text-gray-500 text-[11px] uppercase tracking-wider">
                     <tr><th className="p-4 font-bold">Pertemuan</th><th className="p-4 font-bold">Uraian / Revisi</th><th className="p-4 font-bold">Verifikasi Pembimbing</th></tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                     {riwayatBimbingan.map(r => (
                        <tr key={r.id}>
                           <td className="p-4 text-xs font-bold text-gray-600 whitespace-nowrap">{r.tanggal}</td>
                           <td className="p-4 text-gray-600 text-xs font-medium leading-relaxed">{r.catatan}</td>
                           <td className="p-4">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${r.status === 'Disetujui' ? 'bg-green-100 text-green-700' : r.status === 'Ditolak' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>{r.status}</span>
                           </td>
                        </tr>
                     ))}
                     {riwayatBimbingan.length === 0 && <tr><td colSpan="3" className="p-8 text-center text-gray-400 font-medium">Form jurnal bimbingan skripsi / laporan masih kosong.</td></tr>}
                  </tbody>
               </table>
            </div>
         </div>
      </div>

      {activeModal && (
         <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 xl:p-0">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-slide-in-right">
               <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-purple-50 text-purple-900">
                  <h3 className="font-extrabold text-lg">{selectedTipe}</h3>
                  <button onClick={() => setActiveModal(null)} className="text-purple-400 hover:text-red-500 transition-colors"><X size={20}/></button>
               </div>
               
               {activeModal === 'upload' && (
                  <form onSubmit={submitUpload} className="p-6 space-y-4">
                     <div><label className="block text-xs font-bold text-gray-700 mb-1">Unggah Dokumen Inti (PDF Saja)</label>
                     <input type="file" onChange={(e) => setFile(e.target.files[0])} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-purple-500 text-sm" /></div>
                     <div className="flex items-center text-gray-400 text-xs font-bold my-2"><div className="flex-1 border-t border-gray-200"></div><span className="px-3">ATAU URL DRIVE EKSTERNAL</span><div className="flex-1 border-t border-gray-200"></div></div>
                     <div><label className="block text-xs font-bold text-gray-700 mb-1">Tautkan Tautan Folder Skripsi/File Besar</label>
                     <input type="url" value={fileUrl} onChange={(e) => setFileUrl(e.target.value)} placeholder="https://drive.google.com/..." className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-purple-500" /></div>
                     <button type="submit" className="w-full mt-4 bg-purple-600 hover:bg-purple-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-purple-500/30">Setor ke Sistem</button>
                  </form>
               )}

               {activeModal === 'bimbingan' && (
                  <form onSubmit={submitBimbingan} className="p-6 space-y-4">
                     <div><label className="block text-xs font-bold text-gray-700 mb-1">Tanggal Konsultasi / Bimbingan</label>
                     <input type="date" required value={tanggalBimbingan} onChange={(e) => setTanggalBimbingan(e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-purple-500" /></div>
                     <div><label className="block text-xs font-bold text-gray-700 mb-1">Objek Pembahasan (Bab yang dibuat/Revisi dari dosen)</label>
                     <textarea required rows="4" value={catatanBimbingan} onChange={(e) => setCatatanBimbingan(e.target.value)} placeholder="Misal: Dosen menyuruh merevisi Bab 3 bagian Desain Sistem..." className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-purple-500"></textarea></div>
                     <button type="submit" className="w-full mt-4 bg-purple-600 hover:bg-purple-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-purple-500/30">Submit Progress Bimbingan</button>
                  </form>
               )}

               {activeModal === 'jadwal' && (
                  <div className="p-10 text-center">
                     <Calendar size={56} className="mx-auto text-amber-300 mb-5" />
                     <h4 className="text-2xl font-black text-gray-800 tracking-tight">Status Ujian / Sidang</h4>
                     <p className="text-gray-500 text-sm mt-3 font-medium px-4">Anda belum didaftarkan dalam gelombang sidang Tugas Akhir terdekat oleh Administrasi / BAAK. Pastikan buku bimbingan penuh dan prasyarat lolos.</p>
                     <button onClick={() => setActiveModal(null)} className="mt-8 px-8 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors">Menutup Beritahuan</button>
                  </div>
               )}

               {activeModal === 'tracker' && (
                  <div className="p-10 text-center">
                     <CheckCircle size={56} className="mx-auto text-emerald-400 mb-5" />
                     <h4 className="text-2xl font-black text-gray-800 tracking-tight">Pengecekan Kelayakan</h4>
                     <p className="text-gray-500 text-sm mt-3 font-medium px-4">Berdasarkan data akademik BAAK terbaru, dokumen prasyarat daftar sidang skripsi Anda memuat status <strong>Belum Lengkap</strong>. Kartu bimbingan belum disahkan Dosen Pembimbing.</p>
                     <button onClick={() => setActiveModal(null)} className="mt-8 px-8 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors">Paham, Terima Kasih.</button>
                  </div>
               )}
            </div>
         </div>
      )}
    </div>
  );
};

export default TugasAkhir;