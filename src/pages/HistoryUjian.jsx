import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, History, Search, CalendarDays, 
  FileText, CheckCircle, AlertCircle, ChevronDown, ChevronUp, ArrowRight
} from 'lucide-react';

const HistoryUjian = () => {
  const navigate = useNavigate();
  const [expandedId, setExpandedId] = useState(null);

  // DATA DUMMY HISTORY UJIAN (Diambil dari urutan screenshot kamu)
  const historyData = [
    {
      id: 5, tahun: '2025/2026', semester: 'Ganjil', jenis: 'Ujian Tengah Semester',
      status: 'Selesai',
      detail: [
        { matkul: 'Pemrograman Web Framework', nilai: 'B' },
        { matkul: 'Keamanan Jaringan', nilai: 'A' }
      ]
    },
    {
      id: 4, tahun: '2024/2025', semester: 'Genap', jenis: 'Ujian Akhir Semester',
      status: 'Selesai',
      detail: [
        { matkul: 'Algorithma dan Pemrograman', nilai: 'C' }, // Nilai C -> Bisa diperbaiki
        { matkul: 'Basis Data', nilai: 'B' }
      ]
    },
    {
      id: 3, tahun: '2024/2025', semester: 'Genap', jenis: 'Ujian Tengah Semester',
      status: 'Selesai',
      detail: [
        { matkul: 'Algorithma dan Pemrograman', nilai: 'B' },
        { matkul: 'Basis Data', nilai: 'B' }
      ]
    },
    {
      id: 2, tahun: '2024/2025', semester: 'Ganjil', jenis: 'Ujian Akhir Semester',
      status: 'Selesai',
      detail: [
        { matkul: 'Dasar-dasar Komputer', nilai: 'A' },
        { matkul: 'Aplikasi Komputer-1', nilai: 'B' }
      ]
    },
    {
      id: 1, tahun: '2024/2025', semester: 'Ganjil', jenis: 'Ujian Tengah Semester',
      status: 'Selesai',
      detail: [
        { matkul: 'Dasar-dasar Komputer', nilai: 'A' },
        { matkul: 'Aplikasi Komputer-1', nilai: 'A' }
      ]
    }
  ];

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  // Fungsi untuk pewarnaan nilai
  const getBadgeColor = (nilai) => {
    if (['A', 'B'].includes(nilai)) return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    if (['C'].includes(nilai)) return 'bg-amber-100 text-amber-700 border-amber-200';
    return 'bg-red-100 text-red-700 border-red-200';
  };

  return (
    <div className="animate-fade-in pb-10">
      
      {/* HEADER NAVIGASI */}
      <div className="mb-6 border-b border-gray-100 pb-4">
        <Link to="/app/akademik" className="inline-flex items-center text-sm font-bold text-blue-600 hover:text-blue-800 mb-4 transition-colors">
          <ArrowLeft size={16} className="mr-1" /> Kembali ke Akademik
        </Link>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-800 tracking-tight flex items-center">
              <History size={28} className="mr-3 text-amber-500" /> 
              History UTS & UAS
            </h2>
            <p className="text-gray-500 text-sm mt-1">Arsip riwayat pelaksanaan ujian dari semester awal hingga saat ini.</p>
          </div>
        </div>
      </div>

      {/* LIST HISTORY */}
      <div className="space-y-4">
        {historyData.map((item) => {
          const isExpanded = expandedId === item.id;

          return (
            <div key={item.id} className={`bg-white rounded-2xl border transition-all duration-300 overflow-hidden ${isExpanded ? 'border-amber-400 shadow-md' : 'border-gray-200 shadow-sm hover:border-amber-300'}`}>
              
              {/* BAGIAN ATAS CARD (Selalu Tampil) */}
              <div 
                className="p-5 md:p-6 flex flex-col md:flex-row md:items-center justify-between cursor-pointer gap-4"
                onClick={() => toggleExpand(item.id)}
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 border border-amber-100 flex-shrink-0">
                    <CalendarDays size={24} />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-[10px] font-extrabold text-gray-500 bg-gray-100 px-2 py-0.5 rounded tracking-wider">
                        TAHUN {item.tahun}
                      </span>
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded ${item.semester === 'Ganjil' ? 'bg-indigo-50 text-indigo-600' : 'bg-teal-50 text-teal-600'}`}>
                        SEMESTER {item.semester.toUpperCase()}
                      </span>
                    </div>
                    <h3 className="font-extrabold text-gray-800 text-lg">{item.jenis}</h3>
                  </div>
                </div>

                <div className="flex items-center space-x-4 justify-between md:justify-end">
                  <div className="flex items-center text-sm font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
                    <CheckCircle size={16} className="mr-1.5" /> {item.status}
                  </div>
                  <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-amber-50 hover:text-amber-600 transition-colors">
                    {isExpanded ? <ChevronUp size={20} /> : <Search size={20} />}
                  </div>
                </div>
              </div>

              {/* BAGIAN DETAIL (Tampil Saat Di-Klik) */}
              {isExpanded && (
                <div className="border-t border-gray-100 bg-slate-50 p-5 md:p-6 animate-fade-in">
                  <h4 className="text-sm font-bold text-slate-700 mb-4 flex items-center">
                    <FileText size={18} className="mr-2 text-blue-500" /> Rincian Ujian & Nilai
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {item.detail.map((matkul, idx) => {
                      const butuhPerbaikan = ['C', 'D', 'E'].includes(matkul.nilai);
                      
                      return (
                        <div key={idx} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex items-center">
                            <div className={`w-10 h-10 rounded-lg font-black text-lg flex items-center justify-center mr-3 border ${getBadgeColor(matkul.nilai)}`}>
                              {matkul.nilai}
                            </div>
                            <span className="font-bold text-gray-800 text-sm">{matkul.matkul}</span>
                          </div>
                          
                          {/* LOGIKA PINTAR: Tombol Perbaikan Muncul Jika Nilai C/D/E */}
                          {butuhPerbaikan && (
                            <button 
                              onClick={(e) => {
                                e.stopPropagation(); // Biar card gak ketutup pas tombol diklik
                                navigate('/app/perbaikan-nilai'); // Langsung loncat ke halaman Perbaikan!
                              }}
                              className="text-[10px] font-extrabold bg-orange-500 text-white px-3 py-1.5 rounded-lg hover:bg-orange-600 transition-colors flex items-center justify-center shadow-md shadow-orange-500/20"
                            >
                              Perbaiki Nilai <ArrowRight size={12} className="ml-1" />
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

            </div>
          );
        })}
      </div>

    </div>
  );
};

export default HistoryUjian;