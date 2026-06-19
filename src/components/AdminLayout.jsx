import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Terminal, Settings, LogOut, ShieldAlert } from 'lucide-react';

const AdminLayout = () => {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: 'radial-gradient(ellipse at bottom right, #100b20 0%, #050511 100%)', color: '#fff', overflow: 'hidden' }}>
      
      {/* Sidebar */}
      <aside style={{ width: '280px', background: 'rgba(0,0,0,0.5)', borderRight: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', backdropFilter: 'blur(15px)', zIndex: 50 }}>
        
        {/* Logo Area */}
        <div style={{ padding: '2rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <h1 style={{ fontSize: '1.5rem', margin: 0, fontWeight: 300, letterSpacing: '2px' }}>
            Infinite <span style={{ color: 'var(--neon-purple)', fontWeight: 600 }}>Bank</span>
          </h1>
          <p className="mono" style={{ fontSize: '0.75rem', color: '#888', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <ShieldAlert size={12} color="var(--neon-purple)" /> LEVEL 0 CLEARANCE
          </p>
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1, padding: '2rem 1rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <p className="mono" style={{ fontSize: '0.7rem', color: '#666', marginBottom: '10px', paddingLeft: '1rem' }}>SYSTEM SUPERVISION</p>
          
          <NavLink 
            to="/admin" 
            end
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: '15px', padding: '1rem', borderRadius: '8px',
              textDecoration: 'none', color: isActive ? '#fff' : '#888',
              background: isActive ? 'rgba(0,229,255,0.15)' : 'transparent',
              borderLeft: isActive ? '3px solid var(--neon-cyan)' : '3px solid transparent',
              transition: 'all 0.3s ease'
            })}
          >
            <LayoutDashboard size={20} color={window.location.pathname === '/admin' ? 'var(--neon-cyan)' : '#888'} />
            <span className="mono" style={{ fontSize: '0.9rem' }}>Global Overview</span>
          </NavLink>

          <NavLink 
            to="/admin/users" 
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: '15px', padding: '1rem', borderRadius: '8px',
              textDecoration: 'none', color: isActive ? '#fff' : '#888',
              background: isActive ? 'rgba(157,78,221,0.15)' : 'transparent',
              borderLeft: isActive ? '3px solid var(--neon-purple)' : '3px solid transparent',
              transition: 'all 0.3s ease'
            })}
          >
            <Users size={20} color={window.location.pathname.includes('/admin/users') ? 'var(--neon-purple)' : '#888'} />
            <span className="mono" style={{ fontSize: '0.9rem' }}>User Management</span>
          </NavLink>

          <NavLink 
            to="/admin/terminal" 
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: '15px', padding: '1rem', borderRadius: '8px',
              textDecoration: 'none', color: isActive ? '#fff' : '#888',
              background: isActive ? 'rgba(0,255,136,0.15)' : 'transparent',
              borderLeft: isActive ? '3px solid var(--neon-green)' : '3px solid transparent',
              transition: 'all 0.3s ease'
            })}
          >
            <Terminal size={20} color={window.location.pathname.includes('/admin/terminal') ? 'var(--neon-green)' : '#888'} />
            <span className="mono" style={{ fontSize: '0.9rem' }}>System Terminal</span>
          </NavLink>
        </nav>

        {/* Bottom Actions */}
        <div style={{ padding: '2rem 1rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <NavLink 
            to="/admin/settings" 
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
        <div style={{ position: 'absolute', top: '30%', left: '50%', transform: 'translate(-50%, -50%)', width: '60vw', height: '60vw', background: 'radial-gradient(circle, rgba(157,78,221,0.05) 0%, rgba(0,0,0,0) 60%)', zIndex: 0, filter: 'blur(100px)', pointerEvents: 'none' }}></div>
        <div className="grid-overlay" style={{ opacity: 0.2 }}></div>

        {/* Outlet for nested routes */}
        <div style={{ position: 'relative', zIndex: 10, padding: '2rem 3rem', maxWidth: '1400px', margin: '0 auto' }}>
          <Outlet />
        </div>
      </main>

    </div>
  );
};

export default AdminLayout;
