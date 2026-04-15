import React, { useState, useEffect } from 'react';
import { DollarSign, Clock, CheckCircle, AlertCircle, UploadCloud, FileText, X } from 'lucide-react';
import { getKeuanganUser, addSubmission } from '../services/db';

const Keuangan = () => {
  const userId = localStorage.getItem('userId');
  const [tagihanList, setTagihanList] = useState([]);

  useEffect(() => {
    if(userId) {
      setTagihanList(getKeuanganUser(userId));
    }
  }, [userId]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fileUrl, setFileUrl] = useState('');
  const [file, setFile] = useState(null);

  const submitUpload = async (e) => {
     e.preventDefault();
     if(!file && !fileUrl) return alert("Mohon lampirkan gambar/PDF bukti resi transfer.");
     const data = { nim: userId, kategori: 'keuangan', tipe: 'Bukti Pembayaran SPP/UKT', fileUrl: fileUrl, status: 'Pending' };
     await addSubmission(data, file);
     setIsModalOpen(false);
     setFile(null);
     setFileUrl('');
     alert("Bukti transfer berhasil diamankan! BAAK akan memvalidasi pembayaran Anda.");
  };

  const totalTunggakan = tagihanList.filter(t => t.status === 'Nunggak' || t.status === 'Belum Lunas').reduce((sum, t) => sum + t.tagihan, 0);

  return (
    <div className="animate-fade-in pb-10">
      <div className="mb-8 border-b border-gray-100 pb-4">
        <h2 className="text-3xl font-extrabold text-gray-800 tracking-tight">Administrasi Keuangan</h2>
        <p className="text-gray-500 text-sm mt-1">Kelola tagihan dan status pembayaran UKT Anda.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
         <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 h-full">
               <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center"><FileText size={20} className="mr-2 text-blue-600"/> Ringkasan Tagihan</h3>
               {tagihanList.length === 0 ? (
                  <p className="text-gray-500 text-sm font-medium">Belum ada tagihan terdaftar untuk semester ini.</p>
               ) : (
                  <div className="space-y-4">
                     {tagihanList.map(t => (
                        <div key={t.id} className="p-4 rounded-xl border border-gray-100 flex flex-col md:flex-row justify-between md:items-center gap-4 hover:shadow-md transition-shadow">
                           <div>
                              <p className="text-xs font-bold text-gray-400 mb-1">Bulan / Keterangan</p>
                              <h4 className="font-bold text-gray-800 text-lg">{t.bulan}</h4>
                              <p className="text-xs text-gray-500 mt-1">Jatuh Tempo: <span className="font-bold">{t.jatuhTempo}</span></p>
                           </div>
                           <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:min-w-32">
                              <span className="font-black text-lg text-gray-800">Rp {Number(t.tagihan).toLocaleString('id-ID')}</span>
                              <span className={`mt-0 md:mt-1 inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                 t.status === 'Lunas' ? 'bg-green-100 text-green-700' :
                                 t.status === 'Nunggak' ? 'bg-red-100 text-red-700 bg-red-100 shadow-[0_0_10px_rgb(239,68,68,0.2)]' :
                                 'bg-amber-100 text-amber-700'
                              }`}>
                                 {t.status === 'Lunas' && <CheckCircle size={10} className="mr-1"/>}
                                 {t.status === 'Nunggak' && <AlertCircle size={10} className="mr-1"/>}
                                 {t.status === 'Belum Lunas' && <Clock size={10} className="mr-1"/>}
                                 {t.status}
                              </span>
                           </div>
                        </div>
                     ))}
                  </div>
               )}
            </div>
         </div>
         <div className="space-y-6">
            <div className={`p-6 rounded-2xl shadow-sm border ${totalTunggakan > 0 ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`}>
               <h3 className={`text-sm font-bold uppercase tracking-widest flex items-center mb-2 ${totalTunggakan > 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {totalTunggakan > 0 ? <><AlertCircle size={16} className="mr-2"/> Tunggakan Pembayaran</> : <><CheckCircle size={16} className="mr-2"/> Semua Lunas</>}
               </h3>
               <p className={`text-4xl font-black tracking-tight ${totalTunggakan > 0 ? 'text-red-700' : 'text-green-700'}`}>Rp {totalTunggakan.toLocaleString('id-ID')}</p>
               {totalTunggakan > 0 && <p className="text-red-500/80 text-xs mt-3 font-medium">Anda memiliki tunggakan. Mohon segera melunasi pembayaran agar akses Papan Nilai dan KRS tidak ditangguhkan.</p>}
            </div>

            <button onClick={() => setIsModalOpen(true)} className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-500/30 transition-all flex items-center justify-center group transform hover:-translate-y-1">
               <UploadCloud size={20} className="mr-2 group-hover:-translate-y-1 transition-transform" /> Upload Bukti Transfer
            </button>
            <p className="text-xs text-gray-400 text-center font-medium px-4">Proses verifikasi mutasi maksimal 1x24 Jam hari kerja setelah upload bukti transfer.</p>
         </div>
      </div>

      {isModalOpen && (
         <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-slide-up">
               <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-blue-50 text-blue-900">
                  <h3 className="font-extrabold text-lg flex items-center"><UploadCloud size={20} className="mr-2"/> Konfirmasi Pembayaran</h3>
                  <button onClick={() => setIsModalOpen(false)} className="text-blue-400 hover:text-red-500 transition-colors"><X size={20}/></button>
               </div>
               
               <form onSubmit={submitUpload} className="p-6 space-y-4">
                  <div><label className="block text-xs font-bold text-gray-700 mb-1">Unggah Struk/Resi Transfer (JPG/PDF)</label>
                  <input type="file" onChange={(e) => setFile(e.target.files[0])} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-blue-500 text-sm" /></div>
                  <div className="flex items-center text-gray-400 text-xs font-bold my-2"><div className="flex-1 border-t border-gray-200"></div><span className="px-3">ATAU URL LINK DIGITAL</span><div className="flex-1 border-t border-gray-200"></div></div>
                  <div><label className="block text-xs font-bold text-gray-700 mb-1">Tautkan Tautan (Opsional jika file terlalu besar)</label>
                  <input type="url" value={fileUrl} onChange={(e) => setFileUrl(e.target.value)} placeholder="https://drive.google.com/..." className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500" /></div>
                  <button type="submit" className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-blue-500/30">Kirim Bukti Pembayaran</button>
               </form>
            </div>
         </div>
      )}
    </div>
  );
};

export default Keuangan;