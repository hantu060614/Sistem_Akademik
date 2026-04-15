import React, { useState, useEffect } from 'react';
import { Laptop, CheckCircle, ExternalLink, ShieldCheck, Upload, PlayCircle } from 'lucide-react';
import { getUserSubmissions, addSubmission } from '../services/db';

const DigitalLiteracy = () => {
    const userId = localStorage.getItem('userId');
    const [submitting, setSubmitting] = useState(false);
    const [riwayat, setRiwayat] = useState([]);
    const [fileSertifikat, setFileSertifikat] = useState(null);

    const fetchData = () => {
        if(userId) setRiwayat(getUserSubmissions(userId, 'literasi_digital'));
    };

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line
    }, [userId]);

    const handleUpload = async (e) => {
        e.preventDefault();
        if(!fileSertifikat) return alert("Mohon pilih file sertifikat kelulusan Anda terlebih dahulu.");
        setSubmitting(true);
        const data = {
            nim: userId,
            kategori: 'literasi_digital',
            tipe: 'Sertifikat Literasi Digital Nasional',
            status: 'Pending'
        };
        await addSubmission(data, fileSertifikat);
        alert("Sertifikat berhasil diunggah! Menunggu validasi admin BAAK.");
        setFileSertifikat(null);
        setSubmitting(false);
        fetchData();
    };

    const record = riwayat.length > 0 ? riwayat[riwayat.length - 1] : null;

    return (
        <div className="animate-fade-in pb-10">
            <div className="mb-8 border-b border-gray-100 pb-4">
                <h2 className="text-3xl font-extrabold text-gray-800 tracking-tight flex items-center">
                    <Laptop className="mr-3 text-cyan-600" size={32} />
                    Update Literasi Digital
                </h2>
                <p className="text-gray-500 text-sm mt-1">Sertifikasi Literasi Digital wajib bagi seluruh mahasiswa sebagai bekal menghadapi era Industri 4.0.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* MATERI PELATIHAN */}
                <div className="space-y-6">
                    <div className="bg-gradient-to-br from-cyan-600 to-blue-700 rounded-3xl p-8 text-white shadow-lg shadow-cyan-500/20 relative overflow-hidden">
                        <ShieldCheck size={120} className="absolute -right-6 -bottom-6 text-white/10" />
                        <h3 className="text-2xl font-black mb-2">Program Literasi Digital</h3>
                        <p className="text-cyan-100 text-sm leading-relaxed mb-6 w-5/6">
                            Ikuti pelatihan daring GRATIS yang diselenggarakan oleh Kementerian Kominfo guna mendapatkan sertifikat sah.
                        </p>
                        <a href="https://literasidigital.id" target="_blank" rel="noreferrer" className="inline-flex items-center px-6 py-3 bg-white text-cyan-700 hover:bg-cyan-50 font-black rounded-xl transition-colors">
                            <ExternalLink size={18} className="mr-2"/> Menuju Portal Pelatihan
                        </a>
                    </div>
                    
                    <div className="bg-white border border-gray-100 p-6 rounded-3xl shadow-sm">
                        <h4 className="font-bold text-gray-800 flex items-center mb-4"><PlayCircle size={20} className="mr-2 text-red-500"/> Panduan Singkat</h4>
                        <ol className="list-decimal pl-5 text-sm text-gray-600 space-y-2 font-medium">
                            <li>Kunjungi portal Literasi Digital Nasional.</li>
                            <li>Buat akun menggunakan nama asli yang sama dengan SIAKAD.</li>
                            <li>Selesaikan minimal 1 Modul Pembelajaran (Contoh: Cakap Digital).</li>
                            <li>Unduh e-Sertifikat Kelulusan berupa file PDF.</li>
                            <li>Unggah kembali file sertifikat tersebut pada form di samping halaman ini.</li>
                        </ol>
                    </div>
                </div>

                {/* FORM UPLOAD */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 flex flex-col h-full">
                    <h3 className="text-xl font-bold text-gray-800 mb-6 border-b border-gray-100 pb-3">Validasi Sertifikat Anda</h3>
                    
                    {record && record.status === 'Disetujui' ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-center p-6 bg-green-50 border border-green-100 rounded-2xl">
                            <CheckCircle size={64} className="text-green-500 mb-4 drop-shadow-sm" />
                            <h4 className="text-xl font-black text-green-700">Terverifikasi!</h4>
                            <p className="text-green-600/80 text-sm mt-2 font-medium">Sertifikat Literasi Digital Anda telah diterima dan disahkan oleh kampus.</p>
                            <a href={record.fileUrl} target="_blank" rel="noreferrer" className="mt-6 px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold transition-all shadow-md shadow-green-500/20 text-sm">Lihat Salinan</a>
                        </div>
                    ) : (
                        <form onSubmit={handleUpload} className="flex flex-col flex-1">
                            <div className="flex-1">
                                {record && record.status === 'Pending' && (
                                    <div className="mb-6 p-4 bg-amber-50 text-amber-700 border border-amber-200 rounded-xl text-sm font-bold flex items-center">
                                        Sertifikat Anda sedang ditinjau oleh Admin. Anda dapat me-replace jika ada kesalahan.
                                    </div>
                                )}
                                {record && record.status === 'Ditolak' && (
                                    <div className="mb-6 p-4 bg-red-50 text-red-700 border border-red-200 rounded-xl text-sm font-bold flex items-center">
                                        ❌ Pengajuan sebelumnya ditolak. Silakan unggah file sertifikat yang valid & terbaca jelas.
                                    </div>
                                )}
                                
                                <label className="block text-sm font-bold text-gray-700 mb-2">Unggah e-Sertifikat (.pdf / .png / .jpg)</label>
                                <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 hover:bg-gray-50 transition-colors text-center">
                                    <input type="file" onChange={(e) => setFileSertifikat(e.target.files[0])} accept=".pdf, image/*" className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-cyan-50 file:text-cyan-700 hover:file:bg-cyan-100 cursor-pointer mx-auto outline-none"/>
                                </div>
                                <p className="text-[11px] text-gray-400 font-bold mt-3">*Sertifikat akan dicek silang dengan sistem pusat. Tindakan pemalsuan dapat mengakibatkan sanksi akademik.</p>
                            </div>

                            <button type="submit" disabled={submitting} className="mt-8 w-full bg-cyan-600 hover:bg-cyan-700 text-white font-black py-4 rounded-xl shadow-lg shadow-cyan-500/30 transition-all flex items-center justify-center disabled:opacity-50 group">
                                <Upload size={20} className="mr-2 group-hover:-translate-y-1 transition-transform" />
                                {submitting ? 'Mengunggah...' : 'Kirim Sertifikat untuk divalidasi'}
                            </button>
                        </form>
                    )}
                </div>
                
            </div>
        </div>
    );
};

export default DigitalLiteracy;