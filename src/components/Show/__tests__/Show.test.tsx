import { render, screen } from '@testing-library/react';
import { Show } from '../Show';

describe('Show', () => {
  describe('basic conditional rendering with "when" prop', () => {
    it('should show children when "when" is true', () => {
      render(
        <Show when={true}>
          <div>Visible content</div>
        </Show>
      );

      expect(screen.getByText('Visible content')).toBeInTheDocument();
    });

    it('should hide children when "when" is false', () => {
      render(
        <Show when={false}>
          <div>Hidden content</div>
        </Show>
      );

      expect(screen.queryByText('Hidden content')).not.toBeInTheDocument();
    });

    it('should hide children when "when" is undefined', () => {
      render(
        <Show when={undefined}>
          <div>Hidden content</div>
        </Show>
      );

      expect(screen.queryByText('Hidden content')).not.toBeInTheDocument();
    });

    it('should handle boolean true value', () => {
      const isTrue = true;
      render(
        <Show when={isTrue}>
          <div>Truthy value</div>
        </Show>
      );

      expect(screen.getByText('Truthy value')).toBeInTheDocument();
    });

    it('should handle boolean false value', () => {
      const isFalse = false;
      render(
        <Show when={isFalse}>
          <div>Falsy value</div>
        </Show>
      );

      expect(screen.queryByText('Falsy value')).not.toBeInTheDocument();
    });
  });

  describe('conditional rendering with "if" prop (alias)', () => {
    it('should show children when "if" is true', () => {
      render(
        <Show if={true}>
          <div>Visible with if</div>
        </Show>
      );

      expect(screen.getByText('Visible with if')).toBeInTheDocument();
    });

    it('should hide children when "if" is false', () => {
      render(
        <Show if={false}>
          <div>Hidden with if</div>
        </Show>
      );

      expect(screen.queryByText('Hidden with if')).not.toBeInTheDocument();
    });

    it('should prioritize "when" over "if" when both are provided', () => {
      render(
        <Show when={true} if={false}>
          <div>Visible because when=true</div>
        </Show>
      );

      expect(screen.getByText('Visible because when=true')).toBeInTheDocument();
    });

    it('should use "if" when "when" is undefined', () => {
      render(
        <Show if={true}>
          <div>Using if prop</div>
        </Show>
      );

      expect(screen.getByText('Using if prop')).toBeInTheDocument();
    });
  });

  describe('fallback content', () => {
    it('should show fallback when condition is false', () => {
      render(
        <Show when={false} fallback={<div>Fallback content</div>}>
          <div>Main content</div>
        </Show>
      );

      expect(screen.queryByText('Main content')).not.toBeInTheDocument();
      expect(screen.getByText('Fallback content')).toBeInTheDocument();
    });

    it('should not show fallback when condition is true', () => {
      render(
        <Show when={true} fallback={<div>Fallback content</div>}>
          <div>Main content</div>
        </Show>
      );

      expect(screen.getByText('Main content')).toBeInTheDocument();
      expect(screen.queryByText('Fallback content')).not.toBeInTheDocument();
    });

    it('should show nothing when no fallback and condition is false', () => {
      const { container } = render(
        <Show when={false}>
          <div>Main content</div>
        </Show>
      );

      expect(container.textContent).toBe('');
    });

    it('should handle complex fallback content', () => {
      render(
        <Show
          when={false}
          fallback={
            <div>
              <h1>Not Found</h1>
              <p>Please try again</p>
            </div>
          }
        >
          <div>Content</div>
        </Show>
      );

      expect(screen.getByText('Not Found')).toBeInTheDocument();
      expect(screen.getByText('Please try again')).toBeInTheDocument();
    });
  });

  describe('real-world use cases', () => {
    it('should handle authentication check', () => {
      const isLoggedIn = true;

      render(
        <Show when={isLoggedIn} fallback={<div>Please login</div>}>
          <div>Welcome, User!</div>
        </Show>
      );

      expect(screen.getByText('Welcome, User!')).toBeInTheDocument();
      expect(screen.queryByText('Please login')).not.toBeInTheDocument();
    });

    it('should handle loading state', () => {
      const isLoading = false;
      const hasData = true;

      render(
        <>
          <Show when={isLoading} fallback={null}>
            <div>Loading...</div>
          </Show>
          <Show when={!isLoading && hasData}>
            <div>Data loaded</div>
          </Show>
        </>
      );

      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
      expect(screen.getByText('Data loaded')).toBeInTheDocument();
    });

    it('should handle permission-based rendering', () => {
      const isPremium = true;

      render(
        <Show when={isPremium} fallback={<div>Upgrade to Premium</div>}>
          <div>Premium Feature</div>
        </Show>
      );

      expect(screen.getByText('Premium Feature')).toBeInTheDocument();
    });

    it('should handle data availability', () => {
      const data = null;

      render(
        <Show when={data !== null} fallback={<div>No data available</div>}>
          <div>Data: {data}</div>
        </Show>
      );

      expect(screen.getByText('No data available')).toBeInTheDocument();
    });

    it('should handle feature flags', () => {
      const features = {
        newUI: true,
        betaFeature: false,
      };

      render(
        <>
          <Show when={features.newUI}>
            <div>New UI</div>
          </Show>
          <Show when={features.betaFeature} fallback={<div>Coming soon</div>}>
            <div>Beta Feature</div>
          </Show>
        </>
      );

      expect(screen.getByText('New UI')).toBeInTheDocument();
      expect(screen.getByText('Coming soon')).toBeInTheDocument();
      expect(screen.queryByText('Beta Feature')).not.toBeInTheDocument();
    });
  });

  describe('complex children', () => {
    it('should render complex component trees', () => {
      const hasAccess = true;

      render(
        <Show when={hasAccess}>
          <div>
            <header>Header</header>
            <main>
              <article>Article content</article>
            </main>
            <footer>Footer</footer>
          </div>
        </Show>
      );

      expect(screen.getByText('Header')).toBeInTheDocument();
      expect(screen.getByText('Article content')).toBeInTheDocument();
      expect(screen.getByText('Footer')).toBeInTheDocument();
    });

    it('should handle nested Show components', () => {
      const isLoggedIn = true;
      const hasPermission = true;

      render(
        <Show when={isLoggedIn} fallback={<div>Login required</div>}>
          <Show when={hasPermission} fallback={<div>No permission</div>}>
            <div>Secure content</div>
          </Show>
        </Show>
      );

      expect(screen.getByText('Secure content')).toBeInTheDocument();
    });
  });

  describe('edge cases', () => {
    it('should handle rapidly changing conditions', () => {
      const { rerender } = render(
        <Show when={true}>
          <div>Content</div>
        </Show>
      );

      expect(screen.getByText('Content')).toBeInTheDocument();

      rerender(
        <Show when={false}>
          <div>Content</div>
        </Show>
      );

      expect(screen.queryByText('Content')).not.toBeInTheDocument();

      rerender(
        <Show when={true}>
          <div>Content</div>
        </Show>
      );

      expect(screen.getByText('Content')).toBeInTheDocument();
    });

    it('should handle null children gracefully', () => {
      const { container } = render(<Show when={true}>{null}</Show>);

      expect(container.textContent).toBe('');
    });

    it('should handle undefined children gracefully', () => {
      const { container } = render(<Show when={true}>{undefined}</Show>);

      expect(container.textContent).toBe('');
    });
  });
});
