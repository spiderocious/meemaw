import { render, screen } from '@testing-library/react';
import { Delayed } from '../Delayed';

describe('Delayed', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  describe('until prop', () => {
    it('should hide children when until=false', () => {
      render(
        <Delayed until={false}>
          <div>Content</div>
        </Delayed>
      );

      expect(screen.queryByText('Content')).not.toBeInTheDocument();
    });

    it('should show children when until=true', () => {
      render(
        <Delayed until={true}>
          <div>Content</div>
        </Delayed>
      );

      expect(screen.getByText('Content')).toBeInTheDocument();
    });

    it('should update when until prop changes', () => {
      const { rerender } = render(
        <Delayed until={false}>
          <div>Content</div>
        </Delayed>
      );

      expect(screen.queryByText('Content')).not.toBeInTheDocument();

      rerender(
        <Delayed until={true}>
          <div>Content</div>
        </Delayed>
      );

      expect(screen.getByText('Content')).toBeInTheDocument();
    });

    it('should show fallback when until=false', () => {
      render(
        <Delayed until={false} fallback={<div>Loading...</div>}>
          <div>Content</div>
        </Delayed>
      );

      expect(screen.getByText('Loading...')).toBeInTheDocument();
      expect(screen.queryByText('Content')).not.toBeInTheDocument();
    });
  });

  describe('till prop with timeout (number)', () => {
    it('should delay rendering by milliseconds', async () => {
      const { rerender } = render(
        <Delayed till={1000}>
          <div>Delayed Content</div>
        </Delayed>
      );

      // Should not be visible initially
      expect(screen.queryByText('Delayed Content')).not.toBeInTheDocument();

      // Fast-forward time and trigger re-render
      jest.advanceTimersByTime(1000);
      rerender(
        <Delayed till={1000}>
          <div>Delayed Content</div>
        </Delayed>
      );

      // Should be visible now
      expect(screen.getByText('Delayed Content')).toBeInTheDocument();
    });

    it('should show fallback during delay', () => {
      const { rerender } = render(
        <Delayed till={500} fallback={<div>Waiting...</div>}>
          <div>Content</div>
        </Delayed>
      );

      expect(screen.getByText('Waiting...')).toBeInTheDocument();

      jest.advanceTimersByTime(500);
      rerender(
        <Delayed till={500} fallback={<div>Waiting...</div>}>
          <div>Content</div>
        </Delayed>
      );

      expect(screen.getByText('Content')).toBeInTheDocument();
      expect(screen.queryByText('Waiting...')).not.toBeInTheDocument();
    });

    it('should handle zero delay', () => {
      render(
        <Delayed till={0}>
          <div>Immediate</div>
        </Delayed>
      );

      expect(screen.getByText('Immediate')).toBeInTheDocument();
    });
  });

  describe('till prop with Date', () => {
    it('should delay until specific date', () => {
      const futureDate = new Date(Date.now() + 2000);

      const { rerender } = render(
        <Delayed till={futureDate}>
          <div>Future Content</div>
        </Delayed>
      );

      expect(screen.queryByText('Future Content')).not.toBeInTheDocument();

      jest.advanceTimersByTime(2000);
      rerender(
        <Delayed till={futureDate}>
          <div>Future Content</div>
        </Delayed>
      );

      expect(screen.getByText('Future Content')).toBeInTheDocument();
    });

    it('should show immediately if date is in the past', () => {
      const pastDate = new Date(Date.now() - 1000);

      render(
        <Delayed till={pastDate}>
          <div>Past Content</div>
        </Delayed>
      );

      expect(screen.getByText('Past Content')).toBeInTheDocument();
    });
  });

  describe('no props (immediate show)', () => {
    it('should show children immediately when no props', () => {
      render(
        <Delayed>
          <div>Immediate Content</div>
        </Delayed>
      );

      expect(screen.getByText('Immediate Content')).toBeInTheDocument();
    });
  });

  describe('cleanup', () => {
    it('should cleanup timer on unmount', () => {
      const { unmount } = render(
        <Delayed till={1000}>
          <div>Content</div>
        </Delayed>
      );

      const timerCount = jest.getTimerCount();
      expect(timerCount).toBeGreaterThan(0);

      unmount();

      // Timer should be cleared
      expect(jest.getTimerCount()).toBe(0);
    });
  });
});
