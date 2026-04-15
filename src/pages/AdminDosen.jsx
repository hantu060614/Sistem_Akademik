import React, { useState, useEffect } from 'react';
import { Briefcase, Plus, Edit, Trash2, Save, X, BookOpen, UserCircle, Star } from 'lucide-react';
import { getAllDosen, addUser, updateUser, deleteUser } from '../services/db';

const AdminDosen = () => {
  const [dosens, setDosens] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});

  const fetchDosens = () => {
    setDosens(getAllDosen());
  };

  useEffect(() => {
    fetchDosens();
  }, []);

  const handleOpenForm = (d = null) => {
    if(d) {
      setFormData({...d});
      setIsEditing(true);
    } else {
      setFormData({ 
         id: '', nama: '', prodi: 'Dosen Tetap', role: 'dosen', password: '123',
         jabatanAkademik: 'Lektor', pendidikanSelesai: 'S2 - Magister', emailInstitusi: '',
         noTelp: '', NIP: ''
      });
      setIsEditing(false);
    }
    setIsFormOpen(true);
  };

  const handleSave = () => {
    if(!formData.id || !formData.nama) return alert('NIDN dan Nama Wajib diisi');
    
    // Ensure role is preserved uniquely as dosen
    const finalData = { ...formData, role: 'dosen' };

    if(isEditing) {
      updateUser(finalData.id, finalData);
    } else {
      addUser(finalData);
    }
    setIsFormOpen(false);
    fetchDosens();
  };

  const handleDelete = (id) => {
    if(window.confirm('Yakin menonaktifkan Dosen ini dari pangkalan data DIKTI kampus?')) {
      deleteUser(id);
      fetchDosens();
    }
  };

  return (
    <div className="p-8 animate-fade-in pb-20">
      <div className="mb-6 flex justify-between items-end border-b border-gray-100 pb-4">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-800 flex items-center">
            <Briefcase className="mr-3 text-indigo-600" size={32} />
            Kelola SDM Dosen
          </h2>
          <p className="text-gray-500 mt-2 font-medium">Manajemen data kepegawaian (HR) dan profil rekam jejak Akademik Pengajar.</p>
        </div>
        <button onClick={() => handleOpenForm(null)} className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold flex items-center shadow-lg shadow-indigo-500/30 transition-transform transform hover:-translate-y-0.5">
           <Plus size={18} className="mr-2" /> Registrasi Dosen
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {dosens.map((d) => (
           <div key={d.id} className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group relative">
              <div className="absolute top-4 right-4 flex bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleOpenForm(d)} className="p-2 text-amber-500 hover:bg-amber-100 transition-colors"><Edit size={16}/></button>
                  <button onClick={() => handleDelete(d.id)} className="p-2 text-red-500 hover:bg-red-100 border-l border-gray-100 transition-colors"><Trash2 size={16}/></button>
              </div>

              <div className="p-6 flex items-start flex-1 border-b border-gray-50">
                 <div className="w-16 h-16 bg-indigo-50 text-indigo-400 rounded-2xl flex items-center justify-center shrink-0 mr-4 border border-indigo-100 shadow-inner">
                    <UserCircle size={32} />
                 </div>
                 <div>
                    <span className="text-[10px] font-black uppercase text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded tracking-wider mb-2 inline-block shadow-sm">NIDN: {d.id}</span>
                    <h3 className="font-extrabold text-gray-800 text-lg leading-tight mb-1">{d.nama}</h3>
                    <p className="text-sm font-bold text-gray-500 flex items-center"><Star size={14} className="mr-1 text-amber-400"/> {d.jabatanAkademik || 'Tenaga Pengajar'}</p>
                 </div>
              </div>

              <div className="bg-slate-50 p-5 grid grid-cols-2 gap-y-3 gap-x-2 text-xs font-bold text-gray-600">
                 <div className="flex flex-col">
                    <span className="text-[9px] uppercase tracking-widest text-gray-400 mb-0.5">Status Ikatan</span>
                    <span className="text-gray-800 flex items-center"><Briefcase size={12} className="mr-1 text-indigo-400"/> {d.prodi}</span>
                 </div>
                 <div className="flex flex-col">
                    <span className="text-[9px] uppercase tracking-widest text-gray-400 mb-0.5">Pendidikan Terakhir</span>
                    <span className="text-gray-800 flex items-center"><BookOpen size={12} className="mr-1 text-indigo-400"/> {d.pendidikanSelesai || '-'}</span>
                 </div>
              </div>
           </div>
        ))}
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-3xl overflow-hidden animate-slide-up flex flex-col max-h-[95vh] relative z-[110]">
             
             <div className="bg-slate-50 border-b border-gray-100 p-6 flex justify-between items-center shrink-0">
                <div>
                   <h3 className="font-black text-2xl text-gray-800">{isEditing ? 'Pemutakhiran Data Dosen' : 'Hire Dosen Baru (Perekrutan)'}</h3>
                   <p className="text-sm font-bold text-gray-500 mt-1">Form ini mengakomodir sinkronisasi identitas HRD dengan pangkalan data IT sistem SIAKAD.</p>
                </div>
                <button onClick={() => setIsFormOpen(false)} className="text-gray-400 hover:text-red-500 bg-white p-2 rounded-xl shadow-sm border border-gray-200 transition-colors"><X size={20}/></button>
             </div>
             
             <div className="p-8 overflow-y-auto w-full relative">
                
                <h4 className="font-extrabold text-indigo-600 border-b-2 border-indigo-100 pb-2 mb-6 text-lg">Kredensial Otoritas Platform</h4>
                <div className="flex flex-col md:flex-row gap-6 mb-8">
                   <div className="flex-1">
                      <label className="block text-xs font-black text-gray-700 uppercase tracking-widest mb-2">NIDN (ID Login Unik) <span className="text-red-500">*</span></label>
                      <input type="text" value={formData.id} onChange={(e) => setFormData({...formData, id: e.target.value})} disabled={isEditing} className={`w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl outline-none font-bold ${isEditing?'text-gray-400 cursor-not-allowed border-transparent':'focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all'}`} placeholder="Nomor Induk Dosen..." />
                   </div>
                   <div className="flex-1">
                      <label className="block text-xs font-black text-gray-700 uppercase tracking-widest mb-2">Sandi Sistem (Admin-Generate)</label>
                      <input type="text" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 transition-all font-bold" />
                   </div>
                </div>

                <h4 className="font-extrabold text-blue-600 border-b-2 border-blue-100 pb-2 mb-6 text-lg">Kelengkapan SDM & Kepegawaian</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-slate-50 border border-slate-100 rounded-3xl">
                   <div className="md:col-span-2">
                       <label className="block text-xs font-black text-gray-700 uppercase tracking-widest mb-2">Nama Lengkap beserta Gelar Akademik <span className="text-red-500">*</span></label>
                       <input type="text" value={formData.nama} onChange={(e) => setFormData({...formData, nama: e.target.value})} className="w-full p-3.5 bg-white border border-gray-200 rounded-xl outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-black text-gray-900 text-lg" placeholder="Prof. Dr. Ir. Budi Santoso, M.Kom..." />
                   </div>
                   
                   <div>
                       <label className="block text-xs font-black text-gray-700 uppercase tracking-widest mb-2">Email Kampus / Institusi</label>
                       <input type="email" value={formData.emailInstitusi} onChange={(e) => setFormData({...formData, emailInstitusi: e.target.value})} className="w-full p-3.5 bg-white border border-gray-200 rounded-xl outline-none focus:border-blue-500 transition-all font-bold" placeholder="dosen@kampus.ac.id" />
                   </div>
                   
                   <div>
                       <label className="block text-xs font-black text-gray-700 uppercase tracking-widest mb-2">Nomor Induk Pegawai (NIP)</label>
                       <input type="text" value={formData.NIP} onChange={(e) => setFormData({...formData, NIP: e.target.value})} className="w-full p-3.5 bg-white border border-gray-200 rounded-xl outline-none focus:border-blue-500 transition-all font-bold" placeholder="opsional..." />
                   </div>

                   <div>
                       <label className="block text-xs font-black text-gray-700 uppercase tracking-widest mb-2">Jabatan Akademik & Fungsional</label>
                       <select value={formData.jabatanAkademik} onChange={(e) => setFormData({...formData, jabatanAkademik: e.target.value})} className="w-full p-3.5 bg-white border border-gray-200 rounded-xl outline-none focus:border-blue-500 font-bold cursor-pointer">
                          <option value="Tenaga Pengajar">Tenaga Pengajar</option>
                          <option value="Asisten Ahli">Asisten Ahli</option>
                          <option value="Lektor">Lektor</option>
                          <option value="Lektor Kepala">Lektor Kepala</option>
                          <option value="Guru Besar">Professor (Guru Besar)</option>
                       </select>
                   </div>
                   
                   <div>
                       <label className="block text-xs font-black text-gray-700 uppercase tracking-widest mb-2">Status Ikatan Kerja (Unit)</label>
                       <select value={formData.prodi} onChange={(e) => setFormData({...formData, prodi: e.target.value})} className="w-full p-3.5 bg-white border border-gray-200 rounded-xl outline-none focus:border-blue-500 font-bold cursor-pointer">
                          <option value="Dosen Tetap">Dosen Tetap Purna Waktu</option>
                          <option value="Dosen Praktisi">Praktisi Industri (Tamu)</option>
                          <option value="Dosen Luar Biasa">Dosen Luar Biasa (LB)</option>
                       </select>
                   </div>

                   <div className="md:col-span-2">
                       <label className="block text-xs font-black text-gray-700 uppercase tracking-widest mb-2">Pendidikan Terakhir Diselesaikan</label>
                       <select value={formData.pendidikanSelesai} onChange={(e) => setFormData({...formData, pendidikanSelesai: e.target.value})} className="w-full p-3.5 bg-white border border-gray-200 rounded-xl outline-none focus:border-blue-500 font-bold cursor-pointer">
                          <option value="-">Menunggu Konfirmasi HR</option>
                          <option value="S2 - Magister">S2 (Magister Program Studi)</option>
                          <option value="S3 - Doktor">S3 (Doktoral/Ph.D Program)</option>
                          <option value="Program Profesi">Program Vokasi / Profesi Spesialis</option>
                       </select>
                   </div>
                </div>

             </div>

             <div className="p-6 bg-white border-t border-gray-100 flex justify-end gap-3 shrink-0 shadow-[0_-10px_40px_rgba(0,0,0,0.03)] relative z-10 rounded-b-[2rem]">
                <button onClick={() => setIsFormOpen(false)} className="px-6 py-3 font-bold text-gray-500 hover:bg-gray-100 rounded-xl transition-colors">Batal / Tutup</button>
                <button onClick={handleSave} className="px-8 py-3 font-black text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl flex items-center shadow-xl shadow-indigo-500/40 transition-all transform hover:-translate-y-1">
                   <Save size={18} className="mr-2" /> Sahkan Otoritas Dosen
                </button>
             </div>

          </div>
        </div>
      )}
    </div>
  );
};
export default AdminDosen;
