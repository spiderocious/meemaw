import { render, screen } from '@testing-library/react';
import { Loadable } from '../Loadable';

describe('Loadable', () => {
  describe('loading state', () => {
    it('should show default spinner when loading=true', () => {
      render(
        <Loadable loading={true}>
          <div>Content</div>
        </Loadable>
      );

      expect(screen.queryByText('Content')).not.toBeInTheDocument();
      // Default spinner should be present (checking by style attribute)
      const spinner = document.querySelector('div[style*="border-radius"]');
      expect(spinner).toBeInTheDocument();
    });

    it('should show custom loading component', () => {
      render(
        <Loadable loading={true} loadingComponent={<div>Custom Loading...</div>}>
          <div>Content</div>
        </Loadable>
      );

      expect(screen.getByText('Custom Loading...')).toBeInTheDocument();
      expect(screen.queryByText('Content')).not.toBeInTheDocument();
    });

    it('should not show loading when loading=false', () => {
      render(
        <Loadable loading={false}>
          <div>Content</div>
        </Loadable>
      );

      expect(screen.getByText('Content')).toBeInTheDocument();
    });
  });

  describe('error state', () => {
    it('should show default error when error=true', () => {
      render(
        <Loadable error={true}>
          <div>Content</div>
        </Loadable>
      );

      expect(screen.getByText(/Error:/)).toBeInTheDocument();
      expect(screen.getByText(/An error occurred/)).toBeInTheDocument();
      expect(screen.queryByText('Content')).not.toBeInTheDocument();
    });

    it('should show error message when error is string', () => {
      render(
        <Loadable error="Network request failed">
          <div>Content</div>
        </Loadable>
      );

      expect(screen.getByText(/Error:/)).toBeInTheDocument();
      expect(screen.getByText(/Network request failed/)).toBeInTheDocument();
      expect(screen.queryByText('Content')).not.toBeInTheDocument();
    });

    it('should show error message when error is Error object', () => {
      const error = new Error('Database connection failed');

      render(
        <Loadable error={error}>
          <div>Content</div>
        </Loadable>
      );

      expect(screen.getByText(/Error:/)).toBeInTheDocument();
      expect(screen.getByText(/Database connection failed/)).toBeInTheDocument();
      expect(screen.queryByText('Content')).not.toBeInTheDocument();
    });

    it('should show custom error component', () => {
      render(
        <Loadable error={true} errorComponent={<div>Custom Error UI</div>}>
          <div>Content</div>
        </Loadable>
      );

      expect(screen.getByText('Custom Error UI')).toBeInTheDocument();
      expect(screen.queryByText('Content')).not.toBeInTheDocument();
    });

    it('should pass error to error component function', () => {
      const errorFn = (error: Error | string) => <div>Error: {String(error)}</div>;

      render(
        <Loadable error="API Failed" errorComponent={errorFn}>
          <div>Content</div>
        </Loadable>
      );

      expect(screen.getByText('Error: API Failed')).toBeInTheDocument();
    });

    it('should not show error when error=false', () => {
      render(
        <Loadable error={false}>
          <div>Content</div>
        </Loadable>
      );

      expect(screen.getByText('Content')).toBeInTheDocument();
      expect(screen.queryByText(/Error:/)).not.toBeInTheDocument();
    });
  });

  describe('priority and state combinations', () => {
    it('should prioritize loading over error', () => {
      render(
        <Loadable loading={true} error={true}>
          <div>Content</div>
        </Loadable>
      );

      // Should show loading, not error
      const spinner = document.querySelector('div[style*="border-radius"]');
      expect(spinner).toBeInTheDocument();
      expect(screen.queryByText(/Error:/)).not.toBeInTheDocument();
      expect(screen.queryByText('Content')).not.toBeInTheDocument();
    });

    it('should show content when both loading and error are false', () => {
      render(
        <Loadable loading={false} error={false}>
          <div>Content</div>
        </Loadable>
      );

      expect(screen.getByText('Content')).toBeInTheDocument();
    });

    it('should handle undefined states as false', () => {
      render(
        <Loadable>
          <div>Content</div>
        </Loadable>
      );

      expect(screen.getByText('Content')).toBeInTheDocument();
    });
  });

  describe('real-world use cases', () => {
    it('should handle API data fetching', () => {
      const { rerender } = render(
        <Loadable loading={true}>
          <div>User Data</div>
        </Loadable>
      );

      // Loading state
      expect(screen.queryByText('User Data')).not.toBeInTheDocument();

      // Success state
      rerender(
        <Loadable loading={false} error={false}>
          <div>User Data</div>
        </Loadable>
      );

      expect(screen.getByText('User Data')).toBeInTheDocument();
    });

    it('should handle API error', () => {
      const { rerender } = render(
        <Loadable loading={true}>
          <div>User Data</div>
        </Loadable>
      );

      // Error state
      rerender(
        <Loadable loading={false} error="Failed to fetch user">
          <div>User Data</div>
        </Loadable>
      );

      expect(screen.getByText(/Failed to fetch user/)).toBeInTheDocument();
      expect(screen.queryByText('User Data')).not.toBeInTheDocument();
    });

    it('should handle retry after error', () => {
      const { rerender } = render(
        <Loadable loading={false} error="Network error">
          <div>Data</div>
        </Loadable>
      );

      expect(screen.getByText(/Network error/)).toBeInTheDocument();

      // Retry - back to loading
      rerender(
        <Loadable loading={true} error={false}>
          <div>Data</div>
        </Loadable>
      );

      expect(screen.queryByText(/Network error/)).not.toBeInTheDocument();

      // Success
      rerender(
        <Loadable loading={false} error={false}>
          <div>Data</div>
        </Loadable>
      );

      expect(screen.getByText('Data')).toBeInTheDocument();
    });
  });

  describe('custom components', () => {
    it('should render null as loading component', () => {
      const { container } = render(
        <Loadable loading={true} loadingComponent={null}>
          <div>Content</div>
        </Loadable>
      );

      expect(container.textContent).toBe('');
    });

    it('should render complex loading component', () => {
      render(
        <Loadable
          loading={true}
          loadingComponent={
            <div>
              <h2>Loading...</h2>
              <p>Please wait</p>
            </div>
          }
        >
          <div>Content</div>
        </Loadable>
      );

      expect(screen.getByText('Loading...')).toBeInTheDocument();
      expect(screen.getByText('Please wait')).toBeInTheDocument();
    });

    it('should render complex error component', () => {
      render(
        <Loadable
          error="API Error"
          errorComponent={
            <div>
              <h2>Oops!</h2>
              <button>Retry</button>
            </div>
          }
        >
          <div>Content</div>
        </Loadable>
      );

      expect(screen.getByText('Oops!')).toBeInTheDocument();
      expect(screen.getByText('Retry')).toBeInTheDocument();
    });
  });
});
