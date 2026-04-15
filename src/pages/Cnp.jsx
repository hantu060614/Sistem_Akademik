import React, { useState, useEffect } from 'react';
import { Briefcase, ArrowRight, FileText, Upload, Calendar, X, ExternalLink, Clock, CheckCircle, XCircle, Download, Activity } from 'lucide-react';
import { getUserSubmissions, addSubmission, getUserBimbinganLogs, addBimbinganLog } from '../services/db';

const Cnp = () => {
  const userId = localStorage.getItem('userId');
  const [riwayatBerkas, setRiwayatBerkas] = useState([]);
  const [riwayatBimbingan, setRiwayatBimbingan] = useState([]);

  // Modal States
  const [activeModal, setActiveModal] = useState(null); // 'upload', 'bimbingan', 'jadwal', 'tracker'
  const [selectedTipe, setSelectedTipe] = useState('');
  
  // Upload State
  const [fileUrl, setFileUrl] = useState('');
  const [file, setFile] = useState(null);

  // Bimbingan State
  const [tanggalBimbingan, setTanggalBimbingan] = useState('');
  const [catatanBimbingan, setCatatanBimbingan] = useState('');

  const menus = [
    { title: "Track Record", type: 'tracker' }, 
    { title: "Download Panduan Laporan KKI", type: 'download' },
    { title: "Upload Sertifikat/Surat Ket Sudah Melaksanakan KKI", type: 'upload' },
    { title: "Upload Laporan KKI", type: 'upload' },
    { title: "Upload Nilai Perusahaan KKI", type: 'upload' },
    { title: "Input Bimbingan KKI", type: 'bimbingan' },
    { title: "Jadwal Sidang KKI", type: 'jadwal' },
    { title: "Upload Revisi KKI", type: 'upload' },
    { title: "Upload Surat Ket Sudah Bekerja", type: 'upload' },
    { title: "Upload File Training Softskill", type: 'upload' },
    { title: "Upload Soft Copy CV", type: 'upload' }
  ];

  const fetchData = () => {
     if(userId) {
        setRiwayatBerkas(getUserSubmissions(userId, 'cnp'));
        setRiwayatBimbingan(getUserBimbinganLogs(userId, 'cnp'));
     }
  };

  useEffect(() => {
     fetchData();
  }, [userId]);

  const handleMenuClick = (menu) => {
     setSelectedTipe(menu.title);
     if (menu.type === 'download') {
        alert("Mengunduh panduan_kki_terbaru.pdf..."); // Simulasi download PDF
        // window.open('/panduan.pdf', '_blank');
     } else {
        setFileUrl('');
        setFile(null);
        setTanggalBimbingan('');
        setCatatanBimbingan('');
        setActiveModal(menu.type);
     }
  };

  const submitUpload = async (e) => {
     e.preventDefault();
     if(!file && !fileUrl) return alert("Mohon lampirkan link file atau upload dokumen PDF.");
     const data = { nim: userId, kategori: 'cnp', tipe: selectedTipe, fileUrl: fileUrl, status: 'Pending' };
     await addSubmission(data, file);
     setActiveModal(null);
     fetchData();
  };

  const submitBimbingan = (e) => {
     e.preventDefault();
     const data = { nim: userId, kategori: 'cnp', tanggal: tanggalBimbingan, catatan: catatanBimbingan, status: 'Pending' };
     addBimbinganLog(data);
     setActiveModal(null);
     fetchData();
  };

  return (
    <div className="animate-fade-in pb-10">
      <div className="mb-8 border-b border-gray-100 pb-4">
        <h2 className="text-3xl font-extrabold text-gray-800 tracking-tight">Career & Placement (CNP)</h2>
        <p className="text-gray-500 text-sm mt-1">Pusat informasi KKI (Kuliah Kerja Industri) terpadu.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
        {menus.map((menu, index) => (
          <div key={index} onClick={() => handleMenuClick(menu)} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer flex items-center justify-between group">
            <div className="flex items-center space-x-3">
              <div className="bg-indigo-50 text-indigo-600 p-2 rounded-lg">
                {menu.type === 'upload' ? <Upload size={18} /> : 
                 menu.type === 'jadwal' ? <Calendar size={18} /> : 
                 menu.type === 'bimbingan' ? <FileText size={18} /> : 
                 menu.type === 'download' ? <Download size={18} /> : 
                 <Activity size={18} />}
              </div>
              <h3 className="font-semibold text-gray-700 text-sm group-hover:text-indigo-600 transition-colors line-clamp-2">{menu.title}</h3>
            </div>
            <ArrowRight size={16} className="text-gray-300 group-hover:text-indigo-500 flex-shrink-0 ml-2" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-10 border-t border-gray-100 pt-8">
         <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-800 flex items-center">
               <Upload size={18} className="mr-2 text-indigo-600"/> Riwayat Pengumpulan Dokumen
            </h3>
            <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-x-auto">
               <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 text-gray-500 text-[11px] uppercase tracking-wider">
                     <tr><th className="p-4 font-bold">Tanggal</th><th className="p-4 font-bold">Jenis Dokumen</th><th className="p-4 font-bold">Status Berkas</th></tr>
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
                     {riwayatBerkas.length === 0 && <tr><td colSpan="3" className="p-8 text-center text-gray-400 font-medium">Belum ada riwayat dokumen.</td></tr>}
                  </tbody>
               </table>
            </div>
         </div>

         <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-800 flex items-center">
               <FileText size={18} className="mr-2 text-indigo-600"/> Jurnal Bimbingan KKI
            </h3>
            <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-x-auto">
               <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 text-gray-500 text-[11px] uppercase tracking-wider">
                     <tr><th className="p-4 font-bold">Pelaksanaan</th><th className="p-4 font-bold">Uraian / Topik</th><th className="p-4 font-bold">Validasi Dosen</th></tr>
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
                     {riwayatBimbingan.length === 0 && <tr><td colSpan="3" className="p-8 text-center text-gray-400 font-medium">Anda belum menginput log bimbingan sama sekali.</td></tr>}
                  </tbody>
               </table>
            </div>
         </div>
      </div>

      {activeModal && (
         <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-slide-up">
               <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-indigo-50/50">
                  <h3 className="font-extrabold text-lg text-indigo-900">{selectedTipe}</h3>
                  <button onClick={() => setActiveModal(null)} className="text-gray-400 hover:text-red-500 transition-colors"><X size={20}/></button>
               </div>
               
               {activeModal === 'upload' && (
                  <form onSubmit={submitUpload} className="p-6 space-y-4">
                     <div><label className="block text-xs font-bold text-gray-700 mb-1">Pilih Dokumen PDF/Gambar Terkait</label>
                     <input type="file" onChange={(e) => setFile(e.target.files[0])} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-indigo-500 text-sm" /></div>
                     <div className="flex items-center text-gray-400 text-xs font-bold my-2"><div className="flex-1 border-t border-gray-200"></div><span className="px-3">ATAU URL DRIVE EKSTERNAL</span><div className="flex-1 border-t border-gray-200"></div></div>
                     <div><label className="block text-xs font-bold text-gray-700 mb-1">Tautkan Link</label>
                     <input type="url" value={fileUrl} onChange={(e) => setFileUrl(e.target.value)} placeholder="https://drive.google.com/..." className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-indigo-500" /></div>
                     <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-indigo-500/30">Kirim & Simpan</button>
                  </form>
               )}

               {activeModal === 'bimbingan' && (
                  <form onSubmit={submitBimbingan} className="p-6 space-y-4">
                     <div><label className="block text-xs font-bold text-gray-700 mb-1">Tanggal Pelaksanaan Bimbingan</label>
                     <input type="date" required value={tanggalBimbingan} onChange={(e) => setTanggalBimbingan(e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-indigo-500" /></div>
                     <div><label className="block text-xs font-bold text-gray-700 mb-1">Catatan / Topik Pembahasan</label>
                     <textarea required rows="4" value={catatanBimbingan} onChange={(e) => setCatatanBimbingan(e.target.value)} placeholder="Jelaskan progres bimbingan, revisi apa yang diberikan mentor..." className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-indigo-500"></textarea></div>
                     <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-indigo-500/30">Simpan Jurnal Bimbingan</button>
                  </form>
               )}

               {activeModal === 'jadwal' && (
                  <div className="p-10 text-center">
                     <Calendar size={56} className="mx-auto text-indigo-200 mb-5" />
                     <h4 className="text-2xl font-black text-gray-800 tracking-tight">Jadwal Belum Diterbitkan</h4>
                     <p className="text-gray-500 text-sm mt-3 font-medium px-4">Jadwal Sidang KKI Anda belum ditentukan oleh BAAK. Terus perbarui kelengkapan dokumen KKI Anda agar bisa mendaftar.</p>
                     <button onClick={() => setActiveModal(null)} className="mt-8 px-8 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors">Tutup Jendela</button>
                  </div>
               )}

               {activeModal === 'tracker' && (
                  <div className="p-10 text-center">
                     <Activity size={56} className="mx-auto text-blue-400 mb-5" />
                     <h4 className="text-2xl font-black text-gray-800 tracking-tight">Timeline KKI Aktif</h4>
                     <p className="text-gray-500 text-sm mt-3 font-medium px-4">Sistem mendeteksi bahwa progres Kuliah Kerja Industri Anda saat ini resmi berada pada tahap <strong>Penyusunan Laporan & Bimbingan Intensif</strong>.</p>
                     <button onClick={() => setActiveModal(null)} className="mt-8 px-8 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors">Sembunyikan</button>
                  </div>
               )}
            </div>
         </div>
      )}
    </div>
  );
};

export default Cnp;