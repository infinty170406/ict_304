import React, { useState, useEffect, useRef } from 'react';
import { Terminal as TerminalIcon, Users, Globe, ShieldAlert, Activity, Server, Database } from 'lucide-react';

const AdminDashboard = () => {
  const [logs, setLogs] = useState([
    { type: 'system', text: 'Infinite Bank Admin initialized.' },
    { type: 'system', text: 'Connected to global nodes: 4,021 active.' }
  ]);
  const [cmd, setCmd] = useState('');
  const endRef = useRef(null);

  const scrollToBottom = () => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [logs]);

  const handleCommand = (e) => {
    e.preventDefault();
    if (!cmd.trim()) return;

    const newLogs = [...logs, { type: 'input', text: `root@infinite-core:~# ${cmd}` }];
    setLogs(newLogs);
    setCmd('');

    setTimeout(() => {
      let response = [];
      const c = cmd.toLowerCase().trim();
      
      if (c.includes('run_tests') || c.includes('diagnostics')) {
        response = [
          { type: 'info', text: 'Executing Infinite Diagnostic Suite...' },
          { type: 'success', text: '[OK] Node Synchronization (0.12ms)' },
          { type: 'success', text: '[OK] Cryptographic Engine (AES-256-GCM)' },
          { type: 'warning', text: '[WARN] Node 892 latency elevated (140ms)' },
          { type: 'success', text: 'Diagnostic complete. Network health: 99.8%' }
        ];
      } else if (c === 'clear') {
        setLogs([]);
        return;
      } else {
        response = [{ type: 'error', text: `bash: ${cmd}: command not found. Try 'diagnostics'` }];
      }

      setLogs(prev => [...prev, ...response]);
    }, 600);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'radial-gradient(ellipse at bottom, #100b20 0%, #050511 100%)', color: '#fff', padding: '2rem 5%', position: 'relative', overflow: 'hidden' }}>
      
      {/* Background glow */}
      <div style={{ position: 'absolute', top: '30%', left: '50%', transform: 'translate(-50%, -50%)', width: '80vw', height: '80vw', background: 'radial-gradient(circle, rgba(157,78,221,0.08) 0%, rgba(0,0,0,0) 60%)', zIndex: 0, pointerEvents: 'none', filter: 'blur(100px)' }}></div>
      <div style={{ position: 'absolute', bottom: '-20%', left: '-10%', width: '50vw', height: '50vw', background: 'radial-gradient(circle, rgba(0,229,255,0.05) 0%, rgba(0,0,0,0) 60%)', zIndex: 0, filter: 'blur(80px)' }}></div>

      <div className="grid-overlay" style={{ opacity: 0.3 }}></div>

      <div style={{ position: 'relative', zIndex: 1, maxWidth: '1600px', margin: '0 auto' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '2rem', color: '#fff', fontWeight: 300, letterSpacing: '3px' }}>
              Infinite <span style={{ color: 'var(--neon-purple)', fontWeight: 600 }}>Bank</span>
            </h1>
            <p className="mono" style={{ color: '#888', marginTop: '4px' }}>Global Supervision - Level 0</p>
          </div>
          <div className="mono" style={{ background: 'rgba(157,78,221,0.1)', padding: '0.6rem 1.2rem', borderRadius: '30px', border: '1px solid rgba(157,78,221,0.3)', color: 'var(--neon-purple)', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 0 15px rgba(157,78,221,0.2)' }}>
            <ShieldAlert size={18} /> SYSTEM INTEGRITY SECURE
          </div>
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
          
          <div className="glass-card" style={{ padding: '2rem', borderTop: '2px solid var(--neon-cyan)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem', color: '#888' }}>
              <Globe size={20} color="var(--neon-cyan)" /> <span className="mono" style={{ fontSize: '0.9rem' }}>GLOBAL LIQUIDITY</span>
            </div>
            <div className="mono" style={{ fontSize: '2.5rem', fontWeight: 'bold', textShadow: '0 0 20px rgba(0,229,255,0.3)' }}>$ 8.42B</div>
          </div>

          <div className="glass-card" style={{ padding: '2rem', borderTop: '2px solid var(--neon-purple)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem', color: '#888' }}>
              <Users size={20} color="var(--neon-purple)" /> <span className="mono" style={{ fontSize: '0.9rem' }}>ACTIVE IDENTITIES</span>
            </div>
            <div className="mono" style={{ fontSize: '2.5rem', fontWeight: 'bold', textShadow: '0 0 20px rgba(157,78,221,0.3)' }}>14,092,304</div>
          </div>

          <div className="glass-card" style={{ padding: '2rem', borderTop: '2px solid #fff' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem', color: '#888' }}>
              <Activity size={20} color="#fff" /> <span className="mono" style={{ fontSize: '0.9rem' }}>TPS (Trans/sec)</span>
            </div>
            <div className="mono" style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>84,209</div>
          </div>
          
          <div className="glass-card" style={{ padding: '2rem', borderTop: '2px solid var(--neon-green)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem', color: '#888' }}>
              <Server size={20} color="var(--neon-green)" /> <span className="mono" style={{ fontSize: '0.9rem' }}>NETWORK LOAD</span>
            </div>
            <div className="mono" style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--neon-green)' }}>24%</div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem' }}>
          {/* TERMINAL COMPONENT */}
          <div className="glass-card" style={{ padding: 0, overflow: 'hidden', border: '1px solid rgba(157,78,221,0.2)', boxShadow: '0 20px 40px rgba(0,0,0,0.6)' }}>
            <div style={{ background: 'rgba(0,0,0,0.4)', padding: '12px 20px', display: 'flex', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ display: 'flex', gap: '8px', marginRight: '20px' }}>
                <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--neon-red)', opacity: 0.8 }}></span>
                <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--neon-yellow)', opacity: 0.8 }}></span>
                <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--neon-green)', opacity: 0.8 }}></span>
              </div>
              <TerminalIcon size={16} color="var(--neon-purple)" style={{ marginRight: '10px' }} />
              <span className="mono" style={{ fontSize: '0.8rem', color: '#888', letterSpacing: '1px' }}>root@infinite-core:~</span>
            </div>
            
            <div style={{ padding: '25px', height: '450px', overflowY: 'auto', background: 'rgba(0,0,0,0.7)' }} className="mono">
              {logs.map((log, i) => (
                <div key={i} style={{ 
                  marginBottom: '10px', 
                  fontSize: '0.9rem',
                  lineHeight: '1.4',
                  color: log.type === 'error' ? 'var(--neon-red)' : 
                         log.type === 'success' ? 'var(--neon-cyan)' : 
                         log.type === 'warning' ? 'var(--neon-yellow)' : 
                         log.type === 'input' ? '#fff' : '#aaa'
                }}>
                  {log.text}
                </div>
              ))}
              <div ref={endRef} />
              
              <form onSubmit={handleCommand} style={{ display: 'flex', marginTop: '15px' }}>
                <span style={{ color: 'var(--neon-purple)', marginRight: '10px', fontWeight: 'bold' }}>root@infinite-core:~#</span>
                <input 
                  type="text" 
                  value={cmd}
                  onChange={(e) => setCmd(e.target.value)}
                  autoFocus
                  style={{ flex: 1, background: 'transparent', border: 'none', color: '#fff', outline: 'none', fontFamily: 'inherit', fontSize: 'inherit' }}
                />
              </form>
            </div>
          </div>

          {/* Quick Node Status */}
          <div className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
             <h3 className="mono" style={{ color: '#fff', fontSize: '1rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '10px' }}>Active Nodes</h3>
             
             {['US-East-1', 'EU-West-3', 'AP-South-1', 'SA-East-1'].map((node, idx) => (
               <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                   <Database size={16} color="#888" />
                   <span className="mono" style={{ fontSize: '0.85rem', color: '#ccc' }}>{node}</span>
                 </div>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                   <div className="pulse-dot" style={{ background: idx === 2 ? 'var(--neon-yellow)' : 'var(--neon-cyan)', width: '6px', height: '6px' }}></div>
                   <span className="mono" style={{ fontSize: '0.75rem', color: idx === 2 ? 'var(--neon-yellow)' : 'var(--neon-cyan)' }}>
                     {idx === 2 ? '85ms' : '12ms'}
                   </span>
                 </div>
               </div>
             ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;
