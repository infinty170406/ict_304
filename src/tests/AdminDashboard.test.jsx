import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import React from 'react';
import AdminDashboard from '../pages/AdminDashboard';

describe('AdminDashboard Component', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('fetches accounts and displays stats', async () => {
    const mockAccounts = [
      { id: 1, name: 'Alice', solde: 5000 },
      { id: 2, name: 'Bob', solde: 3000 }
    ];

    global.fetch = vi.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockAccounts)
      })
    );

    await act(async () => {
      render(<AdminDashboard />);
    });

    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(screen.getByText('$ 8,000.00')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('handles backend connection failure gracefully', async () => {
    global.fetch = vi.fn().mockImplementation(() =>
      Promise.reject(new Error('Database Down'))
    );

    await act(async () => {
      render(<AdminDashboard />);
    });

    expect(screen.getAllByText('Loading...').length).toBeGreaterThan(0);
  });

  it('interacts with the simulated terminal console', async () => {
    const mockAccounts = [
      { id: 1, name: 'Alice', solde: 5000, currency: 'USD' }
    ];

    global.fetch = vi.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockAccounts)
      })
    );

    await act(async () => {
      render(<AdminDashboard />);
    });

    const input = screen.getByRole('textbox');
    
    // Test help command
    fireEvent.change(input, { target: { value: 'help' } });
    fireEvent.submit(input.closest('form'));

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(screen.getByText(/Available commands:/)).toBeInTheDocument();

    // Test accounts command
    fireEvent.change(input, { target: { value: 'accounts' } });
    fireEvent.submit(input.closest('form'));

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(screen.getByText(/Alice — USD/)).toBeInTheDocument();

    // Test diagnostics command
    fireEvent.change(input, { target: { value: 'diagnostics' } });
    fireEvent.submit(input.closest('form'));

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(screen.getByText(/Executing Infinite Diagnostic Suite/)).toBeInTheDocument();

    // Test clear command
    fireEvent.change(input, { target: { value: 'clear' } });
    fireEvent.submit(input.closest('form'));

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(screen.queryByText(/Available commands:/)).not.toBeInTheDocument();

    // Test invalid command
    fireEvent.change(input, { target: { value: 'invalid' } });
    fireEvent.submit(input.closest('form'));

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(screen.getByText(/command not found/)).toBeInTheDocument();
  });

  it('displays warning when no accounts are found on accounts terminal command', async () => {
    global.fetch = vi.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([])
      })
    );

    render(<AdminDashboard />);

    await act(async () => {
      await Promise.resolve();
    });

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'accounts' } });
    fireEvent.submit(input.closest('form'));

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(screen.getByText('No accounts found.')).toBeInTheDocument();
  });
});
