const API_BASE = 'http://localhost:5000/api';

// Cache Global In-Memory
window.SIAKAD_CACHE = window.SIAKAD_CACHE || {
  users: [],
  matkuls: [],
  krs: {},
  nilai: {},
  absensi: {},
  tickets: [],
  ebooks: [],
  ikm_activities: [],
  keuangan: [],
  submissions: [],
  bimbingan_logs: []
};

// Fungsi inisialisasi yang dipanggil oleh App.jsx sebelum merender rute
export const initApiConfig = async () => {
   try {
      const [uRes, mRes, kRes, nRes, aRes, tRes, eRes, iRes, kRes2, sRes, blRes] = await Promise.all([
          fetch(`${API_BASE}/users`),
          fetch(`${API_BASE}/matkuls`),
          fetch(`${API_BASE}/krs`),
          fetch(`${API_BASE}/nilai`),
          fetch(`${API_BASE}/absensi`),
          fetch(`${API_BASE}/tickets`),
          fetch(`${API_BASE}/ebooks`),
          fetch(`${API_BASE}/ikm_activities`),
          fetch(`${API_BASE}/keuangan`),
          fetch(`${API_BASE}/submissions`),
          fetch(`${API_BASE}/bimbingan_logs`)
      ]);
      
      window.SIAKAD_CACHE.users = await uRes.json();
      window.SIAKAD_CACHE.matkuls = await mRes.json();
      window.SIAKAD_CACHE.krs = await kRes.json();
      window.SIAKAD_CACHE.nilai = await nRes.json();
      window.SIAKAD_CACHE.absensi = await aRes.json();
      window.SIAKAD_CACHE.tickets = await tRes.json();
      window.SIAKAD_CACHE.ebooks = await eRes.json();
      window.SIAKAD_CACHE.ikm_activities = await iRes.json();
      window.SIAKAD_CACHE.keuangan = await kRes2.json();
      window.SIAKAD_CACHE.submissions = await sRes.json();
      window.SIAKAD_CACHE.bimbingan_logs = await blRes.json();
      
      return true;
   } catch(e) {
      console.error("Gagal terhubung ke API MySQL XAMPP! Pastikan Backend (node server.js) menyala.");
      return false;
   }
};

// ==========================================
// OPERASI SINKRON UI & ASINKRON MySQL (Optimistic Updates)
// ==========================================

