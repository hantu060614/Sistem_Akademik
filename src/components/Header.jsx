import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X, LogOut } from 'lucide-react';


const Header = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const navigate = useNavigate();
  const userRole = localStorage.getItem('userRole') || 'mahasiswa';

  const handleLogout = () => {
    localStorage.removeItem('userRole'); // Hapus sesi saat logout
    navigate('/'); // Kembali ke Landing Page
  };

  return (
    <header className="bg-white shadow-sm h-16 flex items-center justify-between px-6 z-10 flex-shrink-0">
      <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-gray-500 hover:text-blue-600 p-2 rounded-md hover:bg-gray-100 transition-colors">
        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
      
      <div className="flex items-center space-x-4 border-l pl-4">
        <div className="flex flex-col text-right hidden md:block">
          <span className="text-sm font-bold text-gray-800 leading-tight">Pengguna Sistem</span>
          <span className="text-xs text-gray-500 capitalize">{userRole}</span>
        </div>
        <button onClick={handleLogout} className="flex items-center text-red-500 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors font-medium text-sm ml-2">
          <LogOut size={16} className="mr-1"/> Keluar
        </button>
      </div>
    </header>
  );
};

export default Header;