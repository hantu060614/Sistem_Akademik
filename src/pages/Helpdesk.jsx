import React, { useState, useEffect } from 'react';
import { Mail, CheckCircle, Send, ShieldAlert, FileText, ArrowLeft, Clock } from 'lucide-react';
import { getTicketsByUser, createTicket } from '../services/db';
import { Link } from 'react-router-dom';

const Helpdesk = () => {
  const userId = localStorage.getItem('userId');
  const userName = localStorage.getItem('userName') || 'Mahasiswa';
  
  const [tickets, setTickets] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({ subject: 'Revisi Biodata', message: '' });
  
  const fetchTickets = () => {
     if(userId) setTickets(getTicketsByUser(userId));
  };

  useEffect(() => {
     fetchTickets();
  }, [userId]);

  const handleSubmit = (e) => {
     e.preventDefault();
     if(!formData.message) return alert("Pesan tidak boleh kosong!");
     
     createTicket(userId, userName, `[${formData.subject}] ${formData.message}`, false);
     setIsFormOpen(false);
     setFormData({ ...formData, message: '' });
     fetchTickets();
  };

  return (
    <div className="p-8 animate-fade-in pb-20">
      <div className="mb-6 flex justify-between items-end border-b border-gray-100 pb-4">
        <div>
          <Link to="/app/profil" className="inline-flex items-center text-sm font-bold text-blue-600 hover:text-blue-800 mb-4 transition-colors">
            <ArrowLeft size={16} className="mr-1" /> Kembali ke Profil
          </Link>
          <h2 className="text-3xl font-extrabold text-gray-800 flex items-center">
            <Mail className="mr-3 text-emerald-600" size={32} />
            Helpdesk IT Terpadu
          </h2>
          <p className="text-gray-500 mt-2 font-medium">Bantuan revisi data krusial & kendala teknis (Ticket System).</p>
        </div>
        <button 
           onClick={() => setIsFormOpen(true)}
           className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-bold flex items-center shadow-lg shadow-emerald-500/30 transition-all transform hover:-translate-y-0.5"
        >
           <FileText size={18} className="mr-2" /> Buat Tiket Baru
        </button>
      </div>

      {isFormOpen && (
          <div className="bg-slate-900 rounded-3xl shadow-xl p-8 mb-8 text-white animate-slide-up relative overflow-hidden">
             <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                 <ShieldAlert size={120} />
             </div>
             <h3 className="font-extrabold text-2xl mb-2 relative z-10">Formulir Pesan ke IT/BAAK</h3>
             <p className="text-slate-400 mb-6 relative z-10 text-sm">Gunakan form ini untuk meminta Admin mengubah Nama, NIK, Tempat/Tgl Lahir yang terkunci.</p>
             
             <form onSubmit={handleSubmit} className="relative z-10 space-y-4 max-w-2xl">
                 <div>
                    <label className="block text-sm font-bold text-slate-300 mb-1">Perihal Kategori</label>
                    <select value={formData.subject} onChange={(e) => setFormData({...formData, subject: e.target.value})} className="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl outline-none focus:border-emerald-500 text-slate-100 font-bold">
                       <option value="Revisi Biodata">Revisi Biodata Utama</option>
                       <option value="Reset Akun">Lupa Sandi / Reset Akun</option>
                       <option value="Sistem Error">Sistem Error / Bug Web</option>
                       <option value="Validasi KRS">Pertanyaan Validasi KRS</option>
                    </select>
                 </div>
                 <div>
                    <label className="block text-sm font-bold text-slate-300 mb-1">Isi Pesan (Deskripsi Permasalahan)</label>
                    <textarea rows="4" value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} className="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl outline-none focus:border-emerald-500 text-slate-100 placeholder-slate-500" placeholder="Contoh: Halo BAAK, tolong perbaiki NIK saya menjadi 320XXXXXXXX karena salah input..."></textarea>
                 </div>
                 <div className="flex gap-3 justify-end pt-2">
                    <button type="button" onClick={() => setIsFormOpen(false)} className="px-5 py-2.5 font-bold text-slate-400 hover:text-white rounded-xl">Batal</button>
                    <button type="submit" className="px-6 py-2.5 font-bold text-emerald-900 bg-emerald-400 hover:bg-emerald-300 rounded-xl flex items-center shadow-lg shadow-emerald-500/20">
                       <Send size={18} className="mr-2" /> Kirim Tiket
                    </button>
                 </div>
             </form>
          </div>
      )}

      <div className="space-y-4">
         <h3 className="font-extrabold text-xl text-gray-800 mb-4 border-b border-gray-100 pb-2">Riwayat Keluhan Anda</h3>
         {tickets.length === 0 ? (
            <div className="bg-slate-50 text-center py-12 rounded-3xl border-2 border-dashed border-gray-200">
                <p className="text-gray-500 font-bold mb-1">Belum ada riwayat tiket yang dikirim.</p>
                <p className="text-gray-400 text-sm">Masalah Anda? Hubungi BAAK langsung lewat tombol [Buat Tiket Baru].</p>
            </div>
         ) : (
            tickets.slice().reverse().map(t => (
                <div key={t.id} className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden flex flex-col hover:border-gray-300 transition-all">
                   <div className="p-5 flex flex-col md:flex-row justify-between items-start gap-4">
                       <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                             <span className="bg-gray-100 text-gray-600 font-black text-[10px] px-2 py-1 uppercase rounded-md tracking-wider">#{t.id}</span>
                             <span className="text-xs font-bold text-gray-400 flex items-center"><Clock size={12} className="mr-1"/> {new Date(t.createdAt).toLocaleDateString()}</span>
                          </div>
                          <h4 className="font-bold text-gray-800 leading-relaxed">{t.message}</h4>
                       </div>
                       <div>
                          {t.status === 'closed' ? (
                              <span className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-3 py-1 font-bold text-xs rounded-full flex items-center">
                                 <CheckCircle size={14} className="mr-1" /> Terjawab
                              </span>
                          ) : (
                              <span className="bg-amber-50 border border-amber-200 text-amber-700 px-3 py-1 font-bold text-xs rounded-full flex items-center">
                                 <Clock size={14} className="mr-1" /> Menunggu IT
                              </span>
                          )}
                       </div>
                   </div>
                   
                   {t.reply && (
                      <div className="bg-emerald-50/50 p-5 border-t border-emerald-100 flex gap-3">
                          <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                              <ShieldAlert size={14} />
                          </div>
                          <div>
                              <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1">Balasan Official BAAK / IT:</p>
                              <p className="text-sm font-medium text-emerald-900">{t.reply}</p>
                          </div>
                      </div>
                   )}
                </div>
            ))
         )}
      </div>

    </div>
  );
};

export default Helpdesk;
