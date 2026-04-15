import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  Clock,
  MapPin,
  Printer,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import { getKrsUser, getAllMatkuls } from "../services/db";

const Jadwal = () => {
  // BACA DARI MEMORI YANG DISET ADMIN (Dideklarasikan HANYA SEKALI di sini)
  const [isKrsApproved, setIsKrsApproved] = useState(false);
  const [isKrsPending, setIsKrsPending] = useState(false);
  const [jadwalData, setJadwalData] = useState([]);
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if(!userId) return;
    const krs = getKrsUser(userId);
    const allMatkuls = getAllMatkuls();

    if(krs) {
        setIsKrsApproved(krs.status === "approved");
        setIsKrsPending(krs.status === "pending");

        if (krs.status === "approved") {
          // Get full matkul details using IDs stored in krs.matkuls
          const krsData = allMatkuls.filter(m => krs.matkuls.includes(m.id));
          
          // Mengelompokkan berdasarkan hari
          const grouped = krsData.reduce((acc, mk) => {
            const parts = mk.jadwal ? mk.jadwal.split(",") : ["Tak Terjadwal", "-"];
            const hari = parts[0].trim();
            const waktu = parts.length > 1 ? parts[1].trim() : "-";

            if (!acc[hari]) acc[hari] = [];
            acc[hari].push({
              kode: mk.id,
              nama: mk.nama,
              waktu: waktu,
              ruang: mk.ruang,
              dosen: mk.dosenId, // Normally we fetch proper dosen name, simplify here
              sks: mk.sks,
            });
            return acc;
          }, {});

          // Transform ke array
          const transformedData = Object.keys(grouped).map((hari) => ({
            hari,
            mataKuliah: grouped[hari],
          }));

          setJadwalData(transformedData);
        }
    }
  }, [userId]);

  const handleCetak = () => {
    window.print();
  };

  return (
    <div className="animate-fade-in pb-10">
      <div className="mb-6 border-b border-gray-100 pb-4 flex justify-between items-center print-hide">
        <div>
          <Link
            to="/app/akademik"
            className="inline-flex items-center text-sm font-bold text-blue-600 hover:text-blue-800 mb-4 transition-colors"
          >
            <ArrowLeft size={16} className="mr-1" /> Kembali ke Akademik
          </Link>
          <h2 className="text-3xl font-extrabold text-gray-800 tracking-tight">Jadwal Kuliah</h2>
          <p className="text-gray-500 mt-2">Jadwal mingguan Anda untuk semester aktif.</p>
        </div>
        {isKrsApproved && (
           <button onClick={handleCetak} className="flex items-center px-4 py-2 bg-slate-800 text-white font-bold rounded-xl hover:bg-slate-700 transition">
              <Printer size={18} className="mr-2"/> Cetak Jadwal
           </button>
        )}
      </div>

      {!isKrsApproved ? (
        // TAMPILAN JIKA ADMIN BELUM KLIK SETUJU ATAU MAHASISWA BELUM ISI KRS
        <div className="bg-white rounded-3xl border-2 border-dashed border-amber-200 p-12 text-center max-w-2xl mx-auto mt-10">
          <div className="w-24 h-24 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertTriangle size={48} />
          </div>
          <h3 className="text-2xl font-extrabold text-gray-800 mb-3">
            {isKrsPending ? "Jadwal Menunggu Validasi" : "Belum Isi KRS"}
          </h3>
          <p className="text-gray-500 mb-8 leading-relaxed">
            {isKrsPending ? (
              <>
                KRS Anda masih berstatus{" "}
                <strong className="text-amber-600">Menunggu Validasi</strong> oleh Admin BAAK. Jadwal akan otomatis muncul setelah disetujui.
              </>
            ) : (
              "Anda belum mengisi KRS. Silakan isi dan ajukan KRS Anda terlebih dahulu."
            )}
          </p>
        </div>
      ) : (
        // TAMPILAN JIKA ADMIN SUDAH KLIK SETUJU
        <div className="space-y-6">
          <div className="flex justify-between items-center bg-blue-50 p-4 rounded-2xl border border-blue-100">
            <div className="flex items-center text-blue-700 text-sm font-bold">
              <CheckCircle2 size={20} className="mr-2 text-blue-600" /> KRS
              Telah Disetujui Admin.
            </div>
            <button className="flex items-center text-sm font-bold bg-white text-blue-600 px-4 py-2 rounded-xl shadow-sm border border-blue-100">
              <Printer size={16} className="mr-2" /> Cetak PDF
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {jadwalData.map((hariItem, index) => (
              <div
                key={index}
                className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden"
              >
                <div className="bg-slate-800 text-white p-4 flex items-center justify-between">
                  <h3 className="font-extrabold text-lg flex items-center">
                    <CalendarDays size={20} className="mr-2 text-blue-400" />{" "}
                    {hariItem.hari}
                  </h3>
                </div>
                <div className="divide-y divide-gray-100 p-2">
                  {hariItem.mataKuliah.map((mk, mkIndex) => (
                    <div
                      key={mkIndex}
                      className="p-4 hover:bg-slate-50 transition-colors rounded-xl"
                    >
                      <h4 className="font-bold text-gray-800 mb-2">
                        {mk.nama}
                      </h4>
                      <div className="text-sm text-gray-600 font-medium space-y-1">
                        <div className="flex items-center">
                          <Clock size={16} className="text-amber-500 mr-2" />{" "}
                          {mk.waktu}
                        </div>
                        <div className="flex items-center">
                          <MapPin size={16} className="text-emerald-500 mr-2" />{" "}
                          {mk.ruang}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Jadwal;
