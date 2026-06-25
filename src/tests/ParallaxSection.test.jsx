import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import React from 'react';
import ParallaxSection, {
  GridOverlay,
  Scanlines,
  Vignette,
  DataTicker,
  SectionProgress,
  PulseDot,
  DataGauge,
  AnimatedCount
} from '../components/ParallaxSection';

// Mock IntersectionObserver
class MockIntersectionObserver {
  constructor(callback) {
    this.callback = callback;
  }
  observe(element) {
    // Immediately trigger intersection
    this.callback([{ isIntersecting: true }]);
  }
  unobserve() {}
  disconnect() {}
}
global.IntersectionObserver = MockIntersectionObserver;

describe('ParallaxSection Components', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('renders overlays and static components correctly', () => {
    render(<GridOverlay />);
    render(<Scanlines />);
    render(<Vignette />);
    render(<DataTicker />);
    render(<PulseDot />);
    render(<SectionProgress progress={0.5} />);

    expect(screen.getByText(/TPS:/)).toBeInTheDocument();
  });

  it('renders DataGauge correctly', () => {
    render(<DataGauge label="Test Gauge" value={75} max={100} unit="%" color="cyan" />);
    expect(screen.getByText('Test Gauge')).toBeInTheDocument();
    expect(screen.getByText('75%')).toBeInTheDocument();
  });

  it('renders AnimatedCount and counts up to target', () => {
    render(<AnimatedCount target={100} prefix="$" suffix="!" color="cyan" />);
    
    // Fast-forward timers to complete the animation
    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(screen.getByText('$100!')).toBeInTheDocument();
  });

  it('renders ParallaxSection with children and responds to scroll/mouse events', () => {
    let rafs = [];
    const mockRaf = vi.spyOn(window, 'requestAnimationFrame').mockImplementation(cb => {
      rafs.push(cb);
      return rafs.length;
    });
    const mockCaf = vi.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => {});

    const flushRafs = () => {
      const current = [...rafs];
      rafs.length = 0;
      current.forEach(cb => cb());
    };

    // Mock getBoundingClientRect
    const originalGetBoundingClientRect = HTMLElement.prototype.getBoundingClientRect;
    HTMLElement.prototype.getBoundingClientRect = () => ({
      top: -100,
      left: 0,
      width: 1000,
      height: 1000,
      bottom: 900,
      right: 1000,
    });

    render(
      <ParallaxSection id="test-parallax" videoSrc="/test.mp4" showScrollHint={true} trackMouse={true}>
        {(progress) => <div data-testid="parallax-child">Progress: {progress.toFixed(2)}</div>}
      </ParallaxSection>
    );

    // Run the animation frame loop once
    act(() => {
      flushRafs();
    });

    // Verify children rendering
    expect(screen.getByTestId('parallax-child')).toBeInTheDocument();
    expect(screen.getByText(/SCROLL/)).toBeInTheDocument();

    // Trigger mousemove
    act(() => {
      const event = new MouseEvent('mousemove', { clientX: 200, clientY: 300 });
      window.dispatchEvent(event);
    });

    // Run the mousemove callback
    act(() => {
      flushRafs();
    });

    // Restore proto method and mocks
    HTMLElement.prototype.getBoundingClientRect = originalGetBoundingClientRect;
    mockRaf.mockRestore();
    mockCaf.mockRestore();
  });
});
