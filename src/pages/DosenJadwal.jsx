import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Users, BookOpen, Clock } from 'lucide-react';
import { getAllMatkuls } from '../services/db';

const DosenJadwal = () => {
  const userId = localStorage.getItem('userId');
  const [jadwals, setJadwals] = useState([]);

  useEffect(() => {
    const matkuls = getAllMatkuls().filter(m => m.dosenId === userId);
    
    // Kelompokkan berdasar hari
    const grouped = matkuls.reduce((acc, mk) => {
        const parts = mk.jadwal ? mk.jadwal.split(",") : ["Tak Terjadwal", "-"];
        const hari = parts[0].trim();
        const waktu = parts.length > 1 ? parts[1].trim() : "-";
        
        if (!acc[hari]) acc[hari] = [];
        acc[hari].push({ ...mk, waktu });
        return acc;
    }, {});
    
    setJadwals(Object.keys(grouped).map(hari => ({ hari, kelas: grouped[hari] })));
  }, [userId]);

  return (
    <div className="p-8 animate-fade-in">
      <div className="mb-8 border-b border-gray-100 pb-4">
        <h2 className="text-3xl font-extrabold text-gray-800 flex items-center">
          <Calendar className="mr-3 text-indigo-600" size={32} />
          Jadwal Mengajar Anda
        </h2>
        <p className="text-gray-500 mt-2">Daftar kelas dan jadwal perkuliahan semester aktif.</p>
      </div>

      {jadwals.length > 0 ? (
          <div className="space-y-6">
             {jadwals.map((jadwalHari, i) => (
                <div key={i} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                   <div className="bg-slate-50 border-b border-gray-100 p-4">
                      <h3 className="font-extrabold text-lg text-slate-800 uppercase tracking-widest">{jadwalHari.hari}</h3>
                   </div>
                   <div className="divide-y divide-gray-50">
                      {jadwalHari.kelas.map((k) => (
                         <div key={k.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between hover:bg-slate-50/50 transition-colors">
                            <div className="mb-4 md:mb-0">
                               <p className="text-sm font-bold text-indigo-600 tracking-wider mb-1">{k.id}</p>
                               <h4 className="font-extrabold text-xl text-gray-900">{k.nama}</h4>
                               <p className="text-gray-500 text-sm mt-1">{k.sks} SKS • Semester {k.semester}</p>
                            </div>
                            <div className="flex gap-6">
                               <div className="flex items-center text-gray-600 font-medium">
                                  <Clock size={18} className="mr-2 text-amber-500" />
                                  {k.waktu}
                               </div>
                               <div className="flex items-center text-gray-600 font-medium">
                                  <MapPin size={18} className="mr-2 text-red-500" />
                                  {k.ruang}
                               </div>
                            </div>
                         </div>
                      ))}
                   </div>
                </div>
             ))}
          </div>
      ) : (
          <div className="bg-white rounded-3xl shadow-sm border border-dashed border-gray-200 p-12 text-center text-gray-500">
             <BookOpen size={48} className="mx-auto text-gray-300 mb-4" />
             <p className="text-lg font-bold">Belum Ada Jadwal Mengajar</p>
             <p className="mt-2 text-sm">Tidak ditemukan mata kuliah yang di-assign untuk ID Anda pada BAAK.</p>
          </div>
      )}
    </div>
  );
};
export default DosenJadwal;
