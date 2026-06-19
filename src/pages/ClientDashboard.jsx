import React, { useState, useEffect } from 'react';
import { ArrowUpRight, ArrowDownLeft, Send, Activity, Shield, Cpu, Wifi, Database } from 'lucide-react';

const ClientDashboard = () => {
  const [balance, setBalance] = useState(14028492.00);
  const [amount, setAmount] = useState('');
  const [transactions, setTransactions] = useState([
    { id: 1, type: 'receive', amount: 50000, date: '2026-06-18 14:32:11', hash: '0x8f2a...4a2b' },
    { id: 2, type: 'send', amount: -1200, date: '2026-06-17 09:15:00', hash: '0x3c9f...9f1e' },
    { id: 3, type: 'receive', amount: 3500, date: '2026-06-16 11:20:45', hash: '0x1a2b...3c4d' },
    { id: 4, type: 'send', amount: -45000, date: '2026-06-15 16:45:12', hash: '0x9d8e...7f6a' },
  ]);

  const [ping, setPing] = useState(12);

  // Simulate network ping fluctuation
  useEffect(() => {
    const interval = setInterval(() => {
      setPing(Math.floor(Math.random() * 8) + 8); // Random ping between 8 and 15
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleTransaction = (e, type) => {
    e.preventDefault();
    const val = parseFloat(amount);
    if (!val || val <= 0) return;

    if ((type === 'withdraw' || type === 'transfer') && val > balance) {
      return alert('Fonds insuffisants / Insufficient funds');
    }

    setBalance(prev => type === 'deposit' ? prev + val : prev - val);
    setTransactions([{
      id: Date.now(),
      type: type === 'deposit' ? 'receive' : 'send',
      amount: type === 'deposit' ? val : -val,
      date: new Date().toISOString().replace('T', ' ').slice(0, 19),
      hash: '0x' + Math.random().toString(16).slice(2, 10) + '...'
    }, ...transactions]);
    setAmount('');
  };

  return (
    <div style={{ minHeight: '100vh', background: 'radial-gradient(ellipse at top, #100b20 0%, #050511 100%)', color: '#fff', position: 'relative', overflow: 'hidden' }}>
      
      {/* Infinite Ambient Orbs */}
      <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '50vw', height: '50vw', background: 'radial-gradient(circle, rgba(157,78,221,0.15) 0%, rgba(0,0,0,0) 60%)', zIndex: 0, filter: 'blur(60px)' }}></div>
      <div style={{ position: 'absolute', bottom: '-20%', right: '-10%', width: '60vw', height: '60vw', background: 'radial-gradient(circle, rgba(0,229,255,0.1) 0%, rgba(0,0,0,0) 60%)', zIndex: 0, filter: 'blur(80px)' }}></div>

      <div className="grid-overlay" style={{ opacity: 0.5 }}></div>

      {/* Main Content Area */}
      <div style={{ position: 'relative', zIndex: 10, padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '1600px', margin: '0 auto', height: '100vh', overflowY: 'auto' }}>
        
        {/* Header Bar */}
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <h1 style={{ fontSize: '1.4rem', textTransform: 'uppercase', letterSpacing: '3px', margin: 0, fontWeight: 300 }}>
                Infinite <span style={{ color: 'var(--neon-purple)', fontWeight: 600 }}>Bank</span>
              </h1>
              <span className="mono" style={{ fontSize: '0.8rem', color: '#888', marginTop: '4px' }}>USR-778-99X | CLASSIFIED</span>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '15px' }}>
            <div className="glass-card mono" style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', borderRadius: '30px' }}>
              <Activity size={16} color="var(--neon-purple)" />
              <span style={{ color: 'var(--neon-purple)' }}>SYNC: OK</span>
            </div>
            <div className="glass-card mono" style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', borderRadius: '30px' }}>
              <Wifi size={16} color={ping < 12 ? 'var(--neon-cyan)' : '#ffbd2e'} />
              <span style={{ color: ping < 12 ? 'var(--neon-cyan)' : '#ffbd2e' }}>LATENCY: {ping}ms</span>
            </div>
          </div>
        </header>

        {/* Dashboard Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem', flex: 1 }}>
          
          {/* Left Column: Main Stats & Charts */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            
            {/* Balance Card */}
            <div className="glass-card" style={{ padding: '3.5rem 3rem', position: 'relative', overflow: 'hidden', border: '1px solid rgba(157,78,221,0.2)', boxShadow: '0 20px 40px rgba(0,0,0,0.4), inset 0 0 40px rgba(157,78,221,0.05)' }}>
              <div style={{ position: 'absolute', top: 0, right: 0, width: '300px', height: '100%', background: 'linear-gradient(90deg, transparent, rgba(157,78,221,0.05))' }}></div>
              <h2 className="mono" style={{ fontSize: '1.1rem', color: '#aaa', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '2px' }}>Portfolio Balance</h2>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '15px' }}>
                <span className="mono" style={{ fontSize: '2.5rem', color: 'rgba(255,255,255,0.3)' }}>$</span>
                <span className="mono" style={{ fontSize: '6rem', fontWeight: 700, textShadow: '0 0 20px rgba(157,78,221,0.4)', lineHeight: 1, letterSpacing: '-2px' }}>
                  {balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            {/* Simulated Chart & Mini Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
              <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', height: '250px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h3 className="mono" style={{ fontSize: '0.9rem', color: '#888' }}>INFINITE FLOW</h3>
                  <div className="pulse-dot" style={{ background: 'var(--neon-purple)', boxShadow: '0 0 10px var(--neon-purple)' }}></div>
                </div>
                {/* CSS Bar Chart */}
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '100%', paddingBottom: '10px' }}>
                  {[40, 70, 30, 85, 50, 95, 60, 45, 80, 55].map((height, i) => (
                    <div key={i} style={{ flex: 1, background: `linear-gradient(0deg, rgba(0,229,255,0.1) 0%, ${height > 75 ? 'var(--neon-purple)' : 'var(--neon-cyan)'} 100%)`, height: `${height}%`, borderRadius: '4px', opacity: 0.9, transition: 'height 0.5s ease' }}></div>
                  ))}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateRows: '1fr 1fr', gap: '1rem' }}>
                <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', borderLeft: '3px solid var(--neon-cyan)' }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                     <ArrowDownLeft size={20} color="var(--neon-cyan)" />
                     <span className="mono" style={{ color: '#888', fontSize: '0.8rem' }}>INCOMING (24H)</span>
                   </div>
                   <div className="mono" style={{ fontSize: '2rem', color: '#fff' }}>+53,500.00</div>
                </div>
                <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', borderLeft: '3px solid var(--neon-purple)' }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                     <ArrowUpRight size={20} color="var(--neon-purple)" />
                     <span className="mono" style={{ color: '#888', fontSize: '0.8rem' }}>OUTGOING (24H)</span>
                   </div>
                   <div className="mono" style={{ fontSize: '2rem', color: '#fff' }}>-46,200.00</div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Terminal Actions & History */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            
            {/* Terminal Control Box */}
            <div className="glass-card" style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '10px' }}>
                <Cpu size={18} color="var(--neon-cyan)" />
                <h3 className="mono" style={{ fontSize: '1rem', color: '#fff', textTransform: 'uppercase', letterSpacing: '1px' }}>Operations</h3>
              </div>
              
              <form style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                  <label className="mono" style={{ fontSize: '0.75rem', color: '#888', marginBottom: '8px', display: 'block' }}>AMOUNT TO PROCESS</label>
                  <input 
                    type="number" 
                    placeholder="0.00" 
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    style={{ width: '100%', padding: '1rem', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '8px', fontSize: '1.5rem', fontFamily: 'var(--font-mono)', outline: 'none', transition: 'border-color 0.3s' }}
                    onFocus={(e) => e.target.style.borderColor = 'var(--neon-purple)'}
                    onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                  />
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <button onClick={(e) => handleTransaction(e, 'deposit')} className="btn-ghost" style={{ justifyContent: 'center', fontSize: '0.8rem', padding: '0.8rem', borderColor: 'var(--neon-cyan)', color: 'var(--neon-cyan)', borderRadius: '8px' }}>
                    <ArrowDownLeft size={16} /> DEPOSIT
                  </button>
                  <button onClick={(e) => handleTransaction(e, 'withdraw')} className="btn-ghost" style={{ justifyContent: 'center', fontSize: '0.8rem', padding: '0.8rem', borderColor: 'var(--neon-purple)', color: 'var(--neon-purple)', borderRadius: '8px' }}>
                    <ArrowUpRight size={16} /> WITHDRAW
                  </button>
                </div>
                <button onClick={(e) => handleTransaction(e, 'transfer')} className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '10px', borderRadius: '8px', background: 'linear-gradient(135deg, var(--neon-purple), var(--neon-cyan))', color: '#fff', border: 'none', boxShadow: '0 0 20px rgba(157,78,221,0.4)' }}>
                  <Send size={18} /> EXECUTE TRANSFER
                </button>
              </form>
            </div>

            {/* Live Ledger */}
            <div className="glass-card" style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}>
                <Database size={18} color="#fff" />
                <h3 className="mono" style={{ fontSize: '1rem', color: '#fff', textTransform: 'uppercase', letterSpacing: '1px' }}>Recent Ledger</h3>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', overflowY: 'auto', paddingRight: '5px' }}>
                {transactions.map(tx => (
                  <div key={tx.id} style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: '15px', alignItems: 'center', padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', borderLeft: `2px solid ${tx.amount > 0 ? 'var(--neon-cyan)' : 'var(--neon-purple)'}` }}>
                    <div>
                      {tx.amount > 0 ? <ArrowDownLeft size={16} color="var(--neon-cyan)" /> : <ArrowUpRight size={16} color="var(--neon-purple)" />}
                    </div>
                    <div>
                      <div className="mono" style={{ fontSize: '0.85rem', color: '#ccc' }}>{tx.hash}</div>
                      <div className="mono" style={{ fontSize: '0.7rem', color: '#666', marginTop: '2px' }}>{tx.date}</div>
                    </div>
                    <div className="mono" style={{ fontSize: '1rem', color: tx.amount > 0 ? 'var(--neon-cyan)' : 'var(--neon-purple)', fontWeight: '500' }}>
                      {tx.amount > 0 ? '+' : ''}{tx.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;
