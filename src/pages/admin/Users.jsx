import React, { useState, useEffect } from 'react';
import { Users as UsersIcon, Shield } from 'lucide-react';
import { API_BASE_URL } from '../../utils/api';

const Users = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/accounts`)
      .then(res => res.json())
      .then(data => {
        setAccounts(data);
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
        <h2 style={{ fontSize: '1.5rem', fontWeight: 300, margin: 0 }}>User <span style={{ fontWeight: 600 }}>Management</span></h2>
        <p className="mono" style={{ color: '#888', fontSize: '0.85rem', marginTop: '4px' }}>Global registry of all active accounts</p>
      </header>

      <div className="glass-card" style={{ padding: '2rem', flex: 1, display: 'flex', flexDirection: 'column', minHeight: '60vh' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '2rem' }}>
          <UsersIcon size={20} color="#fff" />
          <h3 className="mono" style={{ fontSize: '1.1rem', color: '#fff', textTransform: 'uppercase', letterSpacing: '1px' }}>Account Database</h3>
        </div>

        {loading ? (
          <div className="mono" style={{ color: '#888', textAlign: 'center', padding: '2rem' }}>[ FETCHING ACCOUNT REGISTRY... ]</div>
        ) : accounts.length === 0 ? (
          <div className="mono" style={{ color: '#888', textAlign: 'center', padding: '2rem' }}>[ NO ACCOUNTS FOUND IN DATABASE ]</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr className="mono" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', color: 'var(--neon-purple)', fontSize: '0.85rem' }}>
                  <th style={{ padding: '12px 16px' }}>ID</th>
                  <th style={{ padding: '12px 16px' }}>NAME</th>
                  <th style={{ padding: '12px 16px' }}>CURRENCY</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right' }}>BALANCE</th>
                  <th style={{ padding: '12px 16px', textAlign: 'center' }}>STATUS</th>
                </tr>
              </thead>
              <tbody>
                {accounts.map((acc, idx) => (
                  <tr key={acc.id || idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', transition: 'background 0.3s' }} onMouseOver={(e) => e.currentTarget.style.background='rgba(255,255,255,0.02)'} onMouseOut={(e) => e.currentTarget.style.background='transparent'}>
                    <td className="mono" style={{ padding: '16px', color: '#888' }}>{acc.id}</td>
                    <td style={{ padding: '16px', fontWeight: 500 }}>{acc.name}</td>
                    <td className="mono" style={{ padding: '16px', color: '#aaa' }}>{acc.currency || 'USD'}</td>
                    <td className="mono" style={{ padding: '16px', textAlign: 'right', color: 'var(--neon-cyan)', fontWeight: 'bold' }}>
                      {acc.solde != null ? Number(acc.solde).toLocaleString('en-US', { minimumFractionDigits: 2 }) : '0.00'}
                    </td>
                    <td style={{ padding: '16px', textAlign: 'center' }}>
                      <span className="mono" style={{ background: 'rgba(0,255,136,0.1)', color: 'var(--neon-green)', padding: '4px 10px', borderRadius: '12px', fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                        <Shield size={12} /> ACTIVE
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Users;
