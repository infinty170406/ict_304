import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('LoginPage Component', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
    global.alert = vi.fn();
  });

  it('renders login page with form inputs', () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    expect(screen.getByText('AUTHENTIFICATION')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Entrez votre nom/i)).toBeInTheDocument();
  });

  it('navigates directly to /admin when admin role is selected and submitted', () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    const adminButton = screen.getByRole('button', { name: 'ADMIN' });
    fireEvent.click(adminButton);

    const nameInput = screen.getByPlaceholderText(/Entrez votre nom/i);
    fireEvent.change(nameInput, { target: { value: 'AdminUser' } });

    const submitBtn = screen.getByRole('button', { name: />_ INITIER GOD MODE/i });
    fireEvent.click(submitBtn);

    expect(mockNavigate).toHaveBeenCalledWith('/admin');
  });

  it('connects existing client and redirects to /client', async () => {
    // Mock successful fetch for existing account
    const mockAccounts = [{ id: 12, name: 'Skyfall' }];
    global.fetch = vi.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockAccounts),
      })
    );

    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    const nameInput = screen.getByPlaceholderText(/Entrez votre nom/i);
    fireEvent.change(nameInput, { target: { value: 'Skyfall' } });

    const submitBtn = screen.getByRole('button', { name: />_ ACCÉDER AUX ACTIFS/i });
    
    await act(async () => {
      fireEvent.click(submitBtn);
    });

    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(localStorage.getItem('accountId')).toBe('12');
    expect(mockNavigate).toHaveBeenCalledWith('/client');
  });

  it('automatically creates account if client does not exist', async () => {
    // Mock first fetch returning empty accounts, second fetch returning created account
    const mockAccounts = [];
    const mockCreatedAccount = { id: 45, name: 'NewUser' };
    
    global.fetch = vi.fn()
      .mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockAccounts),
        })
      )
      .mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockCreatedAccount),
        })
      );

    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    const nameInput = screen.getByPlaceholderText(/Entrez votre nom/i);
    fireEvent.change(nameInput, { target: { value: 'NewUser' } });

    const submitBtn = screen.getByRole('button', { name: />_ ACCÉDER AUX ACTIFS/i });

    await act(async () => {
      fireEvent.click(submitBtn);
    });

    expect(global.fetch).toHaveBeenCalledTimes(2);
    expect(localStorage.getItem('accountId')).toBe('45');
    expect(mockNavigate).toHaveBeenCalledWith('/client');
  });

  it('shows alert message on server / connection error', async () => {
    global.fetch = vi.fn().mockImplementation(() =>
      Promise.reject(new Error('Network failure'))
    );

    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    const nameInput = screen.getByPlaceholderText(/Entrez votre nom/i);
    fireEvent.change(nameInput, { target: { value: 'Skyfall' } });

    const submitBtn = screen.getByRole('button', { name: />_ ACCÉDER AUX ACTIFS/i });

    await act(async () => {
      fireEvent.click(submitBtn);
    });

    expect(global.alert).toHaveBeenCalledWith('Erreur de connexion au serveur !');
  });
});
