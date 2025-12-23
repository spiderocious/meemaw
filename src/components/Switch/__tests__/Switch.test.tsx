import { render, screen } from '@testing-library/react';
import { Switch, Case, Default } from '../Switch';

describe('Switch', () => {
  describe('basic case matching', () => {
    it('should render the first matching case', () => {
      const status = 'success' as string;

      render(
        <Switch>
          <Case when={status === 'loading'}>
            <div>Loading...</div>
          </Case>
          <Case when={status === 'success'}>
            <div>Success!</div>
          </Case>
          <Case when={status === 'error'}>
            <div>Error!</div>
          </Case>
        </Switch>
      );

      expect(screen.getByText('Success!')).toBeInTheDocument();
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
      expect(screen.queryByText('Error!')).not.toBeInTheDocument();
    });

    it('should render first case when condition is true', () => {
      render(
        <Switch>
          <Case when={true}>
            <div>First case</div>
          </Case>
          <Case when={false}>
            <div>Second case</div>
          </Case>
        </Switch>
      );

      expect(screen.getByText('First case')).toBeInTheDocument();
      expect(screen.queryByText('Second case')).not.toBeInTheDocument();
    });

    it('should skip false cases and render the first true case', () => {
      render(
        <Switch>
          <Case when={false}>
            <div>First case</div>
          </Case>
          <Case when={false}>
            <div>Second case</div>
          </Case>
          <Case when={true}>
            <div>Third case</div>
          </Case>
          <Case when={true}>
            <div>Fourth case</div>
          </Case>
        </Switch>
      );

      expect(screen.getByText('Third case')).toBeInTheDocument();
      expect(screen.queryByText('First case')).not.toBeInTheDocument();
      expect(screen.queryByText('Second case')).not.toBeInTheDocument();
      expect(screen.queryByText('Fourth case')).not.toBeInTheDocument();
    });

    it('should only render first matching case even if multiple match', () => {
      const value = 5;

      render(
        <Switch>
          <Case when={value > 0}>
            <div>Greater than 0</div>
          </Case>
          <Case when={value > 3}>
            <div>Greater than 3</div>
          </Case>
          <Case when={value === 5}>
            <div>Equals 5</div>
          </Case>
        </Switch>
      );

      expect(screen.getByText('Greater than 0')).toBeInTheDocument();
      expect(screen.queryByText('Greater than 3')).not.toBeInTheDocument();
      expect(screen.queryByText('Equals 5')).not.toBeInTheDocument();
    });
  });

  describe('Default case', () => {
    it('should render Default when no cases match', () => {
      const status = 'unknown' as string;

      render(
        <Switch>
          <Case when={status === 'loading'}>
            <div>Loading...</div>
          </Case>
          <Case when={status === 'success'}>
            <div>Success!</div>
          </Case>
          <Default>
            <div>Default content</div>
          </Default>
        </Switch>
      );

      expect(screen.getByText('Default content')).toBeInTheDocument();
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
      expect(screen.queryByText('Success!')).not.toBeInTheDocument();
    });

    it('should not render Default when a case matches', () => {
      const status = 'success';

      render(
        <Switch>
          <Case when={status === 'success'}>
            <div>Success!</div>
          </Case>
          <Default>
            <div>Default content</div>
          </Default>
        </Switch>
      );

      expect(screen.getByText('Success!')).toBeInTheDocument();
      expect(screen.queryByText('Default content')).not.toBeInTheDocument();
    });

    it('should render nothing when no cases match and no Default', () => {
      const { container } = render(
        <Switch>
          <Case when={false}>
            <div>Case 1</div>
          </Case>
          <Case when={false}>
            <div>Case 2</div>
          </Case>
        </Switch>
      );

      expect(container.textContent).toBe('');
    });

    it('should handle Default placed at the beginning', () => {
      render(
        <Switch>
          <Default>
            <div>Default content</div>
          </Default>
          <Case when={false}>
            <div>Case 1</div>
          </Case>
          <Case when={false}>
            <div>Case 2</div>
          </Case>
        </Switch>
      );

      expect(screen.getByText('Default content')).toBeInTheDocument();
    });

    it('should handle Default placed in the middle', () => {
      render(
        <Switch>
          <Case when={false}>
            <div>Case 1</div>
          </Case>
          <Default>
            <div>Default content</div>
          </Default>
          <Case when={false}>
            <div>Case 2</div>
          </Case>
        </Switch>
      );

      expect(screen.getByText('Default content')).toBeInTheDocument();
    });

    it('should use last Default if multiple are provided', () => {
      render(
        <Switch>
          <Case when={false}>
            <div>Case</div>
          </Case>
          <Default>
            <div>First default</div>
          </Default>
          <Default>
            <div>Second default</div>
          </Default>
        </Switch>
      );

      expect(screen.getByText('Second default')).toBeInTheDocument();
      expect(screen.queryByText('First default')).not.toBeInTheDocument();
    });
  });

  describe('real-world use cases', () => {
    it('should handle status-based rendering', () => {
      const status = 'loading' as string;

      render(
        <Switch>
          <Case when={status === 'idle'}>
            <div>Ready to start</div>
          </Case>
          <Case when={status === 'loading'}>
            <div>Loading data...</div>
          </Case>
          <Case when={status === 'success'}>
            <div>Data loaded successfully</div>
          </Case>
          <Case when={status === 'error'}>
            <div>Failed to load data</div>
          </Case>
          <Default>
            <div>Unknown status</div>
          </Default>
        </Switch>
      );

      expect(screen.getByText('Loading data...')).toBeInTheDocument();
    });

    it('should handle user role-based rendering', () => {
      const userRole = 'admin' as string;

      render(
        <Switch>
          <Case when={userRole === 'admin'}>
            <div>Admin Dashboard</div>
          </Case>
          <Case when={userRole === 'moderator'}>
            <div>Moderator Panel</div>
          </Case>
          <Case when={userRole === 'user'}>
            <div>User Profile</div>
          </Case>
          <Default>
            <div>Guest View</div>
          </Default>
        </Switch>
      );

      expect(screen.getByText('Admin Dashboard')).toBeInTheDocument();
    });

    it('should handle numeric range conditions', () => {
      const score = 85;

      render(
        <Switch>
          <Case when={score >= 90}>
            <div>Grade: A</div>
          </Case>
          <Case when={score >= 80}>
            <div>Grade: B</div>
          </Case>
          <Case when={score >= 70}>
            <div>Grade: C</div>
          </Case>
          <Case when={score >= 60}>
            <div>Grade: D</div>
          </Case>
          <Default>
            <div>Grade: F</div>
          </Default>
        </Switch>
      );

      expect(screen.getByText('Grade: B')).toBeInTheDocument();
    });

    it('should handle API response states', () => {
      const apiState = { loading: false, error: null, data: { items: [] } };

      render(
        <Switch>
          <Case when={apiState.loading}>
            <div>Fetching...</div>
          </Case>
          <Case when={apiState.error !== null}>
            <div>Error: {apiState.error}</div>
          </Case>
          <Case when={apiState.data !== null && apiState.data.items.length === 0}>
            <div>No items found</div>
          </Case>
          <Case when={apiState.data !== null && apiState.data.items.length > 0}>
            <div>Items loaded</div>
          </Case>
          <Default>
            <div>Idle</div>
          </Default>
        </Switch>
      );

      expect(screen.getByText('No items found')).toBeInTheDocument();
    });
  });

  describe('complex children', () => {
    it('should render complex component trees', () => {
      const page = 'home' as string;

      render(
        <Switch>
          <Case when={page === 'home'}>
            <div>
              <h1>Home Page</h1>
              <p>Welcome to the home page</p>
            </div>
          </Case>
          <Case when={page === 'about'}>
            <div>About Page</div>
          </Case>
        </Switch>
      );

      expect(screen.getByText('Home Page')).toBeInTheDocument();
      expect(screen.getByText('Welcome to the home page')).toBeInTheDocument();
    });

    it('should handle nested components', () => {
      const isAuthenticated = true;

      render(
        <Switch>
          <Case when={isAuthenticated}>
            <div>
              <header>Header</header>
              <nav>Navigation</nav>
              <main>Main Content</main>
            </div>
          </Case>
          <Default>
            <div>Login Form</div>
          </Default>
        </Switch>
      );

      expect(screen.getByText('Header')).toBeInTheDocument();
      expect(screen.getByText('Navigation')).toBeInTheDocument();
      expect(screen.getByText('Main Content')).toBeInTheDocument();
    });
  });

  describe('edge cases', () => {
    it('should handle empty Switch', () => {
      const { container } = render(<Switch>{null}</Switch>);

      expect(container.textContent).toBe('');
    });

    it('should ignore non-element children', () => {
      render(
        <Switch>
          {null}
          {undefined}
          <Case when={true}>
            <div>Valid case</div>
          </Case>
          {false}
        </Switch>
      );

      expect(screen.getByText('Valid case')).toBeInTheDocument();
    });

    it('should handle dynamic conditions', () => {
      const { rerender } = render(
        <Switch>
          <Case when={true}>
            <div>Case A</div>
          </Case>
          <Case when={false}>
            <div>Case B</div>
          </Case>
        </Switch>
      );

      expect(screen.getByText('Case A')).toBeInTheDocument();

      rerender(
        <Switch>
          <Case when={false}>
            <div>Case A</div>
          </Case>
          <Case when={true}>
            <div>Case B</div>
          </Case>
        </Switch>
      );

      expect(screen.getByText('Case B')).toBeInTheDocument();
      expect(screen.queryByText('Case A')).not.toBeInTheDocument();
    });

    it('should handle all false cases with no Default', () => {
      const { container } = render(
        <Switch>
          <Case when={false}>
            <div>Case 1</div>
          </Case>
          <Case when={false}>
            <div>Case 2</div>
          </Case>
          <Case when={false}>
            <div>Case 3</div>
          </Case>
        </Switch>
      );

      expect(container.textContent).toBe('');
    });

    it('should work with Case components that have null/undefined children', () => {
      render(
        <Switch>
          <Case when={true}>{null}</Case>
          <Default>
            <div>Default</div>
          </Default>
        </Switch>
      );

      // First case matches even though children is null
      expect(screen.queryByText('Default')).not.toBeInTheDocument();
    });
  });

  describe('comparison with ternary operators', () => {
    it('should be cleaner than nested ternaries', () => {
      const status = 'error' as string;

      // Using Switch - clean and readable
      render(
        <div data-testid="switch-version">
          <Switch>
            <Case when={status === 'loading'}>
              <span>Loading</span>
            </Case>
            <Case when={status === 'success'}>
              <span>Success</span>
            </Case>
            <Case when={status === 'error'}>
              <span>Error</span>
            </Case>
            <Default>
              <span>Unknown</span>
            </Default>
          </Switch>
        </div>
      );

      // Equivalent nested ternary - hard to read
      render(
        <div data-testid="ternary-version">
          {status === 'loading' ? (
            <span>Loading</span>
          ) : status === 'success' ? (
            <span>Success</span>
          ) : status === 'error' ? (
            <span>Error</span>
          ) : (
            <span>Unknown</span>
          )}
        </div>
      );

      expect(screen.getAllByText('Error')).toHaveLength(2);
    });
  });
});
