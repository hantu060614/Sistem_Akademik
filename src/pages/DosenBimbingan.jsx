import React, { useState, useEffect } from 'react';
import { Users, Mail, BookOpen } from 'lucide-react';
import { getAllMahasiswa, getAllKrs } from '../services/db';

const DosenBimbingan = () => {
  const [bimbingan, setBimbingan] = useState([]);

  useEffect(() => {
     // Di sistem asli, mahasiswa dipetakan ke dosen wali tertentu.
     // Untuk demo ini, kita asumsikan semua mahasiswa bimbingan Dosen yang sedang login.
     const mhsAll = getAllMahasiswa();
     const krsAll = getAllKrs();

     const mapped = mhsAll.map(mhs => {
        return {
           ...mhs,
           krsStatus: krsAll[mhs.id] ? krsAll[mhs.id].status : 'unsubmitted'
        };
     });
     setBimbingan(mapped);
  }, []);

  return (
    <div className="p-8 animate-fade-in pb-20">
      <div className="mb-8 border-b border-gray-100 pb-4">
        <h2 className="text-3xl font-extrabold text-gray-800 flex items-center">
          <Users className="mr-3 text-amber-600" size={32} />
          Mahasiswa Perwalian / Bimbingan
        </h2>
        <p className="text-gray-500 mt-2 font-medium">Daftar mahasiswa yang Anda bimbing secara akademik semester ini.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {bimbingan.map(mhs => (
            <div key={mhs.id} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-lg transition-all transform hover:-translate-y-1">
               <div className="p-6">
                  <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-500 flex justify-center items-center font-black text-2xl mb-4 border-2 border-amber-100">
                     {mhs.nama.charAt(0)}
                  </div>
                  <h3 className="font-extrabold text-xl text-gray-900 mb-1">{mhs.nama}</h3>
                  <p className="font-bold text-indigo-600 mb-4">{mhs.id}</p>
                  
                  <div className="space-y-2 text-sm font-medium text-gray-600">
                     <div className="flex items-center"><BookOpen size={16} className="mr-2 text-gray-400" /> {mhs.prodi}</div>
                     <div className="flex items-center">
                        Status KRS Sem 4: 
                        <span className={`ml-2 px-2 py-0.5 rounded font-bold text-xs ${mhs.krsStatus==='approved'?'bg-emerald-100 text-emerald-700':mhs.krsStatus==='pending'?'bg-amber-100 text-amber-700':'bg-gray-100 text-gray-500'}`}>
                           {mhs.krsStatus.toUpperCase()}
                        </span>
                     </div>
                  </div>
               </div>
               <div className="bg-slate-50 p-4 border-t border-gray-100 flex gap-2">
                  <button className="flex-1 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 py-2 rounded-xl font-bold text-sm transition-colors flex justify-center items-center">
                     <BookOpen size={14} className="mr-2" /> Detail
                  </button>
                  <button className="flex-1 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 py-2 rounded-xl font-bold text-sm transition-colors flex justify-center items-center">
                     <Mail size={14} className="mr-2" /> Message
                  </button>
               </div>
            </div>
         ))}
      </div>
    </div>
  );
};
export default DosenBimbingan;
