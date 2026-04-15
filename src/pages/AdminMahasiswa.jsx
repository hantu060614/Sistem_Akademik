import React, { useState, useEffect } from 'react';
import { Users, Plus, Edit, Trash2, Save, X, Fingerprint } from 'lucide-react';
import { getAllMahasiswa, addUser, updateUser, deleteUser } from '../services/db';

const AdminMahasiswa = () => {
  const [mahasiswas, setMahasiswas] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({ id: '', nama: '', prodi: '', role: 'mahasiswa', password: '123' });
  const [isEditing, setIsEditing] = useState(false);

  const fetchMahasiswas = () => {
    setMahasiswas(getAllMahasiswa());
  };

  useEffect(() => {
    fetchMahasiswas();
  }, []);

  const handleOpenForm = (mhs = null) => {
    if(mhs) {
      setFormData(mhs);
      setIsEditing(true);
    } else {
      setFormData({ 
         id: '', nama: '', prodi: 'Manajemen Informatika', role: 'mahasiswa', password: '123',
         nik: '', tempatLahir: '', tanggalLahir: '', jenisKelamin: 'Laki-laki', agama: 'Islam',
         golonganDarah: '-', statusMenikah: 'Belum Kawin', wargaNegara: 'WNI', alamat: '', 
         kota: '', asalSekolah: '', jurusan: '', namaIbu: ''
      });
      setIsEditing(false);
    }
    setIsFormOpen(true);
  };

  const handleSave = () => {
    if(!formData.id || !formData.nama) return alert('NIM dan Nama Wajib diisi');
    if(isEditing) {
      updateUser(formData.id, formData);
    } else {
      addUser(formData);
    }
    setIsFormOpen(false);
    fetchMahasiswas();
  };

  const handleDelete = (id) => {
    if(window.confirm('Yakin menghapus mahasiswa ini secara permanen?')) {
      deleteUser(id);
      fetchMahasiswas();
    }
  };

  return (
    <div className="p-8 animate-fade-in pb-20">
      <div className="mb-6 flex justify-between items-end border-b border-gray-100 pb-4">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-800 flex items-center">
            <Users className="mr-3 text-blue-600" size={32} />
            Data Master Mahasiswa
          </h2>
          <p className="text-gray-500 mt-2 font-medium">Delegasi wewenang perubahan data sensitif mahasiswa terpusat di sini.</p>
        </div>
        <button onClick={() => handleOpenForm(null)} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold flex items-center shadow-lg shadow-blue-500/30 transition-transform transform hover:-translate-y-0.5 z-10">
           <Plus size={18} className="mr-2" /> Registrasi Mahasiswa
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden relative z-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
             <thead className="bg-slate-50 text-slate-600 uppercase font-extrabold text-[11px] tracking-wider border-b border-gray-200">
               <tr>
                 <th className="px-6 py-5">NIM / Nama Lengkap</th>
                 <th className="px-6 py-5">Program Studi</th>
                 <th className="px-6 py-5">Info Kredensial</th>
                 <th className="px-6 py-5 text-center">Modifikasi Total</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-gray-100">
               {mahasiswas.map((mhs) => (
                  <tr key={mhs.id} className="hover:bg-blue-50/50 transition-colors">
                    <td className="px-6 py-4">
                       <span className="font-black text-gray-900 block text-base mb-1">{mhs.nama}</span>
                       <span className="font-bold text-blue-600 flex items-center"><Fingerprint size={12} className="mr-1"/> {mhs.id}</span>
                    </td>
                    <td className="px-6 py-4 text-gray-600 font-bold">{mhs.prodi}</td>
                    <td className="px-6 py-4">
                       <span className="text-gray-400 font-mono text-xs cursor-help bg-slate-100 px-2 py-1 rounded border border-slate-200 block w-max mb-1" title={`Password: ${mhs.password}`}>Password: *** (Arahkan)</span>
                       <span className="text-xs font-bold text-gray-400 block truncate max-w-[150px]">{mhs.nik ? `NIK: ${mhs.nik}` : 'NIK Belum Terisi'}</span>
                    </td>
                    <td className="px-6 py-4 flex justify-center gap-2">
                      <button onClick={() => handleOpenForm(mhs)} className="bg-amber-100 text-amber-700 px-4 py-2 rounded-xl font-bold hover:bg-amber-200 flex items-center transition-colors"><Edit size={16} className="mr-2"/> Atur Data</button>
                      <button onClick={() => handleDelete(mhs.id)} className="bg-red-50 text-red-500 p-2.5 rounded-xl hover:bg-red-100 transition-colors"><Trash2 size={16}/></button>
                    </td>
                  </tr>
               ))}
               {mahasiswas.length === 0 && (
                  <tr><td colSpan="5" className="px-6 py-12 text-center text-gray-400 font-bold text-lg">Belum ada mahasiswa terdaftar</td></tr>
               )}
             </tbody>
          </table>
        </div>
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-3xl overflow-hidden animate-slide-up flex flex-col max-h-[95vh] relative z-[110]">
             
             <div className="bg-slate-50 border-b border-gray-100 p-6 flex justify-between items-center shrink-0">
                <div>
                   <h3 className="font-black text-2xl text-gray-800">{isEditing ? 'Master Hak Akses: Edit Mahasiswa' : 'Pendaftaran Mahasiswa Baru'}</h3>
                   <p className="text-sm font-bold text-gray-500 mt-1">Gunakan formulir ini untuk perbaikan NIK, Nama, dan data DUKCAPIL/DIKTI lainnya yang terkunci pada perangkat Mahasiswa.</p>
                </div>
                <button onClick={() => setIsFormOpen(false)} className="text-gray-400 hover:text-red-500 bg-white p-2 rounded-xl shadow-sm border border-gray-200 transition-colors"><X size={20}/></button>
             </div>
             
             <div className="p-8 overflow-y-auto w-full relative">
                
                <h4 className="font-extrabold text-blue-600 border-b-2 border-blue-100 pb-2 mb-6 text-lg">Kredensial Login & Akademik</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                   <div>
                      <label className="block text-xs font-black text-gray-700 uppercase tracking-widest mb-2">NIM (ID Login Utama) <span className="text-red-500">*</span></label>
                      <input type="text" value={formData.id} onChange={(e) => setFormData({...formData, id: e.target.value})} disabled={isEditing} className={`w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl outline-none transition-all font-bold ${isEditing?'text-gray-400 cursor-not-allowed':'focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10'}`} placeholder="Ketik NIM unik..." />
                   </div>
                   <div>
                      <label className="block text-xs font-black text-gray-700 uppercase tracking-widest mb-2">Sandi Akses <span className="text-red-500">*</span></label>
                      <input type="text" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all font-bold" />
                   </div>
                   <div className="md:col-span-2">
                       <label className="block text-xs font-black text-gray-700 uppercase tracking-widest mb-2">Pilih Program Studi Akademik <span className="text-red-500">*</span></label>
                       <select value={formData.prodi} onChange={(e) => setFormData({...formData, prodi: e.target.value})} className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all font-bold text-gray-800 cursor-pointer">
                          <option value="Manajemen Informatika">Manajemen Informatika</option>
                          <option value="Komputerisasi Akuntansi">Komputerisasi Akuntansi</option>
                          <option value="Administrasi Bisnis">Administrasi Bisnis</option>
                          <option value="Hubungan Masyarakat">Hubungan Masyarakat</option>
                       </select>
                   </div>
                </div>

                <h4 className="font-extrabold text-amber-600 border-b-2 border-amber-100 pb-2 mb-6 text-lg">Biodata Kependudukan (Sesuai KTP)</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 bg-amber-50/30 p-6 rounded-3xl border border-amber-100/50 relative overflow-hidden">
                   <div className="md:col-span-2">
                      <label className="block text-xs font-black text-gray-700 uppercase tracking-widest mb-2">Nama Lengkap (Ijazah) <span className="text-red-500">*</span></label>
                      <input type="text" value={formData.nama} onChange={(e) => setFormData({...formData, nama: e.target.value})} className="w-full p-3.5 bg-white border border-gray-200 rounded-xl outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 transition-all font-bold text-gray-900 text-lg" placeholder="M. Hamami Hamzah..." />
                   </div>
                   <div>
                       <label className="block text-xs font-black text-gray-700 uppercase tracking-widest mb-2">NIK (Sesuai KTP)</label>
                       <input type="text" value={formData.nik || ''} onChange={(e) => setFormData({...formData, nik: e.target.value})} className="w-full p-3.5 bg-white border border-gray-200 rounded-xl outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 transition-all font-bold" placeholder="3209..." />
                   </div>
                   <div>
                       <label className="block text-xs font-black text-gray-700 uppercase tracking-widest mb-2">Nama Ibu Kandung</label>
                       <input type="text" value={formData.namaIbu || ''} onChange={(e) => setFormData({...formData, namaIbu: e.target.value})} className="w-full p-3.5 bg-white border border-gray-200 rounded-xl outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 transition-all font-bold" placeholder="Aminah..." />
                   </div>
                   <div>
                       <label className="block text-xs font-black text-gray-700 uppercase tracking-widest mb-2">Tempat Lahir</label>
                       <input type="text" value={formData.tempatLahir || ''} onChange={(e) => setFormData({...formData, tempatLahir: e.target.value})} className="w-full p-3.5 bg-white border border-gray-200 rounded-xl outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 transition-all font-bold" placeholder="Cirebon..." />
                   </div>
                   <div>
                       <label className="block text-xs font-black text-gray-700 uppercase tracking-widest mb-2">Tanggal Lahir</label>
                       <input type="text" value={formData.tanggalLahir || ''} onChange={(e) => setFormData({...formData, tanggalLahir: e.target.value})} className="w-full p-3.5 bg-white border border-gray-200 rounded-xl outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 transition-all font-bold" placeholder="14 Juni 2006..." />
                   </div>
                   <div>
                       <label className="block text-xs font-black text-gray-700 uppercase tracking-widest mb-2">Jenis Kelamin</label>
                       <select value={formData.jenisKelamin || 'Laki-laki'} onChange={(e) => setFormData({...formData, jenisKelamin: e.target.value})} className="w-full p-3.5 bg-white border border-gray-200 rounded-xl outline-none focus:border-amber-500 font-bold cursor-pointer">
                          <option value="Laki-laki">Laki-laki</option>
                          <option value="Perempuan">Perempuan</option>
                       </select>
                   </div>
                   <div>
                       <label className="block text-xs font-black text-gray-700 uppercase tracking-widest mb-2">Agama</label>
                       <input type="text" value={formData.agama || ''} onChange={(e) => setFormData({...formData, agama: e.target.value})} className="w-full p-3.5 bg-white border border-gray-200 rounded-xl outline-none focus:border-amber-500 font-bold" placeholder="Islam..." />
                   </div>
                   <div className="md:col-span-2">
                       <label className="block text-xs font-black text-gray-700 uppercase tracking-widest mb-2">Alamat Domisili Selengkapnya</label>
                       <textarea rows="3" value={formData.alamat || ''} onChange={(e) => setFormData({...formData, alamat: e.target.value})} className="w-full p-3.5 bg-white border border-gray-200 rounded-xl outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 transition-all font-medium leading-relaxed"></textarea>
                   </div>
                </div>

                <h4 className="font-extrabold text-emerald-600 border-b-2 border-emerald-100 pb-2 mb-6 text-lg mt-8">Kontak & Pembayaran</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 bg-emerald-50/30 p-6 rounded-3xl border border-emerald-100/50">
                   <div className="md:col-span-2">
                       <label className="block text-xs font-black text-gray-700 uppercase tracking-widest mb-2">No VA Mandiri (Metode Pembayaran)</label>
                       <input type="text" value={formData.noVa || ''} onChange={(e) => setFormData({...formData, noVa: e.target.value})} className="w-full p-3.5 bg-white border border-gray-200 rounded-xl outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all font-bold text-gray-900" placeholder="8837..." />
                   </div>
                   <div>
                       <label className="block text-xs font-black text-gray-700 uppercase tracking-widest mb-2">Email Pribadi</label>
                       <input type="email" value={formData.email || ''} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full p-3.5 bg-white border border-gray-200 rounded-xl outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all font-bold" placeholder="email@gmail.com..." />
                   </div>
                   <div>
                       <label className="block text-xs font-black text-gray-700 uppercase tracking-widest mb-2">Email Kampus</label>
                       <input type="email" value={formData.emailPlb || ''} onChange={(e) => setFormData({...formData, emailPlb: e.target.value})} className="w-full p-3.5 bg-white border border-gray-200 rounded-xl outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all font-bold" placeholder="student@kampus.ac.id..." />
                   </div>
                </div>

             </div>

             <div className="p-6 bg-white border-t border-gray-100 flex justify-end gap-3 shrink-0 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] relative z-10 rounded-b-[2rem]">
                <button onClick={() => setIsFormOpen(false)} className="px-6 py-3 font-bold text-gray-500 hover:bg-gray-100 rounded-xl transition-colors">Batalkan</button>
                <button onClick={handleSave} className="px-8 py-3 font-black text-white bg-blue-600 hover:bg-blue-700 rounded-xl flex items-center shadow-xl shadow-blue-500/40 transition-all transform hover:-translate-y-1">
                   <Save size={18} className="mr-2" /> Paksa Simpan (Override)
                </button>
             </div>

          </div>
        </div>
      )}
    </div>
  );
};
export default AdminMahasiswa;
