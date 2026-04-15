import React from 'react';
import { Download, BookOpen } from 'lucide-react';

const Panduan = () => {
   const panduanList = [
      "Panduan Akademik 2024/2025",
      "Panduan Akademik 2023/2024",
      "Panduan Akademik 2022/2023",
      "Panduan Akademik 2021/2022"
   ];

   const handleDownload = (judul) => {
      alert(`Mengunduh file: ${judul}.pdf...`);
      // Implementasi download nyata nantinya: window.open('/path/to/panduan.pdf')
   };

   return (
      <div className="animate-fade-in pb-10">
         <div className="mb-8 border-b border-gray-100 pb-4">
            <h2 className="text-3xl font-extrabold text-gray-800 tracking-tight flex items-center">
               <BookOpen className="mr-3 text-blue-600" size={32} />
               Panduan Akademik
            </h2>
            <p className="text-gray-500 text-sm mt-1">Unduh buku pedoman resmi, kalender akademik, dan tata tertib perkuliahan.</p>
         </div>

         <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-6">
            <div className="flex flex-col space-y-2">
               {panduanList.map((item, index) => (
                  <button 
                     key={index} 
                     onClick={() => handleDownload(item)}
                     className="flex items-center justify-between w-full p-4 hover:bg-blue-50/50 rounded-xl transition-colors border border-transparent hover:border-blue-100 group text-left"
                  >
                     <span className="font-semibold text-gray-700 group-hover:text-blue-700 transition-colors text-lg">{item}</span>
                     <Download size={20} className="text-gray-400 group-hover:text-blue-600 transition-colors" />
                  </button>
               ))}
            </div>
         </div>
      </div>
   );
};

export default Panduan;