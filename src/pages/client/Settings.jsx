import React, { useState } from 'react';
import { User, Lock, Bell, Shield } from 'lucide-react';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <header style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '1rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 300, margin: 0 }}>Account <span style={{ fontWeight: 600 }}>Settings</span></h2>
        <p className="mono" style={{ color: '#888', fontSize: '0.85rem', marginTop: '4px' }}>Manage your profile, security, and preferences</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: '2rem' }}>
        {/* Settings Sidebar */}
        <div className="glass-card" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', height: 'fit-content' }}>
          {[
            { id: 'profile', icon: User, label: 'Profile' },
            { id: 'security', icon: Lock, label: 'Security' },
            { id: 'notifications', icon: Bell, label: 'Notifications' },
            { id: 'advanced', icon: Shield, label: 'Advanced' }
          ].map(tab => (
            <div 
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="mono"
              style={{
                display: 'flex', alignItems: 'center', gap: '10px', padding: '0.75rem 1rem', borderRadius: '8px',
                cursor: 'pointer', transition: 'all 0.2s',
                background: activeTab === tab.id ? 'rgba(157,78,221,0.15)' : 'transparent',
                color: activeTab === tab.id ? 'var(--neon-purple)' : '#888',
                borderLeft: activeTab === tab.id ? '3px solid var(--neon-purple)' : '3px solid transparent'
              }}
            >
              <tab.icon size={16} />
              {tab.label}
            </div>
          ))}
        </div>

        {/* Settings Content */}
        <div className="glass-card" style={{ padding: '2rem' }}>
          {activeTab === 'profile' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <h3 className="mono" style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>Profile Information</h3>
              <div style={{ display: 'grid', gap: '1rem' }}>
                <div>
                  <label className="mono" style={{ display: 'block', fontSize: '0.8rem', color: '#888', marginBottom: '0.5rem' }}>FULL NAME</label>
                  <input type="text" defaultValue="Jean Dupont" style={{ width: '100%', padding: '0.75rem', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px', color: '#fff', outline: 'none' }} />
                </div>
                <div>
                  <label className="mono" style={{ display: 'block', fontSize: '0.8rem', color: '#888', marginBottom: '0.5rem' }}>EMAIL ADDRESS</label>
                  <input type="email" defaultValue="jean.dupont@example.com" style={{ width: '100%', padding: '0.75rem', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px', color: '#fff', outline: 'none' }} />
                </div>
                <button className="btn-primary mono" style={{ padding: '0.75rem 1.5rem', width: 'fit-content', fontSize: '0.8rem', marginTop: '1rem' }}>SAVE CHANGES</button>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <h3 className="mono" style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>Security Settings</h3>
              <div style={{ display: 'grid', gap: '1rem' }}>
                <div>
                  <label className="mono" style={{ display: 'block', fontSize: '0.8rem', color: '#888', marginBottom: '0.5rem' }}>CURRENT PASSWORD</label>
                  <input type="password" placeholder="********" style={{ width: '100%', padding: '0.75rem', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px', color: '#fff', outline: 'none' }} />
                </div>
                <div>
                  <label className="mono" style={{ display: 'block', fontSize: '0.8rem', color: '#888', marginBottom: '0.5rem' }}>NEW PASSWORD</label>
                  <input type="password" placeholder="********" style={{ width: '100%', padding: '0.75rem', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px', color: '#fff', outline: 'none' }} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(0,255,136,0.2)', borderRadius: '8px', marginTop: '1rem' }}>
                  <div>
                    <div style={{ color: '#fff', fontSize: '0.9rem', fontWeight: 600 }}>Two-Factor Authentication (2FA)</div>
                    <div style={{ color: '#888', fontSize: '0.8rem', marginTop: '4px' }}>Protect your account with an extra layer of security.</div>
                  </div>
                  <button className="mono" style={{ background: 'var(--neon-green)', color: '#000', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>ENABLE</button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="mono" style={{ color: '#888' }}>Notification preferences go here.</div>
          )}
          {activeTab === 'advanced' && (
            <div className="mono" style={{ color: '#888' }}>Advanced settings go here.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
