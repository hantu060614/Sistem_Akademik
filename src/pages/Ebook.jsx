import React, { useState, useEffect } from 'react';
import { Book, Plus, Trash2, Download, ExternalLink, Library, X, Search, FileText } from 'lucide-react';
import { getEbooks, addEbook, deleteEbook } from '../services/db';

const Ebook = () => {
   const userRole = localStorage.getItem('userRole') || 'mahasiswa';
   const [ebooks, setEbooks] = useState([]);
   const [isFormOpen, setIsFormOpen] = useState(false);
   const [search, setSearch] = useState('');
   const [formData, setFormData] = useState({ judul: '', matkul: '', url: '', size: 'Cloud Link' });
   const [file, setFile] = useState(null);

   const fetchEbooks = () => {
      setEbooks([...getEbooks()]);
   };

   useEffect(() => {
      fetchEbooks();
   }, []);

   const handleSave = async (e) => {
      e.preventDefault();
      if(!formData.judul || (!formData.url && !file)) return alert('Kredensial E-book wajib diisi (Judul & URL/File)!');
      await addEbook({ ...formData, uploaderRole: userRole }, file);
      setIsFormOpen(false);
      setFormData({ judul: '', matkul: '', url: '', size: 'Cloud Link' });
      setFile(null);
      fetchEbooks();
   };

   const handleDelete = (id) => {
      if(window.confirm('Hapus dokumen ini dari perpustakaan pusat SIAKAD?')) {
          deleteEbook(id);
          fetchEbooks();
      }
   };

   const filteredDocs = ebooks.filter(e => e.judul.toLowerCase().includes(search.toLowerCase()) || e.matkul.toLowerCase().includes(search.toLowerCase()));

   return (
      <div className="p-8 animate-fade-in pb-20">
        <div className="mb-6 flex flex-col md:flex-row justify-between md:items-end border-b border-gray-100 pb-4 gap-4">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-800 flex items-center">
              <Library className="mr-3 text-purple-600" size={32} />
              Perpustakaan e-Book
            </h2>
            <p className="text-gray-500 mt-2 font-medium">Modul PDF perkuliahan terintegrasi (Dikelola BAAK & Dosen).</p>
          </div>
          
          <div className="flex gap-3 items-center">
             <div className="relative group">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-purple-600 transition-colors" />
                <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari referensi buku..." className="pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl outline-none focus:border-purple-500 shadow-sm w-full md:w-64" />
             </div>
             
             {(userRole === 'admin' || userRole === 'dosen') && (
                <button onClick={() => setIsFormOpen(true)} className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-xl font-bold flex items-center shadow-lg shadow-purple-500/30 transition-transform transform hover:-translate-y-0.5 whitespace-nowrap">
                  <Plus size={18} className="mr-2" /> Unggah Modul
                </button>
             )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
           {filteredDocs.map((doc) => (
              <div key={doc.id} className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group overflow-hidden relative">
                 {/* Akses Moderasi */}
                 {(userRole === 'admin' || userRole === 'dosen') && (
                     <button onClick={() => handleDelete(doc.id)} className="absolute top-3 right-3 bg-white p-2 rounded-lg text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all shadow-sm border border-red-100 z-10"><Trash2 size={16}/></button>
                 )}

                 <div className="h-40 bg-gradient-to-br from-purple-50 to-indigo-50 border-b border-purple-100/50 flex flex-col items-center justify-center p-6 relative">
                    <Book size={48} className="text-purple-300 drop-shadow-sm mb-2 transform group-hover:scale-110 group-hover:-translate-y-1 transition-all duration-300" />
                    <span className="text-[10px] font-black uppercase text-purple-600 tracking-widest bg-white/60 backdrop-blur-sm px-3 py-1 rounded-full">{doc.matkul}</span>
                 </div>
                 
                 <div className="p-6 flex-1 flex flex-col">
                    <h3 className="font-extrabold text-gray-800 text-lg leading-snug mb-2 line-clamp-2" title={doc.judul}>{doc.judul}</h3>
                    <div className="flex items-center text-xs font-bold text-gray-400 mb-6">
                       <FileText size={14} className="mr-1.5"/> {doc.size} &bull; Upload: {new Date(doc.timestamp).toLocaleDateString()}
                    </div>
                    
                    <div className="mt-auto grid grid-cols-2 gap-2">
                       <a href={doc.url} target="_blank" rel="noreferrer" className="flex items-center justify-center bg-gray-50 text-gray-600 hover:bg-gray-100 font-bold py-2.5 rounded-xl transition-colors border border-gray-200">
                          <ExternalLink size={16} className="mr-1.5"/> Lihat
                       </a>
                       <a href={doc.url} download target="_blank" rel="noreferrer" className="flex items-center justify-center bg-purple-50 text-purple-600 hover:bg-purple-100 font-bold py-2.5 rounded-xl transition-colors border border-purple-200">
                          <Download size={16} className="mr-1.5"/> Unduh
                       </a>
                    </div>
                 </div>
              </div>
           ))}
        </div>

        {filteredDocs.length === 0 && (
           <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-gray-200 text-center">
              <Library size={48} className="text-gray-300 mb-4" />
              <h3 className="text-xl font-extrabold text-gray-800 mb-1">Pustaka Kosong</h3>
              <p className="text-gray-500 font-medium">Belum ada dokumen PDF/Modul yang ditambahkan pada etalase ini.</p>
           </div>
        )}

        {isFormOpen && (
           <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-slide-up">
                 <div className="bg-slate-50 border-b border-gray-100 p-6 flex justify-between items-center">
                    <h3 className="font-extrabold text-xl text-gray-800 flex items-center"><Plus className="mr-2 text-purple-600"/> Tautkan Modul/E-book</h3>
                    <button onClick={() => setIsFormOpen(false)} className="text-gray-400 hover:text-red-500"><X size={20}/></button>
                 </div>
                 
                 <form onSubmit={handleSave} className="p-6 space-y-4">
                    <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl text-xs text-blue-700 leading-relaxed font-medium mb-4">
                       <span className="font-bold">Info:</span> Anda dapat mengunggah file PDF secara langsung, atau merekatkan *Link Sharing* Drive (Google Drive/OneDrive) ke dalam kolom URL di bawah.
                    </div>
                    <div>
                       <label className="block text-xs font-black text-gray-700 uppercase tracking-widest mb-1.5">Judul Buku / Modul <span className="text-red-500">*</span></label>
                       <input type="text" value={formData.judul} onChange={(e) => setFormData({...formData, judul: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-purple-500 font-bold" placeholder="Misal: Algoritma & Struktur Data Lanjut" required />
                    </div>
                    <div>
                       <label className="block text-xs font-black text-gray-700 uppercase tracking-widest mb-1.5">Mata Kuliah Referensi</label>
                       <input type="text" value={formData.matkul} onChange={(e) => setFormData({...formData, matkul: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-purple-500 font-medium" placeholder="Misal: MI301" />
                    </div>
                    <div>
                       <label className="block text-xs font-black text-gray-700 uppercase tracking-widest mb-1.5">Link Direktori Unduh (URL)</label>
                       <input type="url" value={formData.url} onChange={(e) => setFormData({...formData, url: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-purple-500 text-sm font-medium" placeholder="https://drive.google.com/..." />
                    </div>
                    <div>
                       <label className="block text-xs font-black text-gray-700 uppercase tracking-widest mb-1.5">Atau Upload File (PDF)</label>
                       <input type="file" accept="application/pdf" onChange={(e) => setFile(e.target.files[0])} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-purple-500 text-sm font-medium" />
                    </div>
                    
                    <button type="submit" className="w-full mt-4 bg-purple-600 hover:bg-purple-700 text-white font-black py-3.5 rounded-xl shadow-lg shadow-purple-500/30 transition-all flex items-center justify-center">
                       Unggah ke Pustaka Pusat
                    </button>
                 </form>
              </div>
           </div>
        )}
      </div>
   );
};

export default Ebook;