import React, { useState, useEffect } from 'react';
import { UploadCloud, Save, Eye, X, Check, File as FileIcon, Image as ImageIcon } from 'lucide-react';
import { getUserSubmissions, addSubmission } from '../services/db';

const UploadFile = () => {
   const userId = localStorage.getItem('userId');
   const [submissions, setSubmissions] = useState([]);
   const [filesToUpload, setFilesToUpload] = useState({}); // menampung input file per row id
   const [isUploading, setIsUploading] = useState(false);

   const dataPendukung = [
      { id: 1, title: "Ijazah (Ekstensi Pdf max 6 MB)", type: 'pdf' },
      { id: 2, title: "Transkrip Nilai yang dilegalisir atau SKHUN (Ektensi PDF dan Ukuran Maximal 6 Mb)", type: 'pdf' },
      { id: 3, title: "Akta Kelahiran (Ektensi JPG,PNG,JPEG dan Ukuran Maximal 2 Mb)", type: 'img' },
      { id: 4, title: "Kartu Keluarga (Ektensi JPG,PNG,JPEG dan Ukuran Maximal 2 Mb)", type: 'img' },
      { id: 5, title: "KTP (Ektensi JPG,PNG,JPEG dan Ukuran Maximal 2 Mb)", type: 'img' },
      { id: 6, title: "Pas Photo Almamater 4x6 (Ektensi JPG,PNG,JPEG dan Ukuran Maximal 2 Mb)", type: 'img' }
   ];

   const fetchData = () => {
      if(userId) setSubmissions(getUserSubmissions(userId, 'dokumen_pendukung'));
   };

   useEffect(() => {
      fetchData();
   }, [userId]);

   const handleFileChange = (id, file) => {
      setFilesToUpload(prev => ({ ...prev, [id]: file }));
   };

   const handleSimpan = async (tipe, id) => {
      const selectedFile = filesToUpload[id];
      if (!selectedFile) return alert("Silakan 'Choose file' terlebih dahulu sebelum klik SIMPAN.");
      
      setIsUploading(true);
      const data = {
         nim: userId,
         kategori: 'dokumen_pendukung',
         tipe: tipe,
         status: 'Pending',
         // Menggunakan URL palsu jika backend belum merespons link asli file statis
         fileUrl: URL.createObjectURL(selectedFile) 
      };
      
      await addSubmission(data, selectedFile);
      alert(`${tipe} berhasil diunggah!`);
      
      const newFiles = {...filesToUpload};
      delete newFiles[id];
      setFilesToUpload(newFiles);
      
      fetchData();
      setIsUploading(false);
   };

   const getSubmissionData = (tipe) => {
      // Ambil riwayat terbaru dari tipe ini
      const matches = submissions.filter(s => s.tipe === tipe);
      return matches.length > 0 ? matches[matches.length - 1] : null;
   };

   return (
      <div className="animate-fade-in pb-10">
         <div className="mb-6 border-b border-gray-100 pb-4">
            <h2 className="text-3xl font-extrabold text-gray-800 tracking-tight flex items-center">
               <UploadCloud className="mr-3 text-cyan-600" size={32} />
               Upload File Pendukung
            </h2>
            <p className="text-gray-500 text-sm mt-1">Lengkapi berkas identitas dan akademik Anda di bawah ini sesuai ketentuan ukuran dan ekstensi.</p>
         </div>

         <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-x-auto">
            <div className="p-4 bg-gray-50 border-b border-gray-200 text-center font-bold text-gray-700 tracking-wide">
               FORM UPLOAD FILE PENDUKUNG
            </div>
            <table className="w-full text-left text-sm border-collapse">
               <thead>
                  <tr className="bg-white text-gray-700 border-b border-gray-200 text-xs font-bold uppercase tracking-wider">
                     <th className="p-4 text-center w-12">No</th>
                     <th className="p-4">Data Pendukung Yang Harus Di Upload</th>
                     <th className="p-4 text-center min-w-[300px]">Action</th>
                     <th className="p-4 text-center">Lihat File</th>
                     <th className="p-4 text-center">Keterangan</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-gray-200">
                  {dataPendukung.map((item) => {
                     const sub = getSubmissionData(item.title);
                     return (
                        <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                           <td className="p-4 text-center font-bold text-gray-600">{item.id}</td>
                           <td className="p-4 font-semibold text-gray-700 flex items-center">
                              {item.type === 'pdf' ? <FileIcon className="text-red-500 mr-3 flex-shrink-0" size={24}/> : <ImageIcon className="text-blue-400 mr-3 flex-shrink-0" size={24}/>}
                              <span className="leading-tight">{item.title}</span>
                           </td>
                           <td className="p-4">
                              <div className="flex items-center justify-center space-x-2">
                                 <input 
                                    type="file" 
                                    accept={item.type === 'img' ? 'image/*' : '.pdf'}
                                    onChange={(e) => handleFileChange(item.id, e.target.files[0])}
                                    className="block w-full text-xs text-slate-500
                                       file:mr-2 file:py-2 file:px-3
                                       file:rounded-md file:border-0
                                       file:text-xs file:font-semibold
                                       file:bg-gray-100 file:text-gray-700
                                       hover:file:bg-gray-200 border border-gray-200 rounded-md
                                       bg-white cursor-pointer"
                                 />
                                 <button 
                                    onClick={() => handleSimpan(item.title, item.id)}
                                    disabled={isUploading}
                                    className="bg-[#10b981] hover:bg-[#059669] text-white px-4 py-2.5 rounded-md font-bold text-xs uppercase transition-colors flex items-center min-w-max shadow-sm disabled:opacity-50"
                                 >
                                    <Save size={14} className="mr-1.5" /> Simpan
                                 </button>
                              </div>
                           </td>
                           <td className="p-4 text-center">
                              <button 
                                 onClick={() => {
                                    if(sub && sub.fileUrl) window.open(sub.fileUrl, '_blank');
                                    else alert('Anda belum mengunggah file ini.');
                                 }}
                                 className={`px-4 py-2.5 rounded-md font-bold text-xs flex items-center justify-center mx-auto transition-colors shadow-sm ${sub ? 'bg-[#0ea5e9] hover:bg-[#0284c7] text-white cursor-pointer' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
                              >
                                 <Eye size={14} className="mr-1.5" /> Lihat File
                              </button>
                           </td>
                           <td className="p-4 text-center">
                              {sub ? (
                                 sub.status === 'Disetujui' ? (
                                    <div className="flex justify-center text-[#10b981]" title="Disetujui"><Check size={28} className="drop-shadow-sm"/></div>
                                 ) : sub.status === 'Ditolak' ? (
                                    <div className="flex justify-center text-red-500" title="Ditolak"><X size={28} className="drop-shadow-sm font-bold"/></div>
                                 ) : (
                                    <div className="flex justify-center text-[#0ea5e9] font-black text-xl" title="Pending">?</div>
                                 )
                              ) : (
                                 <div className="flex justify-center text-[#0ea5e9]"><X size={28} className="drop-shadow-sm font-bold"/></div> // Meniru ikon X biru di screenshot
                              )}
                           </td>
                        </tr>
                     );
                  })}
               </tbody>
            </table>
         </div>
      </div>
   );
};

export default UploadFile;