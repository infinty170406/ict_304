import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import LandingPage from '../pages/LandingPage';

// Mock react-router-dom useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock IntersectionObserver
class MockIntersectionObserver {
  constructor(callback) {
    this.callback = callback;
  }
  observe() {
    this.callback([{ isIntersecting: true }]);
  }
  unobserve() {}
  disconnect() {}
}
global.IntersectionObserver = MockIntersectionObserver;

describe('LandingPage Component', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('renders landing page sections and redirects on login click', () => {
    render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>
    );

    // Verify Title
    expect(screen.getAllByText(/INFINITE BANK/i).length).toBeGreaterThan(0);

    // Verify hover links
    const featuresLink = screen.getByText('Fonctionnalités');
    fireEvent.mouseEnter(featuresLink);
    expect(featuresLink.style.color).toBe('#fff');
    fireEvent.mouseLeave(featuresLink);
    expect(featuresLink.style.color).toBe('#666');

    // Verify Redirect on Connexion button
    const loginButton = screen.getByRole('button', { name: /Connexion/i });
    fireEvent.click(loginButton);
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  it('handles window scroll event', () => {
    render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>
    );

    // Trigger scroll event
    window.scrollY = 100;
    fireEvent.scroll(window);
  });
});
