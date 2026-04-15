import React, { useState, useEffect } from 'react';
import { Database, Plus, Edit, Trash2, Save, X, BookOpen } from 'lucide-react';
import { getAllMatkuls, addMatkul, updateMatkul, deleteMatkul, getAllDosen } from '../services/db';

const AdminMatkul = () => {
  const [matkuls, setMatkuls] = useState([]);
  const [dosens, setDosens] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({ id: '', nama: '', sks: 3, semester: 1, dosenId: '', ruang: 'Lab 1', jadwal: 'Senin, 08:00 - 10:30' });
  const [isEditing, setIsEditing] = useState(false);

  const fetchData = () => {
    setMatkuls(getAllMatkuls());
    setDosens(getAllDosen());
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenForm = (m = null) => {
    if(m) {
      setFormData(m);
      setIsEditing(true);
    } else {
      setFormData({ id: '', nama: '', sks: 3, semester: 1, dosenId: dosens[0]?.id || '', ruang: 'Lab 1', jadwal: 'Senin, 08:00 - 10:30' });
      setIsEditing(false);
    }
    setIsFormOpen(true);
  };

  const handleSave = () => {
    if(!formData.id || !formData.nama || !formData.dosenId) return alert('Kode, Nama dan Dosen Pengampu Wajib diisi');
    const saveData = { ...formData, sks: Number(formData.sks), semester: Number(formData.semester) };
    if(isEditing) {
      updateMatkul(formData.id, saveData);
    } else {
      addMatkul(saveData);
    }
    setIsFormOpen(false);
    fetchData();
  };

  const handleDelete = (id) => {
    if(window.confirm('Yakin menghapus mata kuliah ini dari basis data?')) {
      deleteMatkul(id);
      fetchData();
    }
  };

  const getDosenName = (id) => {
    const d = dosens.find(x => x.id === id);
    return d ? d.nama : 'Silakan setting Dosen Pengampu';
  };

  return (
    <div className="p-8 animate-fade-in relative">
      <div className="mb-6 flex justify-between items-end border-b border-gray-100 pb-4">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-800 flex items-center">
            <Database className="mr-3 text-emerald-600" size={32} />
            Master Mata Kuliah
          </h2>
          <p className="text-gray-500 mt-2">Kelola daftar seluruh mata kuliah dan relasi ke dosen pengampu.</p>
        </div>
        <button onClick={() => handleOpenForm(null)} className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-bold flex items-center shadow-lg shadow-emerald-500/30 transition-all transform hover:-translate-y-0.5">
           <Plus size={18} className="mr-2" /> Tambah Matkul
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {matkuls.map((mk) => (
           <div key={mk.id} className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="p-5 flex justify-between items-start">
                 <div className="flex-1 pr-4">
                    <span className="text-xs font-extrabold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-md tracking-wider uppercase">{mk.id}</span>
                    <h3 className="font-extrabold text-lg text-gray-800 mt-3 leading-tight">{mk.nama}</h3>
                    <p className="text-sm font-bold text-gray-400 mt-1">{mk.sks} SKS • Semester {mk.semester}</p>
                 </div>
                 <div className="flex bg-slate-50 rounded-xl border border-slate-100 overflow-hidden shadow-sm">
                    <button onClick={() => handleOpenForm(mk)} className="p-2 text-amber-500 hover:bg-amber-100 transition-colors"><Edit size={16}/></button>
                    <button onClick={() => handleDelete(mk.id)} className="p-2 text-red-500 hover:bg-red-100 border-l border-slate-100 transition-colors"><Trash2 size={16}/></button>
                 </div>
              </div>
              <div className="bg-slate-50 p-4 border-t border-gray-100 space-y-2.5 text-xs font-bold text-gray-600">
                 <div className="flex items-center"><BookOpen size={14} className="mr-2 text-emerald-500"/> <span className="text-gray-800">{getDosenName(mk.dosenId)}</span></div>
                 <div className="flex items-center"><Database size={14} className="mr-2 text-indigo-500"/> {mk.jadwal} ({mk.ruang})</div>
              </div>
           </div>
        ))}
        {matkuls.length === 0 && (
           <div className="col-span-full flex flex-col items-center justify-center py-16 bg-white rounded-3xl border-2 border-dashed border-gray-200">
              <Database size={48} className="text-gray-300 mb-4" />
              <p className="text-gray-500 font-bold text-lg">Basis Data Kurikulum Kosong</p>
           </div>
        )}
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in relative">
             <div className="bg-slate-50 border-b border-gray-100 p-6 flex justify-between items-center">
                <h3 className="font-extrabold text-xl text-gray-800">{isEditing ? 'Edit Matkul System' : 'Registrasi Matkul Baru'}</h3>
                <button onClick={() => setIsFormOpen(false)} className="text-gray-400 hover:text-red-500 transition-colors"><X size={20}/></button>
             </div>
             
             <div className="p-6 grid grid-cols-2 gap-4">
                <div className="col-span-2">
                   <label className="block text-xs font-bold text-gray-700 mb-1">Kode Matkul <span className="text-red-500">*</span></label>
                   <input type="text" value={formData.id} onChange={(e) => setFormData({...formData, id: e.target.value})} disabled={isEditing} className={`w-full p-2.5 bg-gray-50 border ${isEditing?'border-transparent text-gray-400':'border-gray-200 focus:bg-white'} rounded-xl outline-none focus:border-emerald-500 font-bold uppercase transition-all`} placeholder="Unik (Misal: MI301)" />
                </div>
                <div className="col-span-2">
                   <label className="block text-xs font-bold text-gray-700 mb-1">Nama Matkul <span className="text-red-500">*</span></label>
                   <input type="text" value={formData.nama} onChange={(e) => setFormData({...formData, nama: e.target.value})} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:bg-white focus:border-emerald-500 font-bold text-gray-800 transition-all" placeholder="Ketik Nama Matkul..." />
                </div>
                <div>
                   <label className="block text-xs font-bold text-gray-700 mb-1">Bobot SKS <span className="text-red-500">*</span></label>
                   <input type="number" value={formData.sks} onChange={(e) => setFormData({...formData, sks: e.target.value})} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:bg-white focus:border-emerald-500 font-bold text-gray-800 text-center" />
                </div>
                <div>
                   <label className="block text-xs font-bold text-gray-700 mb-1">Diambil di SMT <span className="text-red-500">*</span></label>
                   <input type="number" value={formData.semester} onChange={(e) => setFormData({...formData, semester: e.target.value})} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:bg-white focus:border-emerald-500 font-bold text-gray-800 text-center" />
                </div>
                <div className="col-span-2">
                   <label className="block text-xs font-bold text-gray-700 mb-1">Dosen Pengampu <span className="text-red-500">*</span></label>
                   <select value={formData.dosenId} onChange={(e) => setFormData({...formData, dosenId: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:bg-white focus:border-emerald-500 font-bold text-gray-800 cursor-pointer transition-all">
                      <option value="">-- Setup Dosen --</option>
                      {dosens.map(d => <option key={d.id} value={d.id}>{d.nama}</option>)}
                   </select>
                </div>
                <div>
                   <label className="block text-xs font-bold text-gray-700 mb-1">Alokasi Ruangan</label>
                   <input type="text" value={formData.ruang} onChange={(e) => setFormData({...formData, ruang: e.target.value})} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:bg-white focus:border-emerald-500 text-sm font-medium" />
                </div>
                <div>
                   <label className="block text-xs font-bold text-gray-700 mb-1">Sesi Perkuliahan</label>
                   <input type="text" value={formData.jadwal} onChange={(e) => setFormData({...formData, jadwal: e.target.value})} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:bg-white focus:border-emerald-500 text-sm font-medium" placeholder="Senin, 08:00 - 10:30" />
                </div>
             </div>
             <div className="p-5 bg-slate-50 border-t border-gray-100 flex justify-end gap-3 rounded-b-3xl">
                <button onClick={() => setIsFormOpen(false)} className="px-6 py-2.5 font-bold text-gray-600 hover:bg-gray-200 rounded-xl transition-colors">Batal</button>
                <button onClick={handleSave} className="px-6 py-2.5 font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl flex items-center shadow-lg shadow-emerald-500/30 transition-all transform hover:-translate-y-0.5">
                   <Save size={18} className="mr-2" /> Sync Record
                </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default AdminMatkul;
