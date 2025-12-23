import { ReactNode, useEffect, useState } from 'react';

export interface DelayedProps {
  until?: boolean;
  till?: Date | number;
  fallback?: ReactNode;
  children: ReactNode;
}

export function Delayed({ until, till, fallback = null, children }: DelayedProps): JSX.Element | null {
  const [shouldShow, setShouldShow] = useState(false);

  useEffect(() => {
    // Handle `until` prop - show when condition becomes true
    if (until !== undefined) {
      setShouldShow(until);
      return undefined;
    }

    // Handle `till` prop - show after date/timeout
    if (till !== undefined) {
      const delay = typeof till === 'number' ? till : till.getTime() - Date.now();

      if (delay <= 0) {
        setShouldShow(true);
        return undefined;
      }

      const timer = setTimeout(() => {
        setShouldShow(true);
      }, delay);

      return () => clearTimeout(timer);
    }

    // If neither prop is provided, show immediately
    setShouldShow(true);
    return undefined;
  }, [until, till]);

  return <>{shouldShow ? children : fallback}</>;
}
