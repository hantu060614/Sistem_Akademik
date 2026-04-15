import React, { useState, useEffect } from 'react';
import { Mail, CheckCircle, ShieldAlert, Clock, Inbox, Send, Search, Trash2 } from 'lucide-react';
import { getTickets, replyTicket, deleteTicket } from '../services/db';

const AdminHelpdesk = () => {
  const [tickets, setTickets] = useState([]);
  const [replyForm, setReplyForm] = useState({ tId: null, message: '' });
  const [filter, setFilter] = useState('open');

  const fetchTickets = () => {
     setTickets(getTickets());
  };

  useEffect(() => {
     fetchTickets();
  }, []);

  const handleReply = (e) => {
     e.preventDefault();
     if(!replyForm.message) return alert("Pesan balasan harus diisi!");
     replyTicket(replyForm.tId, replyForm.message);
     setReplyForm({ tId: null, message: '' });
     fetchTickets();
  };

  const handleDelete = (id) => {
     if(window.confirm('Yakin ingin menghapus riwayat laporan ini secara permanen?')) {
         deleteTicket(id);
         fetchTickets();
     }
  };

  const filteredTickets = tickets.filter(t => filter === 'all' || t.status === filter);

  return (
    <div className="p-8 animate-fade-in pb-20">
      <div className="mb-6 flex justify-between items-end border-b border-gray-100 pb-4">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-800 flex items-center">
            <Inbox className="mr-3 text-blue-600" size={32} />
            Kotak Papan Kendala (Helpdesk)
          </h2>
          <p className="text-gray-500 mt-2 font-medium">Pusat penerimaan keluhan sistem dan permintaan update biodata Mahasiswa.</p>
        </div>
        
        <div className="flex bg-slate-100 p-1 rounded-xl">
           <button onClick={() => setFilter('open')} className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${filter==='open'?'bg-white shadow text-blue-600':'text-gray-500 hover:text-gray-800'}`}>Menunggu ({tickets.filter(t=>t.status==='open').length})</button>
           <button onClick={() => setFilter('closed')} className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${filter==='closed'?'bg-white shadow text-blue-600':'text-gray-500 hover:text-gray-800'}`}>Selesai</button>
           <button onClick={() => setFilter('all')} className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${filter==='all'?'bg-white shadow text-blue-600':'text-gray-500 hover:text-gray-800'}`}>Semua Info</button>
        </div>
      </div>

      <div className="space-y-4">
         {filteredTickets.length === 0 ? (
            <div className="bg-white text-center py-16 rounded-3xl border-2 border-dashed border-gray-200">
                <CheckCircle size={48} className="mx-auto text-emerald-300 mb-4" />
                <p className="text-gray-500 font-extrabold text-xl mb-1">Tidak ada tiket laporan!</p>
                <p className="text-gray-400 text-sm">Filter <strong>{filter.toUpperCase()}</strong> kosong. BAAK/IT sudah menangani semua keluhan.</p>
            </div>
         ) : (
            filteredTickets.slice().reverse().map(t => (
                <div key={t.id} className="bg-white border border-gray-200 rounded-3xl shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-all">
                   <div className="p-6 md:p-8 flex flex-col md:flex-row gap-6 relative">
                       <button onClick={() => handleDelete(t.id)} className="absolute top-6 right-6 text-red-400 hover:text-red-600 bg-red-50 hover:bg-red-100 p-2 rounded-xl transition-colors">
                           <Trash2 size={16} />
                       </button>
                       <div className="w-full md:w-1/3 border-r border-gray-100 pr-4 mt-8 md:mt-0">
                          <span className={`px-2.5 py-1 text-[10px] font-black uppercase rounded tracking-wider mb-3 inline-block ${t.isGuest ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                             {t.isGuest ? 'Guest LandingPage' : 'Internal Mahasiswa'}
                          </span>
                          <h4 className="font-extrabold text-lg text-gray-900">{t.senderName}</h4>
                          <p className="text-xs font-bold text-gray-500 mb-3">{t.senderId}</p>
                          <p className="text-xs font-medium text-gray-400 flex items-center bg-gray-50 p-2 rounded-lg border border-gray-100"><Clock size={12} className="mr-1.5"/> {new Date(t.createdAt).toLocaleString()}</p>
                       </div>
                       
                       <div className="flex-1">
                          <p className="text-sm font-bold text-gray-800 bg-slate-50 p-4 rounded-2xl border border-slate-100 italic">"{t.message}"</p>
                          
                          {/* Admin Response Action */}
                          {t.status === 'open' ? (
                             <div className="mt-4">
                                {replyForm.tId === t.id ? (
                                   <form onSubmit={handleReply} className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100 relative">
                                      <p className="text-xs font-bold text-blue-600 mb-2 uppercase tracking-wider">Ketik Balasan Resmi:</p>
                                      <textarea autoFocus value={replyForm.message} onChange={(e) => setReplyForm({...replyForm, message: e.target.value})} rows="2" className="w-full p-3 font-medium text-sm text-gray-800 rounded-xl outline-none border border-blue-200 focus:border-blue-500 bg-white shadow-sm mb-3" placeholder="Sampaikan solusi Anda..."></textarea>
                                      <div className="flex gap-2 justify-end">
                                         <button type="button" onClick={() => setReplyForm({tId: null, message:''})} className="px-4 py-2 font-bold text-sm text-gray-500 hover:text-gray-800 rounded-lg">Batal</button>
                                         <button type="submit" className="px-5 py-2 font-bold text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center shadow-lg shadow-blue-500/20"><Send size={14} className="mr-2"/> Send Reply</button>
                                      </div>
                                   </form>
                                ) : (
                                   <button onClick={() => setReplyForm({tId: t.id, message: ''})} className="flex items-center text-sm font-bold text-blue-600 hover:text-blue-800 bg-blue-50 px-4 py-2.5 rounded-xl transition-colors">
                                      <ShieldAlert size={16} className="mr-2"/> Balas & Tutup Tiket
                                   </button>
                                )}
                             </div>
                          ) : (
                             <div className="mt-4 bg-emerald-50 border border-emerald-100 p-4 rounded-2xl">
                                <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-1 flex items-center"><CheckCircle size={12} className="mr-1"/> Terselesaikan. Balasan BAAK:</p>
                                <p className="text-sm font-bold text-emerald-900">{t.reply}</p>
                             </div>
                          )}
                       </div>
                   </div>
                </div>
            ))
         )}
      </div>
    </div>
  );
};

export default AdminHelpdesk;
