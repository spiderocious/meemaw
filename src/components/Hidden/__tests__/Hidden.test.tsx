import { render, screen, act } from '@testing-library/react';
import { Hidden, BREAKPOINTS } from '../Hidden';

describe('Hidden', () => {
  describe('conditional hiding with "when" prop', () => {
    it('should hide children when "when" is true', () => {
      render(
        <Hidden when={true}>
          <div>Hidden content</div>
        </Hidden>
      );

      expect(screen.queryByText('Hidden content')).not.toBeInTheDocument();
    });

    it('should show children when "when" is false', () => {
      render(
        <Hidden when={false}>
          <div>Visible content</div>
        </Hidden>
      );

      expect(screen.getByText('Visible content')).toBeInTheDocument();
    });

    it('should show children when "when" is undefined', () => {
      render(
        <Hidden>
          <div>Default visible</div>
        </Hidden>
      );

      expect(screen.getByText('Default visible')).toBeInTheDocument();
    });
  });

  describe('conditional hiding with "if" prop (alias)', () => {
    it('should hide children when "if" is true', () => {
      render(
        <Hidden if={true}>
          <div>Hidden content</div>
        </Hidden>
      );

      expect(screen.queryByText('Hidden content')).not.toBeInTheDocument();
    });

    it('should show children when "if" is false', () => {
      render(
        <Hidden if={false}>
          <div>Visible content</div>
        </Hidden>
      );

      expect(screen.getByText('Visible content')).toBeInTheDocument();
    });

    it('should prioritize "when" over "if" when both are provided', () => {
      render(
        <Hidden when={false} if={true}>
          <div>Should be visible</div>
        </Hidden>
      );

      expect(screen.getByText('Should be visible')).toBeInTheDocument();
    });
  });

  describe('breakpoint-based hiding', () => {
    beforeEach(() => {
      // Reset window size
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1920,
      });
    });

    it('should hide on mobile breakpoint', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: BREAKPOINTS.mobile - 100, // Below mobile breakpoint
      });

      render(
        <Hidden on="mobile">
          <div>Hidden on mobile</div>
        </Hidden>
      );

      expect(screen.queryByText('Hidden on mobile')).not.toBeInTheDocument();
    });

    it('should hide on tablet breakpoint', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: BREAKPOINTS.mobile + 100, // Between mobile and tablet
      });

      render(
        <Hidden on="tablet">
          <div>Hidden on tablet</div>
        </Hidden>
      );

      expect(screen.queryByText('Hidden on tablet')).not.toBeInTheDocument();
    });

    it('should hide on desktop breakpoint', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: BREAKPOINTS.tablet + 100, // Above tablet breakpoint
      });

      render(
        <Hidden on="desktop">
          <div>Hidden on desktop</div>
        </Hidden>
      );

      expect(screen.queryByText('Hidden on desktop')).not.toBeInTheDocument();
    });

    it('should hide on multiple breakpoints', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: BREAKPOINTS.mobile - 100, // Mobile
      });

      render(
        <Hidden on={['mobile', 'tablet']}>
          <div>Hidden on mobile and tablet</div>
        </Hidden>
      );

      expect(screen.queryByText('Hidden on mobile and tablet')).not.toBeInTheDocument();
    });

    it('should show when not on specified breakpoint', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: BREAKPOINTS.tablet + 100, // Desktop
      });

      render(
        <Hidden on="mobile">
          <div>Visible on desktop</div>
        </Hidden>
      );

      expect(screen.getByText('Visible on desktop')).toBeInTheDocument();
    });
  });

  describe('combined conditions', () => {
    it('should hide when "when" is true OR on specified breakpoint', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: BREAKPOINTS.tablet + 100, // Desktop
      });

      render(
        <Hidden when={true} on="mobile">
          <div>Hidden by when condition</div>
        </Hidden>
      );

      expect(screen.queryByText('Hidden by when condition')).not.toBeInTheDocument();
    });

    it('should hide when "when" is false BUT on specified breakpoint', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: BREAKPOINTS.mobile - 100, // Mobile
      });

      render(
        <Hidden when={false} on="mobile">
          <div>Hidden by breakpoint</div>
        </Hidden>
      );

      expect(screen.queryByText('Hidden by breakpoint')).not.toBeInTheDocument();
    });

    it('should show when "when" is false AND not on specified breakpoint', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: BREAKPOINTS.tablet + 100, // Desktop
      });

      render(
        <Hidden when={false} on="mobile">
          <div>Visible on desktop</div>
        </Hidden>
      );

      expect(screen.getByText('Visible on desktop')).toBeInTheDocument();
    });
  });

  describe('resize event handling', () => {
    it('should update visibility when window is resized', async () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: BREAKPOINTS.tablet + 100, // Desktop
      });

      const { rerender } = render(
        <Hidden on="mobile">
          <div>Content</div>
        </Hidden>
      );

      expect(screen.getByText('Content')).toBeInTheDocument();

      // Simulate resize to mobile
      await act(async () => {
        Object.defineProperty(window, 'innerWidth', {
          writable: true,
          configurable: true,
          value: BREAKPOINTS.mobile - 100,
        });

        window.dispatchEvent(new Event('resize'));
      });

      rerender(
        <Hidden on="mobile">
          <div>Content</div>
        </Hidden>
      );

      // Content should now be hidden
      expect(screen.queryByText('Content')).not.toBeInTheDocument();
    });

    it('should clean up resize event listener on unmount', () => {
      const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');

      const { unmount } = render(
        <Hidden on="mobile">
          <div>Content</div>
        </Hidden>
      );

      unmount();

      expect(removeEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function));

      removeEventListenerSpy.mockRestore();
    });

    it('should not add resize listener when "on" prop is not provided', () => {
      const addEventListenerSpy = jest.spyOn(window, 'addEventListener');

      render(
        <Hidden when={false}>
          <div>Content</div>
        </Hidden>
      );

      expect(addEventListenerSpy).not.toHaveBeenCalledWith('resize', expect.any(Function));

      addEventListenerSpy.mockRestore();
    });
  });

  describe('exports', () => {
    it('should export BREAKPOINTS constant with correct values', () => {
      expect(BREAKPOINTS).toEqual({
        mobile: 768,
        tablet: 1024,
      });
    });

    it('should have BREAKPOINTS as readonly', () => {
      expect(Object.isFrozen(BREAKPOINTS)).toBe(false);
      // The "as const" makes it readonly at compile time, not runtime
      expect(BREAKPOINTS.mobile).toBe(768);
      expect(BREAKPOINTS.tablet).toBe(1024);
    });
  });
});
