import React, { useState, useEffect, useRef } from 'react';
import { Terminal as TerminalIcon } from 'lucide-react';

const Terminal = () => {
  const [logs, setLogs] = useState([
    { type: 'system', text: 'Infinite Bank Admin initialized.' },
    { type: 'system', text: 'Connected to global nodes: 4,021 active.' },
    { type: 'system', text: 'Type "help" to see available commands.' }
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
      } else if (c === 'help') {
        response = [
          { type: 'info', text: 'Available commands:' },
          { type: 'system', text: '  diagnostics - Run full system health check' },
          { type: 'system', text: '  clear       - Clear terminal output' },
          { type: 'system', text: '  help        - Show this help message' }
        ];
      } else {
        response = [{ type: 'error', text: `bash: ${cmd}: command not found. Try 'help'` }];
      }

      setLogs(prev => [...prev, ...response]);
    }, 400);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', height: '100%' }}>
      <header style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '1rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 300, margin: 0 }}>System <span style={{ fontWeight: 600 }}>Terminal</span></h2>
        <p className="mono" style={{ color: '#888', fontSize: '0.85rem', marginTop: '4px' }}>Direct shell access to Infinite core</p>
      </header>

      <div className="glass-card" style={{ padding: 0, overflow: 'hidden', border: '1px solid rgba(157,78,221,0.2)', boxShadow: '0 20px 40px rgba(0,0,0,0.6)', flex: 1, display: 'flex', flexDirection: 'column', minHeight: '60vh' }}>
        <div style={{ background: 'rgba(0,0,0,0.4)', padding: '12px 20px', display: 'flex', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ display: 'flex', gap: '8px', marginRight: '20px' }}>
            <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--neon-red)', opacity: 0.8 }}></span>
            <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--neon-yellow)', opacity: 0.8 }}></span>
            <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--neon-green)', opacity: 0.8 }}></span>
          </div>
          <TerminalIcon size={16} color="var(--neon-purple)" style={{ marginRight: '10px' }} />
          <span className="mono" style={{ fontSize: '0.8rem', color: '#888', letterSpacing: '1px' }}>root@infinite-core:~</span>
        </div>
        
        <div style={{ padding: '25px', flex: 1, overflowY: 'auto', background: 'rgba(0,0,0,0.7)' }} className="mono">
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
    </div>
  );
};

export default Terminal;
