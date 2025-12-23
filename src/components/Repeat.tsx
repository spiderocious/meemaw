import { ReactNode } from 'react';

interface RepeatProps<T = unknown> {
  times?: number;
  each?: T[];
  children: ((item: T, index: number) => ReactNode) | ReactNode;
}

export function Repeat<T = unknown>({ times, each, children }: RepeatProps<T>): JSX.Element {
  if (each) {
    return (
      <>
        {each.map((item, index) => {
          if (typeof children === 'function') {
            return children(item, index);
          }
          return children;
        })}
      </>
    );
  }

  if (times) {
    return (
      <>
        {Array.from({ length: times }).map((_, index) => {
          if (typeof children === 'function') {
            return children(undefined as T, index);
          }
          return children;
        })}
      </>
    );
  }

  return <></>;
}
