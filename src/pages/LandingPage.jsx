import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser, createTicket, resetPassword } from '../services/db';
import { 
  ShieldCheck, Headset, Lock, User, ArrowRight, AlertCircle, Server, MessageSquare, X, Send
} from 'lucide-react';
import logoLp3i from '../assets/logoLp3i.png';

const LandingPage = () => {
  const navigate = useNavigate();
  
  // STATE UNTUK LOGIKA LOGIN LANGSUNG DI HALAMAN DEPAN
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Sate untuk Guest Widget Ticket
  const [isWidgetOpen, setIsWidgetOpen] = useState(false);
  const [widgetSuccess, setWidgetSuccess] = useState(false);
  const [guestForm, setGuestForm] = useState({ nim: '', message: '' });

  // State untuk Lupa Kata Sandi
  const [isForgotSandiOpen, setIsForgotSandiOpen] = useState(false);
  const [forgotForm, setForgotForm] = useState({ nim: '', tanggalLahir: '', newPassword: '' });
  const [forgotMsg, setForgotMsg] = useState({ type: '', text: '' });

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    const user = loginUser(username, password);

    if (!user) {
      setErrorMsg('Kredensial tidak valid. Silakan periksa NIM/NIDN dan Sadi Anda (Default sandi: 123).');
      return; 
    }

    localStorage.setItem('userRole', user.role);
    localStorage.setItem('userName', user.nama);
    localStorage.setItem('userId', user.id); // Penting untuk multi-user
    
    navigate('/app/dashboard');
  };

  const handleGuestSubmit = (e) => {
    e.preventDefault();
    if(!guestForm.nim || !guestForm.message) return alert("NIM dan Pesan wajid diisi untuk verifikasi pengaduan!");
    createTicket(guestForm.nim, 'GUEST / ' + guestForm.nim, guestForm.message, true);
    setWidgetSuccess(true);
    setTimeout(() => {
       setIsWidgetOpen(false);
       setWidgetSuccess(false);
       setGuestForm({ nim: '', message: '' });
    }, 3500);
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setForgotMsg({ type: '', text: '' });
    if(!forgotForm.nim || !forgotForm.tanggalLahir || !forgotForm.newPassword) {
        setForgotMsg({ type: 'error', text: 'Mohon isi semua form untuk verifikasi.' });
        return;
    }
    const res = await resetPassword(forgotForm.nim, forgotForm.tanggalLahir, forgotForm.newPassword);
    if(res.success) {
        setForgotMsg({ type: 'success', text: res.message });
        setTimeout(() => setIsForgotSandiOpen(false), 2000);
    } else {
        setForgotMsg({ type: 'error', text: res.message });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans selection:bg-blue-200">
      
      {/* SISI KIRI: BRANDING & INFO IT (Porsi lebih kecil) */}
      <div className="hidden lg:flex lg:w-5/12 bg-slate-900 relative flex-col justify-between p-12 overflow-hidden">
        {/* Dekorasi Background */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-20">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-600 rounded-full mix-blend-screen filter blur-[100px]"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-600 rounded-full mix-blend-screen filter blur-[100px]"></div>
        </div>

        {/* Header Kiri */}
        <div className="relative z-10 flex items-center space-x-3">
          <div className="bg-white p-2 rounded-xl">
            <img src={logoLp3i} alt="Logo LP3I" className="h-10 w-auto object-contain" />
          </div>
          <div className="border-l-2 border-slate-700 pl-3">
            <h1 className="text-xl font-bold text-white tracking-tight leading-none">
              SIAKAD<span className="text-blue-400 font-light">Online</span>
            </h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Politeknik LP3I</p>
          </div>
        </div>

        {/* Teks Tengah Kiri */}
        <div className="relative z-10 my-auto">
          <div className="inline-flex items-center space-x-2 bg-blue-500/10 border border-blue-500/20 px-3 py-1.5 rounded-full mb-6">
             <ShieldCheck size={16} className="text-blue-400" />
             <span className="text-xs font-bold tracking-wider text-blue-300 uppercase">Single Sign-On (SSO)</span>
          </div>
          <h2 className="text-4xl font-extrabold text-white mb-4 leading-tight tracking-tight">
            Sistem Informasi <br/> Akademik Terpadu
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
            Portal otentikasi terpusat khusus untuk civitas academica Politeknik LP3I. Seluruh akses direkam dan dipantau oleh sistem keamanan server.
          </p>
        </div>

        {/* Footer Kiri: Helpdesk */}
        <div className="relative z-10 bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
          <div className="flex items-center mb-3">
            <Headset size={18} className="text-blue-400 mr-2" />
            <h3 className="font-bold text-sm text-white">Butuh Bantuan Akses?</h3>
          </div>
          <div className="space-y-2 text-xs font-medium text-slate-400">
            <p>Hubungi Helpdesk BAAK/IT Support:</p>
            <div className="flex justify-between items-center bg-slate-900/50 p-2 rounded-lg">
              <span>WhatsApp</span>
              <span className="text-blue-400">0812-3456-7890</span>
            </div>
            <div className="flex justify-between items-center bg-slate-900/50 p-2 rounded-lg">
              <span>Email</span>
              <span className="text-blue-400">it.support@cirebon.lp3i.ac.id</span>
            </div>
          </div>
        </div>
      </div>

      {/* SISI KANAN: FORM LOGIN UTAMA (Porsi lebih besar, fokus utama) */}
      <div className="w-full lg:w-7/12 flex flex-col justify-center items-center p-8 sm:p-12 md:p-24 relative bg-white">
        
        {/* Indikator Status Server di Pojok Kanan Atas */}
        <div className="absolute top-8 right-8 hidden sm:flex items-center text-xs font-bold text-green-600 bg-green-50 px-3 py-1.5 rounded-full border border-green-100">
          <Server size={14} className="mr-1.5" /> Server Optimal
        </div>

        {/* Logo Mobile (Hanya muncul di HP) */}
        <div className="lg:hidden bg-slate-50 p-3 rounded-2xl mb-8 border border-slate-100 shadow-sm">
           <img src={logoLp3i} alt="Logo LP3I" className="h-12 w-auto object-contain" />
        </div>

        <div className="w-full max-w-md animate-fade-in">
          
          <div className="text-center md:text-left mb-8">
            <h2 className="text-3xl font-extrabold text-slate-800 mb-2">Selamat Datang</h2>
            <p className="text-slate-500 text-sm font-medium">Gunakan ID Pengguna dan Kata Sandi SIAKAD Anda.</p>
          </div>

          {errorMsg && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start space-x-3 animate-fade-in">
              <AlertCircle size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm font-medium text-red-700">{errorMsg}</p>
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">ID Pengguna (NIM / NIDN)</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-blue-600 text-slate-400">
                  <User size={18} />
                </div>
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 outline-none text-slate-800 font-medium placeholder:font-normal placeholder:text-slate-400" 
                  placeholder="Contoh: 202301001 atau admin" 
                  required 
                />
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                 <label className="block text-sm font-bold text-slate-700">Kata Sandi</label>
                 <button type="button" onClick={() => setIsForgotSandiOpen(true)} className="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors">Lupa sandi?</button>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-blue-600 text-slate-400">
                  <Lock size={18} />
                </div>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 outline-none text-slate-800 font-medium placeholder:font-normal placeholder:text-slate-400" 
                  placeholder="••••••••" 
                  required 
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="w-full bg-blue-600 text-white font-bold py-4 px-4 rounded-xl hover:bg-blue-700 mt-4 transition-all duration-300 shadow-lg shadow-blue-500/30 flex justify-center items-center group"
            >
              Masuk ke Sistem
              <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="mt-12 text-center border-t border-slate-100 pt-6">
            <p className="text-xs text-slate-400 font-medium">
              &copy; 2026 BAAK & IT Dept Politeknik LP3I. <br/> Terenkripsi SSL 256-bit.
            </p>
          </div>

        </div>
      </div>

      {/* MODAL LUPA KATA SANDI */}
      {isForgotSandiOpen && (
         <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden animate-slide-up">
               <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-blue-50/50">
                  <h3 className="font-extrabold text-lg text-blue-900 flex items-center"><Lock size={18} className="mr-2"/> Atur Ulang Sandi</h3>
                  <button onClick={() => setIsForgotSandiOpen(false)} className="text-slate-400 hover:text-red-500 transition-colors"><X size={20}/></button>
               </div>
               <form onSubmit={handleForgotSubmit} className="p-6 space-y-4">
                  {forgotMsg.text && (
                     <div className={`p-3 rounded-xl text-xs font-bold ${forgotMsg.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                        {forgotMsg.text}
                     </div>
                  )}
                  <p className="text-xs font-medium text-slate-500 mb-2">Verifikasi identitas Anda untuk merubah kata sandi.</p>
                  <div>
                     <label className="block text-[10px] uppercase font-black text-slate-400 mb-1 tracking-wider">ID Pengguna (NIM/NIDN)</label>
                     <input type="text" value={forgotForm.nim} onChange={e => setForgotForm({...forgotForm, nim: e.target.value})} className="w-full text-sm p-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-blue-500 font-bold" />
                  </div>
                  <div>
                     <label className="block text-[10px] uppercase font-black text-slate-400 mb-1 tracking-wider">Tanggal Lahir (YYYY-MM-DD)</label>
                     <input type="text" placeholder="Contoh: 2001-05-12" value={forgotForm.tanggalLahir} onChange={e => setForgotForm({...forgotForm, tanggalLahir: e.target.value})} className="w-full text-sm p-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-blue-500" />
                  </div>
                  <div>
                     <label className="block text-[10px] uppercase font-black text-slate-400 mb-1 tracking-wider">Kata Sandi Baru</label>
                     <input type="password" value={forgotForm.newPassword} onChange={e => setForgotForm({...forgotForm, newPassword: e.target.value})} className="w-full text-sm p-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-blue-500" />
                  </div>
                  <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-500/30 transition-all mt-4">Simpan Sandi Baru</button>
               </form>
            </div>
         </div>
      )}

      {/* FLOATING HELPDESK WIDGET */}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end">
         
         {isWidgetOpen && (
            <div className="mb-4 w-[320px] bg-white rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.15)] border border-slate-100 overflow-hidden animate-slide-up flex flex-col">
               <div className="bg-slate-900 p-4 flex justify-between items-center text-white shrink-0">
                  <div className="flex items-center">
                     <Headset size={18} className="text-blue-400 mr-2" />
                     <h4 className="font-extrabold text-sm">IT Support Kampus</h4>
                  </div>
                  <button onClick={() => setIsWidgetOpen(false)} className="text-slate-400 hover:text-white transition-colors"><X size={18}/></button>
               </div>
               
               <div className="p-5">
                  {widgetSuccess ? (
                     <div className="text-center py-6">
                        <div className="w-12 h-12 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                           <ShieldCheck size={24} />
                        </div>
                        <h5 className="font-bold text-slate-800 mb-1">Tiket Terkirim!</h5>
                        <p className="text-xs text-slate-500 font-medium leading-relaxed">Admin BAAK akan menangani request Anda. Silakan hubungi WA Kampus jika mendesak.</p>
                     </div>
                  ) : (
                     <form onSubmit={handleGuestSubmit} className="space-y-3">
                        <p className="text-xs text-slate-500 font-bold mb-4 leading-relaxed bg-slate-50 p-2 rounded-lg border border-slate-100">Gagal login / Lupa Password? Kirim permintaan perbaikan ke Admin IT disini.</p>
                        
                        <div>
                           <label className="block text-[10px] uppercase font-black text-slate-400 mb-1 tracking-wider">NIM (Identitas Akun)</label>
                           <input type="text" value={guestForm.nim} onChange={(e) => setGuestForm({...guestForm, nim: e.target.value})} className="w-full text-sm p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-blue-500 font-bold" placeholder="Ketik NIM Anda" />
                        </div>
                        <div>
                           <label className="block text-[10px] uppercase font-black text-slate-400 mb-1 tracking-wider">Pesan Keluhan</label>
                           <textarea rows="3" value={guestForm.message} onChange={(e) => setGuestForm({...guestForm, message: e.target.value})} className="w-full text-sm p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-blue-500" placeholder="Tuliskan keluhan / masalah Anda..."></textarea>
                        </div>
                        
                        <button type="submit" className="w-full bg-slate-900 text-white font-bold py-2.5 rounded-xl hover:bg-slate-800 transition-colors flex items-center justify-center text-sm shadow-md mt-2">
                           <Send size={14} className="mr-2" /> Kirim Tiket GUEST
                        </button>
                     </form>
                  )}
               </div>
            </div>
         )}

         <button 
            onClick={() => setIsWidgetOpen(!isWidgetOpen)}
            className={`w-14 h-14 rounded-full flex items-center justify-center shadow-xl transition-all transform hover:-translate-y-1 ${isWidgetOpen ? 'bg-slate-800 text-white' : 'bg-blue-600 text-white shadow-blue-500/30'}`}
         >
            {isWidgetOpen ? <X size={24} /> : <MessageSquare size={24} />}
         </button>
      </div>

    </div>
  );
};

export default LandingPage;