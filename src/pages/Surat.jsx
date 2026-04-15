import React, { useState, useEffect } from 'react';
import { Mail, Download, ArrowRight, X, Clock, CheckCircle, XCircle } from 'lucide-react';
import { getUserSubmissions, addSubmission } from '../services/db';

const Surat = () => {
   const userId = localStorage.getItem('userId');
   const [riwayat, setRiwayat] = useState([]);
   const [isModalOpen, setIsModalOpen] = useState(false);
   const [selectedSurat, setSelectedSurat] = useState('');
   const [keterangan, setKeterangan] = useState('');

   const suratList = [
      { title: "Pengajuan SK Aktif Kuliah", type: "pengajuan" },
      { title: "Pengajuan Surat Permohonan Observasi", type: "pengajuan" },
      { title: "Pengajuan Pindah Prodi", type: "pengajuan" },
      { title: "Download Surat Pengunduran diri", type: "download" },
      { title: "Download Surat Permohonan Cuti", type: "download" },
      { title: "Download Form Pindah Prodi", type: "download" }
   ];

   const fetchData = () => {
      if(userId) setRiwayat(getUserSubmissions(userId, 'surat'));
   };

   useEffect(() => {
      fetchData();
   }, [userId]);

   const handleAksi = (item) => {
      if (item.type === 'download') {
         alert(`Mengunduh file: ${item.title.replace('Download ', '')}.pdf ...`);
      } else {
         setSelectedSurat(item.title);
         setKeterangan('');
         setIsModalOpen(true);
      }
   };

   const handleSubmit = async (e) => {
      e.preventDefault();
      const data = {
         nim: userId,
         kategori: 'surat',
         tipe: selectedSurat,
         fileUrl: keterangan, // Menyimpan alasan di field fileUrl agar ringkas untuk DB
         status: 'Pending'
      };
      await addSubmission(data, null); // Tanpa file, murni form request
      setIsModalOpen(false);
      fetchData();
   };

   return (
      <div className="animate-fade-in pb-10">
         <div className="mb-8 border-b border-gray-100 pb-4">
            <h2 className="text-3xl font-extrabold text-gray-800 tracking-tight flex items-center">
               <Mail className="mr-3 text-blue-600" size={32} />
               Layanan Persuratan
            </h2>
            <p className="text-gray-500 text-sm mt-1">Layanan pengajuan dokumen administratif dan pengunduhan form BAAK.</p>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
            {suratList.map((item, index) => (
               <div key={index} onClick={() => handleAksi(item)} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-200 transition-all cursor-pointer flex items-center justify-between group">
                  <div className="flex items-center space-x-3">
                     <div className={`p-2 rounded-lg ${item.type === 'download' ? 'bg-orange-50 text-orange-600' : 'bg-blue-50 text-blue-600'}`}>
                        {item.type === 'download' ? <Download size={18} /> : <Mail size={18} />}
                     </div>
                     <h3 className="font-bold text-gray-700 text-sm group-hover:text-blue-700 transition-colors">{item.title}</h3>
                  </div>
                  <ArrowRight size={16} className={`flex-shrink-0 ml-2 transition-colors ${item.type === 'download' ? 'text-orange-200 group-hover:text-orange-500' : 'text-blue-200 group-hover:text-blue-500'}`} />
               </div>
            ))}
         </div>

         <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-800 flex items-center border-b border-gray-100 pb-2">
               <Clock size={20} className="mr-2 text-blue-600"/> Riwayat Pengajuan Surat Anda
            </h3>
            <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-x-auto">
               <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 text-gray-500 text-[11px] uppercase tracking-wider">
                     <tr><th className="p-4 font-bold">Tanggal</th><th className="p-4 font-bold">Jenis Pengajuan</th><th className="p-4 font-bold">Alasan/Keterangan Tambahan</th><th className="p-4 font-bold">Status BAAK</th></tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                     {riwayat.map(r => (
                        <tr key={r.id}>
                           <td className="p-4 text-xs font-medium text-gray-500 whitespace-nowrap">{new Date(r.timestamp).toLocaleDateString('id-ID')}</td>
                           <td className="p-4 font-bold text-gray-800 leading-tight">{r.tipe}</td>
                           <td className="p-4 text-gray-600 text-xs">{r.fileUrl || '-'}</td>
                           <td className="p-4">
                              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${r.status === 'Disetujui' ? 'bg-green-100 text-green-700' : r.status === 'Ditolak' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                                 {r.status === 'Disetujui' && <CheckCircle size={10} className="mr-1"/>}
                                 {r.status === 'Ditolak' && <XCircle size={10} className="mr-1"/>}
                                 {r.status === 'Pending' && <Clock size={10} className="mr-1"/>}
                                 {r.status}
                              </span>
                           </td>
                        </tr>
                     ))}
                     {riwayat.length === 0 && <tr><td colSpan="4" className="p-8 text-center text-gray-400 font-medium">Anda belum pernah mengajukan persuratan ke BAAK.</td></tr>}
                  </tbody>
               </table>
            </div>
         </div>

         {isModalOpen && (
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
               <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-slide-up">
                  <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-blue-50 text-blue-900">
                     <h3 className="font-extrabold text-lg flex items-center">Formulir Request Surat</h3>
                     <button onClick={() => setIsModalOpen(false)} className="text-blue-400 hover:text-red-500 transition-colors"><X size={20}/></button>
                  </div>
                  
                  <form onSubmit={handleSubmit} className="p-6 space-y-4">
                     <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Tipe Surat</label>
                        <input type="text" readOnly value={selectedSurat} className="w-full p-3 bg-gray-100 border border-gray-200 rounded-xl font-bold text-gray-600 outline-none" />
                     </div>
                     <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Alasan / Detail / Tujuan Pengajuan</label>
                        <textarea required rows="4" value={keterangan} onChange={(e) => setKeterangan(e.target.value)} placeholder="Contoh: Digunakan untuk syarat pendaftaran beasiswa..." className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-blue-500"></textarea>
                     </div>
                     <button type="submit" className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-blue-500/30">Kirim Permohonan Surat</button>
                  </form>
               </div>
            </div>
         )}
      </div>
   );
};

export default Surat;