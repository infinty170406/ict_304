import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';

// Mock react-router-dom useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('AdminLayout Component', () => {
  it('renders side bar and content area', () => {
    render(
      <MemoryRouter initialEntries={['/admin']}>
        <Routes>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<div>Admin Content Mock</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    // Verify title and clearance info
    expect(screen.getByText(/Infinite/i)).toBeInTheDocument();
    expect(screen.getByText(/LEVEL 0 CLEARANCE/i)).toBeInTheDocument();

    // Verify links
    expect(screen.getByText(/Global Overview/i)).toBeInTheDocument();
    expect(screen.getByText(/User Management/i)).toBeInTheDocument();
    expect(screen.getByText(/System Terminal/i)).toBeInTheDocument();

    // Verify sub-route content is rendered
    expect(screen.getByText('Admin Content Mock')).toBeInTheDocument();
  });

  it('navigates to / when Disconnect is clicked', () => {
    render(
      <MemoryRouter initialEntries={['/admin']}>
        <Routes>
          <Route path="/admin" element={<AdminLayout />} />
        </Routes>
      </MemoryRouter>
    );

    const disconnectBtn = screen.getByText(/Disconnect/i);
    fireEvent.click(disconnectBtn);

    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('covers all active link path checks', () => {
    render(
      <MemoryRouter initialEntries={['/admin/users']}>
        <Routes>
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="users" element={<div>Users</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    render(
      <MemoryRouter initialEntries={['/admin/terminal']}>
        <Routes>
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="terminal" element={<div>Terminal</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    render(
      <MemoryRouter initialEntries={['/admin/settings']}>
        <Routes>
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="settings" element={<div>Settings</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );
  });
});
