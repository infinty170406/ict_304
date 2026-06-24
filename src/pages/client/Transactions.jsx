import React, { useState, useEffect } from 'react';
import { Database, ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { API_BASE_URL } from '../../utils/api';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const accountId = localStorage.getItem('accountId') || 1;
    fetch(`${API_BASE_URL}/api/transactions/account/${accountId}`)
      .then(res => res.json())
      .then(data => {
        // Sort by date descending if the API doesn't do it
        const sorted = data.sort((a, b) => new Date(b.date) - new Date(a.date));
        setTransactions(sorted);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching transactions:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      <header style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '1rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 300, margin: 0 }}>Transaction <span style={{ fontWeight: 600 }}>History</span></h2>
        <p className="mono" style={{ color: '#888', fontSize: '0.85rem', marginTop: '4px' }}>Live Ledger for Account ID: 1</p>
      </header>

      <div className="glass-card" style={{ padding: '2rem', flex: 1, display: 'flex', flexDirection: 'column', minHeight: '60vh' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '2rem' }}>
          <Database size={20} color="#fff" />
          <h3 className="mono" style={{ fontSize: '1.1rem', color: '#fff', textTransform: 'uppercase', letterSpacing: '1px' }}>Global Ledger</h3>
        </div>

        {loading ? (
          <div className="mono" style={{ color: '#888', textAlign: 'center', padding: '2rem' }}>[ FETCHING LEDGER DATA... ]</div>
        ) : transactions.length === 0 ? (
          <div className="mono" style={{ color: '#888', textAlign: 'center', padding: '2rem' }}>[ NO TRANSACTIONS FOUND ]</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {transactions.map((tx, idx) => {
              const currentAccountId = 1; // Hardcoded for now
              const isDeposit = tx.type === 'DEPOSIT' || (tx.type === 'TRANSFER' && tx.destinationAccountId === currentAccountId);
              const color = isDeposit ? 'var(--neon-cyan)' : 'var(--neon-purple)';
              return (
                <div key={tx.id || idx} style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: '20px', alignItems: 'center', padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', borderLeft: `3px solid ${color}` }}>
                  <div>
                    {isDeposit ? <ArrowDownLeft size={20} color={color} /> : <ArrowUpRight size={20} color={color} />}
                  </div>
                  <div>
                    <div className="mono" style={{ fontSize: '0.9rem', color: '#ccc', fontWeight: 'bold' }}>{tx.type}</div>
                    <div className="mono" style={{ fontSize: '0.8rem', color: '#888', marginTop: '4px' }}>{new Date(tx.date).toLocaleString()} | {tx.description}</div>
                  </div>
                  <div className="mono" style={{ fontSize: '1.2rem', color: color, fontWeight: '500' }}>
                    {isDeposit ? '+' : '-'}{Math.abs(tx.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Transactions;
