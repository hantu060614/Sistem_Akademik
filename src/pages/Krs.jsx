import React, { useState, useEffect } from 'react';
import { 
  BookOpen, CheckCircle, AlertCircle, Save, FileText, ArrowLeft, 
  ChevronDown, ChevronUp, Clock, MapPin, Info 
} from 'lucide-react';
import { getAllMatkuls, getKrsUser, setKrsUser, getAllDosen } from '../services/db';
import { Link } from 'react-router-dom';

const Krs = () => {
  const userId = localStorage.getItem('userId');
  const [daftarMatkul, setDaftarMatkul] = useState([]);
  
  const [selectedMatkul, setSelectedMatkul] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [semesterFilter, setSemesterFilter] = useState('Semua');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [statusSks, setStatusSks] = useState(0);

  useEffect(() => {
    // 1. Fetch Matkuls enriched with Dosen names
    const allDbMatkuls = getAllMatkuls();
    const allDosen = getAllDosen();
    const enrichedMatkuls = allDbMatkuls.map(mk => {
         const dos = allDosen.find(d => d.id === mk.dosenId);
         return {
            ...mk,
            dosen: dos ? dos.nama : mk.dosenId,
            materi: 'Bab/Syllabus akan disesuaikan dengan instruksi program studi bulan ini.'
         };
    });
    setDaftarMatkul(enrichedMatkuls);

    // 2. Fetch User KRS
    if(userId) {
        const krs = getKrsUser(userId);
        if (krs && (krs.status === 'pending' || krs.status === 'approved')) {
            setIsSubmitted(true);
            setStatusSks(krs.totalSks);
            setSelectedMatkul(krs.matkuls || []);
        }
    }
  }, [userId]);

  // Logika Checkbox
  const handleToggle = (id) => {
    if (selectedMatkul.includes(id)) {
      setSelectedMatkul(selectedMatkul.filter(item => item !== id));
    } else {
      setSelectedMatkul([...selectedMatkul, id]);
    }
  };

  // Logika Buka-Tutup Accordion Materi
  const toggleExpand = (id, e) => {
    e.preventDefault(); 
    setExpandedId(expandedId === id ? null : id);
  };

  // Hitung SKS & Progress
  const maxSKS = 24;
  const totalSKS = selectedMatkul.reduce((total, id) => {
    const matkul = daftarMatkul.find(m => m.id === id);
    return total + (matkul ? Number(matkul.sks) : 0);
  }, 0);
  const progressPercentage = Math.min((totalSKS / maxSKS) * 100, 100);

  const handleSubmit = () => {
    if (totalSKS === 0) return alert('Pilih minimal 1 Mata Kuliah!');
    if (totalSKS > maxSKS) return alert('Batas maksimal SKS terlampaui!');
    
    // Simpan ke DB layer
    if(userId) {
        setKrsUser(userId, {
            status: 'pending',
            totalSks: totalSKS,
            matkuls: selectedMatkul
        });
    }
    setIsSubmitted(true);
  };

  const handleRevisi = () => {
    if(userId) {
        setKrsUser(userId, { status: 'unsubmitted', matkuls: [], totalSks: 0 });
    }
    setIsSubmitted(false);
  };

  // CETAK PDF HANDLER (CSS Print)
  const handleCetak = () => {
     window.print();
  };

  return (
    <div className="animate-fade-in pb-10">
      
      {/* HEADER NAVIGASI & KONTEKS */}
      <div className="mb-6 border-b border-gray-100 pb-4 print-hide">
        <Link to="/app/akademik" className="inline-flex items-center text-sm font-bold text-blue-600 hover:text-blue-800 mb-4 transition-colors">
          <ArrowLeft size={16} className="mr-1" /> Kembali ke Hub Akademik
        </Link>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-800 tracking-tight">Pengisian KRS</h2>
            <p className="text-gray-500 text-sm mt-1">Tahun Akademik - Ganjil/Genap</p>
          </div>
          <div className="flex items-center space-x-3 bg-blue-50/80 border border-blue-100 p-3 rounded-xl">
            <div className="w-10 h-10 bg-blue-600 text-white rounded-lg flex items-center justify-center font-bold">
              IPS
            </div>
            <div>
              <p className="text-xs text-blue-600 font-bold uppercase">Indeks Prestasi Sem Lalu</p>
              <p className="text-lg font-extrabold text-gray-800 leading-none">3.85 <span className="text-xs font-normal text-gray-500">(Max 24 SKS)</span></p>
            </div>
          </div>
        </div>
      </div>

      {/* HEADER CETAK KOP SURAT */}
      <div className="hidden print-block mb-10 border-b-4 border-slate-800 pb-6 text-center">
         <h1 className="text-2xl font-black uppercase tracking-widest text-slate-800">Politeknik LP3I Kampus Cirebon Kedawung</h1>
         <p className="font-medium text-slate-600 text-sm">Jl. Ir. H. Juanda No.106, Kedawung, Cirebon</p>
         <h2 className="text-xl font-bold mt-6 underline">KARTU RENCANA STUDI (KRS)</h2>
         <p className="mt-2 text-left font-bold border border-slate-300 p-4 inline-block w-full">
            NIM: {userId} <br/> 
            NAMA: {localStorage.getItem('userName')}
         </p>
      </div>

      {isSubmitted ? (
        // STATE: SUKSES SUBMIT ATAU UNTUK PRINT PRIBADI
        <div className="bg-white rounded-3xl p-10 print:p-0 print:border-none print:shadow-none text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 max-w-2xl print:max-w-full mx-auto mt-10 print:mt-0">
          <div className="w-24 h-24 print:hidden bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={48} />
          </div>
          <h3 className="text-3xl font-extrabold text-gray-800 mb-3 tracking-tight print:hidden">KRS Diajukan!</h3>
          <p className="text-gray-500 mb-8 text-lg print:hidden">
            Pengajuan sebanyak <span className="font-bold text-gray-800">{totalSKS || statusSks} SKS</span> saat ini terdata dalam sistem BAAK.
          </p>

          <table className="hidden print-block w-full text-left border-collapse border border-slate-400 mb-10">
             <thead>
               <tr className="bg-slate-200">
                  <th className="border border-slate-400 p-2">Kode</th>
                  <th className="border border-slate-400 p-2">Mata Kuliah</th>
                  <th className="border border-slate-400 p-2">SKS</th>
                  <th className="border border-slate-400 p-2">Dosen Pengampu</th>
               </tr>
             </thead>
             <tbody>
                {daftarMatkul.filter(m => selectedMatkul.includes(m.id)).map(mk => (
                   <tr key={mk.id}>
                      <td className="border border-slate-400 p-2">{mk.id}</td>
                      <td className="border border-slate-400 p-2 font-bold">{mk.nama}</td>
                      <td className="border border-slate-400 p-2 text-center">{mk.sks}</td>
                      <td className="border border-slate-400 p-2">{mk.dosen}</td>
                   </tr>
                ))}
                <tr>
                   <td colSpan="2" className="border border-slate-400 p-2 text-right font-black">TOTAL SKS DIAMBIL</td>
                   <td className="border border-slate-400 p-2 text-center font-black">{totalSKS || statusSks}</td>
                   <td className="border border-slate-400 p-2"></td>
                </tr>
             </tbody>
          </table>

          <div className="flex flex-col sm:flex-row justify-center gap-4 print-hide">
            <button onClick={handleRevisi} className="px-6 py-3 border-2 border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-50 transition-colors">
              Batalkan / Revisi Pilihan
            </button>
            <button onClick={handleCetak} className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center shadow-lg shadow-blue-500/30">
              <FileText size={18} className="mr-2" /> Cetak BUKTI KRS (PDF)
            </button>
          </div>
        </div>
      ) : (
        // STATE: FORM PENGISIAN
        <div className="flex flex-col lg:flex-row gap-8 relative print-hide">
          
          {/* KOLOM KIRI: DAFTAR MATA KULIAH */}
          <div className="flex-1 space-y-4">
            
            {/* Filter Tool */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
              <span className="font-bold text-gray-700 flex items-center"><BookOpen size={18} className="mr-2 text-blue-600"/> Tampilkan Semester</span>
              <select 
                value={semesterFilter}
                onChange={(e) => setSemesterFilter(e.target.value)}
                className="bg-gray-50 border border-gray-200 text-gray-800 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 outline-none font-medium cursor-pointer"
              >
                 <option value="Semua">Semua Semester</option>
                 <option value="1">Semester 1</option>
                 <option value="2">Semester 2</option>
                 <option value="3">Semester 3</option>
                 <option value="4">Semester 4</option>
                 <option value="5">Semester 5</option>
                 <option value="6">Semester 6</option>
              </select>
            </div>

            {/* List Mata Kuliah */}
            <div className="space-y-4">
              {daftarMatkul.filter(m => semesterFilter === 'Semua' || m.semester.toString() === semesterFilter).map((mk) => {
                const isSelected = selectedMatkul.includes(mk.id);
                const isExpanded = expandedId === mk.id;

                return (
                  <div key={mk.id} className={`bg-white rounded-2xl border-2 transition-all duration-300 overflow-hidden ${isSelected ? 'border-blue-500 shadow-md shadow-blue-500/10' : 'border-gray-100 shadow-sm hover:border-gray-300'}`}>
                    
                    <div className="p-5 flex items-start cursor-pointer" onClick={() => handleToggle(mk.id)}>
                      <div className="flex-shrink-0 mt-1">
                        <div className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${isSelected ? 'bg-blue-600 border-blue-600' : 'border-gray-300 bg-white'}`}>
                          {isSelected && <CheckCircle size={16} className="text-white" />}
                        </div>
                      </div>
                      
                      <div className="ml-4 flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="text-xs font-extrabold text-blue-600 bg-blue-50 px-2 py-0.5 rounded uppercase tracking-wider">{mk.id}</span>
                              <span className="text-xs font-bold text-gray-500">• {mk.dosen}</span>
                            </div>
                            <h4 className="font-bold text-gray-800 text-lg leading-tight">{mk.nama}</h4>
                          </div>
                          <span className={`font-extrabold text-sm px-3 py-1 rounded-full border ${isSelected ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-gray-50 text-gray-600 border-gray-200'}`}>
                            {mk.sks} SKS
                          </span>
                        </div>
                        
                        <div className="mt-3 flex flex-wrap gap-3 text-xs font-medium text-gray-500">
                          <span className="flex items-center bg-gray-50 px-2.5 py-1 rounded-md border border-gray-100"><Clock size={14} className="mr-1.5 text-gray-400"/> {mk.jadwal}</span>
                          <span className="flex items-center bg-gray-50 px-2.5 py-1 rounded-md border border-gray-100"><MapPin size={14} className="mr-1.5 text-gray-400"/> {mk.ruang}</span>
                        </div>
                      </div>
                    </div>

                    <div 
                      className="bg-gray-50 border-t border-gray-100 px-5 py-2.5 flex justify-between items-center cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={(e) => toggleExpand(mk.id, e)}
                    >
                      <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Info Mata Kuliah</span>
                      {isExpanded ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
                    </div>

                    {isExpanded && (
                      <div className="px-5 py-4 bg-slate-50 border-t border-gray-100 animate-fade-in">
                        <div className="flex items-start text-sm text-gray-600">
                          <Info size={18} className="mr-2 text-blue-500 flex-shrink-0 mt-0.5" />
                          <p className="leading-relaxed"><span className="font-bold text-gray-700">Materi Pembelajaran:</span> {mk.materi}</p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
              {daftarMatkul.length === 0 && (
                 <div className="text-center py-10 text-gray-400 font-bold border-2 border-dashed rounded-3xl">Pilihan mata kuliah sedang kosong di basis data.</div>
              )}
            </div>
          </div>

          {/* KOLOM KANAN: PANEL KERANJANG SKS */}
          <div className="w-full lg:w-80">
            <div className="bg-slate-900 rounded-3xl shadow-xl p-7 sticky top-24 text-white">
              <h3 className="font-extrabold text-xl border-b border-slate-700 pb-4 mb-6 tracking-tight">Draft Rencana Studi</h3>
              
              <div className="space-y-5 mb-8">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-sm font-medium">Total Mata Kuliah</span>
                  <span className="font-bold text-lg">{selectedMatkul.length} Matkul</span>
                </div>
                
                <div>
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-slate-400 text-sm font-medium">Beban SKS</span>
                    <span className="text-xs font-bold text-slate-500">Max {maxSKS} SKS</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${totalSKS > maxSKS ? 'bg-red-500' : 'bg-gradient-to-r from-blue-500 to-cyan-400'}`} 
                      style={{ width: `${progressPercentage}%` }}
                    ></div>
                  </div>
                </div>

                <div className="pt-2">
                  <div className="flex justify-between items-end">
                    <span className="text-slate-300 font-bold">Total Terpilih</span>
                    <span className={`text-5xl font-black tracking-tighter ${totalSKS > maxSKS ? 'text-red-400' : 'text-white'}`}>
                      {totalSKS}
                    </span>
                  </div>
                </div>
              </div>

              {totalSKS > maxSKS && (
                <div className="mb-6 bg-red-500/20 border border-red-500/50 p-4 rounded-xl flex items-start text-red-200 text-sm animate-fade-in">
                  <AlertCircle size={18} className="mt-0.5 mr-2 flex-shrink-0" />
                  <p className="font-medium">Batas SKS terlampaui! Anda harus membuang beberapa mata kuliah.</p>
                </div>
              )}

              <button 
                onClick={handleSubmit}
                disabled={totalSKS > maxSKS || totalSKS === 0}
                className={`w-full py-4 rounded-2xl font-extrabold text-lg flex items-center justify-center transition-all duration-300 ${
                  totalSKS > maxSKS || totalSKS === 0 
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_30px_rgba(37,99,235,0.6)] transform hover:-translate-y-1'
                }`}
              >
                <Save size={20} className="mr-2" /> AJUKAN KRS
              </button>
            </div>
          </div>

        </div>
      )}

      {/* Signature Area Only for Print */}
      <div className="hidden print-block mt-16 flex justify-end">
         <div className="text-center w-64 border-t border-slate-800 pt-2 font-bold text-slate-800">
           Tanda Tangan Dosen Wali
         </div>
      </div>

    </div>
  );
};

export default Krs;