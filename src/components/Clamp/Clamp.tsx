import { ReactNode, useState } from 'react';

export interface ClampProps {
  maxChar?: number;
  maxLines?: number;
  truncateEnd?: string;
  expandable?: boolean;
  expandText?: string;
  collapseText?: string;
  onToggle?: (isExpanded: boolean) => void;
  children: ReactNode;
}

export function Clamp({
  maxChar,
  maxLines,
  truncateEnd = '...',
  expandable = false,
  expandText = 'Show more',
  collapseText = 'Show less',
  onToggle,
  children,
}: ClampProps): JSX.Element {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggle = () => {
    const newState = !isExpanded;
    setIsExpanded(newState);
    if (onToggle) {
      onToggle(newState);
    }
  };

  // Extract text content from children
  const textContent = extractText(children);

  // If expanded or no clamping needed, show full content
  if (isExpanded || (!maxChar && !maxLines)) {
    return (
      <div>
        {children}
        {expandable && (maxChar || maxLines) && shouldTruncate(textContent, maxChar, maxLines) && (
          <button
            onClick={handleToggle}
            style={{
              marginLeft: '8px',
              background: 'none',
              border: 'none',
              color: '#007bff',
              cursor: 'pointer',
              padding: 0,
              textDecoration: 'underline',
            }}
          >
            {collapseText}
          </button>
        )}
      </div>
    );
  }

  // Check if truncation is needed
  if (!shouldTruncate(textContent, maxChar, maxLines)) {
    return <div>{children}</div>;
  }

  // Truncate by character count
  if (maxChar) {
    const truncated = textContent.slice(0, maxChar) + truncateEnd;
    return (
      <div>
        {truncated}
        {expandable && (
          <button
            onClick={handleToggle}
            style={{
              marginLeft: '4px',
              background: 'none',
              border: 'none',
              color: '#007bff',
              cursor: 'pointer',
              padding: 0,
              textDecoration: 'underline',
            }}
          >
            {expandText}
          </button>
        )}
      </div>
    );
  }

  // Truncate by line count
  if (maxLines) {
    return (
      <div>
        <div
          style={{
            display: '-webkit-box',
            WebkitLineClamp: maxLines,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {children}
        </div>
        {expandable && (
          <button
            onClick={handleToggle}
            style={{
              marginTop: '4px',
              background: 'none',
              border: 'none',
              color: '#007bff',
              cursor: 'pointer',
              padding: 0,
              textDecoration: 'underline',
            }}
          >
            {expandText}
          </button>
        )}
      </div>
    );
  }

  return <div>{children}</div>;
}

function extractText(node: ReactNode): string {
  if (typeof node === 'string') {
    return node;
  }

  if (typeof node === 'number') {
    return String(node);
  }

  if (Array.isArray(node)) {
    return node.map(extractText).join('');
  }

  if (node && typeof node === 'object' && 'props' in node) {
    return extractText((node as React.ReactElement).props.children);
  }

  return '';
}

function shouldTruncate(text: string, maxChar?: number, maxLines?: number): boolean {
  if (maxChar && text.length > maxChar) {
    return true;
  }

  // For maxLines, we assume truncation is needed if maxLines is set
  // The actual line counting would require DOM measurement
  if (maxLines) {
    return true;
  }

  return false;
}
