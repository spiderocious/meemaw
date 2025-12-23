import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CopyToClipboard } from '../CopyToClipboard';

// Mock clipboard API
Object.assign(navigator, {
  clipboard: {
    writeText: jest.fn(),
  },
});

describe('CopyToClipboard', () => {
  beforeEach(() => {
    (navigator.clipboard.writeText as jest.Mock).mockClear();
    (navigator.clipboard.writeText as jest.Mock).mockResolvedValue(undefined);
  });

  describe('with text prop', () => {
    it('should copy specified text when clicked', async () => {
      render(
        <CopyToClipboard text="Hello World">
          <button>Copy</button>
        </CopyToClipboard>
      );

      fireEvent.click(screen.getByText('Copy'));

      await waitFor(() => {
        expect(navigator.clipboard.writeText).toHaveBeenCalledWith('Hello World');
      });
    });

    it('should call onSuccess after successful copy', async () => {
      const onSuccess = jest.fn();

      render(
        <CopyToClipboard text="Test" onSuccess={onSuccess}>
          <button>Copy</button>
        </CopyToClipboard>
      );

      fireEvent.click(screen.getByText('Copy'));

      await waitFor(() => {
        expect(onSuccess).toHaveBeenCalled();
      });
    });
  });

  describe('with string children', () => {
    it('should copy text from string children', async () => {
      render(<CopyToClipboard>Copy this text</CopyToClipboard>);

      fireEvent.click(screen.getByText('Copy this text'));

      await waitFor(() => {
        expect(navigator.clipboard.writeText).toHaveBeenCalledWith('Copy this text');
      });
    });
  });

  describe('with element children', () => {
    it('should extract text from element children', async () => {
      render(
        <CopyToClipboard>
          <div>
            <span>Nested</span> Text
          </div>
        </CopyToClipboard>
      );

      fireEvent.click(screen.getByText('Nested'));

      await waitFor(() => {
        expect(navigator.clipboard.writeText).toHaveBeenCalledWith('Nested Text');
      });
    });

    it('should preserve original onClick', async () => {
      const originalClick = jest.fn();

      render(
        <CopyToClipboard text="Test">
          <button onClick={originalClick}>Click Me</button>
        </CopyToClipboard>
      );

      fireEvent.click(screen.getByText('Click Me'));

      await waitFor(() => {
        expect(navigator.clipboard.writeText).toHaveBeenCalled();
        expect(originalClick).toHaveBeenCalled();
      });
    });
  });

  describe('with render prop', () => {
    it('should provide copy function and copied state', async () => {
      render(
        <CopyToClipboard text="Render Prop Text">
          {(copy: () => void, copied: boolean) => (
            <button onClick={copy}>{copied ? 'Copied!' : 'Copy'}</button>
          )}
        </CopyToClipboard>
      );

      const button = screen.getByText('Copy');
      fireEvent.click(button);

      await waitFor(() => {
        expect(screen.getByText('Copied!')).toBeInTheDocument();
      });

      // Should reset after 2 seconds
      await waitFor(
        () => {
          expect(screen.getByText('Copy')).toBeInTheDocument();
        },
        { timeout: 2500 }
      );
    });
  });

  describe('error handling', () => {
    it('should call onError when copy fails', async () => {
      const onError = jest.fn();
      (navigator.clipboard.writeText as jest.Mock).mockRejectedValue(new Error('Copy failed'));

      render(
        <CopyToClipboard text="Test" onError={onError}>
          <button>Copy</button>
        </CopyToClipboard>
      );

      fireEvent.click(screen.getByText('Copy'));

      await waitFor(() => {
        expect(onError).toHaveBeenCalled();
      });
    });

    it('should handle missing text gracefully', async () => {
      const onError = jest.fn();

      const { container } = render(
        <CopyToClipboard onError={onError}>
          <div data-testid="empty-div" />
        </CopyToClipboard>
      );

      const emptyDiv = container.querySelector('[data-testid="empty-div"]');
      if (emptyDiv) {
        fireEvent.click(emptyDiv);
      }

      await waitFor(() => {
        expect(onError).toHaveBeenCalledWith(expect.any(Error));
      });
    });
  });

  describe('fallback for older browsers', () => {
    it('should use document.execCommand when clipboard API unavailable', async () => {
      // Temporarily remove clipboard API
      const originalClipboard = navigator.clipboard;
      // @ts-expect-error - Testing fallback
      delete navigator.clipboard;

      document.execCommand = jest.fn().mockReturnValue(true);

      render(
        <CopyToClipboard text="Fallback Text">
          <button>Copy</button>
        </CopyToClipboard>
      );

      fireEvent.click(screen.getByText('Copy'));

      await waitFor(() => {
        expect(document.execCommand).toHaveBeenCalledWith('copy');
      });

      // Restore clipboard
      Object.assign(navigator, { clipboard: originalClipboard });
    });
  });
});
