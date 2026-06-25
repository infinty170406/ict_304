import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import App from '../App';

describe('App Component', () => {
  it('renders without crashing', () => {
    render(<App />);
    // Simple verification to check if the Router mounts properly
    // It should render the LandingPage on the default route "/"
    expect(screen.getAllByText(/Infinite Bank/i).length).toBeGreaterThan(0);
  });
});
