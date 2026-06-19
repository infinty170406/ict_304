import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ArrowLeftRight, CreditCard, Settings, LogOut } from 'lucide-react';

const ClientLayout = () => {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: 'radial-gradient(ellipse at top left, #100b20 0%, #050511 100%)', color: '#fff', overflow: 'hidden' }}>
      
      {/* Sidebar */}
      <aside style={{ width: '280px', background: 'rgba(0,0,0,0.4)', borderRight: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', backdropFilter: 'blur(10px)', zIndex: 50 }}>
        
        {/* Logo Area */}
        <div style={{ padding: '2rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <h1 style={{ fontSize: '1.5rem', margin: 0, fontWeight: 300, letterSpacing: '2px' }}>
            Infinite <span style={{ color: 'var(--neon-purple)', fontWeight: 600 }}>Bank</span>
          </h1>
          <p className="mono" style={{ fontSize: '0.75rem', color: '#888', marginTop: '8px' }}>CLIENT INTERFACE v2.0</p>
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1, padding: '2rem 1rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <p className="mono" style={{ fontSize: '0.7rem', color: '#666', marginBottom: '10px', paddingLeft: '1rem' }}>MAIN MENU</p>
          
          <NavLink 
            to="/client" 
            end
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: '15px', padding: '1rem', borderRadius: '8px',
              textDecoration: 'none', color: isActive ? '#fff' : '#888',
              background: isActive ? 'rgba(157,78,221,0.15)' : 'transparent',
              borderLeft: isActive ? '3px solid var(--neon-purple)' : '3px solid transparent',
              transition: 'all 0.3s ease'
            })}
          >
            <LayoutDashboard size={20} color={window.location.pathname === '/client' ? 'var(--neon-purple)' : '#888'} />
            <span className="mono" style={{ fontSize: '0.9rem' }}>Overview</span>
          </NavLink>

          <NavLink 
            to="/client/transactions" 
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: '15px', padding: '1rem', borderRadius: '8px',
              textDecoration: 'none', color: isActive ? '#fff' : '#888',
              background: isActive ? 'rgba(0,229,255,0.15)' : 'transparent',
              borderLeft: isActive ? '3px solid var(--neon-cyan)' : '3px solid transparent',
              transition: 'all 0.3s ease'
            })}
          >
            <ArrowLeftRight size={20} color={window.location.pathname.includes('/client/transactions') ? 'var(--neon-cyan)' : '#888'} />
            <span className="mono" style={{ fontSize: '0.9rem' }}>Transactions</span>
          </NavLink>

          <NavLink 
            to="/client/operations" 
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: '15px', padding: '1rem', borderRadius: '8px',
              textDecoration: 'none', color: isActive ? '#fff' : '#888',
              background: isActive ? 'rgba(0,255,136,0.15)' : 'transparent',
              borderLeft: isActive ? '3px solid var(--neon-green)' : '3px solid transparent',
              transition: 'all 0.3s ease'
            })}
          >
            <CreditCard size={20} color={window.location.pathname.includes('/client/operations') ? 'var(--neon-green)' : '#888'} />
            <span className="mono" style={{ fontSize: '0.9rem' }}>Operations</span>
          </NavLink>
        </nav>

        {/* Bottom Actions */}
        <div style={{ padding: '2rem 1rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <NavLink 
            to="/client/settings" 
            style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: '15px', padding: '1rem',
              color: isActive ? '#fff' : '#888', cursor: 'pointer', textDecoration: 'none',
              background: isActive ? 'rgba(255,255,255,0.05)' : 'transparent',
              borderRadius: '8px'
            })}
          >
            <Settings size={20} />
            <span className="mono" style={{ fontSize: '0.9rem' }}>Settings</span>
          </NavLink>
          <div onClick={() => navigate('/')} style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '1rem', color: 'var(--neon-red)', cursor: 'pointer' }}>
            <LogOut size={20} />
            <span className="mono" style={{ fontSize: '0.9rem' }}>Disconnect</span>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main style={{ flex: 1, position: 'relative', overflowY: 'auto' }}>
        {/* Background Ambient Orbs */}
        <div style={{ position: 'absolute', top: '-10%', left: '20%', width: '40vw', height: '40vw', background: 'radial-gradient(circle, rgba(157,78,221,0.08) 0%, rgba(0,0,0,0) 60%)', zIndex: 0, filter: 'blur(80px)', pointerEvents: 'none' }}></div>
        <div className="grid-overlay" style={{ opacity: 0.3 }}></div>

        {/* Outlet for nested routes */}
        <div style={{ position: 'relative', zIndex: 10, padding: '2rem 3rem', maxWidth: '1200px', margin: '0 auto' }}>
          <Outlet />
        </div>
      </main>

    </div>
  );
};

export default ClientLayout;
