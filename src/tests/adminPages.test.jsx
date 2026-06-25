import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import React from 'react';
import Overview from '../pages/admin/Overview';
import Users from '../pages/admin/Users';
import Terminal from '../pages/admin/Terminal';
import Settings from '../pages/admin/Settings';

describe('Admin Pages Suite', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('Overview Component', () => {
    it('fetches and displays aggregate statistics', async () => {
      const mockAccounts = [
        { id: 1, name: 'User A', solde: 15000 },
        { id: 2, name: 'User B', solde: 5000 }
      ];

      global.fetch = vi.fn().mockImplementation(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockAccounts)
        })
      );

      await act(async () => {
        render(<Overview />);
      });

      expect(screen.getByText('$ 20,000.00')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument();
      expect(screen.getByText('US-East-1')).toBeInTheDocument();
    });

    it('handles overview network error gracefully', async () => {
      global.fetch = vi.fn().mockImplementation(() =>
        Promise.reject(new Error('Fetch failed'))
      );

      await act(async () => {
        render(<Overview />);
      });

      expect(screen.getByText('$ 0.00')).toBeInTheDocument();
    });
  });

  describe('Users Component', () => {
    it('fetches and displays account registry in a table', async () => {
      const mockAccounts = [
        { id: 1, name: 'User A', solde: 15000, currency: 'USD' }
      ];

      global.fetch = vi.fn().mockImplementation(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockAccounts)
        })
      );

      await act(async () => {
        render(<Users />);
      });

      expect(screen.getByText('User A')).toBeInTheDocument();
      expect(screen.getByText('15,000.00')).toBeInTheDocument();

      // Test hover effect
      const row = screen.getByText('User A').closest('tr');
      fireEvent.mouseOver(row);
      expect(row.style.background).toBe('rgba(255, 255, 255, 0.02)');
      fireEvent.mouseOut(row);
      expect(row.style.background).toBe('transparent');
    });

    it('shows empty registry message on empty list', async () => {
      global.fetch = vi.fn().mockImplementation(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve([])
        })
      );

      await act(async () => {
        render(<Users />);
      });

      expect(screen.getByText('[ NO ACCOUNTS FOUND IN DATABASE ]')).toBeInTheDocument();
    });

    it('handles registry load error', async () => {
      global.fetch = vi.fn().mockImplementation(() =>
        Promise.reject(new Error('Load failure'))
      );

      await act(async () => {
        render(<Users />);
      });

      expect(screen.getByText('[ NO ACCOUNTS FOUND IN DATABASE ]')).toBeInTheDocument();
    });
  });

  describe('Terminal Component', () => {
    it('executes diagnostics, tests, coverage, and help commands', () => {
      render(<Terminal />);
      const input = screen.getByRole('textbox');

      // help command
      fireEvent.change(input, { target: { value: 'help' } });
      fireEvent.submit(input.closest('form'));
      act(() => { vi.advanceTimersByTime(400); });
      expect(screen.getByText(/Available commands:/)).toBeInTheDocument();

      // diagnostics command
      fireEvent.change(input, { target: { value: 'diagnostics' } });
      fireEvent.submit(input.closest('form'));
      act(() => { vi.advanceTimersByTime(400); });
      expect(screen.getByText(/Executing Infinite Diagnostic Suite.../)).toBeInTheDocument();

      // coverage command
      fireEvent.change(input, { target: { value: 'coverage' } });
      fireEvent.submit(input.closest('form'));
      act(() => { vi.advanceTimersByTime(400); });
      expect(screen.getByText('LoginPage.jsx')).toBeInTheDocument();

      // tests command
      fireEvent.change(input, { target: { value: 'tests' } });
      fireEvent.submit(input.closest('form'));
      act(() => { vi.advanceTimersByTime(400); });
      expect(screen.getByText(/Executing JUnit 5 test suite/)).toBeInTheDocument();

      // clear command
      fireEvent.change(input, { target: { value: 'clear' } });
      fireEvent.submit(input.closest('form'));
      act(() => { vi.advanceTimersByTime(400); });
      expect(screen.queryByText(/Available commands:/)).not.toBeInTheDocument();

      // invalid command
      fireEvent.change(input, { target: { value: 'unknown' } });
      fireEvent.submit(input.closest('form'));
      act(() => { vi.advanceTimersByTime(400); });
      expect(screen.getByText(/bash: unknown: command not found/)).toBeInTheDocument();
    });
  });

  describe('Settings Component', () => {
    it('switches tabs and toggles preferences', () => {
      render(<Settings />);

      expect(screen.getByText('Maintenance Mode')).toBeInTheDocument();

      // Switch to security protocols
      const securityTab = screen.getByText('Security Protocols');
      fireEvent.click(securityTab);
      expect(screen.getByText(/Security protocols configuration/)).toBeInTheDocument();

      // Switch to API keys
      const apiTab = screen.getByText('API Keys');
      fireEvent.click(apiTab);
      expect(screen.getByText(/api settings/)).toBeInTheDocument();
    });
  });
});
