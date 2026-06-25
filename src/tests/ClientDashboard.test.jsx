import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import React from 'react';
import ClientDashboard from '../pages/ClientDashboard';

describe('ClientDashboard Component', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.restoreAllMocks();
    global.alert = vi.fn();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders stats, balance, and ledger correctly', () => {
    render(<ClientDashboard />);
    expect(screen.getByText('Portfolio Balance')).toBeInTheDocument();
    // Default initial balance is 14,028,492
    expect(screen.getByText('14,028,492.00')).toBeInTheDocument();
    // Live ledger checks
    expect(screen.getByText('Recent Ledger')).toBeInTheDocument();
    expect(screen.getByText('0x8f2a...4a2b')).toBeInTheDocument();
  });

  it('updates ping on interval tick', () => {
    render(<ClientDashboard />);
    // Advance timers by 2 seconds to trigger ping update
    act(() => {
      vi.advanceTimersByTime(2000);
    });
    expect(screen.getByText(/LATENCY:/)).toBeInTheDocument();
  });

  it('performs deposit successfully', () => {
    render(<ClientDashboard />);
    const amountInput = screen.getByPlaceholderText('0.00');
    
    // Deposit 1000
    fireEvent.change(amountInput, { target: { value: '1000' } });
    const depositBtn = screen.getByRole('button', { name: /DEPOSIT/i });
    
    fireEvent.click(depositBtn);
    expect(screen.getByText('14,029,492.00')).toBeInTheDocument();
    expect(amountInput.value).toBe('');
  });

  it('performs withdrawal successfully', () => {
    render(<ClientDashboard />);
    const amountInput = screen.getByPlaceholderText('0.00');

    // Withdraw 50000
    fireEvent.change(amountInput, { target: { value: '50000' } });
    const withdrawBtn = screen.getByRole('button', { name: /WITHDRAW/i });

    fireEvent.click(withdrawBtn);
    expect(screen.getByText('13,978,492.00')).toBeInTheDocument();
  });

  it('fails withdrawal / transfer if funds are insufficient', () => {
    render(<ClientDashboard />);
    const amountInput = screen.getByPlaceholderText('0.00');

    // Attempt to withdraw an excessive amount
    fireEvent.change(amountInput, { target: { value: '999999999' } });
    const withdrawBtn = screen.getByRole('button', { name: /WITHDRAW/i });

    fireEvent.click(withdrawBtn);
    expect(global.alert).toHaveBeenCalledWith('Fonds insuffisants / Insufficient funds');

    // Attempt to execute transfer
    const transferBtn = screen.getByRole('button', { name: /EXECUTE TRANSFER/i });
    fireEvent.click(transferBtn);
    expect(global.alert).toHaveBeenCalledTimes(2);
  });

  it('handles negative or invalid amount gracefully', () => {
    render(<ClientDashboard />);
    const amountInput = screen.getByPlaceholderText('0.00');

    // Try setting invalid amount
    fireEvent.change(amountInput, { target: { value: '-10' } });
    const depositBtn = screen.getByRole('button', { name: /DEPOSIT/i });
    fireEvent.click(depositBtn);

    // Balance should remain unchanged
    expect(screen.getByText('14,028,492.00')).toBeInTheDocument();
  });
});
