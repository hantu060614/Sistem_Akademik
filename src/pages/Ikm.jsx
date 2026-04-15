import React, { useState, useEffect } from 'react';
import { Check, Info, FileText, Image as ImageIcon, Download, Upload } from 'lucide-react';
import { getIkmUser, submitIkm, getUser } from '../services/db';

const Ikm = () => {
    const userId = localStorage.getItem('userId');
    const user = getUser(userId) || { nama: 'Mahasiswa' };
    const [riwayat, setRiwayat] = useState([]);
    const [submitting, setSubmitting] = useState(false);

    const [form, setForm] = useState({
        tanggal: '',
        smt: '',
        kategori: '',
        kegiatan: '',
        deskripsi: '',
        peringkat: ''
    });

    const [fileSertifikat, setFileSertifikat] = useState(null);
    const [fileFoto, setFileFoto] = useState(null);

    const fetchData = () => {
        if(userId) setRiwayat(getIkmUser(userId));
    };

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line
    }, [userId]);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    // Dummy poin calculator
    const calcPoinAwal = (kat, per) => {
        if(!kat || !per) return 0;
        if(per.includes('Internasional')) return 100;
        if(per.includes('Nasional')) return 75;
        if(per.includes('Provinsi')) return 50;
        if(per.includes('Universitas') || per.includes('Lokal')) return 25;
        return 10;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(!form.tanggal || !form.smt || !form.kategori || !form.kegiatan || !form.peringkat) {
            return alert("Harap lengkapi semua field dropdown dan isian!");
        }
        if(!fileSertifikat || !fileFoto) {
            return alert("Anda wajib melampirkan file Sertifikat dan Foto dokumentasi!");
        }

        setSubmitting(true);
        const poinAwal = calcPoinAwal(form.kategori, form.peringkat);
        
        await submitIkm({
            ...form,
            nim: userId,
            poinAwal: poinAwal
        }, fileSertifikat, fileFoto);

        alert("Berhasil disubmit! Menunggu verifikasi BAAK.");
        setForm({ tanggal: '', smt: '', kategori: '', kegiatan: '', deskripsi: '', peringkat: '' });
        setFileSertifikat(null);
        setFileFoto(null);
        setSubmitting(false);
        setTimeout(fetchData, 1000); // refresh optimistic cache array update tick
    };

    const SMT_OPTIONS = ['1', '2', '3', '4', '5', '6', '7', '8'];
    const KATEGORI_OPTIONS = ['Organisasi Kemahasiswaan', 'Prestasi Akademik/Non-Akademik', 'Seminar / Pelatihan / Workshop', 'Kepanitiaan'];
    const KEGIATAN_OPTIONS = ['Peserta', 'Panitia / Pengurus Aktif', 'Narasumber / Pembicara', 'Juara 1/2/3'];
    const PERINGKAT_OPTIONS = ['Internasional', 'Nasional', 'Provinsi / Wilayah', 'Kabupaten / Kota', 'Tingkat Institusi / Lokal'];

    return (
        <div className="animate-fade-in pb-10 bg-gray-50 min-h-screen">
            <div className="bg-white px-8 py-5 border-b border-gray-200">
               <h2 className="text-2xl font-bold text-center text-gray-700 tracking-tight">Indeks Keaktifan Mahasiswa</h2>
            </div>
            
            <div className="p-8 max-w-7xl mx-auto space-y-6">
                
                {/* INFO BANNER */}
                <div className="bg-[#0f9d58] text-white p-5 rounded-md shadow-md relative">
                    <button className="absolute top-4 right-4 text-white/70 hover:text-white">&times;</button>
                    <h3 className="flex items-center text-lg font-bold mb-3"><Check size={20} className="mr-2" strokeWidth={3} /> Informasi !</h3>
                    <p className="text-sm text-white/90 font-medium leading-relaxed mb-4 text-justify">
                        Indeks Keaktifan Mahasiswa (IKM) merupakan sistem penilaian untuk mengukur keaktifan mahasiswa dalam berbagai kegiatan akademik, organisasi, dan seminar/pelatihan. Mahasiswa diwajibkan mengumpulkan minimal 250 poin IKM hingga semester 5 sebagai salah satu syarat pengajuan Tugas Akhir. Jika tidak memenuhi point yang dimaksud maka silahkan mencari kegiatan diluar kampus seperti seminar offline dan kegiatan kemasyarakatan lainnya di lampirkan bukti bukti otentiknya.
                    </p>
                    <h4 className="font-bold text-sm mb-1">Petunjuk Pengisian dan Penilaian IKM</h4>
                    <ol className="list-decimal pl-4 text-[13px] text-white/90 space-y-0.5 leading-relaxed font-medium">
                        <li>Mahasiswa mengumpulkan bukti kegiatan (sertifikat, SK, dokumentasi) dan mengunggahnya ke sistem.</li>
                        <li>Setiap kegiatan hanya dapat diklaim 2 Kali per semester.</li>
                        <li>Nilai Indeks IKM menjadi syarat wajib Tugas Akhir.</li>
                        <li>Verifikasi dilakukan oleh Bagian Kemahasiswaan (BAAK) dan Kaprodi.</li>
                    </ol>
                </div>

                {/* FORM SECTION */}
                <div className="bg-white border border-gray-200 rounded-md shadow-sm">
                    <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-[150px_1fr] items-center gap-4">
                            <label className="font-bold text-gray-700 text-sm">Npm</label>
                            <input type="text" readOnly value={userId} className="w-full md:w-1/3 bg-gray-100 border border-gray-300 p-2 text-sm text-gray-600 focus:outline-none placeholder-gray-500" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-[150px_1fr] items-center gap-4">
                            <label className="font-bold text-gray-700 text-sm">Nama</label>
                            <input type="text" readOnly value={user.nama} className="w-full md:w-1/2 bg-gray-100 border border-gray-300 p-2 text-sm text-gray-600 focus:outline-none" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-[150px_1fr] items-center gap-4">
                            <label className="font-bold text-gray-700 text-sm">Tanggal</label>
                            <input type="date" name="tanggal" value={form.tanggal} onChange={handleChange} className="w-full md:w-1/3 bg-white border border-gray-300 p-2 text-sm text-gray-700 focus:border-[#0ea5e9] focus:outline-none" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-[150px_1fr] items-center gap-4">
                            <label className="font-bold text-gray-700 text-sm">SMT</label>
                            <select name="smt" value={form.smt} onChange={handleChange} className="w-full md:w-1/3 bg-white border border-gray-300 p-2 text-sm text-gray-700 focus:border-[#0ea5e9] focus:outline-none">
                                <option value="">-- Pilih SMT --</option>
                                {SMT_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-[150px_1fr] items-center gap-4">
                            <label className="font-bold text-gray-700 text-sm">Kategori</label>
                            <select name="kategori" value={form.kategori} onChange={handleChange} className="w-full md:w-1/2 bg-white border border-gray-300 p-2 text-sm text-gray-700 focus:outline-none">
                                <option value="">-- Pilih --</option>
                                {KATEGORI_OPTIONS.map(k => <option key={k} value={k}>{k}</option>)}
                            </select>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-[150px_1fr] items-center gap-4">
                            <label className="font-bold text-gray-700 text-sm">Kegiatan</label>
                            <select name="kegiatan" value={form.kegiatan} onChange={handleChange} className="w-full md:w-1/2 bg-white border border-gray-300 p-2 text-sm text-gray-700 focus:outline-none">
                                <option value="">-- Pilih --</option>
                                {KEGIATAN_OPTIONS.map(k => <option key={k} value={k}>{k}</option>)}
                            </select>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-[150px_1fr] items-start gap-4">
                            <label className="font-bold text-gray-700 text-sm mt-3">Deskripsi</label>
                            <textarea name="deskripsi" value={form.deskripsi} onChange={handleChange} rows="3" placeholder="Masukan Deskripsi Kegiatan" className="w-full bg-white border border-gray-300 p-2 text-sm text-gray-700 focus:outline-none resize-none"></textarea>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-[150px_1fr] items-center gap-4">
                            <label className="font-bold text-gray-700 text-sm">Peringkat</label>
                            <select name="peringkat" value={form.peringkat} onChange={handleChange} className="w-full md:w-1/2 bg-white border border-gray-300 p-2 text-sm text-gray-700 focus:outline-none">
                                <option value="">-- Pilih --</option>
                                {PERINGKAT_OPTIONS.map(k => <option key={k} value={k}>{k}</option>)}
                            </select>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-[150px_1fr] items-center gap-4">
                            <label className="font-bold text-gray-700 text-sm leading-tight text-right md:text-left pr-4 md:pr-0">Format Pernyataan<br/>Keabsahan</label>
                            <button type="button" className="bg-[#0ea5e9] hover:bg-blue-500 text-white font-bold py-1.5 px-4 rounded text-xs inline-flex items-center w-max shadow-sm">
                                <Download size={14} className="mr-2"/> Download
                            </button>
                        </div>

                        <div className="border-t border-gray-100 my-4 pt-4"></div>

                        <div className="grid grid-cols-1 md:grid-cols-[150px_1fr] items-center gap-4">
                            <label className="font-bold text-gray-700 text-xs uppercase leading-tight">Upload lampiran sertifikat/SK/ST *Pdf</label>
                            <input type="file" accept=".pdf" onChange={(e) => setFileSertifikat(e.target.files[0])} className="text-xs file:mr-4 file:py-1 file:px-3 file:border file:border-gray-300 file:bg-gray-100 file:text-gray-700 file:text-xs file:cursor-pointer cursor-pointer hover:file:bg-gray-200" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-[150px_1fr] items-center gap-4 mt-2">
                            <label className="font-bold text-gray-700 text-xs uppercase leading-tight">Upload Lampiran Foto (Min 2 foto)</label>
                            <input type="file" accept="image/*" onChange={(e) => setFileFoto(e.target.files[0])} className="text-xs file:mr-4 file:py-1 file:px-3 file:border file:border-gray-300 file:bg-gray-100 file:text-gray-700 file:text-xs file:cursor-pointer cursor-pointer hover:file:bg-gray-200" />
                        </div>

                        <div className="flex justify-center mt-6 pt-4">
                            <button type="submit" disabled={submitting} className="bg-[#0f9d58] hover:bg-green-700 transition-colors text-white font-bold py-2 px-6 rounded text-sm inline-flex items-center shadow-sm disabled:opacity-50">
                                <Upload size={16} className="mr-2"/> Upload
                            </button>
                        </div>
                    </form>
                </div>

                {/* TABLE SECTION */}
                <div className="bg-white border border-gray-200 shadow-sm overflow-x-auto rounded-t-lg">
                    <table className="w-full text-left text-[11px] font-bold text-gray-700 border-collapse whitespace-nowrap">
                        <thead className="bg-[#f8f9fa] border-b border-gray-200">
                            <tr>
                                <th className="p-3 text-center border-r border-gray-200">No</th>
                                <th className="p-3 text-center border-r border-gray-200">Tanggal</th>
                                <th className="p-3 text-center border-r border-gray-200">SMT</th>
                                <th className="p-3 border-r border-gray-200">Kategori</th>
                                <th className="p-3 border-r border-gray-200">Kegiatan</th>
                                <th className="p-3 border-r border-gray-200">Peringkat</th>
                                <th className="p-3 border-r border-gray-200">Deskripsi</th>
                                <th className="p-3 text-center border-r border-gray-200 leading-tight">Lampiran<br/>Sertifikat</th>
                                <th className="p-3 text-center border-r border-gray-200 leading-tight">Lampiran<br/>Foto</th>
                                <th className="p-3 text-center border-r border-gray-200 leading-tight">Poin<br/>Awal</th>
                                <th className="p-3 text-center border-r border-gray-200 leading-tight">Poin<br/>Valid</th>
                                <th className="p-3 text-center">Verif</th>
                            </tr>
                        </thead>
                        <tbody>
                            {riwayat.length === 0 ? (
                                <tr><td colSpan="12" className="p-4 text-center font-normal text-gray-400">No data available in table</td></tr>
                            ) : riwayat.map((r, i) => (
                                <tr key={r.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                                    <td className="p-3 text-center border-r border-gray-200">{i + 1}</td>
                                    <td className="p-3 text-center border-r border-gray-200 font-normal">{r.tanggal}</td>
                                    <td className="p-3 text-center border-r border-gray-200">{r.smt}</td>
                                    <td className="p-3 border-r border-gray-200 font-normal">{r.kategori}</td>
                                    <td className="p-3 border-r border-gray-200 font-normal">{r.kegiatan}</td>
                                    <td className="p-3 border-r border-gray-200 font-normal">{r.peringkat}</td>
                                    <td className="p-3 border-r border-gray-200 font-normal text-[10px] truncate max-w-[100px]" title={r.deskripsi}>{r.deskripsi}</td>
                                    <td className="p-3 text-center border-r border-gray-200">
                                        {r.fileSertifikat ? <a href={r.fileSertifikat} target="_blank" rel="noreferrer" className="text-red-500 hover:text-red-700 flex justify-center"><FileText size={16}/></a> : '-'}
                                    </td>
                                    <td className="p-3 text-center border-r border-gray-200">
                                        {r.fileFoto ? <a href={r.fileFoto} target="_blank" rel="noreferrer" className="text-blue-500 hover:text-blue-700 flex justify-center"><ImageIcon size={16}/></a> : '-'}
                                    </td>
                                    <td className="p-3 text-center border-r border-gray-200 text-blue-600">{r.poinAwal}</td>
                                    <td className="p-3 text-center border-r border-gray-200 text-green-600">{r.poinValid || '?'}</td>
                                    <td className="p-3 text-center flex justify-center items-center">
                                        {r.status === 'Disetujui' ? (
                                            <div className="bg-green-500 text-white rounded-full p-1 shadow-sm"><Check size={14} strokeWidth={3}/></div>
                                        ) : (
                                            <div className="bg-[#2a87a9] text-white rounded-full p-1 shadow-sm" title="Menunggu Konfirmasi BAAK"><Info size={14} /></div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Ikm;