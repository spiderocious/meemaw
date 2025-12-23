import { ReactNode, useEffect, useState } from 'react';

type Breakpoint = 'mobile' | 'tablet' | 'desktop';

interface HiddenProps {
  when?: boolean;
  if?: boolean;
  on?: Breakpoint | Breakpoint[];
  children: ReactNode;
}

const BREAKPOINTS = {
  mobile: 768,
  tablet: 1024,
};

export function Hidden({ when, if: ifProp, on, children }: HiddenProps): JSX.Element | null {
  const [currentBreakpoint, setCurrentBreakpoint] = useState<Breakpoint>('desktop');

  useEffect(() => {
    if (!on) return;

    const updateBreakpoint = () => {
      const width = window.innerWidth;
      if (width < BREAKPOINTS.mobile) {
        setCurrentBreakpoint('mobile');
      } else if (width < BREAKPOINTS.tablet) {
        setCurrentBreakpoint('tablet');
      } else {
        setCurrentBreakpoint('desktop');
      }
    };

    updateBreakpoint();
    window.addEventListener('resize', updateBreakpoint);
    return () => window.removeEventListener('resize', updateBreakpoint);
  }, [on]);

  const condition = when !== undefined ? when : ifProp;

  let shouldHide = condition ?? false;

  if (on) {
    const breakpoints = Array.isArray(on) ? on : [on];
    const hiddenOnBreakpoint = breakpoints.includes(currentBreakpoint);
    shouldHide = shouldHide || hiddenOnBreakpoint;
  }

  return shouldHide ? null : <>{children}</>;
}
