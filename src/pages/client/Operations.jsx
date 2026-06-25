import React, { useState } from 'react';
import { Send, ArrowDownLeft, ArrowUpRight, Cpu } from 'lucide-react';
import { API_BASE_URL } from '../../utils/api';

const Operations = () => {
  const [activeTab, setActiveTab] = useState('deposit');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [destAccountId, setDestAccountId] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const executeOperation = async () => {
    setLoading(true);
    setMessage('');

    let url = '';
    const currentAccountId = localStorage.getItem('accountId') || 1;
    let payload = {
      accountId: Number(currentAccountId),
      amount: parseFloat(amount),
      description: description || 'No description'
    };

    if (activeTab === 'deposit') url = `${API_BASE_URL}/api/accounts/deposit`;
    else if (activeTab === 'withdraw') url = `${API_BASE_URL}/api/accounts/withdraw`;
    else if (activeTab === 'transfer') {
      url = `${API_BASE_URL}/api/accounts/transfer`;
      payload = {
        sourceAccountId: Number(currentAccountId),
        destinationAccountId: parseInt(destAccountId),
        amount: parseFloat(amount),
        description: description || 'Transfer'
      };
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        setMessage(`[SUCCESS] ${activeTab.toUpperCase()} COMPLETED SUCESSFULLY.`);
        setAmount('');
        setDescription('');
        setDestAccountId('');
      } else {
        const errorText = await response.text();
        setMessage(`[ERROR] OPERATION FAILED: ${errorText || response.statusText}`);
      }
    } catch (err) {
      setMessage(`[ERROR] NETWORK EXCEPTION: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

      <header style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '1rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 300, margin: 0 }}>Command <span style={{ fontWeight: 600 }}>Center</span></h2>
        <p className="mono" style={{ color: '#888', fontSize: '0.85rem', marginTop: '4px' }}>Execute financial operations securely</p>
      </header>

      <div className="glass-card" style={{ padding: '3rem', maxWidth: '800px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '2rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '10px' }}>
          <Cpu size={20} color="var(--neon-cyan)" />
          <h3 className="mono" style={{ fontSize: '1.2rem', color: '#fff', textTransform: 'uppercase', letterSpacing: '1px' }}>Operation Console</h3>
        </div>

        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem' }}>
          <button
            onClick={() => { setActiveTab('deposit'); setMessage(''); }}
            className="btn-ghost"
            style={{
              borderColor: activeTab === 'deposit' ? 'var(--neon-cyan)' : 'transparent',
              color: activeTab === 'deposit' ? 'var(--neon-cyan)' : '#888',
              background: activeTab === 'deposit' ? 'rgba(0, 255, 255, 0.1)' : 'transparent',
              flex: 1,
              justifyContent: 'center'
            }}
          >
            <ArrowDownLeft size={18} /> Deposit
          </button>
          <button
            onClick={() => { setActiveTab('withdraw'); setMessage(''); }}
            className="btn-ghost"
            style={{
              borderColor: activeTab === 'withdraw' ? 'var(--neon-purple)' : 'transparent',
              color: activeTab === 'withdraw' ? 'var(--neon-purple)' : '#888',
              background: activeTab === 'withdraw' ? 'rgba(176, 38, 255, 0.1)' : 'transparent',
              flex: 1,
              justifyContent: 'center'
            }}
          >
            <ArrowUpRight size={18} /> Withdraw
          </button>
          <button
            onClick={() => { setActiveTab('transfer'); setMessage(''); }}
            className="btn-ghost"
            style={{
              borderColor: activeTab === 'transfer' ? '#fff' : 'transparent',
              color: activeTab === 'transfer' ? '#fff' : '#888',
              background: activeTab === 'transfer' ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
              flex: 1,
              justifyContent: 'center'
            }}
          >
            <Send size={18} /> Transfer
          </button>
        </div>

        {message && (
          <div className="mono" style={{ marginBottom: '2rem', padding: '1rem', background: 'rgba(0,0,0,0.5)', borderLeft: message.includes('SUCCESS') ? '3px solid var(--neon-cyan)' : '3px solid var(--neon-red)', color: message.includes('SUCCESS') ? 'var(--neon-cyan)' : 'var(--neon-red)' }}>
            {message}
          </div>
        )}

        <form style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }} onSubmit={(e) => { e.preventDefault(); executeOperation(); }}>

          {activeTab === 'transfer' && (
            <div>
              <label className="mono" style={{ fontSize: '0.8rem', color: '#888', marginBottom: '8px', display: 'block' }}>RECIPIENT ACCOUNT ID</label>
              <input
                type="number"
                placeholder="e.g. 2 (Account Number)"
                value={destAccountId}
                onChange={(e) => setDestAccountId(e.target.value)}
                required={activeTab === 'transfer'}
                style={{ width: '100%', padding: '1rem', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '8px', fontSize: '1.2rem', fontFamily: 'var(--font-mono)', outline: 'none' }}
              />
            </div>
          )}

          <div>
            <label className="mono" style={{ fontSize: '0.8rem', color: '#888', marginBottom: '8px', display: 'block' }}>AMOUNT (USD)</label>
            <input
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              style={{ width: '100%', padding: '1rem', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '8px', fontSize: '1.2rem', fontFamily: 'var(--font-mono)', outline: 'none' }}
            />
          </div>

          <div>
            <label className="mono" style={{ fontSize: '0.8rem', color: '#888', marginBottom: '8px', display: 'block' }}>DESCRIPTION / REFERENCE</label>
            <input
              type="text"
              placeholder={`e.g. ${activeTab === 'transfer' ? 'Transfer to John' : activeTab === 'deposit' ? 'Salary' : 'Rent'}`}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{ width: '100%', padding: '1rem', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '8px', fontSize: '1rem', fontFamily: 'var(--font-main)', outline: 'none' }}
            />
          </div>

          <button
            type="submit"
            disabled={loading || !amount || (activeTab === 'transfer' && !destAccountId)}
            className="btn-primary"
            style={{
              width: '100%',
              justifyContent: 'center',
              marginTop: '10px',
              background: activeTab === 'deposit' ? 'var(--neon-cyan)' : activeTab === 'withdraw' ? 'var(--neon-purple)' : 'linear-gradient(135deg, var(--neon-purple), var(--neon-cyan))',
              color: activeTab === 'transfer' ? '#fff' : '#000',
              border: 'none',
              fontWeight: 'bold'
            }}
          >
            {loading ? 'PROCESSING...' : activeTab === 'deposit' ? 'CONFIRM DEPOSIT' : activeTab === 'withdraw' ? 'CONFIRM WITHDRAWAL' : 'EXECUTE TRANSFER'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Operations;
