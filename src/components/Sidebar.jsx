import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  BookOpen, DollarSign, GraduationCap, LayoutDashboard, UserCircle, 
  FileText, Users, Database, Briefcase, Calendar, 
  Book, Mail, UploadCloud, Info, FileCheck
} from 'lucide-react';
import logoLp3i from '../assets/logoLp3i.png';

const Sidebar = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const userRole = localStorage.getItem('userRole') || 'mahasiswa';

  // MENU MAHASISWA (SUDAH LENGKAP SESUAI WEB ASLI)
  const menusMahasiswa = [
    { title: "Dashboard", icon: <LayoutDashboard size={20} />, path: "/app/dashboard" },
    { title: "Profil Saya", icon: <UserCircle size={20} />, path: "/app/profil" },
    { title: "Akademik", icon: <BookOpen size={20} />, path: "/app/akademik" },
    { title: "Keuangan", icon: <DollarSign size={20} />, path: "/app/keuangan" },
    { title: "Career (CNP)", icon: <Briefcase size={20} />, path: "/app/cnp" },
    { title: "Tugas Akhir", icon: <GraduationCap size={20} />, path: "/app/tugas-akhir" },
    { title: "e-Book", icon: <Book size={20} />, path: "/app/ebook" },
    { title: "Surat", icon: <Mail size={20} />, path: "/app/surat" },
    { title: "Upload File Pendukung", icon: <UploadCloud size={20} />, path: "/app/upload-file" },
    { title: "Panduan Akademik", icon: <Info size={20} />, path: "/app/panduan" },
    { title: "Helpdesk IT", icon: <Mail size={20} />, path: "/app/helpdesk" },
  ];

  // MENU ADMIN BAAK
  const menusAdmin = [
    { title: "Dashboard", icon: <LayoutDashboard size={20} />, path: "/app/dashboard" },
    { title: "Data Mahasiswa", icon: <Users size={20} />, path: "/app/admin/mahasiswa" },
    { title: "Kelola Dosen & SDM", icon: <Briefcase size={20} />, path: "/app/admin/dosen" },
    { title: "Master Kuliah", icon: <Database size={20} />, path: "/app/admin/matkul" },
    { title: "Data Keuangan", icon: <DollarSign size={20} />, path: "/app/admin/keuangan" },
    { title: "Validasi KRS", icon: <FileText size={20} />, path: "/app/admin/validasi-krs" },
    { title: "Validasi Berkas TA/CNP", icon: <FileCheck size={20} />, path: "/app/admin/validasi-berkas" },
    { title: "E-Book Pustaka", icon: <Book size={20} />, path: "/app/ebook" },
    { title: "Kotak Pesan Masuk", icon: <Mail size={20} />, path: "/app/admin/helpdesk" },
  ];

  // MENU DOSEN
  const menusDosen = [
    { title: "Dashboard", icon: <LayoutDashboard size={20} />, path: "/app/dashboard" },
    { title: "Jadwal Mengajar", icon: <Calendar size={20} />, path: "/app/dosen/jadwal" },
    { title: "Input Nilai", icon: <FileText size={20} />, path: "/app/dosen/nilai" },
    { title: "Absensi", icon: <Users size={20} />, path: "/app/dosen/absensi" },
    { title: "Bimbingan TA", icon: <Users size={20} />, path: "/app/dosen/bimbingan" },
    { title: "E-Book Pustaka", icon: <Book size={20} />, path: "/app/ebook" },
  ];

  const activeMenus = userRole === 'admin' ? menusAdmin : userRole === 'dosen' ? menusDosen : menusMahasiswa;

  const handleNavigation = (path) => {
    navigate(path);
    if (window.innerWidth < 768) setIsSidebarOpen(false);
  };

  return (
    <div className={`print-hide ${isSidebarOpen ? 'w-64' : 'w-0 hidden'} bg-slate-900 text-white transition-all duration-300 flex flex-col shadow-xl z-20 flex-shrink-0`}>
      <div className="p-5 flex flex-col items-center justify-center border-b border-slate-800 cursor-pointer" onClick={() => handleNavigation('/app/dashboard')}>
        <div className="bg-white p-2 rounded-lg mb-3 w-full flex justify-center">
           <img src={logoLp3i} alt="Logo LP3I" className="h-10 w-auto object-contain" />
        </div>
        <p className="text-xs text-blue-400 mt-1 uppercase tracking-widest font-bold">Portal {userRole}</p>
      </div>
      
      <div className="flex-1 overflow-y-auto py-4">
        {activeMenus.map((menu, index) => (
          <div key={index} className="mb-1">
            <div 
              onClick={() => handleNavigation(menu.path)} 
              className={`px-5 py-3 flex items-center cursor-pointer transition-colors ${location.pathname.includes(menu.path) ? 'bg-blue-600 border-l-4 border-white text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}
            >
              {menu.icon}
              <span className="ml-3 font-medium text-sm">{menu.title}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;