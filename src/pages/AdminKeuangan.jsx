import React, { useState, useEffect } from 'react';
import { DollarSign, Search, CheckCircle, Clock, AlertCircle, Plus, Edit, Trash2 } from 'lucide-react';
import { getAllKeuangan, addKeuangan, updateKeuangan, deleteKeuangan, getAllMahasiswa } from '../services/db';

const AdminKeuangan = () => {
   const [keuanganList, setKeuanganList] = useState([]);
   const [mahasiswaList, setMahasiswaList] = useState([]);
   const [search, setSearch] = useState('');
   
   // Form Add/Edit
   const [isFormOpen, setIsFormOpen] = useState(false);
   const [formData, setFormData] = useState({ id: null, nim: '', bulan: '', tagihan: 1500000, status: 'Belum Lunas', jatuhTempo: '' });

   const fetchData = () => {
      setKeuanganList(getAllKeuangan());
      setMahasiswaList(getAllMahasiswa());
   };

   useEffect(() => {
      fetchData();
   }, []);

   const getMahasiswaName = (nim) => {
      const m = mahasiswaList.find(x => x.id === nim);
      return m ? m.nama : 'Unknown';
   };

   const filteredKeuangan = keuanganList.filter(k => 
      String(k.nim).includes(search) || k.bulan.toLowerCase().includes(search.toLowerCase()) || getMahasiswaName(k.nim).toLowerCase().includes(search.toLowerCase())
   );

   const handleSave = (e) => {
      e.preventDefault();
      if(formData.id) {
         updateKeuangan(formData.id, formData);
      } else {
         addKeuangan(formData);
      }
      setIsFormOpen(false);
      fetchData();
   };

   const handleEdit = (k) => {
      setFormData(k);
      setIsFormOpen(true);
   };

   const handleDelete = (id) => {
      if(window.confirm('Hapus record keuangan ini?')) {
         deleteKeuangan(id);
         fetchData();
      }
   };

   return (
      <div className="animate-fade-in pb-10">
         <div className="mb-6 flex flex-col md:flex-row justify-between md:items-end border-b border-gray-100 pb-4 gap-4">
            <div>
               <h2 className="text-3xl font-extrabold text-gray-800 flex items-center">
                  <DollarSign className="mr-3 text-green-600" size={32} />
                  Manajemen Keuangan
               </h2>
               <p className="text-gray-500 mt-2 font-medium">Kelola tagihan, SPP, dan tunggakan mahasiswa.</p>
            </div>
            
            <div className="flex gap-3 items-center">
               <div className="relative group">
                  <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-green-600 transition-colors" />
                  <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari NIM / Nama..." className="pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl outline-none focus:border-green-500 shadow-sm w-full md:w-64" />
               </div>
               <button onClick={() => { setFormData({ id: null, nim: '', bulan: '', tagihan: 1500000, status: 'Belum Lunas', jatuhTempo: '' }); setIsFormOpen(true); }} className="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-xl font-bold flex items-center shadow-lg shadow-green-500/30 transition-transform transform hover:-translate-y-0.5 whitespace-nowrap">
                  <Plus size={18} className="mr-2" /> Tagihan Baru
               </button>
            </div>
         </div>

         <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
               <table className="w-full text-left border-collapse">
                  <thead>
                     <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-100">
                        <th className="p-4 font-bold">Mahasiswa</th>
                        <th className="p-4 font-bold">Bulan Tagihan</th>
                        <th className="p-4 font-bold">Nominal (Rp)</th>
                        <th className="p-4 font-bold">Jatuh Tempo</th>
                        <th className="p-4 font-bold">Status</th>
                        <th className="p-4 font-bold text-center">Aksi</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 text-sm">
                     {filteredKeuangan.map((k) => (
                        <tr key={k.id} className="hover:bg-gray-50/50 transition-colors">
                           <td className="p-4">
                              <p className="font-bold text-gray-800">{getMahasiswaName(k.nim)}</p>
                              <p className="text-xs text-gray-500">{k.nim}</p>
                           </td>
                           <td className="p-4 font-medium text-gray-700">{k.bulan}</td>
                           <td className="p-4 font-bold text-gray-800">Rp {Number(k.tagihan).toLocaleString('id-ID')}</td>
                           <td className="p-4 text-gray-500">{k.jatuhTempo}</td>
                           <td className="p-4">
                              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                                 k.status === 'Lunas' ? 'bg-green-100 text-green-700' :
                                 k.status === 'Nunggak' ? 'bg-red-100 text-red-700' :
                                 'bg-amber-100 text-amber-700'
                              }`}>
                                 {k.status === 'Lunas' && <CheckCircle size={12} className="mr-1"/>}
                                 {k.status === 'Nunggak' && <AlertCircle size={12} className="mr-1"/>}
                                 {k.status === 'Belum Lunas' && <Clock size={12} className="mr-1"/>}
                                 {k.status}
                              </span>
                           </td>
                           <td className="p-4 text-center space-x-2">
                              <button onClick={() => handleEdit(k)} className="text-blue-500 hover:bg-blue-50 p-2 rounded-lg transition-colors"><Edit size={16} /></button>
                              <button onClick={() => handleDelete(k.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"><Trash2 size={16} /></button>
                           </td>
                        </tr>
                     ))}
                     {filteredKeuangan.length === 0 && (
                        <tr>
                           <td colSpan="6" className="p-10 text-center text-gray-400 font-medium">Belum ada data keuangan.</td>
                        </tr>
                     )}
                  </tbody>
               </table>
            </div>
         </div>

         {isFormOpen && (
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
               <div className="bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden animate-slide-up">
                  <div className="p-6 border-b border-gray-100">
                     <h3 className="font-bold text-xl text-gray-800">{formData.id ? 'Edit Tagihan' : 'Tambah Tagihan'}</h3>
                  </div>
                  <form onSubmit={handleSave} className="p-6 space-y-4">
                     <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">NIM Mahasiswa</label>
                        <select required value={formData.nim} onChange={(e) => setFormData({...formData, nim: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-green-500">
                           <option value="">Pilih Mahasiswa</option>
                           {mahasiswaList.map(m => <option key={m.id} value={m.id}>{m.id} - {m.nama}</option>)}
                        </select>
                     </div>
                     <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Bulan/Keterangan Tagihan</label>
                        <input type="text" required value={formData.bulan} onChange={(e) => setFormData({...formData, bulan: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-green-500" placeholder="Misal: UKT Semester Ganjil 2025" />
                     </div>
                     <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Nominal Tagihan (Rp)</label>
                        <input type="number" required value={formData.tagihan} onChange={(e) => setFormData({...formData, tagihan: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-green-500" />
                     </div>
                     <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Tanggal Jatuh Tempo</label>
                        <input type="date" required value={formData.jatuhTempo} onChange={(e) => setFormData({...formData, jatuhTempo: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-green-500" />
                     </div>
                     <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Status Pembayaran</label>
                        <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-green-500">
                           <option value="Belum Lunas">Belum Lunas</option>
                           <option value="Lunas">Lunas</option>
                           <option value="Nunggak">Nunggak</option>
                        </select>
                     </div>
                     <div className="flex justify-end space-x-3 pt-4">
                        <button type="button" onClick={() => setIsFormOpen(false)} className="px-5 py-2.5 text-gray-600 font-bold hover:bg-gray-100 rounded-xl transition-colors">Batal</button>
                        <button type="submit" className="px-5 py-2.5 bg-green-600 text-white font-bold rounded-xl shadow-lg shadow-green-500/30 hover:bg-green-700 transition-colors">Simpan Tagihan</button>
                     </div>
                  </form>
               </div>
            </div>
         )}
      </div>
   );
};

export default AdminKeuangan;
