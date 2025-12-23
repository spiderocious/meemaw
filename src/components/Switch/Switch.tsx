import { ReactNode, Children, isValidElement } from 'react';

interface CaseProps {
  when: boolean;
  children: ReactNode;
}

interface DefaultProps {
  children: ReactNode;
}

interface SwitchProps {
  children: ReactNode;
}

export function Case({ children }: CaseProps): JSX.Element | null {
  return <>{children}</>;
}

export function Default({ children }: DefaultProps): JSX.Element {
  return <>{children}</>;
}

export function Switch({ children }: SwitchProps): JSX.Element | null {
  let defaultCase: ReactNode = null;

  const childArray = Children.toArray(children);

  for (const child of childArray) {
    if (!isValidElement(child)) continue;

    if (child.type === Case && child.props.when) {
      return <>{child.props.children}</>;
    }

    if (child.type === Default) {
      defaultCase = child.props.children;
    }
  }

  return <>{defaultCase}</>;
}
