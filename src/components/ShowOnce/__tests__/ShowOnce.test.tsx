import { render, screen } from '@testing-library/react';
import { ShowOnce } from '../ShowOnce';

describe('ShowOnce', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    localStorage.clear();
    sessionStorage.clear();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  describe('duration-based visibility', () => {
    it('should hide after specified duration', () => {
      const { rerender } = render(
        <ShowOnce for={1000}>
          <div>Temporary Message</div>
        </ShowOnce>
      );

      expect(screen.getByText('Temporary Message')).toBeInTheDocument();

      jest.advanceTimersByTime(1000);

      // Force re-render to see state change
      rerender(
        <ShowOnce for={1000}>
          <div>Temporary Message</div>
        </ShowOnce>
      );

      expect(screen.queryByText('Temporary Message')).not.toBeInTheDocument();
    });

    it('should stay visible without duration', () => {
      render(
        <ShowOnce>
          <div>Permanent Message</div>
        </ShowOnce>
      );

      jest.advanceTimersByTime(10000);

      expect(screen.getByText('Permanent Message')).toBeInTheDocument();
    });
  });

  describe('persistence with localStorage', () => {
    it('should persist shown state in localStorage', () => {
      const { unmount } = render(
        <ShowOnce for={500} persist={true} persistKey="test-key">
          <div>Persisted Message</div>
        </ShowOnce>
      );

      jest.advanceTimersByTime(500);
      unmount();

      // Check localStorage
      expect(localStorage.getItem('meemaw_showonce_test-key')).toBe('true');

      // Render again - should not show
      render(
        <ShowOnce persist={true} persistKey="test-key">
          <div>Persisted Message</div>
        </ShowOnce>
      );

      expect(screen.queryByText('Persisted Message')).not.toBeInTheDocument();
    });

    it('should not show if already shown (localStorage)', () => {
      localStorage.setItem('meemaw_showonce_existing-key', 'true');

      render(
        <ShowOnce persist={true} persistKey="existing-key">
          <div>Should Not Show</div>
        </ShowOnce>
      );

      expect(screen.queryByText('Should Not Show')).not.toBeInTheDocument();
    });
  });

  describe('persistence with sessionStorage', () => {
    it('should persist in sessionStorage', () => {
      const { unmount } = render(
        <ShowOnce for={500} persist={true} persistKey="session-key" persistType="session">
          <div>Session Message</div>
        </ShowOnce>
      );

      jest.advanceTimersByTime(500);
      unmount();

      expect(sessionStorage.getItem('meemaw_showonce_session-key')).toBe('true');
    });
  });

  describe('persistence with memory', () => {
    it('should persist in memory only', () => {
      const { unmount } = render(
        <ShowOnce for={500} persist={true} persistKey="memory-key" persistType="memory">
          <div>Memory Message</div>
        </ShowOnce>
      );

      jest.advanceTimersByTime(500);
      unmount();

      // Should not be in localStorage or sessionStorage
      expect(localStorage.getItem('meemaw_showonce_memory-key')).toBeNull();
      expect(sessionStorage.getItem('meemaw_showonce_memory-key')).toBeNull();

      // Render again - should not show (memory persists in this session)
      render(
        <ShowOnce persist={true} persistKey="memory-key" persistType="memory">
          <div>Memory Message</div>
        </ShowOnce>
      );

      expect(screen.queryByText('Memory Message')).not.toBeInTheDocument();
    });
  });

  describe('no persistence', () => {
    it('should show again when persist=false', () => {
      const { unmount } = render(
        <ShowOnce for={500} persist={false} persistKey="no-persist">
          <div>Non-Persisted</div>
        </ShowOnce>
      );

      jest.advanceTimersByTime(500);
      unmount();

      // Render again - should show
      render(
        <ShowOnce persist={false} persistKey="no-persist">
          <div>Non-Persisted</div>
        </ShowOnce>
      );

      expect(screen.getByText('Non-Persisted')).toBeInTheDocument();
    });
  });

  describe('auto-generated keys', () => {
    it('should generate unique key when no persistKey provided', () => {
      render(
        <ShowOnce persist={true} for={100}>
          <div>Auto Key</div>
        </ShowOnce>
      );

      jest.advanceTimersByTime(100);

      // Should have created a key in localStorage
      const keys = Object.keys(localStorage);
      const showOnceKeys = keys.filter((k) => k.startsWith('meemaw_showonce_'));
      expect(showOnceKeys.length).toBeGreaterThan(0);
    });
  });
});
