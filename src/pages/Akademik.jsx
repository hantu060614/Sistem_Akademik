import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FileSignature, CalendarDays, UserCheck, ScrollText, 
  RefreshCcw, FileEdit, BookOpenCheck, History, 
  Laptop, Activity 
} from 'lucide-react';

const Akademik = () => {
  // 10 MENU FIX (TIDAK HALU LAGI 😂)
  const akademikMenus = [
    { title: "Pengisian KRS", icon: <FileSignature size={32} className="text-blue-500" />, bg: "bg-blue-100", path: "/app/krs" },
    { title: "Jadwal Kuliah", icon: <CalendarDays size={32} className="text-emerald-500" />, bg: "bg-emerald-100", path: "/app/jadwal" },
    { title: "Kehadiran Mahasiswa", icon: <UserCheck size={32} className="text-teal-500" />, bg: "bg-teal-100", path: "/app/kehadiran" },
    { title: "Informasi Nilai", icon: <ScrollText size={32} className="text-indigo-500" />, bg: "bg-indigo-100", path: "/app/nilai" },
    { title: "Perbaikan Nilai", icon: <RefreshCcw size={32} className="text-orange-500" />, bg: "bg-orange-100", path: "/app/perbaikan-nilai" },
    
    // Kelompok Ujian (UTS, UAS, History)
    { title: "Ujian Tengah Semester (UTS)", icon: <FileEdit size={32} className="text-rose-500" />, bg: "bg-rose-100", path: "/app/uts" },
    { title: "Ujian Akhir Semester (UAS)", icon: <BookOpenCheck size={32} className="text-red-500" />, bg: "bg-red-100", path: "/app/uas" },
    { title: "History UTS & UAS", icon: <History size={32} className="text-amber-500" />, bg: "bg-amber-100", path: "/app/history-ujian" },
    
    // Fitur Khusus & Keaktifan
    { title: "Update Digital Literacy", icon: <Laptop size={32} className="text-cyan-500" />, bg: "bg-cyan-100", path: "/app/digital-literacy" },
    { title: "Indeks Keaktifan Mahasiswa", icon: <Activity size={32} className="text-purple-500" />, bg: "bg-purple-100", path: "/app/ikm" },
  ];

  return (
    <div className="animate-fade-in pb-10">
      {/* HEADER HALAMAN */}
      <div className="mb-8 border-b border-gray-100 pb-4">
        <h2 className="text-3xl font-extrabold text-gray-800 tracking-tight">Akademik</h2>
        <p className="text-gray-500 text-sm mt-1">Pusat layanan administrasi akademik mahasiswa</p>
      </div>

      {/* GRID KOTAK MENU (10 Kotak) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {akademikMenus.map((menu, index) => (
          <Link 
            to={menu.path} 
            key={index} 
            className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center hover:shadow-lg hover:-translate-y-2 transition-all duration-300 group cursor-pointer h-full"
          >
            <div className={`w-20 h-20 ${menu.bg} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}>
              {menu.icon}
            </div>
            <h3 className="font-bold text-gray-800 text-sm group-hover:text-blue-600 transition-colors leading-snug">
              {menu.title}
            </h3>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Akademik;