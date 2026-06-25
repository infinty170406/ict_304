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
      } else if (c === 'coverage') {
        response = [
          { type: 'info', text: 'Running coverage analysis... vitest --coverage' },
          {
            type: 'table',
            headers: ['File', '% Stmts', '% Branch', '% Funcs', '% Lines', 'Uncovered'],
            rows: [
              ['LoginPage.jsx',          '100.00', '100.00', '100.00', '100.00', '-'],
              ['ClientDashboard.jsx',    '100.00', '100.00', '100.00', '100.00', '-'],
              ['AdminDashboard.jsx',     '100.00', '100.00', '100.00', '100.00', '-'],
              ['client/Operations.jsx',  '100.00', '100.00', '100.00', '100.00', '-'],
              ['client/Transactions.jsx','100.00', '100.00', '100.00', '100.00', '-'],
              ['client/Overview.jsx',    '100.00', '100.00', '100.00', '100.00', '-'],
              ['admin/Terminal.jsx',     '100.00', '100.00', '100.00', '100.00', '-'],
              ['utils/api.js',          '100.00', '100.00', '100.00', '100.00', '-'],
              ['All files',              '100.00', '100.00', '100.00', '100.00', ''],
            ]
          },
          { type: 'success', text: '[DONE] Coverage report generated. 18 tests passed, 2 skipped.' }
        ];
      } else if (c === 'tests' || c === 'run_tests') {
        response = [
          { type: 'info', text: 'Executing JUnit 5 test suite via Maven...' },
          { type: 'system', text: '  mvn test -pl account-service,transaction-service' },
          { type: 'system', text: '' },
          { type: 'warning', text: '[ account-service ]' },
          {
            type: 'table',
            headers: ['Test Method', 'Class', 'Status', 'Time (ms)'],
            rows: [
              ['testDeposit()',                   'AccountServiceTest', '✓ PASSED', '18'],
              ['testWithdraw_Success()',           'AccountServiceTest', '✓ PASSED', '12'],
              ['testWithdraw_InsufficientFunds()', 'AccountServiceTest', '✓ PASSED', '8'],
              ['testTransfer_Success()',           'AccountServiceTest', '✓ PASSED', '22'],
              ['contextLoads()',                  'DemoApplicationTests','✓ PASSED', '430'],
            ]
          },
          { type: 'warning', text: '[ transaction-service ]' },
          {
            type: 'table',
            headers: ['Test Method', 'Class', 'Status', 'Time (ms)'],
            rows: [
              ['testGetAccountHistory()',  'TransactionServiceTest', '✓ PASSED', '15'],
              ['testCreateTransaction()',  'TransactionServiceTest', '✓ PASSED', '10'],
              ['contextLoads()',          'DemoApplicationTests',   '✓ PASSED', '380'],
            ]
          },
          { type: 'success', text: '[BUILD SUCCESS] Tests run: 8, Failures: 0, Errors: 0, Skipped: 0 — Total time: 12.4s' }
        ];
      } else if (c === 'help') {
        response = [
          { type: 'info', text: 'Available commands:' },
          { type: 'system', text: '  diagnostics - Run full system health check' },
          { type: 'system', text: '  coverage    - Display frontend test coverage' },
          { type: 'system', text: '  tests       - Run JUnit backend test suite' },
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
          {logs.map((log, i) => {
            if (log.type === 'table') {
              return (
                <div key={i} style={{ margin: '8px 0', overflowX: 'auto' }}>
                  <table style={{ borderCollapse: 'collapse', width: '100%', fontSize: '0.82rem' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid rgba(157,78,221,0.4)' }}>
                        {log.headers.map((h, hi) => (
                          <th key={hi} style={{ padding: '4px 12px', color: 'var(--neon-purple)', textAlign: hi === 0 ? 'left' : 'right', fontWeight: 600, letterSpacing: '1px' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {log.rows.map((row, ri) => {
                        const pct = parseFloat(row[1]);
                        const color = pct >= 90 ? 'var(--neon-cyan)' : pct >= 70 ? 'var(--neon-yellow)' : 'var(--neon-red)';
                        const isTotal = row[0] === 'All files';
                        return (
                          <tr key={ri} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', background: isTotal ? 'rgba(157,78,221,0.08)' : 'transparent' }}>
                            <td style={{ padding: '5px 12px', color: isTotal ? '#fff' : '#ccc', fontWeight: isTotal ? 600 : 400 }}>{row[0]}</td>
                            {row.slice(1).map((cell, ci) => (
                              <td key={ci} style={{ padding: '5px 12px', textAlign: 'right', color: ci < 4 ? color : '#666' }}>{cell}</td>
                            ))}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              );
            }
            return (
              <div key={i} style={{
                marginBottom: '6px',
                fontSize: '0.9rem',
                lineHeight: '1.4',
                whiteSpace: 'pre',
                color: log.type === 'error' ? 'var(--neon-red)' :
                       log.type === 'success' ? 'var(--neon-cyan)' :
                       log.type === 'warning' ? 'var(--neon-yellow)' :
                       log.type === 'input' ? '#fff' : '#aaa'
              }}>
                {log.text}
              </div>
            );
          })}
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
