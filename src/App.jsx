import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';

import ClientLayout from './components/ClientLayout';
import ClientOverview from './pages/client/Overview';
import ClientTransactions from './pages/client/Transactions';
import ClientOperations from './pages/client/Operations';
import ClientSettings from './pages/client/Settings';

import AdminLayout from './components/AdminLayout';
import AdminOverview from './pages/admin/Overview';
import AdminUsers from './pages/admin/Users';
import AdminTerminal from './pages/admin/Terminal';
import AdminSettings from './pages/admin/Settings';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        
        {/* Client Multi-Page Dashboard */}
        <Route path="/client" element={<ClientLayout />}>
          <Route index element={<ClientOverview />} />
          <Route path="transactions" element={<ClientTransactions />} />
          <Route path="operations" element={<ClientOperations />} />
          <Route path="settings" element={<ClientSettings />} />
        </Route>

        {/* Admin Multi-Page Dashboard */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminOverview />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="terminal" element={<AdminTerminal />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
        
        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
