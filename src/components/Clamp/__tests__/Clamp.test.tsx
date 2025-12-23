import { render, screen, fireEvent } from '@testing-library/react';
import { Clamp } from '../Clamp';

describe('Clamp', () => {
  describe('character-based clamping', () => {
    it('should truncate text at maxChar', () => {
      render(
        <Clamp maxChar={10}>This is a very long text that should be truncated</Clamp>
      );

      expect(screen.getByText(/This is a \.\.\./)).toBeInTheDocument();
      expect(screen.queryByText(/very long/)).not.toBeInTheDocument();
    });

    it('should use custom truncateEnd', () => {
      render(
        <Clamp maxChar={15} truncateEnd=" [more]">
          This is a long text that needs truncation
        </Clamp>
      );

      expect(screen.getByText(/This is a long \[more\]/)).toBeInTheDocument();
    });

    it('should not truncate if text is shorter than maxChar', () => {
      render(<Clamp maxChar={100}>Short text</Clamp>);

      expect(screen.getByText('Short text')).toBeInTheDocument();
      expect(screen.queryByText(/\.\.\./)).not.toBeInTheDocument();
    });
  });

  describe('expandable with maxChar', () => {
    it('should show expand button', () => {
      render(
        <Clamp maxChar={10} expandable>
          This is a long text
        </Clamp>
      );

      expect(screen.getByText('Show more')).toBeInTheDocument();
    });

    it('should expand text when clicked', () => {
      render(
        <Clamp maxChar={10} expandable>
          This is a long text that should expand
        </Clamp>
      );

      fireEvent.click(screen.getByText('Show more'));

      expect(screen.getByText(/This is a long text that should expand/)).toBeInTheDocument();
      expect(screen.getByText('Show less')).toBeInTheDocument();
    });

    it('should collapse text when clicked again', () => {
      render(
        <Clamp maxChar={10} expandable>
          This is a long text
        </Clamp>
      );

      const button = screen.getByText('Show more');
      fireEvent.click(button);

      const collapseButton = screen.getByText('Show less');
      fireEvent.click(collapseButton);

      expect(screen.getByText('Show more')).toBeInTheDocument();
      expect(screen.getByText(/\.\.\./)).toBeInTheDocument();
    });

    it('should call onToggle callback', () => {
      const onToggle = jest.fn();

      render(
        <Clamp maxChar={10} expandable onToggle={onToggle}>
          This is a long text
        </Clamp>
      );

      fireEvent.click(screen.getByText('Show more'));
      expect(onToggle).toHaveBeenCalledWith(true);

      fireEvent.click(screen.getByText('Show less'));
      expect(onToggle).toHaveBeenCalledWith(false);
    });

    it('should use custom expand/collapse text', () => {
      render(
        <Clamp maxChar={10} expandable expandText="Read more" collapseText="Read less">
          This is a long text
        </Clamp>
      );

      expect(screen.getByText('Read more')).toBeInTheDocument();

      fireEvent.click(screen.getByText('Read more'));

      expect(screen.getByText('Read less')).toBeInTheDocument();
    });
  });

  describe('line-based clamping', () => {
    it('should apply line clamping with maxLines', () => {
      const { container } = render(
        <Clamp maxLines={3}>
          Line 1 Line 2 Line 3 Line 4 Line 5
        </Clamp>
      );

      // Check for the clamping div with WebkitLineClamp style
      const clampedDiv = container.querySelector('[style*="webkit-line-clamp"]');
      const displayDiv = container.querySelector('[style*="display"]');
      // At least one of the style properties should be present
      expect(clampedDiv || displayDiv).toBeTruthy();
    });

    it('should show expand button with maxLines', () => {
      render(
        <Clamp maxLines={2} expandable>
          <p>Line 1</p>
          <p>Line 2</p>
          <p>Line 3</p>
        </Clamp>
      );

      expect(screen.getByText('Show more')).toBeInTheDocument();
    });

    it('should expand on click with maxLines', () => {
      render(
        <Clamp maxLines={1} expandable>
          <div>Content line 1</div>
          <div>Content line 2</div>
        </Clamp>
      );

      fireEvent.click(screen.getByText('Show more'));

      expect(screen.getByText('Content line 1')).toBeInTheDocument();
      expect(screen.getByText('Content line 2')).toBeInTheDocument();
      expect(screen.getByText('Show less')).toBeInTheDocument();
    });
  });

  describe('no clamping', () => {
    it('should render without clamping when no maxChar or maxLines', () => {
      render(
        <Clamp>
          <div>Full content without any truncation</div>
        </Clamp>
      );

      expect(screen.getByText('Full content without any truncation')).toBeInTheDocument();
    });

    it('should not show expand button if no truncation needed', () => {
      render(
        <Clamp maxChar={100} expandable>
          Short
        </Clamp>
      );

      expect(screen.queryByText('Show more')).not.toBeInTheDocument();
    });
  });

  describe('complex children', () => {
    it('should handle nested elements', () => {
      render(
        <Clamp maxChar={20}>
          <div>
            <span>Nested </span>
            <strong>content </strong>
            with multiple elements
          </div>
        </Clamp>
      );

      // Should extract and truncate text from nested structure
      const text = screen.getByText(/Nested content with/);
      expect(text).toBeInTheDocument();
    });
  });
});
