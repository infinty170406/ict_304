import React, { useState, useEffect } from 'react';
import { Globe, Users, Activity, Server, Database } from 'lucide-react';

const Overview = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalLiquidity: 0, totalUsers: 0 });

  useEffect(() => {
    fetch('/api/accounts')
      .then(res => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then(data => {
        setAccounts(data);
        const liquidity = data.reduce((sum, acc) => sum + (acc.soldeInitial || 0), 0);
        setStats({ totalLiquidity: liquidity, totalUsers: data.length });
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching accounts:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <header style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '1rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 300, margin: 0 }}>Global <span style={{ fontWeight: 600 }}>Overview</span></h2>
        <p className="mono" style={{ color: '#888', fontSize: '0.85rem', marginTop: '4px' }}>System health and aggregate metrics</p>
      </header>

      {loading ? (
        <div className="mono" style={{ color: '#888', padding: '2rem', textAlign: 'center' }}>[ FETCHING GLOBAL DATA FROM BACKEND... ]</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
            
            <div className="glass-card" style={{ padding: '2rem', borderTop: '2px solid var(--neon-cyan)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem', color: '#888' }}>
                <Globe size={20} color="var(--neon-cyan)" /> <span className="mono" style={{ fontSize: '0.9rem' }}>GLOBAL LIQUIDITY</span>
              </div>
              <div className="mono" style={{ fontSize: '2.5rem', fontWeight: 'bold', textShadow: '0 0 20px rgba(0,229,255,0.3)' }}>
                $ {stats.totalLiquidity.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>

            <div className="glass-card" style={{ padding: '2rem', borderTop: '2px solid var(--neon-purple)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem', color: '#888' }}>
                <Users size={20} color="var(--neon-purple)" /> <span className="mono" style={{ fontSize: '0.9rem' }}>ACTIVE IDENTITIES</span>
              </div>
              <div className="mono" style={{ fontSize: '2.5rem', fontWeight: 'bold', textShadow: '0 0 20px rgba(157,78,221,0.3)' }}>
                {stats.totalUsers.toLocaleString()}
              </div>
            </div>

            <div className="glass-card" style={{ padding: '2rem', borderTop: '2px solid #fff' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem', color: '#888' }}>
                <Activity size={20} color="#fff" /> <span className="mono" style={{ fontSize: '0.9rem' }}>SYSTEM LOAD</span>
              </div>
              <div className="mono" style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>Optimal</div>
            </div>
          </div>

          <div className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', border: '1px solid rgba(255,255,255,0.05)' }}>
            <h3 className="mono" style={{ color: '#fff', fontSize: '1rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '10px' }}>Active Nodes</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              {['US-East-1', 'EU-West-3', 'AP-South-1', 'SA-East-1'].map((node, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '8px' }}>
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
      )}
    </div>
  );
};

export default Overview;
