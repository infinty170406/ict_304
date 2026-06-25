import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import ClientLayout from '../components/ClientLayout';

// Mock react-router-dom useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('ClientLayout Component', () => {
  it('renders side bar and content area', () => {
    render(
      <MemoryRouter initialEntries={['/client']}>
        <Routes>
          <Route path="/client" element={<ClientLayout />}>
            <Route index element={<div>Client Content Mock</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    // Verify title and version info
    expect(screen.getByText(/Infinite/i)).toBeInTheDocument();
    expect(screen.getByText(/CLIENT INTERFACE v2.0/i)).toBeInTheDocument();

    // Verify links
    expect(screen.getByText(/Overview/i)).toBeInTheDocument();
    expect(screen.getByText(/Transactions/i)).toBeInTheDocument();
    expect(screen.getByText(/Operations/i)).toBeInTheDocument();

    // Verify sub-route content is rendered
    expect(screen.getByText('Client Content Mock')).toBeInTheDocument();
  });

  it('navigates to / when Disconnect is clicked', () => {
    render(
      <MemoryRouter initialEntries={['/client']}>
        <Routes>
          <Route path="/client" element={<ClientLayout />} />
        </Routes>
      </MemoryRouter>
    );

    const disconnectBtn = screen.getByText(/Disconnect/i);
    fireEvent.click(disconnectBtn);

    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('covers all active link path checks', () => {
    render(
      <MemoryRouter initialEntries={['/client/transactions']}>
        <Routes>
          <Route path="/client" element={<ClientLayout />}>
            <Route path="transactions" element={<div>Transactions</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    render(
      <MemoryRouter initialEntries={['/client/operations']}>
        <Routes>
          <Route path="/client" element={<ClientLayout />}>
            <Route path="operations" element={<div>Operations</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    render(
      <MemoryRouter initialEntries={['/client/settings']}>
        <Routes>
          <Route path="/client" element={<ClientLayout />}>
            <Route path="settings" element={<div>Settings</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );
  });
});
