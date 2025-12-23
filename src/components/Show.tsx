import { ReactNode } from 'react';

interface ShowProps {
  when?: boolean;
  if?: boolean;
  fallback?: ReactNode;
  children: ReactNode;
}

export function Show({ when, if: ifProp, fallback = null, children }: ShowProps): JSX.Element | null {
  const condition = when !== undefined ? when : ifProp;
  return <>{condition ? children : fallback}</>;
}
