import React, { useState, useEffect } from 'react';
import { Save, CheckCircle, Search, Edit3 } from 'lucide-react';
import { getAllMatkuls, getNilaiMatkul, setNilaiSingle, getAllMahasiswa } from '../services/db';

const DosenNilai = () => {
  const userId = localStorage.getItem('userId');
  const [matkuls, setMatkuls] = useState([]);
  const [selectedMatkul, setSelectedMatkul] = useState('');
  const [studentsData, setStudentsData] = useState([]);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const listMk = getAllMatkuls().filter(m => m.dosenId === userId);
    setMatkuls(listMk);
    if(listMk.length > 0) {
        setSelectedMatkul(listMk[0].id);
    }
  }, [userId]);

  useEffect(() => {
    if(selectedMatkul) {
        const nilaiDb = getNilaiMatkul(selectedMatkul);
        const mhsAll = getAllMahasiswa();
        
        // Cari mhs yang punya entri (artinya KRS-nya disetujui BAAK)
        const activeStudents = Object.keys(nilaiDb).map(nim => {
            const mhs = mhsAll.find(m => m.id === nim);
            return {
                nim,
                nama: mhs ? mhs.nama : 'Unknown',
                data: nilaiDb[nim] || { tugas: 0, uts: 0, uas: 0, akhir: 0, huruf: '-' }
            };
        });
        setStudentsData(activeStudents);
    }
  }, [selectedMatkul]);

  const handleChange = (nim, field, value) => {
    const newStudents = [...studentsData];
    const idx = newStudents.findIndex(s => s.nim === nim);
    if(idx > -1) {
        newStudents[idx].data[field] = Number(value);
        
        // Auto hitung nilai akhir: 30% Tugas + 30% UTS + 40% UAS
        const tg = newStudents[idx].data.tugas || 0;
        const ut = newStudents[idx].data.uts || 0;
        const ua = newStudents[idx].data.uas || 0;
        newStudents[idx].data.akhir = Math.round((tg * 0.3) + (ut * 0.3) + (ua * 0.4));
        
        setStudentsData(newStudents);
        setIsSaved(false);
    }
  };

  const handleSave = () => {
    studentsData.forEach(s => {
       setNilaiSingle(selectedMatkul, s.nim, s.data);
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="p-8 animate-fade-in pb-20">
      <div className="mb-8 border-b border-gray-100 pb-4 flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-800 flex items-center">
            <Edit3 className="mr-3 text-rose-600" size={32} />
            Input Nilai KHS
          </h2>
          <p className="text-gray-500 mt-2">Daftar Penilaian Akhir Mahasiswa per Kelas.</p>
        </div>
        {isSaved && (
          <div className="bg-emerald-50 text-emerald-600 px-4 py-2 border border-emerald-200 rounded-lg flex items-center font-bold text-sm animate-fade-in">
            <CheckCircle size={16} className="mr-2" />
            Nilai Tersimpan!
          </div>
        )}
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 mb-6 flex flex-col md:flex-row gap-4 items-center">
        <label className="text-sm font-bold text-gray-700 whitespace-nowrap">Pilih Mata Kuliah:</label>
        <select 
          value={selectedMatkul}
          onChange={(e) => setSelectedMatkul(e.target.value)}
          className="w-full md:w-auto flex-1 p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none font-extrabold text-slate-800 focus:ring-2 focus:ring-rose-500"
        >
          {matkuls.map(mk => (
            <option key={mk.id} value={mk.id}>{mk.nama} ({mk.id})</option>
          ))}
          {matkuls.length === 0 && <option value="">Belum Ada Matkul</option>}
        </select>
        
        <button 
           onClick={handleSave}
           className="w-full md:w-auto bg-rose-600 hover:bg-rose-700 text-white font-bold py-3 px-6 rounded-xl flex items-center justify-center transition-all shadow-lg shadow-rose-500/30"
        >
           <Save size={18} className="mr-2" /> Publish Nilai KHS
        </button>
      </div>

      {studentsData.length > 0 ? (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
               <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 text-slate-600 uppercase font-extrabold text-xs tracking-wider border-b border-gray-100">
                     <tr>
                        <th className="px-6 py-4">Mahasiswa</th>
                        <th className="px-6 py-4 w-32 text-center">Tugas (30%)</th>
                        <th className="px-6 py-4 w-32 text-center">UTS (30%)</th>
                        <th className="px-6 py-4 w-32 text-center">UAS (40%)</th>
                        <th className="px-6 py-4 w-24 text-center">Angka</th>
                        {/* Huruf mutu dikalkulasi sistem */}
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                     {studentsData.map((s, index) => (
                        <tr key={index} className="hover:bg-slate-50/50 transition-colors">
                           <td className="px-6 py-4">
                              <span className="font-extrabold text-gray-900 block">{s.nama}</span>
                              <span className="text-xs font-bold text-gray-500">{s.nim}</span>
                           </td>
                           <td className="px-6 py-4">
                              <input type="number" min="0" max="100" value={s.data.tugas} onChange={(e) => handleChange(s.nim, 'tugas', e.target.value)} className="w-full p-2 border-2 border-gray-200 rounded-lg text-center font-bold focus:border-rose-500 outline-none" />
                           </td>
                           <td className="px-6 py-4">
                              <input type="number" min="0" max="100" value={s.data.uts} onChange={(e) => handleChange(s.nim, 'uts', e.target.value)} className="w-full p-2 border-2 border-gray-200 rounded-lg text-center font-bold focus:border-rose-500 outline-none" />
                           </td>
                           <td className="px-6 py-4">
                              <input type="number" min="0" max="100" value={s.data.uas} onChange={(e) => handleChange(s.nim, 'uas', e.target.value)} className="w-full p-2 border-2 border-gray-200 rounded-lg text-center font-bold focus:border-rose-500 outline-none" />
                           </td>
                           <td className="px-6 py-4 text-center">
                              <span className="text-xl font-black text-gray-800">{s.data.akhir}</span>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-3xl border-2 border-dashed border-gray-200">
           <Search size={48} className="mx-auto text-gray-300 mb-4" />
           <p className="text-gray-500 font-bold text-lg">Belum Ada Mahasiswa Aktif</p>
           <p className="text-gray-400">Pastikan KRS mahasiswa sudah disetujui BAAK agar namanya muncul di absen Bapak/Ibu Dosen.</p>
        </div>
      )}
    </div>
  );
};
export default DosenNilai;