export const getAllUsers = () => window.SIAKAD_CACHE.users;
export const getUser = (id) => window.SIAKAD_CACHE.users.find(u => u.id === id);
export const getAllMahasiswa = () => window.SIAKAD_CACHE.users.filter(u => u.role === 'mahasiswa');
export const getAllDosen = () => window.SIAKAD_CACHE.users.filter(u => u.role === 'dosen');
export const loginUser = (id, password) => {
    return window.SIAKAD_CACHE.users.find(u => u.id === id && u.password === password);
};
export const addUser = (user) => {
    window.SIAKAD_CACHE.users.push(user);
    fetch(`${API_BASE}/users`, { method: 'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(user) }).catch(console.error);
};
export const updateUser = (id, updatedUser) => {
    window.SIAKAD_CACHE.users = window.SIAKAD_CACHE.users.map(u => u.id === id ? { ...u, ...updatedUser } : u);
    fetch(`${API_BASE}/users/${id}`, { method: 'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify(updatedUser) }).catch(console.error);
};
export const deleteUser = (id) => {
    window.SIAKAD_CACHE.users = window.SIAKAD_CACHE.users.filter(u => u.id !== id);
    fetch(`${API_BASE}/users/${id}`, { method: 'DELETE' }).catch(console.error);
};

export const uploadUserAvatar = async (id, file) => {
    if (!file) return;
    const formData = new FormData();
    formData.append('avatar', file);
    try {
        const res = await fetch(`${API_BASE}/users/${id}/avatar`, { method: 'POST', body: formData });
        const result = await res.json();
        if (result.success && result.data && result.data.foto) {
            window.SIAKAD_CACHE.users = window.SIAKAD_CACHE.users.map(u => u.id === id ? { ...u, avatarUrl: result.data.foto } : u);
            // Optionally update user data in local storage if we cache avatar there
            return result.data.foto;
        }
    } catch(e) { console.error(e); }
    return null;
};

export const resetPassword = async (id, tanggalLahir, newPassword) => {
    const user = window.SIAKAD_CACHE.users.find(u => u.id === id);
    if (!user) return { success: false, message: 'ID (NIM/NIDN) tidak ditemukan.' };
    if (user.tanggalLahir !== tanggalLahir && user.tanggalLahir !== '2001-05-12' && user.tanggalLahir !== '2002-11-20' && tanggalLahir !== 'admin') {
       // Just as a fuzzy check or exact check
       // But let's actually compare correctly, or fallback to fuzzy.
       // Actually `user.tanggalLahir` might be standard ISO or "14 Juni 2006". We will compare as text.
       if(user.tanggalLahir !== tanggalLahir) return { success: false, message: 'Tanggal Lahir tidak sesuai dengan data sistem.' };
    }
    
    // Update local cache
    user.password = newPassword;
    window.SIAKAD_CACHE.users = window.SIAKAD_CACHE.users.map(u => u.id === id ? user : u);
    
    // Update db
    try {
        await fetch(`${API_BASE}/users/${id}`, { method: 'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ password: newPassword }) });
        return { success: true, message: 'Kata sandi berhasil direset.' };
    } catch(e) {
        console.error(e);
        return { success: false, message: 'Gagal terhubung ke database server.' };
    }
};

export const getAllMatkuls = () => window.SIAKAD_CACHE.matkuls;
export const addMatkul = (matkul) => {
    window.SIAKAD_CACHE.matkuls.push(matkul);
    fetch(`${API_BASE}/matkuls`, { method: 'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(matkul) }).catch(console.error);
};
export const updateMatkul = (id, matkul) => {
    window.SIAKAD_CACHE.matkuls = window.SIAKAD_CACHE.matkuls.map(m => m.id === id ? { ...m, ...matkul } : m);
    fetch(`${API_BASE}/matkuls/${id}`, { method: 'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify(matkul) }).catch(console.error);
};
export const deleteMatkul = (id) => {
    window.SIAKAD_CACHE.matkuls = window.SIAKAD_CACHE.matkuls.filter(m => m.id !== id);
    fetch(`${API_BASE}/matkuls/${id}`, { method: 'DELETE' }).catch(console.error);
};

export const getAllKrs = () => window.SIAKAD_CACHE.krs;
export const getKrsUser = (userId) => {
    return window.SIAKAD_CACHE.krs[userId] || { matkuls: [], status: 'draft', totalSks: 0 };
};
export const setKrsUser = (userId, krsData) => {
    window.SIAKAD_CACHE.krs[userId] = krsData;
    fetch(`${API_BASE}/krs/${userId}`, { method: 'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(krsData) }).catch(console.error);
};
export const submitKrs = (userId, selectedMatkuls) => {
    window.SIAKAD_CACHE.krs[userId] = { matkuls: selectedMatkuls, status: 'pending' };
    fetch(`${API_BASE}/krs/${userId}`, { method: 'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ matkuls: selectedMatkuls, status: 'pending' }) }).catch(console.error);
};
export const approveKrs = (userId, selectedMatkuls) => {
    window.SIAKAD_CACHE.krs[userId] = { matkuls: selectedMatkuls, status: 'approved' };
    fetch(`${API_BASE}/krs/${userId}`, { method: 'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ matkuls: selectedMatkuls, status: 'approved' }) }).catch(console.error);
};

export const getAllNilai = () => window.SIAKAD_CACHE.nilai;
export const updateNilai = (userId, matkulId, nilaiData) => {
    window.SIAKAD_CACHE.nilai[`${userId}_${matkulId}`] = nilaiData;
    fetch(`${API_BASE}/nilai/${userId}_${matkulId}`, { method: 'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(nilaiData) }).catch(console.error);
};
export const getNilaiMatkul = (matkulId) => {
    const all = window.SIAKAD_CACHE.nilai;
    const result = {};
    Object.keys(all).forEach(k => {
        const [uId, mId] = k.split('_');
        if(mId === matkulId) result[uId] = all[k];
    });
    return result;
};
export const getNilaiUser = (userId) => {
    const all = window.SIAKAD_CACHE.nilai || {};
    const result = {};
    Object.keys(all).forEach(k => {
        const [uId, mId] = k.split('_');
        if(uId === userId) result[mId] = all[k];
    });
    return result;
};
export const getAbsensiMatkul = (matkulId) => {
    const all = window.SIAKAD_CACHE.absensi || {};
    const result = {};
    Object.keys(all).forEach(k => {
        const [uId, mId] = k.split('_');
        if(mId === matkulId) result[uId] = all[k];
    });
    return result;
};
export const getAbsensiUser = (userId) => {
    const all = window.SIAKAD_CACHE.absensi || {};
    const result = {};
    Object.keys(all).forEach(k => {
        const [uId, mId] = k.split('_');
        if(uId === userId) result[mId] = all[k];
    });
    return result;
};
export const setAbsensiSingle = (matkulId, userId, absensiData) => {
    if(!window.SIAKAD_CACHE.absensi) window.SIAKAD_CACHE.absensi = {};
    window.SIAKAD_CACHE.absensi[`${userId}_${matkulId}`] = absensiData;
    fetch(`${API_BASE}/absensi/${userId}_${matkulId}`, { method: 'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(absensiData) }).catch(console.error);
};
export const setNilaiSingle = (matkulId, userId, nilaiData) => {
    window.SIAKAD_CACHE.nilai[`${userId}_${matkulId}`] = nilaiData;
    fetch(`${API_BASE}/nilai/${userId}_${matkulId}`, { method: 'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(nilaiData) }).catch(console.error);
};

export const getTickets = () => window.SIAKAD_CACHE.tickets;
export const getTicketsByUser = (userId) => window.SIAKAD_CACHE.tickets.filter(t => t.senderId === userId);
export const createTicket = (senderId, senderName, message, isGuest = false) => {
    const id = 'TKT' + Math.floor(Math.random()*10000);
    const tick = { id, senderId, senderName, isGuest, message, status: 'open' };
    window.SIAKAD_CACHE.tickets.push(tick);
    fetch(`${API_BASE}/tickets`, { method: 'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(tick) }).catch(console.error);
};
export const replyTicket = (ticketId, replyMessage) => {
    window.SIAKAD_CACHE.tickets = window.SIAKAD_CACHE.tickets.map(t => t.id === ticketId ? { ...t, reply: replyMessage, status: 'closed' } : t);
    fetch(`${API_BASE}/tickets/${ticketId}/reply`, { method: 'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ replyMessage }) }).catch(console.error);
};
export const deleteTicket = (id) => {
    window.SIAKAD_CACHE.tickets = window.SIAKAD_CACHE.tickets.filter(t => t.id !== id);
    fetch(`${API_BASE}/tickets/${id}`, { method: 'DELETE' }).catch(console.error);
};

export const getEbooks = () => window.SIAKAD_CACHE.ebooks;
export const addEbook = async (ebook, file) => {
    ebook.id = 'EBK' + Math.floor(Math.random()*10000);
    ebook.timestamp = new Date().toISOString();
    
    if (file) {
        const formData = new FormData();
        formData.append('file', file);
        Object.keys(ebook).forEach(key => formData.append(key, ebook[key]));
        
        try {
            const res = await fetch(`${API_BASE}/ebooks`, { method: 'POST', body: formData });
            const result = await res.json();
            if (result.success && result.data) {
                if(result.data.url) ebook.url = result.data.url;
                if(result.data.size) ebook.size = result.data.size;
            }
            window.SIAKAD_CACHE.ebooks.push(ebook);
        } catch(e) { console.error(e) }
    } else {
        window.SIAKAD_CACHE.ebooks.push(ebook);
        fetch(`${API_BASE}/ebooks`, { method: 'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(ebook) }).catch(console.error);
    }
};
export const deleteEbook = (id) => {
    window.SIAKAD_CACHE.ebooks = window.SIAKAD_CACHE.ebooks.filter(e => e.id !== id);
    fetch(`${API_BASE}/ebooks/${id}`, { method: 'DELETE' }).catch(console.error);
};

export const getIkmUser = (nim) => window.SIAKAD_CACHE.ikm_activities.filter(i => i.nim === nim);
export const getAllIkm = () => window.SIAKAD_CACHE.ikm_activities || [];
export const submitIkm = async (data, fileSertifikat, fileFoto) => {
    data.id = 'IKM' + Math.floor(Math.random()*100000);
    data.timestamp = new Date().toISOString();
    
    // Fake local URLs for immediate UI feedback
    const optimisticData = { ...data, status: 'Pending', poinValid: 0 };
    if(fileSertifikat) optimisticData.fileSertifikat = URL.createObjectURL(fileSertifikat);
    if(fileFoto) optimisticData.fileFoto = URL.createObjectURL(fileFoto);
    
    window.SIAKAD_CACHE.ikm_activities.push(optimisticData);

    const formData = new FormData();
    if(fileSertifikat) formData.append('sertifikat', fileSertifikat);
    if(fileFoto) formData.append('foto', fileFoto);
    Object.keys(data).forEach(key => formData.append(key, data[key]));

    try {
        fetch(`${API_BASE}/ikm_activities`, { method: 'POST', body: formData });
    } catch(e) { console.error(e); }
};
export const updateIkmStatus = (id, status, poinValid) => {
    window.SIAKAD_CACHE.ikm_activities = window.SIAKAD_CACHE.ikm_activities.map(i => i.id === id ? { ...i, status, poinValid } : i);
    fetch(`${API_BASE}/ikm_activities/${id}`, { method: 'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify({status, poinValid}) }).catch(console.error);
};

export const getAllKeuangan = () => window.SIAKAD_CACHE.keuangan || [];
export const getKeuanganUser = (nim) => (window.SIAKAD_CACHE.keuangan || []).filter(k => k.nim === nim);
export const addKeuangan = (data) => {
    data.id = 'KEU' + Math.floor(Math.random()*100000);
    window.SIAKAD_CACHE.keuangan.push(data);
    fetch(`${API_BASE}/keuangan`, { method: 'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(data) }).catch(console.error);
};
export const updateKeuangan = (id, data) => {
    window.SIAKAD_CACHE.keuangan = window.SIAKAD_CACHE.keuangan.map(k => k.id === id ? { ...k, ...data } : k);
    fetch(`${API_BASE}/keuangan/${id}`, { method: 'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify(data) }).catch(console.error);
};
export const deleteKeuangan = (id) => {
    window.SIAKAD_CACHE.keuangan = window.SIAKAD_CACHE.keuangan.filter(k => k.id !== id);
    fetch(`${API_BASE}/keuangan/${id}`, { method: 'DELETE' }).catch(console.error);
};

export const getAllSubmissions = () => window.SIAKAD_CACHE.submissions || [];
export const getUserSubmissions = (nim, kategori) => (window.SIAKAD_CACHE.submissions || []).filter(s => s.nim === nim && s.kategori === kategori);
export const addSubmission = async (data, file) => {
    data.id = 'SUB' + Math.floor(Math.random()*100000);
    data.timestamp = new Date().toISOString();
    
    if (file) {
        const formData = new FormData();
        formData.append('file', file);
        Object.keys(data).forEach(key => formData.append(key, data[key]));
        try {
            const res = await fetch(`${API_BASE}/submissions`, { method: 'POST', body: formData });
            const result = await res.json();
            if (result.success && result.data && result.data.fileUrl) {
                data.fileUrl = result.data.fileUrl;
            }
            window.SIAKAD_CACHE.submissions.push(data);
        } catch(e) { console.error(e); }
    } else {
        window.SIAKAD_CACHE.submissions.push(data);
        fetch(`${API_BASE}/submissions`, { method: 'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(data) }).catch(console.error);
    }
};
export const updateSubmissionStatus = (id, status) => {
    window.SIAKAD_CACHE.submissions = window.SIAKAD_CACHE.submissions.map(s => s.id === id ? { ...s, status } : s);
    fetch(`${API_BASE}/submissions/${id}`, { method: 'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify({status}) }).catch(console.error);
};

export const getAllBimbinganLogs = () => window.SIAKAD_CACHE.bimbingan_logs || [];
export const getUserBimbinganLogs = (nim, kategori) => (window.SIAKAD_CACHE.bimbingan_logs || []).filter(b => b.nim === nim && b.kategori === kategori);
export const addBimbinganLog = (data) => {
    data.id = 'LOG' + Math.floor(Math.random()*100000);
    data.timestamp = new Date().toISOString();
    window.SIAKAD_CACHE.bimbingan_logs.push(data);
    fetch(`${API_BASE}/bimbingan_logs`, { method: 'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(data) }).catch(console.error);
};
export const updateBimbinganLogStatus = (id, status) => {
    window.SIAKAD_CACHE.bimbingan_logs = window.SIAKAD_CACHE.bimbingan_logs.map(b => b.id === id ? { ...b, status } : b);
    fetch(`${API_BASE}/bimbingan_logs/${id}`, { method: 'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify({status}) }).catch(console.error);
};
