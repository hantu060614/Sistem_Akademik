import React, { useState, useEffect } from 'react';
import { Save, CheckCircle, Clock, CalendarX, UserCheck } from 'lucide-react';
import { getAllMatkuls, getAbsensiMatkul, setAbsensiSingle, getAllMahasiswa } from '../services/db';

const DosenAbsensi = () => {
  const userId = localStorage.getItem('userId');
  const [matkuls, setMatkuls] = useState([]);
  const [selectedMatkul, setSelectedMatkul] = useState('');
  const [studentsData, setStudentsData] = useState([]);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    // Only fetch Matkuls taught by this Dosen
    const listMk = getAllMatkuls().filter(m => m.dosenId === userId);
    setMatkuls(listMk);
    if(listMk.length > 0) setSelectedMatkul(listMk[0].id);
  }, [userId]);

  useEffect(() => {
    if(selectedMatkul) {
        const absDB = getAbsensiMatkul(selectedMatkul);
        const mhsAll = getAllMahasiswa();
        
        const activeStudents = Object.keys(absDB).map(nim => {
            const mhs = mhsAll.find(m => m.id === nim);
            return {
                nim,
                nama: mhs ? mhs.nama : 'Unknown',
                data: absDB[nim] || { pertemuan: Array(14).fill('-'), uts: '-', uas: '-' }
            };
        });
        setStudentsData(activeStudents);
    }
  }, [selectedMatkul]);

  const handleChange = (nim, type, index, value) => {
    const newStudents = [...studentsData];
    const idx = newStudents.findIndex(s => s.nim === nim);
    if(idx > -1) {
        if(type === 'pertemuan') newStudents[idx].data.pertemuan[index] = value;
        else if (type === 'uts') newStudents[idx].data.uts = value;
        else if (type === 'uas') newStudents[idx].data.uas = value;
        
        setStudentsData(newStudents);
        setIsSaved(false);
    }
  };

  const handleSave = () => {
    studentsData.forEach(s => {
       setAbsensiSingle(selectedMatkul, s.nim, s.data);
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="p-8 animate-fade-in pb-20">
      <div className="mb-8 border-b border-gray-100 pb-4 flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-800 tracking-tight flex items-center">
            <UserCheck className="mr-3 text-indigo-600" size={32} />
            Input Presensi Harian
          </h2>
          <p className="text-gray-500 mt-2 font-medium">Buku Absen Mahasiswa yang tersambung Real-time ke KHS masing-masing.</p>
        </div>
        {isSaved && (
          <div className="bg-emerald-50 text-emerald-600 px-4 py-2 border border-emerald-200 rounded-lg flex items-center font-bold text-sm animate-fade-in shadow-sm">
            <CheckCircle size={16} className="mr-2" />
            Tersimpan Otomatis
          </div>
        )}
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-6 mb-8 flex flex-col md:flex-row gap-4 items-center">
        <label className="text-sm font-bold text-gray-700 whitespace-nowrap">Pilih Kelas / Mata Kuliah:</label>
        <select 
          value={selectedMatkul}
          onChange={(e) => setSelectedMatkul(e.target.value)}
          className="w-full md:w-auto flex-1 p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none font-extrabold text-slate-800 focus:ring-2 focus:ring-indigo-500 hover:bg-white transition-all cursor-pointer"
        >
          {matkuls.map(mk => (
            <option key={mk.id} value={mk.id}>{mk.nama} ({mk.id} - {mk.ruang})</option>
          ))}
          {matkuls.length === 0 && <option value="">Tidak ada kelas diampu</option>}
        </select>
        
        <button 
           onClick={handleSave}
           className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-xl flex items-center justify-center transition-all shadow-lg shadow-indigo-500/30 transform hover:-translate-y-0.5"
        >
           <Save size={18} className="mr-2" /> Update Buku Absen
        </button>
      </div>

      {studentsData.length > 0 ? (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
             <div className="overflow-x-auto">
               <table className="w-full text-sm text-left border-collapse">
                  <thead className="bg-slate-50 text-slate-600 uppercase font-extrabold text-[10px] tracking-wider border-b border-gray-200">
                     <tr>
                        <th className="px-4 py-4 w-48 sticky left-0 bg-slate-50 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] z-10">Mhs Info</th>
                        {/* Pertemuan 1-14 */}
                        {[...Array(14)].map((_,i) => <th key={i} className="px-2 py-4 text-center min-w-[50px] border-l border-slate-200">P{i+1}</th>)}
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                     {studentsData.map((s, index) => (
                        <tr key={index} className="hover:bg-slate-50/30 transition-colors">
                           <td className="px-4 py-3 sticky left-0 bg-white shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)] z-10">
                              <span className="font-extrabold text-gray-900 block truncate w-40">{s.nama}</span>
                              <span className="text-[10px] font-bold text-indigo-500">{s.nim}</span>
                           </td>
                           {s.data.pertemuan.map((status, i) => (
                              <td key={i} className="px-2 py-3 border-l border-slate-100 align-middle">
                                 <select 
                                     value={status}
                                     onChange={(e) => handleChange(s.nim, 'pertemuan', i, e.target.value)}
                                     className={`w-full py-2.5 rounded-lg font-bold text-[11px] text-center appearance-none border outline-none cursor-pointer
                                       ${status === 'H' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
                                         status === 'S' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                         status === 'I' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                                         status === 'A' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-transparent text-gray-300 border-transparent hover:border-gray-200'}
                                     `}
                                 >
                                    <option value="-">-</option>
                                    <option value="H">H</option>
                                    <option value="S">S</option>
                                    <option value="I">I</option>
                                    <option value="A">A</option>
                                 </select>
                              </td>
                           ))}
                        </tr>
                     ))}
                  </tbody>
               </table>
             </div>
             <div className="bg-slate-50 p-4 border-t border-gray-200 text-xs text-gray-500 font-bold flex gap-4 uppercase">
               <span>H: Hadir</span>
               <span>S: Sakit</span>
               <span>I: Izin</span>
               <span>A: Alpha</span>
             </div>
          </div>
      ) : (
        <div className="text-center p-16 bg-white rounded-3xl border-2 border-dashed border-gray-200">
           <CalendarX size={48} className="mx-auto text-gray-300 mb-6" />
           <p className="text-gray-500 font-extrabold text-xl mb-2">Kelas Masih Kosong</p>
           <p className="text-gray-400">Belum ada mahasiswa yang mengambil mata kuliah ini (atau KRS belum divalidasi BAAK).</p>
        </div>
      )}
    </div>
  );
};

export default DosenAbsensi;
