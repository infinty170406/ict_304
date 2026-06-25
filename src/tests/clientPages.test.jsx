import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import React from 'react';
import Overview from '../pages/client/Overview';
import Transactions from '../pages/client/Transactions';
import Operations from '../pages/client/Operations';
import Settings from '../pages/client/Settings';

describe('Client Pages Suite', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.restoreAllMocks();
    localStorage.clear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('Overview Component', () => {
    it('fetches and displays account summary', async () => {
      const mockAccount = { id: 1, name: 'Alice', solde: 95000, currency: 'EUR' };
      const mockTransactions = [
        { id: 101, type: 'DEPOSIT', amount: 5000, date: '2026-06-25T01:00:00Z', description: 'Test Deposit' },
        { id: 102, type: 'WITHDRAWAL', amount: 2000, date: '2026-06-25T02:00:00Z', description: 'Test Withdrawal' }
      ];

      localStorage.setItem('accountId', '1');
      global.fetch = vi.fn().mockImplementation((url) => {
        if (url.includes('/api/accounts/')) {
          return Promise.resolve({ ok: true, json: () => Promise.resolve(mockAccount) });
        }
        if (url.includes('/api/transactions/')) {
          return Promise.resolve({ ok: true, json: () => Promise.resolve(mockTransactions) });
        }
        return Promise.reject(new Error('Unknown URL'));
      });

      await act(async () => {
        render(<Overview />);
      });

      expect(screen.getByText('95,000.00')).toBeInTheDocument();
      expect(screen.getByText('Welcome back, Alice')).toBeInTheDocument();
      expect(screen.getByText('+ 5,000.00')).toBeInTheDocument();
      expect(screen.getByText('- 2,000.00')).toBeInTheDocument();

      // Trigger latency timer
      act(() => {
        vi.advanceTimersByTime(2000);
      });
      expect(screen.getByText(/LATENCY:/)).toBeInTheDocument();
    });

    it('covers lowercase transaction types and edge cases', async () => {
      const mockAccount = { id: 1, name: 'Bob' }; // missing currency/solde
      const mockTransactions = [
        { id: 101, type: 'deposit', amount: 100, date: '2026-06-25T01:00:00Z', description: 'd' },
        { id: 102, type: 'withdrawal', amount: 50, date: '2026-06-25T02:00:00Z', description: 'w' }
      ];

      global.fetch = vi.fn().mockImplementation((url) => {
        if (url.includes('/api/accounts/')) {
          return Promise.resolve({ ok: true, json: () => Promise.resolve(mockAccount) });
        }
        if (url.includes('/api/transactions/')) {
          return Promise.resolve({ ok: true, json: () => Promise.resolve(mockTransactions) });
        }
        return Promise.reject(new Error('Unknown URL'));
      });

      // Mock random to cover ping logic < 12 and >= 12
      let randomCount = 0;
      vi.spyOn(Math, 'random').mockImplementation(() => {
        randomCount++;
        return randomCount % 2 === 0 ? 0.1 : 0.9; // will give ping 8 or 15
      });

      await act(async () => {
        render(<Overview />);
      });

      expect(screen.getByText('0.00')).toBeInTheDocument(); // default solde
      expect(screen.getByText('USD')).toBeInTheDocument(); // default currency

      // Advance timer to trigger ping >= 12 (0.9 random => 15 ping)
      await act(async () => {
        vi.advanceTimersByTime(2000);
      });
      expect(screen.getByText(/LATENCY:/).textContent.replace(/\s+/g, '')).toContain('15ms');

      // Advance timer to trigger ping < 12 (0.1 random => 8 ping)
      await act(async () => {
        vi.advanceTimersByTime(2000);
      });
      expect(screen.getByText(/LATENCY:/).textContent.replace(/\s+/g, '')).toContain('8ms');
    });

    it('handles non-array transaction response and failed res.ok', async () => {
      const mockAccount = { id: 1, name: 'Charlie', solde: 10 };
      global.fetch = vi.fn().mockImplementation((url) => {
        if (url.includes('/api/accounts/')) {
          return Promise.resolve({ ok: false, statusText: 'Bad Request' });
        }
        if (url.includes('/api/transactions/')) {
          return Promise.resolve({ ok: false, json: () => Promise.resolve(null) });
        }
        return Promise.reject(new Error('Unknown URL'));
      });

      await act(async () => {
        render(<Overview />);
      });

      // Should show the failed message
      expect(screen.getByText(/ERROR: FAILED TO FETCH ACCOUNT DATA/)).toBeInTheDocument();
    });

    it('displays error message on account fetch failure', async () => {
      global.fetch = vi.fn().mockImplementation(() =>
        Promise.reject(new Error('Backend error'))
      );

      await act(async () => {
        render(<Overview />);
      });

      expect(screen.getByText(/ERROR: FAILED TO FETCH ACCOUNT DATA/)).toBeInTheDocument();
    });
  });

  describe('Transactions Component', () => {
    it('fetches and lists transactions history', async () => {
      const mockTransactions = [
        { id: 101, type: 'DEPOSIT', amount: 300, date: '2026-06-25T01:00:00Z', description: 'Salary' }
      ];

      global.fetch = vi.fn().mockImplementation(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockTransactions)
        })
      );

      await act(async () => {
        render(<Transactions />);
      });

      expect(screen.getByText('DEPOSIT')).toBeInTheDocument();
      expect(screen.getByText(/Salary/)).toBeInTheDocument();
    });

    it('shows empty message when no transactions found', async () => {
      global.fetch = vi.fn().mockImplementation(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve([])
        })
      );

      await act(async () => {
        render(<Transactions />);
      });

      expect(screen.getByText('[ NO TRANSACTIONS FOUND ]')).toBeInTheDocument();
    });

    it('handles fetch exception in Transactions', async () => {
      global.fetch = vi.fn().mockImplementation(() =>
        Promise.reject(new Error('Failed to load transactions'))
      );

      await act(async () => {
        render(<Transactions />);
      });

      expect(screen.getByText('[ NO TRANSACTIONS FOUND ]')).toBeInTheDocument();
    });
  });

  describe('Operations Component', () => {
    it('renders tabs and processes operations', async () => {
      global.fetch = vi.fn().mockImplementation(() =>
        Promise.resolve({
          ok: true,
          text: () => Promise.resolve('Success')
        })
      );

      render(<Operations />);

      // Switch to Withdrawal tab
      const withdrawTab = screen.getByRole('button', { name: /Withdraw/i });
      fireEvent.click(withdrawTab);

      // Amount input
      const input = screen.getByPlaceholderText('0.00');
      fireEvent.change(input, { target: { value: '150' } });

      const submitBtn = screen.getByRole('button', { name: /CONFIRM WITHDRAWAL/i });
      
      await act(async () => {
        fireEvent.click(submitBtn);
      });

      expect(screen.getByText(/WITHDRAW COMPLETED SUCESSFULLY/)).toBeInTheDocument();
    });

    it('performs transfer operation', async () => {
      global.fetch = vi.fn().mockImplementation(() =>
        Promise.resolve({
          ok: true,
          text: () => Promise.resolve('Success')
        })
      );

      render(<Operations />);

      const transferTab = screen.getByRole('button', { name: /Transfer/i });
      fireEvent.click(transferTab);

      const destInput = screen.getByPlaceholderText(/e.g. 2/i);
      fireEvent.change(destInput, { target: { value: '4' } });

      const amountInput = screen.getByPlaceholderText('0.00');
      fireEvent.change(amountInput, { target: { value: '50' } });

      const submitBtn = screen.getByRole('button', { name: /EXECUTE TRANSFER/i });

      await act(async () => {
        fireEvent.click(submitBtn);
      });

      expect(screen.getByText(/TRANSFER COMPLETED SUCESSFULLY/)).toBeInTheDocument();
    });

    it('displays error on operation failure', async () => {
      global.fetch = vi.fn().mockImplementation(() =>
        Promise.resolve({
          ok: false,
          text: () => Promise.resolve('Insufficent Funds'),
          statusText: 'Bad Request'
        })
      );

      render(<Operations />);

      const input = screen.getByPlaceholderText('0.00');
      fireEvent.change(input, { target: { value: '100' } });

      const submitBtn = screen.getByRole('button', { name: /CONFIRM DEPOSIT/i });

      await act(async () => {
        fireEvent.click(submitBtn);
      });

      expect(screen.getByText(/OPERATION FAILED: Insufficent Funds/)).toBeInTheDocument();
    });

    it('handles operation failure with fallback to statusText', async () => {
      global.fetch = vi.fn().mockImplementation(() =>
        Promise.resolve({
          ok: false,
          text: () => Promise.resolve(''),
          statusText: 'Internal Error'
        })
      );

      render(<Operations />);

      const input = screen.getByPlaceholderText('0.00');
      fireEvent.change(input, { target: { value: '100' } });

      const submitBtn = screen.getByRole('button', { name: /CONFIRM DEPOSIT/i });

      await act(async () => {
        fireEvent.click(submitBtn);
      });

      expect(screen.getByText(/OPERATION FAILED: Internal Error/)).toBeInTheDocument();
    });

    it('handles network exceptions', async () => {
      global.fetch = vi.fn().mockImplementation(() =>
        Promise.reject(new Error('Connection timed out'))
      );

      render(<Operations />);

      const input = screen.getByPlaceholderText('0.00');
      fireEvent.change(input, { target: { value: '100' } });

      const submitBtn = screen.getByRole('button', { name: /CONFIRM DEPOSIT/i });

      await act(async () => {
        fireEvent.click(submitBtn);
      });

      expect(screen.getByText(/NETWORK EXCEPTION: Connection timed out/)).toBeInTheDocument();
    });
  });

  describe('Settings Component', () => {
    it('switches tabs and saves profile', async () => {
      const mockAccount = { id: 1, name: 'Skyfall', currency: 'USD' };
      global.fetch = vi.fn().mockImplementation(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockAccount)
        })
      );

      await act(async () => {
        render(<Settings />);
      });

      expect(screen.getByDisplayValue('Skyfall')).toBeInTheDocument();

      // Submit form
      const submitBtn = screen.getByRole('button', { name: /SAVE CHANGES/i });
      fireEvent.click(submitBtn);

      expect(screen.getByText('SAVING...')).toBeInTheDocument();

      act(() => {
        vi.advanceTimersByTime(800);
      });

      expect(screen.getByText('SAVED ✓')).toBeInTheDocument();

      // Switch to security tab
      const securityTab = screen.getByText('Security');
      fireEvent.click(securityTab);

      expect(screen.getAllByPlaceholderText('********').length).toBeGreaterThan(0);
      expect(screen.getByText('Two-Factor Authentication (2FA)')).toBeInTheDocument();

      // Switch to notifications and advanced
      const notifTab = screen.getByText('Notifications');
      fireEvent.click(notifTab);
      expect(screen.getByText(/Notification preferences/)).toBeInTheDocument();

      const advancedTab = screen.getByText('Advanced');
      fireEvent.click(advancedTab);
      expect(screen.getByText(/Advanced settings/)).toBeInTheDocument();
    });

    it('handles failed or non-ok response and exceptions', async () => {
      global.fetch = vi.fn()
        .mockImplementationOnce(() =>
          Promise.resolve({
            ok: false
          })
        )
        .mockImplementationOnce(() =>
          Promise.reject(new Error('Network Down'))
        );

      // Render for ok: false
      await act(async () => {
        render(<Settings />);
      });

      // Render for exception
      await act(async () => {
        render(<Settings />);
      });
    });
  });
});
