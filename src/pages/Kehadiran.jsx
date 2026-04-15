import React, { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle2, Clock, CalendarX, Printer } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getAbsensiUser, getNilaiUser, getAllMatkuls } from '../services/db';

const Kehadiran = () => {
  const userId = localStorage.getItem('userId');
  const userName = localStorage.getItem('userName');
  const [dataKehadiran, setDataKehadiran] = useState([]);
  const [rataRataSmt, setRataRataSmt] = useState(0);

  useEffect(() => {
    if(!userId) return;
    const absensiDb = getAbsensiUser(userId);
    const nilaiDb = getNilaiUser(userId);
    const allMatkuls = getAllMatkuls();

    if(Object.keys(absensiDb).length > 0) {
        let totalPersentase = 0;
        let countMatkul = 0;

        const formattedData = Object.keys(absensiDb).map(matkulId => {
            const matkulDesc = allMatkuls.find(m => m.id === matkulId);
            const pertemuan = absensiDb[matkulId].pertemuan || Array(14).fill('-');
            const absUts = absensiDb[matkulId].uts || '-';
            const absUas = absensiDb[matkulId].uas || '-';
            const nilaiUtama = nilaiDb[matkulId]?.huruf || '-'; // Fetch KHS grade

            const tHadir = pertemuan.filter(p => p === 'H').length;
            const tSelesai = pertemuan.filter(p => p !== '-').length;
            let percent = 0;
            if(tSelesai > 0) {
               percent = (tHadir / tSelesai) * 100;
               totalPersentase += percent;
               countMatkul++;
            }

            return {
                id: matkulId,
                matkul: matkulDesc ? matkulDesc.nama : matkulId,
                sks: matkulDesc ? matkulDesc.sks : 0,
                pertemuan,
                uts: absUts,
                uas: absUas,
                akhir: nilaiUtama,
                percent: Math.round(percent)
            };
        });

        setDataKehadiran(formattedData);
        setRataRataSmt(countMatkul > 0 ? Math.round(totalPersentase / countMatkul) : 0);
    }
  }, [userId]);

  const getStatusColor = (status) => {
    switch(status) {
      case 'H': return 'bg-emerald-500 text-white border-emerald-500 shadow-sm';
      case 'S': return 'bg-blue-500 text-white border-blue-500 shadow-sm';
      case 'I': return 'bg-amber-500 text-white border-amber-500 shadow-sm';
      case 'A': return 'bg-red-500 text-white border-red-500 shadow-sm';
      default: return 'bg-slate-50 text-slate-400 border-slate-200';
    }
  };

  const handleCetak = () => {
      window.print();
  };

  return (
    <div className="animate-fade-in pb-10">
      
      {/* Header (Hidden in Print) */}
      <div className="mb-6 mb-8 border-b border-gray-100 pb-4 flex justify-between items-center print-hide">
        <div>
           <Link to="/app/akademik" className="inline-flex items-center text-sm font-bold text-blue-600 hover:text-blue-800 mb-4 transition-colors">
              <ArrowLeft size={16} className="mr-1" /> Kembali ke Akademik
           </Link>
           <h2 className="text-3xl font-extrabold text-gray-800 tracking-tight">KHS & Presensi Kuliah</h2>
           <p className="text-gray-500 mt-2">Kartu Hasil Studi dan riwayat absensi Anda semester ini.</p>
        </div>
        <button onClick={handleCetak} className="flex items-center px-4 py-2 bg-slate-800 text-white font-bold rounded-xl hover:bg-slate-700 transition shadow-lg">
           <Printer size={18} className="mr-2"/> Cetak KHS (PDF)
        </button>
      </div>

      {/* Print Only Header (Kop Surat) */}
      <div className="hidden print-block mb-10 border-b-4 border-slate-800 pb-6 text-center">
         <h1 className="text-2xl font-black uppercase tracking-widest text-slate-800">Politeknik LP3I Kampus Tasikmalaya</h1>
         <p className="font-medium text-slate-600 text-sm">Jl. Ir. H. Juanda No.106, Panglayungan, Kec. Cipedes, Tasikmalaya</p>
         <h2 className="text-xl font-bold mt-6 underline">KARTU HASIL STUDI (KHS) DAN PRESENSI</h2>
         <p className="mt-2 text-left font-bold border border-slate-300 p-4 inline-block w-full">NAMA: {userName} <br/> NIM: {userId}</p>
      </div>

      {dataKehadiran.length > 0 ? (
        <div className="space-y-6">
          {/* Card Statistik Total */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-8 text-white shadow-lg relative overflow-hidden print-hide">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mt-20 -mr-20 blur-2xl pointer-events-none"></div>
            <div className="flex items-center justify-between relative z-10">
              <div>
                <p className="text-blue-100 text-sm font-bold mb-1 uppercase tracking-widest">Akumulasi Historis</p>
                <h3 className="text-5xl font-extrabold tracking-tight">{rataRataSmt}<span className="text-2xl text-blue-200">%</span></h3>
              </div>
              <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-sm border border-white/20">
                <CheckCircle2 size={40} className="text-emerald-300" />
              </div>
            </div>
          </div>
          
          {dataKehadiran.map((mk) => (
            <div key={mk.id} className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-sm print-break-inside-avoid">
              
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-6 border-b border-gray-50 gap-4">
                <div>
                  <h3 className="text-xl font-extrabold text-gray-800">{mk.matkul}</h3>
                  <div className="flex items-center gap-3 mt-2">
                     <span className="text-sm font-bold text-gray-500 bg-gray-50 px-3 py-1 rounded-md">{mk.sks} SKS</span>
                  </div>
                </div>
                
                {/* Print shows explicit grade */}
                <div className="flex items-center gap-4">
                   <div className="text-right">
                     <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Grade KHS</p>
                     <p className={`text-2xl font-black ${mk.akhir==='A'?'text-emerald-500':mk.akhir==='B'?'text-blue-500':'text-amber-500'}`}>{mk.akhir}</p>
                   </div>
                   <div className="text-right pl-4 border-l border-gray-100">
                     <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Rata-rata Presensi</p>
                     <p className="text-2xl font-extrabold text-gray-800">{mk.percent}%</p>
                   </div>
                </div>
              </div>

              {/* Grid Pertemuan Harian */}
              <div className="mb-6">
                <h4 className="text-sm font-bold text-gray-700 mb-4 flex items-center">
                  <Clock size={16} className="mr-2 text-blue-500" /> Presensi Harian (1-14)
                </h4>
                <div className="grid grid-cols-7 gap-2 sm:gap-3">
                  {mk.pertemuan.map((status, index) => (
                    <div key={index} className="flex flex-col items-center">
                      <span className="text-[10px] font-bold text-gray-400 mb-1.5">P{index + 1}</span>
                      <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl border-2 flex items-center justify-center font-bold text-xs sm:text-sm transition-all ${getStatusColor(status)}`}>
                        {status}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Grid Ujian */}
              <div className="bg-slate-50 rounded-2xl p-4 flex gap-6">
                <div>
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">Ujian Tengah Semester</span>
                  <div className={`px-4 py-1.5 rounded-lg border-2 inline-flex items-center justify-center font-bold text-sm ${getStatusColor(mk.uts)}`}>
                     {mk.uts} {mk.uts==='H'?'(Hadir)': mk.uts==='-'?'Belum':'(Absen)'}
                  </div>
                </div>
                <div>
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">Ujian Akhir Semester</span>
                  <div className={`px-4 py-1.5 rounded-lg border-2 inline-flex items-center justify-center font-bold text-sm ${getStatusColor(mk.uas)}`}>
                     {mk.uas} {mk.uas==='H'?'(Hadir)': mk.uas==='-'?'Belum':'(Absen)'}
                  </div>
                </div>
              </div>

            </div>
          ))}

          {/* Legenda (Hidden in Print) */}
          <div className="bg-slate-800 rounded-2xl p-6 text-white text-sm flex flex-wrap gap-6 items-center print-hide">
            <span className="font-bold text-slate-400 mr-2 uppercase tracking-widest text-xs">Keterangan Presensi:</span>
            <div className="flex items-center"><div className="w-4 h-4 rounded-md bg-emerald-500 mr-2"></div> Hadir (H)</div>
            <div className="flex items-center"><div className="w-4 h-4 rounded-md bg-blue-500 mr-2"></div> Sakit (S)</div>
            <div className="flex items-center"><div className="w-4 h-4 rounded-md bg-amber-500 mr-2"></div> Izin (I)</div>
            <div className="flex items-center"><div className="w-4 h-4 rounded-md bg-red-500 mr-2"></div> Alpha (A)</div>
          </div>
        </div>
      ) : (
        <div className="text-center p-16 bg-white rounded-3xl border-2 border-dashed border-gray-200">
           <CalendarX size={48} className="mx-auto text-gray-300 mb-6" />
           <p className="text-gray-500 font-extrabold text-xl mb-2">KHS Belum Tersedia</p>
           <p className="text-gray-400">KRS Anda belum disetujui BAAK. Silakan ajukan KRS terlebih dahulu.</p>
        </div>
      )}

      {/* Signature Area Only for Print */}
      <div className="hidden print-block mt-16 flex justify-end">
         <div className="text-center w-64 border-t border-slate-800 pt-2 font-bold text-slate-800">
           Tanda Tangan Kaprodi
         </div>
      </div>
    </div>
  );
};

export default Kehadiran;