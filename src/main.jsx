import React, { useState, useEffect, StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { initApiConfig } from './services/db';

const RootApp = () => {
   const [isLoaded, setIsLoaded] = useState(false);
   const [error, setError] = useState(false);

   useEffect(() => {
       initApiConfig().then((success) => {
           if(success) {
              setIsLoaded(true);
           } else {
              setError(true);
           }
       });
   }, []);

   if(error) {
      return (
         <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', fontFamily: 'sans-serif', backgroundColor: '#f8fafc', color: '#334155' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔌</div>
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px' }}>Koneksi Backend Terputus</h1>
            <p style={{ maxWidth: '400px', textAlign: 'center', lineHeight: '1.5', fontSize: '14px', marginBottom: '24px' }}>
               Aplikasi React gagal terhubung ke Server MySQL XAMPP. Pastikan server <code style={{background:'#e2e8f0', padding:'2px 6px', borderRadius:'4px'}}>node server.js</code> di folder backend sedang berjalan pada port 5000.
            </p>
         </div>
      );
   }

   if(!isLoaded) {
      return (
         <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', fontFamily: 'sans-serif', backgroundColor: '#f8fafc' }}>
            <div style={{ padding: '20px', borderRadius: '50%', backgroundColor: '#eff6ff', marginBottom: '16px', animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }}>
               ⏳
            </div>
            <h2 style={{ fontSize: '16px', fontWeight: 'bold', color: '#1e293b' }}>Sinkronisasi Database MySQL...</h2>
         </div>
      );
   }

   return <App />;
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RootApp />
  </StrictMode>
);
