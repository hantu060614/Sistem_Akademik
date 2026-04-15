import React, { useState, useEffect } from 'react';
import { CheckCircle, Clock, XCircle, Search } from 'lucide-react';
import { getAllKrs, setKrsUser, getAllMahasiswa } from '../services/db';

const AdminValidasiKrs = () => {
  const [submissions, setSubmissions] = useState([]);

  const fetchData = () => {
    const allKrs = getAllKrs();
    const allMhs = getAllMahasiswa();
    
    // Gabung data mahasiswa dan data pengajuan KRS mereka
    const combined = allMhs.map(mhs => {
       const krsData = allKrs[mhs.id] || { status: 'unsubmitted', matkuls: [], totalSks: 0 };
       return {
         nim: mhs.id,
         nama: mhs.nama,
         prodi: mhs.prodi,
         status: krsData.status,
         totalSks: krsData.totalSks || 0,
         rawData: krsData
       };
    });
    setSubmissions(combined);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSetujuiKrs = (nim, rawData) => {
    setKrsUser(nim, { ...rawData, status: 'approved' });
    alert(`KRS Mahasiswa ${nim} berhasil disetujui! Format blanko Nilai dan Presensi telah otomatis diterbitkan untuk Dosen.`);
    fetchData();
  };

  const handleBatalkanKrs = (nim, rawData) => {
    if(window.confirm(`Yakin menarik validasi KRS ${nim}? Ini akan mengunci jadwal mahasiswa tersebut.`)) {
        setKrsUser(nim, { ...rawData, status: 'pending' });
        fetchData();
    }
  };

  return (
    <div className="p-8 animate-fade-in relative">
      <div className="mb-6 flex justify-between items-end border-b border-gray-100 pb-4">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-800 flex items-center tracking-tight">
            Validasi KRS Terpadu
          </h2>
          <p className="text-gray-500 mt-2 font-medium">Biro Administrasi Akademik dan Kemahasiswaan (BAAK)</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Header Tools */}
        <div className="p-6 border-b border-gray-100 bg-slate-50 flex justify-between items-center">
           <h3 className="font-extrabold text-lg text-slate-800">Daftar Antrean Validasi</h3>
           <div className="relative">
             <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
             <input type="text" placeholder="Cari NIM/Nama..." className="pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm w-64 outline-none focus:border-blue-500 font-bold bg-white" />
           </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-white text-gray-400 uppercase font-extrabold text-xs tracking-wider border-b border-gray-100">
              <tr>
                <th className="px-6 py-4">NIM</th>
                <th className="px-6 py-4">Nama Mahasiswa</th>
                <th className="px-6 py-4">SKS Diambil</th>
                <th className="px-6 py-4">Status Portal</th>
                <th className="px-6 py-4 text-center">Tindakan Admin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {submissions.map(item => (
                 <tr key={item.nim} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-bold text-gray-600">{item.nim}</td>
                    <td className="px-6 py-4">
                        <span className="font-extrabold text-gray-900 block">{item.nama}</span>
                        <span className="text-xs font-bold text-gray-400">{item.prodi}</span>
                    </td>
                    <td className="px-6 py-4 font-extrabold text-gray-700">{item.status !== 'unsubmitted'? `${item.totalSks} SKS` : '-'}</td>
                    <td className="px-6 py-4">
                        {item.status === 'approved' ? (
                          <span className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center w-max shadow-sm">
                            <CheckCircle size={14} className="mr-1.5" /> Approved
                          </span>
                        ) : item.status === 'pending' ? (
                          <span className="bg-amber-50 border border-amber-200 text-amber-700 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center w-max shadow-sm">
                            <Clock size={14} className="mr-1.5" /> Menunggu Cek
                          </span>
                        ) : (
                          <span className="bg-gray-50 border border-gray-200 text-gray-500 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center w-max shadow-sm">
                            <XCircle size={14} className="mr-1.5" /> Belum Mengisi
                          </span>
                        )}
                    </td>
                    <td className="px-6 py-4 flex justify-center gap-2">
                        {item.status === 'pending' && (
                          <button onClick={() => handleSetujuiKrs(item.nim, item.rawData)} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-blue-500/20 transform hover:-translate-y-0.5">
                            Setujui KRS
                          </button>
                        )}
                        {item.status === 'approved' && (
                          <button onClick={() => handleBatalkanKrs(item.nim, item.rawData)} className="bg-gray-100 hover:bg-red-50 text-gray-500 hover:text-red-600 px-5 py-2.5 rounded-xl font-bold transition-colors">
                            Batalkan
                          </button>
                        )}
                        {item.status === 'unsubmitted' && (
                          <span className="text-gray-300 text-sm font-bold italic block py-2.5">Menunggu Mahasiswa</span>
                        )}
                    </td>
                 </tr>
              ))}
              {submissions.length === 0 && (
                 <tr>
                    <td colSpan="5" className="text-center py-12 text-gray-400 font-bold">Tidak ada mahasiswa dalam database</td>
                 </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
export default AdminValidasiKrs;