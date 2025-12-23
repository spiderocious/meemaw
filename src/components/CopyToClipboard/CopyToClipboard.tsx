import { ReactNode, cloneElement, isValidElement, useState, useCallback } from 'react';

export interface CopyToClipboardProps {
  text?: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  children: ReactNode | ((copy: () => void, copied: boolean) => ReactNode);
}

export function CopyToClipboard({
  text,
  onSuccess,
  onError,
  children,
}: CopyToClipboardProps): JSX.Element {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      // Get text to copy
      let textToCopy = text;

      // If no text prop, try to get text from children
      if (!textToCopy && typeof children === 'string') {
        textToCopy = children;
      } else if (!textToCopy && isValidElement(children)) {
        const childText = extractTextFromElement(children);
        textToCopy = childText;
      }

      if (!textToCopy) {
        throw new Error('No text to copy');
      }

      // Copy to clipboard
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(textToCopy);
      } else {
        // Fallback for older browsers
        fallbackCopy(textToCopy);
      }

      setCopied(true);
      setTimeout(() => setCopied(false), 2000);

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      if (onError) {
        onError(error as Error);
      }
    }
  }, [text, children, onSuccess, onError]);

  // If children is a function, call it with copy function and copied state
  if (typeof children === 'function') {
    return <>{children(handleCopy, copied)}</>;
  }

  // If children is a single element, clone it and add onClick
  if (isValidElement(children)) {
    return cloneElement(children, {
      ...children.props,
      onClick: (e: React.MouseEvent) => {
        handleCopy();
        if (children.props.onClick) {
          children.props.onClick(e);
        }
      },
    });
  }

  // Wrap other content in a clickable div
  return <div onClick={handleCopy}>{children}</div>;
}

function extractTextFromElement(element: React.ReactElement): string {
  if (typeof element.props.children === 'string') {
    return element.props.children;
  }

  if (Array.isArray(element.props.children)) {
    return element.props.children
      .map((child: unknown) => {
        if (typeof child === 'string') return child;
        if (isValidElement(child)) return extractTextFromElement(child);
        return '';
      })
      .join('');
  }

  if (isValidElement(element.props.children)) {
    return extractTextFromElement(element.props.children);
  }

  return '';
}

function fallbackCopy(text: string): void {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.position = 'fixed';
  textArea.style.left = '-999999px';
  textArea.style.top = '-999999px';
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    document.execCommand('copy');
  } finally {
    document.body.removeChild(textArea);
  }
}
