import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Menu, Bell, UserCircle, LogOut } from 'lucide-react';

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();
  
  const userName = localStorage.getItem('userName') || 'Pengguna';
  const userRole = localStorage.getItem('userRole') || 'mahasiswa';

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    
    // INI YANG DIPERBAIKI: Mengarahkan kembali ke halaman depan '/'
    navigate('/'); 
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
      <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-100 shadow-sm h-16 flex items-center justify-between px-6 z-10 flex-shrink-0">
          
          <div className="flex items-center">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 mr-4 rounded-lg bg-gray-50 text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors">
              <Menu size={20} />
            </button>
            <h2 className="hidden md:block font-bold text-gray-700 tracking-tight">SIAKAD Politeknik LP3I</h2>
          </div>

          <div className="flex items-center space-x-6">
            <button className="relative p-2 text-gray-400 hover:text-blue-600 transition-colors">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </button>
            
            <div className="flex items-center pl-6 border-l border-gray-200">
              <div className="text-right mr-4 hidden md:block">
                <p className="text-[11px] font-bold text-blue-500 uppercase tracking-widest mb-0.5">
                  {userRole}
                </p>
                <p className="text-sm font-extrabold text-gray-800">
                  {userName}
                </p>
              </div>
              <div className="h-10 w-10 bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white shadow-md border-2 border-white ring-2 ring-blue-50">
                <UserCircle size={24} />
              </div>
            </div>

            <button onClick={handleLogout} className="p-2 text-gray-400 hover:text-red-500 transition-colors ml-2" title="Keluar">
              <LogOut size={20} />
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50/50 p-6 md:p-8 relative">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;