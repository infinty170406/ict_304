import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Key, Fingerprint } from 'lucide-react';

const LoginPage = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState('client');

  const handleLogin = (e) => {
    e.preventDefault();
    if (role === 'admin') navigate('/admin');
    else navigate('/client');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#000', position: 'relative', overflow: 'hidden' }}>
      {/* Background element */}
      <video autoPlay loop muted playsInline style={{ position: 'absolute', top: 0, left: 0, minWidth: '100%', minHeight: '100%', objectFit: 'cover', opacity: 0.3, zIndex: 0 }}>
        <source src="/assets/videos/hero.mp4" type="video/mp4" />
      </video>

      <div className="glass-card" style={{ position: 'relative', zIndex: 1, padding: '3rem', width: '100%', maxWidth: '400px' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
          <Fingerprint size={48} color="#00f0ff" />
        </div>
        
        <h2 style={{ textAlign: 'center', marginBottom: '2rem', fontSize: '2rem' }}>AUTHENTIFICATION</h2>
        
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
            <button 
              type="button"
              onClick={() => setRole('client')}
              style={{ flex: 1, padding: '0.8rem', background: role === 'client' ? 'rgba(0,240,255,0.2)' : 'transparent', border: `1px solid ${role === 'client' ? '#00f0ff' : 'rgba(255,255,255,0.2)'}`, color: role === 'client' ? '#00f0ff' : '#fff', borderRadius: '4px', cursor: 'pointer' }}
              className="mono-text"
            >
              CLIENT
            </button>
            <button 
              type="button"
              onClick={() => setRole('admin')}
              style={{ flex: 1, padding: '0.8rem', background: role === 'admin' ? 'rgba(57,255,20,0.2)' : 'transparent', border: `1px solid ${role === 'admin' ? '#39ff14' : 'rgba(255,255,255,0.2)'}`, color: role === 'admin' ? '#39ff14' : '#fff', borderRadius: '4px', cursor: 'pointer' }}
              className="mono-text"
            >
              ADMIN
            </button>
          </div>

          <div>
            <label className="mono-text" style={{ fontSize: '0.8rem', color: '#888', marginBottom: '0.5rem', display: 'block' }}>IDENTIFIANT CRYPTOGRAPHIQUE</label>
            <div style={{ position: 'relative' }}>
              <Shield size={18} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#888' }} />
              <input type="text" placeholder="Entrez votre clé publique" style={{ width: '100%', padding: '1rem 1rem 1rem 2.5rem', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '4px', outline: 'none', fontFamily: 'monospace' }} />
            </div>
          </div>

          <div>
            <label className="mono-text" style={{ fontSize: '0.8rem', color: '#888', marginBottom: '0.5rem', display: 'block' }}>PHRASE DE SÉCURITÉ</label>
            <div style={{ position: 'relative' }}>
              <Key size={18} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#888' }} />
              <input type="password" placeholder="••••••••••••" style={{ width: '100%', padding: '1rem 1rem 1rem 2.5rem', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '4px', outline: 'none', fontFamily: 'monospace' }} />
            </div>
          </div>

          <button type="submit" className="ghost-btn" style={{ marginTop: '1rem', background: role === 'admin' ? 'rgba(57,255,20,0.1)' : 'rgba(0,240,255,0.1)', borderColor: role === 'admin' ? '#39ff14' : '#00f0ff', color: role === 'admin' ? '#39ff14' : '#00f0ff' }}>
            &gt;_ {role === 'admin' ? 'INITIER GOD MODE' : 'ACCÉDER AUX ACTIFS'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
