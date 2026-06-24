import React, { useState, useEffect } from 'react';
import { ArrowUpRight, ArrowDownLeft, Activity, Wifi } from 'lucide-react';
import { API_BASE_URL } from '../../utils/api';

const Overview = () => {
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [ping, setPing] = useState(12);

  // Simulate network ping fluctuation
  useEffect(() => {
    const interval = setInterval(() => {
      setPing(Math.floor(Math.random() * 8) + 8);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const accountId = localStorage.getItem('accountId') || 1;
    // Fetch real account data
    fetch(`${API_BASE_URL}/api/accounts/${accountId}`)
      .then(res => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then(data => {
        setAccount(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching account:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Header Bar */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 300, margin: 0 }}>Portfolio <span style={{ fontWeight: 600 }}>Overview</span></h2>
          <p className="mono" style={{ color: '#888', fontSize: '0.85rem', marginTop: '4px' }}>Welcome back, {account ? account.name : 'User'}</p>
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

      {loading ? (
        <div className="mono" style={{ color: '#888', padding: '2rem', textAlign: 'center' }}>[ ESTABLISHING SECURE CONNECTION TO BACKEND... ]</div>
      ) : account ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Balance Card */}
          <div className="glass-card" style={{ padding: '3.5rem 3rem', position: 'relative', overflow: 'hidden', border: '1px solid rgba(157,78,221,0.2)', boxShadow: '0 20px 40px rgba(0,0,0,0.4), inset 0 0 40px rgba(157,78,221,0.05)' }}>
            <div style={{ position: 'absolute', top: 0, right: 0, width: '300px', height: '100%', background: 'linear-gradient(90deg, transparent, rgba(157,78,221,0.05))' }}></div>
            <h3 className="mono" style={{ fontSize: '1rem', color: '#aaa', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '2px' }}>Total Liquid Assets</h3>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '15px' }}>
              <span className="mono" style={{ fontSize: '2.5rem', color: 'rgba(255,255,255,0.3)' }}>{account.currency || 'USD'}</span>
              <span className="mono" style={{ fontSize: '5rem', fontWeight: 700, textShadow: '0 0 20px rgba(157,78,221,0.4)', lineHeight: 1, letterSpacing: '-2px' }}>
                {account.solde ? account.solde.toLocaleString('en-US', { minimumFractionDigits: 2 }) : '0.00'}
              </span>
            </div>
            <div className="mono" style={{ marginTop: '1.5rem', color: '#666', fontSize: '0.85rem' }}>ACCOUNT ID: {account.id}</div>
          </div>

          {/* Quick Stats Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', borderLeft: '3px solid var(--neon-cyan)' }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                 <ArrowDownLeft size={20} color="var(--neon-cyan)" />
                 <span className="mono" style={{ color: '#888', fontSize: '0.8rem' }}>LAST DEPOSIT</span>
               </div>
               <div className="mono" style={{ fontSize: '1.5rem', color: '#fff' }}>+ --.--</div>
            </div>
            <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', borderLeft: '3px solid var(--neon-purple)' }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                 <ArrowUpRight size={20} color="var(--neon-purple)" />
                 <span className="mono" style={{ color: '#888', fontSize: '0.8rem' }}>LAST WITHDRAWAL</span>
               </div>
               <div className="mono" style={{ fontSize: '1.5rem', color: '#fff' }}>- --.--</div>
            </div>
          </div>
        </div>
      ) : (
        <div className="mono" style={{ color: 'var(--neon-red)', padding: '2rem' }}>[ ERROR: FAILED TO FETCH ACCOUNT DATA. BACKEND MAY BE OFFLINE. ]</div>
      )}
    </div>
  );
};

export default Overview;
