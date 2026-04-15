import React, { useState, useEffect } from 'react';
import { FileCheck, Search, CheckCircle, XCircle, Clock, ExternalLink } from 'lucide-react';
import { getAllSubmissions, updateSubmissionStatus, getAllMahasiswa, getAllIkm, updateIkmStatus } from '../services/db';

const AdminValidasiBerkas = () => {
   const [submissions, setSubmissions] = useState([]);
   const [mahasiswa, setMahasiswa] = useState([]);
   const [search, setSearch] = useState('');
   const [filterKategori, setFilterKategori] = useState('all');

   const fetchData = () => {
      const subs = getAllSubmissions() || [];
      const ikms = getAllIkm() || [];
      
      const mappedIkms = ikms.map(i => ({
         id: i.id,
         nim: i.nim,
         kategori: 'ikm',
         tipe: `[IKM] ${i.kegiatan} - ${i.peringkat}`,
         fileUrl: i.fileSertifikat,
         fileFoto: i.fileFoto,
         poinAwal: i.poinAwal,
         poinValid: i.poinValid,
         deskripsi: i.deskripsi,
         status: i.status,
         timestamp: i.timestamp
      }));

      setSubmissions([...subs, ...mappedIkms].sort((a,b) => new Date(b.timestamp) - new Date(a.timestamp)));
      setMahasiswa(getAllMahasiswa());
   };

   useEffect(() => {
      fetchData();
   }, []);

   const getMahasiswaName = (nim) => {
      const m = mahasiswa.find(x => x.id === nim);
      return m ? m.nama : 'Unknown';
   };

   const filtered = submissions.filter(s => {
      const matchSearch = String(s.nim).includes(search) || getMahasiswaName(s.nim).toLowerCase().includes(search.toLowerCase());
      const matchKategori = filterKategori === 'all' || s.kategori === filterKategori;
      return matchSearch && matchKategori;
   });

   const handleStatus = (item, status) => {
      if(window.confirm(`Anda yakin ingin memberikan status "${status}" pada berkas ini?`)) {
         if (item.kategori === 'ikm') {
             let poin = 0;
             if (status === 'Disetujui') {
                 const input = prompt(`Masukkan Poin Valid untuk aktivitas IKM ini (Saran Poin Awal: ${item.poinAwal}):`, item.poinAwal);
                 if(input === null) return;
                 poin = parseInt(input) || 0;
             }
             updateIkmStatus(item.id, status, poin);
         } else {
             updateSubmissionStatus(item.id, status);
         }
         setTimeout(fetchData, 800);
      }
   };

   return (
      <div className="animate-fade-in pb-10">
         <div className="mb-6 flex flex-col md:flex-row justify-between md:items-end border-b border-gray-100 pb-4 gap-4">
            <div>
               <h2 className="text-3xl font-extrabold text-gray-800 flex items-center tracking-tight">
                  <FileCheck className="mr-3 text-indigo-600" size={32} />
                  Validasi Dokumen Berkas
               </h2>
               <p className="text-gray-500 mt-2 font-medium">Periksa dan validasi pengajuan CNP & Tugas Akhir Mahasiswa.</p>
            </div>
            
            <div className="flex flex-col md:flex-row gap-3">
               <select value={filterKategori} onChange={(e) => setFilterKategori(e.target.value)} className="p-2.5 bg-white border border-gray-200 rounded-xl outline-none focus:border-indigo-500 shadow-sm font-bold text-gray-600 text-sm">
                  <option value="all">Semua Kategori</option>
                  <option value="cnp">Career & Placement (CNP)</option>
                  <option value="tugas_akhir">Tugas Akhir (Skripsi)</option>
                  <option value="keuangan">Bukti Keuangan</option>
                  <option value="surat">Pengajuan Persuratan</option>
                  <option value="dokumen_pendukung">Dokumen Pendukung Mahasiswa</option>
                  <option value="literasi_digital">Literasi Digital Nasional</option>
                  <option value="ikm">Indeks Keaktifan MK/Kecakapan (IKM)</option>
               </select>
               <div className="relative group">
                  <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
                  <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari NIM / Nama..." className="pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl outline-none focus:border-indigo-500 shadow-sm w-full md:w-64" />
               </div>
            </div>
         </div>

         <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
               <table className="w-full text-left border-collapse">
                  <thead>
                     <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-100">
                        <th className="p-4 font-bold">Mahasiswa / Tanggal</th>
                        <th className="p-4 font-bold">Kategori / Tipe Berkas</th>
                        <th className="p-4 font-bold">Lampiran</th>
                        <th className="p-4 font-bold">Status</th>
                        <th className="p-4 font-bold text-center border-l border-gray-100 min-w-40">Aksi Validasi</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 text-sm">
                     {filtered.map(s => (
                        <tr key={s.id} className="hover:bg-gray-50/50 transition-colors">
                           <td className="p-4">
                              <p className="font-bold text-gray-800">{getMahasiswaName(s.nim)}</p>
                              <p className="text-xs text-gray-500">{s.nim}</p>
                              <p className="text-[10px] text-gray-400 mt-1 font-bold">{new Date(s.timestamp).toLocaleString('id-ID')}</p>
                           </td>
                           <td className="p-4">
                              <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider mb-1 ${
                                 s.kategori === 'cnp' ? 'bg-indigo-100 text-indigo-700' : 
                                 s.kategori === 'keuangan' ? 'bg-blue-100 text-blue-700' : 
                                 s.kategori === 'surat' ? 'bg-orange-100 text-orange-700' :
                                 s.kategori === 'dokumen_pendukung' ? 'bg-cyan-100 text-cyan-700' :
                                 s.kategori === 'literasi_digital' ? 'bg-teal-100 text-teal-700' :
                                 s.kategori === 'ikm' ? 'bg-emerald-100 text-emerald-700' :
                                 'bg-purple-100 text-purple-700'
                              }`}>
                                 {s.kategori === 'cnp' ? 'CNP' : 
                                  s.kategori === 'keuangan' ? 'Keuangan' : 
                                  s.kategori === 'surat' ? 'Persuratan' : 
                                  s.kategori === 'dokumen_pendukung' ? 'Data Pribadi' : 
                                  s.kategori === 'literasi_digital' ? 'Literasi Digital' : 
                                  s.kategori === 'ikm' ? 'Poin IKM' : 
                                  'Tugas Akhir'}
                              </span>
                              <p className="font-bold text-gray-700 leading-tight">{s.tipe}</p>
                              {s.kategori === 'ikm' && <p className="text-[10px] font-bold text-emerald-600 mt-1">Estimasi Poin: {s.poinAwal}</p>}
                           </td>
                           <td className="p-4">
                              <div className="flex flex-col space-y-2">
                                 {s.fileUrl ? (
                                    s.kategori === 'surat' && !s.fileUrl.startsWith('blob:') && !s.fileUrl.startsWith('http') ? (
                                       <span className="text-gray-600 text-xs font-medium italic mb-1 block">Alasan: {s.fileUrl}</span>
                                    ) : (
                                       <a href={s.fileUrl} target="_blank" rel="noreferrer" className="text-blue-600 hover:text-blue-800 flex items-center font-bold bg-blue-50 px-3 py-1.5 rounded-lg w-fit transition-colors"><ExternalLink size={14} className="mr-1.5"/> Lihat Berkas</a>
                                    )
                                 ) : <span className="text-gray-400 italic text-xs">Tak ada lampiran</span>}
                                 
                                 {s.fileFoto && (
                                    <a href={s.fileFoto} target="_blank" rel="noreferrer" className="text-pink-600 hover:text-pink-800 flex items-center font-bold bg-pink-50 px-3 py-1.5 rounded-lg w-fit transition-colors"><ExternalLink size={14} className="mr-1.5"/> Lihat Foto</a>
                                 )}
                              </div>
                           </td>
                           <td className="p-4">
                              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] tracking-wider uppercase font-black ${s.status === 'Disetujui' ? 'bg-green-100 text-green-700' : s.status === 'Ditolak' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                                 {s.status === 'Disetujui' && <CheckCircle size={10} className="mr-1"/>}
                                 {s.status === 'Ditolak' && <XCircle size={10} className="mr-1"/>}
                                 {s.status === 'Pending' && <Clock size={10} className="mr-1"/>}
                                 {s.status}
                              </span>
                           </td>
                           <td className="p-4 border-l border-gray-100">
                              <div className="flex justify-center space-x-2">
                                 <button onClick={() => handleStatus(s, 'Disetujui')} className="flex-1 bg-green-50 hover:bg-green-100 text-green-600 p-2 rounded-lg transition-colors font-bold text-xs flex items-center justify-center border border-green-200">
                                    <CheckCircle size={14} className="md:mr-1" /> <span className="hidden md:inline">Approve</span>
                                 </button>
                                 <button onClick={() => handleStatus(s, 'Ditolak')} className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 p-2 rounded-lg transition-colors font-bold text-xs flex items-center justify-center border border-red-200">
                                    <XCircle size={14} className="md:mr-1" /> <span className="hidden md:inline">Reject</span>
                                 </button>
                              </div>
                           </td>
                        </tr>
                     ))}
                     {filtered.length === 0 && (
                        <tr><td colSpan="5" className="p-10 text-center text-gray-400 font-medium bg-gray-50/50 border-b border-gray-100">Tidak ada data pengajuan yang sesuai dengan pencarian Anda.</td></tr>
                     )}
                  </tbody>
               </table>
            </div>
         </div>
      </div>
   );
};

export default AdminValidasiBerkas;
