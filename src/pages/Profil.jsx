import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, User, Mail, Phone, MapPin, 
  Calendar, GraduationCap, Users, BookOpen, 
  ShieldCheck, Camera, Edit3, Fingerprint, 
  Droplet, Heart, Flag, CreditCard, Building, CheckCircle, X, Key
} from 'lucide-react';
import { getAllUsers, updateUser } from '../services/db';

const DataRow = ({ icon, label, value }) => (
  <div className="flex items-start py-3 border-b border-gray-50 last:border-0">
    <div className="mt-0.5 text-blue-500 mr-3">{icon}</div>
    <div className="flex-1">
      <p className="text-[11px] font-extrabold text-gray-400 uppercase tracking-wider mb-0.5">{label}</p>
      <p className="text-sm font-bold text-gray-800 leading-relaxed">{value || '-'}</p>
    </div>
  </div>
);

const Profil = () => {
  const userId = localStorage.getItem('userId');
  const [userData, setUserData] = useState(null);

  // Modals state
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isEditPasswordOpen, setIsEditPasswordOpen] = useState(false);
  const [isAvatarOpen, setIsAvatarOpen] = useState(false);
  
  // Forms state
  const [profileForm, setProfileForm] = useState({});
  const [passwordForm, setPasswordForm] = useState({ old: '', new: '', confirm: '' });
  const [avatarForm, setAvatarForm] = useState({ url: '' });

  const fetchUser = () => {
     if(!userId) return;
     const allUsers = getAllUsers();
     const currentUser = allUsers.find(u => u.id === userId);
     
     if(currentUser) {
         setUserData({
            ...currentUser,
            nik: currentUser.nik || "32091XXXXXXXXXXX",
            tempatLahir: currentUser.tempatLahir || "Cirebon",
            tanggalLahir: currentUser.tanggalLahir || "14 Juni 2006",
            jenisKelamin: currentUser.jenisKelamin || "Laki-laki",
            agama: currentUser.agama || "Islam",
            golonganDarah: currentUser.golonganDarah || "O",
            statusMenikah: currentUser.statusMenikah || "Belum Kawin",
            wargaNegara: currentUser.wargaNegara || "WNI",
            alamat: currentUser.alamat || "Jl. Setiabudhi No. 193",
            kota: currentUser.kota || "Bandung",
            noHp: currentUser.noHp || "081234567890",
            email: currentUser.email || "hamami@example.com",
            emailPlb: currentUser.emailPlb || "hamami@student.kampus.ac.id",
            noVa: currentUser.noVa || "883711212407045",
            asalSekolah: currentUser.asalSekolah || "SMK Informatika",
            jurusan: currentUser.jurusan || "RPL",
            konsentrasi: currentUser.konsentrasi || "Software Engineering",
            dosenWali: currentUser.dosenWali || "Muangsal, S.E., M.Si.",
            kontakDosen: currentUser.kontakDosen || "081395810994",
            status: currentUser.status || "Aktif",
            namaIbu: currentUser.namaIbu || "Aminah",
            telpOrtu: currentUser.telpOrtu || "081299998888",
            avatarUrl: currentUser.avatarUrl || null
         });
     }
  };

  useEffect(() => {
     fetchUser();
  }, [userId]);

  const handleOpenEditProfile = () => {
    setProfileForm({...userData});
    setIsEditProfileOpen(true);
  };

  const handleSaveProfile = () => {
    updateUser(userId, profileForm);
    setIsEditProfileOpen(false);
    fetchUser();
    alert('Profil berhasil diperbarui!');
  };

  const handleSavePassword = () => {
    if(passwordForm.new !== passwordForm.confirm) return alert('Konfirmasi password baru tidak cocok!');
    if(passwordForm.old !== userData.password) return alert('Password lama salah!');
    if(passwordForm.new.length < 3) return alert('Password minimal 3 karakter.');
    
    updateUser(userId, { password: passwordForm.new });
    setIsEditPasswordOpen(false);
    setPasswordForm({ old: '', new: '', confirm: '' });
    fetchUser();
    alert('Password berhasil diubah!');
  };

  const handleSaveAvatar = () => {
    updateUser(userId, { avatarUrl: avatarForm.url });
    setIsAvatarOpen(false);
    fetchUser();
    alert('Foto profil berhasil diubah!');
  };

  if(!userData) return <div className="p-10 text-center font-bold text-gray-500">Memuat profil...</div>;

  return (
    <div className="animate-fade-in pb-10">
      
      {/* HEADER NAVIGASI */}
      <div className="mb-6">
        <Link to="/app/dashboard" className="inline-flex items-center text-sm font-bold text-blue-600 hover:text-blue-800 mb-4 transition-colors">
          <ArrowLeft size={16} className="mr-1" /> Kembali ke Dashboard
        </Link>
      </div>

      {/* HEADER PROFIL (BANNER & AVATAR) */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-8">
        <div className="h-32 md:h-48 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 relative">
          <div className="absolute inset-0 bg-black/10"></div>
        </div>
        
        <div className="px-6 md:px-10 pb-6 relative">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between">
            
            <div className="flex flex-col md:flex-row md:items-end mt-[-50px] md:mt-[-60px] relative z-10">
              <div className="relative">
                <div className="w-28 h-28 md:w-32 md:h-32 bg-slate-100 rounded-2xl border-4 border-white shadow-lg flex items-center justify-center text-slate-300 overflow-hidden object-cover">
                  {userData.avatarUrl ? (
                     <img src={userData.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                     <User size={64} />
                  )}
                </div>
                <button onClick={() => setIsAvatarOpen(true)} className="absolute bottom-2 right-2 w-8 h-8 bg-blue-600 rounded-full text-white flex items-center justify-center shadow-md hover:bg-blue-700 transition border-2 border-white">
                  <Camera size={14} />
                </button>
              </div>
              
              <div className="mt-4 md:mt-0 md:ml-6 mb-2">
                <h2 className="text-3xl font-black text-gray-800 tracking-tight">{userData.nama}</h2>
                <div className="flex flex-wrap items-center mt-1 text-gray-500 font-medium text-sm gap-2">
                  <span className="text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded">{userData.id}</span>
                  <span className="flex items-center"><ShieldCheck size={16} className="text-emerald-500 mr-1" /> {userData.prodi}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 md:mt-0 flex flex-wrap gap-3">
              <button onClick={() => setIsEditPasswordOpen(true)} className="flex-1 md:flex-none px-5 py-2.5 bg-slate-50 text-slate-600 font-bold rounded-xl hover:bg-slate-100 transition-colors flex items-center justify-center border border-slate-200">
                <Key size={16} className="mr-2" /> Ganti Password
              </button>
              <button onClick={handleOpenEditProfile} className="flex-1 md:flex-none px-6 py-2.5 bg-blue-50 text-blue-600 font-bold rounded-xl hover:bg-blue-100 transition-colors flex items-center justify-center border border-blue-200">
                <Edit3 size={16} className="mr-2" /> Ubah Biodata
              </button>
            </div>
            
          </div>
        </div>
      </div>

      {/* GRID KONTEN DATA */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* KOLOM KIRI: DATA PRIBADI */}
        <div className="xl:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100">
            <h3 className="text-xl font-extrabold text-gray-800 mb-6 flex items-center border-b border-gray-100 pb-4">
              <User size={22} className="text-blue-500 mr-3" /> Informasi Pribadi
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
              <DataRow icon={<Fingerprint size={18} />} label="NIK" value={userData.nik} />
              <DataRow icon={<Calendar size={18} />} label="Tempat, Tanggal Lahir" value={`${userData.tempatLahir}, ${userData.tanggalLahir}`} />
              <DataRow icon={<User size={18} />} label="Jenis Kelamin" value={userData.jenisKelamin} />
              <DataRow icon={<BookOpen size={18} />} label="Agama" value={userData.agama} />
              <DataRow icon={<Droplet size={18} />} label="Golongan Darah" value={userData.golonganDarah} />
              <DataRow icon={<Heart size={18} />} label="Status Menikah" value={userData.statusMenikah} />
              <DataRow icon={<Flag size={18} />} label="Warga Negara" value={userData.wargaNegara} />
              <DataRow icon={<Phone size={18} />} label="No Telp/HP" value={userData.noHp} />
              <div className="md:col-span-2">
                <DataRow icon={<MapPin size={18} />} label="Alamat & Kota" value={`${userData.alamat} - ${userData.kota}`} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-extrabold text-gray-800 mb-4 flex items-center border-b border-gray-100 pb-3">
                <Mail size={20} className="text-amber-500 mr-3" /> Kontak & Pembayaran
              </h3>
              <DataRow icon={<Mail size={18} />} label="Email Pribadi" value={userData.email} />
              <DataRow icon={<Mail size={18} />} label="Email Kampus" value={userData.emailPlb} />
              <DataRow icon={<CreditCard size={18} />} label="No VA Mandiri" value={userData.noVa} />
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-extrabold text-gray-800 mb-4 flex items-center border-b border-gray-100 pb-3">
                <Building size={20} className="text-emerald-500 mr-3" /> Latar Belakang
              </h3>
              <DataRow icon={<Building size={18} />} label="Asal Sekolah" value={userData.asalSekolah} />
              <DataRow icon={<BookOpen size={18} />} label="Jurusan Sekolah" value={userData.jurusan} />
            </div>
          </div>
        </div>

        {/* KOLOM KANAN: DATA AKADEMIK & ORTU */}
        <div className="space-y-6">
          <div className="bg-slate-900 rounded-3xl p-6 md:p-8 shadow-xl text-white">
            <h3 className="text-xl font-extrabold mb-6 flex items-center border-b border-slate-700 pb-4">
              <GraduationCap size={22} className="text-blue-400 mr-3" /> Akademik
            </h3>
            
            <div className="space-y-5">
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Status Mahasiswa</p>
                <span className="bg-emerald-500/20 text-emerald-400 font-extrabold px-3 py-1.5 rounded-lg text-sm border border-emerald-500/30 flex items-center w-max">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 mr-2 animate-pulse"></span> {userData.status}
                </span>
              </div>
              
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Konsentrasi</p>
                <p className="text-sm font-bold text-slate-100">{userData.konsentrasi}</p>
              </div>
              
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Dosen Pembimbing Akademik</p>
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center mr-3 flex-shrink-0">
                    <User size={14} className="text-slate-300" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-100">{userData.dosenWali}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{userData.kontakDosen}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-extrabold text-gray-800 mb-4 flex items-center border-b border-gray-100 pb-3">
              <Users size={20} className="text-purple-500 mr-3" /> Data Orang Tua
            </h3>
            <DataRow icon={<User size={18} />} label="Nama Ibu" value={userData.namaIbu} />
            <DataRow icon={<Phone size={18} />} label="No. Telp Orang Tua" value={userData.telpOrtu} />
          </div>

        </div>

      </div>

      {/* MODAL EDIT BIODATA */}
      {isEditProfileOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-slide-up max-h-[90vh] flex flex-col">
             <div className="bg-slate-50 border-b border-gray-100 p-6 flex justify-between items-center shrink-0">
                <h3 className="font-extrabold text-xl">Ubah Biodata Diri</h3>
                <button onClick={() => setIsEditProfileOpen(false)} className="text-gray-400 hover:text-red-500"><X size={20}/></button>
             </div>
             
             <div className="p-6 overflow-y-auto space-y-4">
                
                <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex items-start mb-4">
                   <div className="bg-blue-100 text-blue-600 p-2 rounded-lg shrink-0 mr-3">
                      <ShieldCheck size={20} />
                   </div>
                   <div>
                      <p className="text-sm font-bold text-blue-900 mb-1">Pemberitahuan Sistem (BAAK)</p>
                      <p className="text-xs text-blue-700 leading-relaxed">Sesuai standar operasional DIKTI, data krusial seperti Nama, NIK, Tempat/Tgl Lahir, dan Prodi dikunci. Jika terdapat kesalahan pencatatan, harap ajukan permintaan perbaikan melalui fasilitas <Link to="/app/helpdesk" className="font-bold underline text-blue-800">Helpdesk IT Terpadu</Link>.</p>
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div className="col-span-2">
                       <label className="block text-sm font-bold text-gray-700 mb-1">Nomor Handphone (WhatsApp)</label>
                       <input type="text" value={profileForm.noHp || ''} onChange={(e) => setProfileForm({...profileForm, noHp: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-blue-500 font-bold" />
                   </div>
                   <div className="col-span-2">
                       <label className="block text-sm font-bold text-gray-700 mb-1">Email Korespodensi Pribadi</label>
                       <input type="email" value={profileForm.email || ''} onChange={(e) => setProfileForm({...profileForm, email: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-blue-500 font-bold" />
                   </div>
                   <div>
                       <label className="block text-sm font-bold text-gray-700 mb-1">Asal Sekolah</label>
                       <input type="text" value={profileForm.asalSekolah || ''} onChange={(e) => setProfileForm({...profileForm, asalSekolah: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-blue-500 font-bold" />
                   </div>
                   <div>
                       <label className="block text-sm font-bold text-gray-700 mb-1">Jurusan Sekolah</label>
                       <input type="text" value={profileForm.jurusan || ''} onChange={(e) => setProfileForm({...profileForm, jurusan: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-blue-500 font-bold" />
                   </div>
                </div>
             </div>

             <div className="p-6 bg-slate-50 border-t border-gray-100 flex justify-end gap-3 shrink-0">
                <button onClick={() => setIsEditProfileOpen(false)} className="px-5 py-2.5 font-bold text-gray-600 hover:bg-gray-200 rounded-xl">Batal</button>
                <button onClick={handleSaveProfile} className="px-6 py-2.5 font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl overflow-hidden shadow-lg shadow-blue-500/30">
                   Simpan Perubahan
                </button>
             </div>
          </div>
        </div>
      )}

      {/* MODAL EDIT PASSWORD */}
      {isEditPasswordOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-slide-up">
             <div className="bg-slate-50 border-b border-gray-100 p-6 flex justify-between items-center">
                <h3 className="font-extrabold text-xl">Ubah Kata Sandi</h3>
                <button onClick={() => setIsEditPasswordOpen(false)} className="text-gray-400 hover:text-red-500"><X size={20}/></button>
             </div>
             <div className="p-6 space-y-4">
                <div>
                   <label className="block text-sm font-bold text-gray-700 mb-1">Sandi Lama</label>
                   <input type="password" value={passwordForm.old} onChange={(e) => setPasswordForm({...passwordForm, old: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-blue-500" />
                </div>
                <div>
                   <label className="block text-sm font-bold text-gray-700 mb-1">Sandi Baru</label>
                   <input type="password" value={passwordForm.new} onChange={(e) => setPasswordForm({...passwordForm, new: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-blue-500" />
                </div>
                <div>
                   <label className="block text-sm font-bold text-gray-700 mb-1">Konfirmasi Sandi Baru</label>
                   <input type="password" value={passwordForm.confirm} onChange={(e) => setPasswordForm({...passwordForm, confirm: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-blue-500" />
                </div>
             </div>
             <div className="p-6 bg-slate-50 border-t border-gray-100 flex justify-end gap-3">
                <button onClick={() => setIsEditPasswordOpen(false)} className="px-5 py-2.5 font-bold text-gray-600 hover:bg-gray-200 rounded-xl">Batal</button>
                <button onClick={handleSavePassword} className="px-6 py-2.5 font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg shadow-blue-500/30">
                   Ganti Sandi
                </button>
             </div>
          </div>
        </div>
      )}

      {/* MODAL UPDATE FOTO */}
      {isAvatarOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden animate-slide-up">
             <div className="bg-slate-50 border-b border-gray-100 p-6 flex justify-between items-center">
                <h3 className="font-extrabold text-xl">Upload Foto Profil</h3>
                <button onClick={() => setIsAvatarOpen(false)} className="text-gray-400 hover:text-red-500"><X size={20}/></button>
             </div>
             <div className="p-6 space-y-4 text-center">
                <Camera size={48} className="mx-auto text-blue-300 mb-2" />
                <p className="text-sm text-gray-500 mb-4">Untuk demonstrasi, silakan tempel URL gambar valid (berakhiran .jpg/.png) ke dalam kolom di bawah.</p>
                <div>
                   <input type="url" placeholder="https://example.com/foto.jpg" value={avatarForm.url} onChange={(e) => setAvatarForm({...avatarForm, url: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-blue-500 text-sm" />
                </div>
             </div>
             <div className="p-6 bg-slate-50 border-t border-gray-100 flex justify-end gap-3">
                <button onClick={() => setIsAvatarOpen(false)} className="px-5 py-2.5 font-bold text-gray-600 hover:bg-gray-200 rounded-xl">Batal</button>
                <button onClick={handleSaveAvatar} className="px-6 py-2.5 font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg shadow-blue-500/30">
                   Update Foto
                </button>
             </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Profil;