import React, { useState } from 'react';
import { Settings as SettingsIcon, Shield, Server, Database, Key } from 'lucide-react';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('system');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <header style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '1rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 300, margin: 0 }}>System <span style={{ fontWeight: 600 }}>Configuration</span></h2>
        <p className="mono" style={{ color: '#888', fontSize: '0.85rem', marginTop: '4px' }}>Global parameters and core system settings</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: '2rem' }}>
        {/* Settings Sidebar */}
        <div className="glass-card" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', height: 'fit-content' }}>
          {[
            { id: 'system', icon: SettingsIcon, label: 'System Core' },
            { id: 'security', icon: Shield, label: 'Security Protocols' },
            { id: 'nodes', icon: Server, label: 'Node Management' },
            { id: 'api', icon: Key, label: 'API Keys' },
            { id: 'database', icon: Database, label: 'Database Backup' }
          ].map(tab => (
            <div 
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="mono"
              style={{
                display: 'flex', alignItems: 'center', gap: '10px', padding: '0.75rem 1rem', borderRadius: '8px',
                cursor: 'pointer', transition: 'all 0.2s',
                background: activeTab === tab.id ? 'rgba(0,229,255,0.15)' : 'transparent',
                color: activeTab === tab.id ? 'var(--neon-cyan)' : '#888',
                borderLeft: activeTab === tab.id ? '3px solid var(--neon-cyan)' : '3px solid transparent'
              }}
            >
              <tab.icon size={16} />
              {tab.label}
            </div>
          ))}
        </div>

        {/* Settings Content */}
        <div className="glass-card" style={{ padding: '2rem' }}>
          {activeTab === 'system' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <h3 className="mono" style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>Core Preferences</h3>
              <div style={{ display: 'grid', gap: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'rgba(0,0,0,0.4)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div>
                    <div style={{ color: '#fff', fontSize: '0.95rem' }}>Maintenance Mode</div>
                    <div className="mono" style={{ color: '#888', fontSize: '0.75rem', marginTop: '4px' }}>Suspend all client operations for updates.</div>
                  </div>
                  <div style={{ width: '50px', height: '24px', background: 'rgba(255,255,255,0.1)', borderRadius: '12px', position: 'relative', cursor: 'pointer' }}>
                    <div style={{ width: '20px', height: '20px', background: '#888', borderRadius: '50%', position: 'absolute', top: '2px', left: '2px' }}></div>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'rgba(0,0,0,0.4)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div>
                    <div style={{ color: '#fff', fontSize: '0.95rem' }}>Strict Audit Logging</div>
                    <div className="mono" style={{ color: '#888', fontSize: '0.75rem', marginTop: '4px' }}>Log every micro-transaction and API call.</div>
                  </div>
                  <div style={{ width: '50px', height: '24px', background: 'rgba(0,229,255,0.2)', borderRadius: '12px', position: 'relative', cursor: 'pointer' }}>
                    <div style={{ width: '20px', height: '20px', background: 'var(--neon-cyan)', borderRadius: '50%', position: 'absolute', top: '2px', right: '2px' }}></div>
                  </div>
                </div>

                <div>
                  <label className="mono" style={{ display: 'block', fontSize: '0.8rem', color: '#888', marginBottom: '0.5rem' }}>GLOBAL RATE LIMIT (REQ/SEC)</label>
                  <input type="number" defaultValue="10000" style={{ width: '100%', padding: '0.75rem', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px', color: '#fff', outline: 'none' }} />
                </div>

                <button className="btn-primary mono" style={{ padding: '0.75rem 1.5rem', width: 'fit-content', fontSize: '0.8rem', marginTop: '1rem' }}>APPLY SYSTEM CONFIG</button>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="mono" style={{ color: '#888' }}>Security protocols configuration goes here.</div>
          )}
          {activeTab !== 'system' && activeTab !== 'security' && (
            <div className="mono" style={{ color: '#888' }}>{activeTab} settings go here.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
