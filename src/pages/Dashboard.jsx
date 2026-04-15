import { 
  BookOpen, DollarSign, GraduationCap, Calendar, Briefcase, Zap, 
  Bell, Users, FileCheck, Server, AlertCircle, Info, CheckCircle 
} from 'lucide-react';
import { getAllKeuangan, getKeuanganUser } from '../services/db';

const Dashboard = () => {
  // Ambil data dari Local Storage
  const userRole = localStorage.getItem('userRole') || 'mahasiswa';
  const userName = localStorage.getItem('userName') || 'Pengguna';
  const userId = localStorage.getItem('userId');

  // Keuangan Data Logic
  const seluruhKeuangan = getAllKeuangan();
  const keuanganMahasiswa = getKeuanganUser(userId);
  const adminTunggakanCount = seluruhKeuangan.filter(k => k.status === 'Nunggak' || k.status === 'Belum Lunas').length;
  const mahasiswaTunggakanCount = keuanganMahasiswa.filter(k => k.status === 'Nunggak' || k.status === 'Belum Lunas').length;

  // URL Gambar Online agar tidak error missing local file
  const imgLobby = "https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";
  const imgCnp = "https://images.unsplash.com/photo-1573164713988-8665fc963095?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";

  // ==============================================
  // LOGIKA DATA PENGUMUMAN DINAMIS BERDASARKAN ROLE
  // ==============================================
  const pengumumanUmum = [
    { id: 1, type: 'info', date: '01 Jan 2026', title: 'SIAKAD v2.0 Berhasil Dirilis', desc: 'Selamat datang di portal SIAKAD baru dengan antarmuka yang lebih responsif dan sistem keamanan terpusat.' }
  ];

  const pengumumanMahasiswa = [
    { id: 2, type: 'danger', date: '14 Jan 2026', title: 'Penutupan Pengisian KRS Online', desc: 'Batas akhir pengisian KRS adalah 14 Januari 2026. Mahasiswa yang tidak mengisi akan berstatus Cuti Akademik.' },
    ...(mahasiswaTunggakanCount > 0 ? [{ id: 99, type: 'danger', date: 'Hari Ini', title: 'Peringatan Tunggakan Keuangan!', desc: `Anda terdeteksi memiliki tagihan/tunggakan yang belum lunas. Segera konfirmasi di menu Keuangan agar akses akademik tidak diblokir.` }] : []),
    ...pengumumanUmum
  ];

  const pengumumanDosen = [
    { id: 4, type: 'danger', date: '05 Jan 2026', title: 'Batas Akhir Input Nilai', desc: 'Mohon segera menyelesaikan input nilai ujian akhir semester ganjil sebelum portal ditutup otomatis oleh sistem.' },
    ...pengumumanUmum
  ];

  const pengumumanAdmin = [
    ...(adminTunggakanCount > 0 ? [{ id: 98, type: 'danger', date: 'Peringatan', title: 'Tunggakan Mahasiswa', desc: `Terdapat ${adminTunggakanCount} catatan tunggakan tagihan mahasiswa. Periksa menu Rekap Keuangan segera.` }] : []),
    { id: 5, type: 'warning', date: '16 Jan 2026', title: 'Validasi KRS Mahasiswa', desc: 'Terdapat 84 KRS mahasiswa yang menunggu validasi dari pihak BAAK. Harap segera diproses sebelum perkuliahan dimulai.' },
    ...pengumumanUmum
  ];

  // Pilih daftar pengumuman sesuai role
  const activePengumuman = 
    userRole === 'admin' ? pengumumanAdmin : 
    userRole === 'dosen' ? pengumumanDosen : 
    pengumumanMahasiswa;

  // Render Papan Pengumuman
  const renderPapanPengumuman = () => (
    <div className="mb-8">
      <div className="flex items-center mb-4">
        <Bell size={20} className="text-blue-600 mr-2" />
        <h3 className="text-lg font-bold text-gray-800">Pengumuman Terbaru</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {activePengumuman.map(item => (
          <div key={item.id} className={`p-4 rounded-xl shadow-sm border-l-4 flex items-start transition-all hover:shadow-md ${
            item.type === 'danger' ? 'bg-red-50 border-red-500' :
            item.type === 'warning' ? 'bg-amber-50 border-amber-500' :
            'bg-blue-50 border-blue-500'
          }`}>
            <div className="mr-3 mt-1 flex-shrink-0">
              {item.type === 'danger' && <AlertCircle size={20} className="text-red-500" />}
              {item.type === 'warning' && <Info size={20} className="text-amber-500" />}
              {item.type === 'info' && <CheckCircle size={20} className="text-blue-500" />}
            </div>
            <div>
              <span className={`text-[10px] font-bold uppercase tracking-wider block mb-1 ${
                item.type === 'danger' ? 'text-red-600' : item.type === 'warning' ? 'text-amber-600' : 'text-blue-600'
              }`}>{item.date}</span>
              <h4 className={`font-bold text-sm mb-1 ${
                item.type === 'danger' ? 'text-red-900' : item.type === 'warning' ? 'text-amber-900' : 'text-blue-900'
              }`}>{item.title}</h4>
              <p className={`text-xs leading-relaxed ${
                item.type === 'danger' ? 'text-red-700' : item.type === 'warning' ? 'text-amber-700' : 'text-blue-700'
              }`}>{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // ==============================================
  // TAMPILAN DASHBOARD ADMIN
  // ==============================================
  if (userRole === 'admin') {
    return (
      <div className="animate-fade-in space-y-8">
        <div className="mb-6 border-b border-gray-100 pb-4">
          <h2 className="text-3xl font-extrabold text-gray-800 tracking-tight">Dashboard BAAK</h2>
          <p className="text-gray-500 text-sm mt-1">Sistem Administrasi Akademik Pusat</p>
        </div>
        
        {renderPapanPengumuman()}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4 border-l-4 border-l-blue-500">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-lg"><Users size={24} /></div>
            <div><p className="text-sm text-gray-500">Total Mahasiswa Aktif</p><h3 className="text-2xl font-bold text-gray-800">1,245</h3></div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4 border-l-4 border-l-amber-500">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-lg"><FileCheck size={24} /></div>
            <div><p className="text-sm text-gray-500">KRS Belum Divalidasi</p><h3 className="text-2xl font-bold text-amber-600">84</h3></div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4 border-l-4 border-l-emerald-500">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg"><Server size={24} /></div>
            <div><p className="text-sm text-gray-500">Status Server SIAKAD</p><h3 className="text-2xl font-bold text-emerald-600">Optimal</h3></div>
          </div>
        </div>
      </div>
    );
  }

  // ==============================================
  // TAMPILAN DASHBOARD DOSEN
  // ==============================================
  if (userRole === 'dosen') {
    return (
      <div className="animate-fade-in space-y-8">
        <div className="mb-6 border-b border-gray-100 pb-4">
          <h2 className="text-3xl font-extrabold text-gray-800 tracking-tight">Portal Dosen</h2>
          <p className="text-gray-500 text-sm mt-1">Selamat datang kembali, {userName}</p>
        </div>
        
        {renderPapanPengumuman()}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4 border-l-4 border-l-indigo-500">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg"><Calendar size={24} /></div>
            <div><p className="text-sm text-gray-500">Jadwal Mengajar Hari Ini</p><h3 className="text-2xl font-bold text-gray-800">2 Kelas</h3></div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4 border-l-4 border-l-rose-500">
            <div className="p-3 bg-rose-50 text-rose-600 rounded-lg"><Users size={24} /></div>
            <div><p className="text-sm text-gray-500">Mahasiswa Bimbingan TA</p><h3 className="text-2xl font-bold text-gray-800">12 Orang</h3></div>
          </div>
        </div>
      </div>
    );
  }

  // ==============================================
  // TAMPILAN DASHBOARD MAHASISWA (Default)
  // ==============================================
  return (
    <div className="animate-fade-in space-y-8">
      
      {/* JUDUL HEADER DASHBOARD */}
      <div className="mb-6 border-b border-gray-100 pb-4">
        <h2 className="text-3xl font-extrabold text-gray-800 tracking-tight">Dashboard Mahasiswa</h2>
        <p className="text-gray-500 text-sm mt-1">Sistem Informasi Akademik Politeknik LP3I</p>
      </div>

      {/* PAPAN PENGUMUMAN KHUSUS MAHASISWA */}
      {renderPapanPengumuman()}

      {/* 1. KARTU STATISTIK */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4 border-l-4 border-l-blue-500 hover:shadow-md transition">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg"><BookOpen size={24} /></div>
          <div><p className="text-sm text-gray-500">IPK Kumulatif</p><h3 className="text-2xl font-bold text-gray-800">3.85</h3></div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4 border-l-4 border-l-green-500 hover:shadow-md transition">
          <div className={`p-3 rounded-lg ${mahasiswaTunggakanCount > 0 ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}><DollarSign size={24} /></div>
          <div><p className="text-sm text-gray-500">Status Keuangan</p><h3 className={`text-2xl font-bold ${mahasiswaTunggakanCount > 0 ? 'text-red-600' : 'text-green-600'}`}>{mahasiswaTunggakanCount > 0 ? 'Ada Tunggakan' : 'Lunas'}</h3></div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4 border-l-4 border-l-purple-500 hover:shadow-md transition">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-lg"><GraduationCap size={24} /></div>
          <div><p className="text-sm text-gray-500">Semester Aktif</p><h3 className="text-2xl font-bold text-gray-800">Genap 2025/2026</h3></div>
        </div>
      </div>

      {/* PROMOTION CARDS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex items-center space-x-6 hover:shadow-lg transition-all group overflow-hidden">
          <div className="w-1/3 h-40 bg-gray-100 rounded-2xl overflow-hidden flex-shrink-0">
             <img src={imgLobby} alt="LP3I Career Center" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
          </div>
          <div className="w-2/3 space-y-3">
             <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full flex items-center w-fit"><Bell size={14} className="mr-1"/> Layanan Prioritas</span>
             <h4 className="text-2xl font-extrabold text-gray-800 leading-tight">Career Center & Penempatan Kerja</h4>
             <p className="text-sm text-gray-600 leading-relaxed">
               Akses eksklusif bagi mahasiswa LP3I untuk lowongan kerja dari perusahaan mitra. Lengkapi CV di menu CNP.
             </p>
             <button className="bg-blue-600 text-white font-bold py-2.5 px-6 rounded-xl hover:bg-blue-700 mt-2 transition-colors flex items-center text-sm shadow-md shadow-blue-500/20">
                Lengkapi CV <Zap size={16} className="ml-2"/>
             </button>
          </div>
        </div>
        
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all">
          <div className="h-44 w-full bg-gray-100 overflow-hidden">
             <img src={imgCnp} alt="Success Story" className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
          </div>
          <div className="p-6">
             <span className="text-xs font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full flex items-center w-fit"><Briefcase size={14} className="mr-1"/> Berita CNP</span>
             <h4 className="text-lg font-bold text-gray-800 mt-2">Bekerja Sebelum Wisuda</h4>
             <p className="text-xs text-gray-500 mt-1">Komitmen LP3I menghubungkan mahasiswa dengan dunia industri nasional.</p>
          </div>
        </div>
      </div>

      {/* JADWAL KULIAH */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h3 className="font-semibold text-gray-800 flex items-center"><Calendar size={18} className="mr-2 text-blue-600"/> Jadwal Kuliah Hari Ini</h3>
        </div>
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3">Mata Kuliah</th>
              <th className="px-6 py-3">Waktu</th>
              <th className="px-6 py-3">Dosen</th>
            </tr>
          </thead>
          <tbody>
            <tr className="bg-white border-b hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 font-medium text-gray-900">Pemrograman Web Framework</td>
              <td className="px-6 py-4">08:00 - 10:30</td>
              <td className="px-6 py-4">Bpk. Supriyadi, M.Kom</td>
            </tr>
            <tr className="bg-white border-b hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 font-medium text-gray-900">Keamanan Jaringan (Cybersecurity)</td>
              <td className="px-6 py-4">13:00 - 15:30</td>
              <td className="px-6 py-4">Ibu Rina, S.T., M.T.</td>
            </tr>
          </tbody>
        </table>
      </div>
      
    </div>
  );
};

export default Dashboard;