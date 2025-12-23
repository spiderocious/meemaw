import { ReactNode } from 'react';

export interface LoadableProps {
  loading?: boolean;
  error?: boolean | Error | string;
  loadingComponent?: ReactNode;
  errorComponent?: ReactNode | ((error: Error | string) => ReactNode);
  children: ReactNode;
}

const DefaultSpinner = () => (
  <div
    style={{
      display: 'inline-block',
      width: '20px',
      height: '20px',
      border: '3px solid rgba(0, 0, 0, 0.1)',
      borderRadius: '50%',
      borderTopColor: '#333',
      animation: 'spin 0.6s linear infinite',
    }}
  >
    <style>
      {`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}
    </style>
  </div>
);

const DefaultError = ({ error }: { error: Error | string | boolean }) => {
  const errorMessage =
    typeof error === 'string'
      ? error
      : error instanceof Error
        ? error.message
        : 'An error occurred';

  return (
    <div
      style={{
        padding: '12px 16px',
        backgroundColor: '#fee',
        color: '#c00',
        borderRadius: '4px',
        border: '1px solid #fcc',
      }}
    >
      <strong>Error:</strong> {errorMessage}
    </div>
  );
};

export function Loadable({
  loading = false,
  error = false,
  loadingComponent,
  errorComponent,
  children,
}: LoadableProps): JSX.Element | null {
  if (loading) {
    return <>{loadingComponent !== undefined ? loadingComponent : <DefaultSpinner />}</>;
  }

  if (error) {
    if (errorComponent !== undefined) {
      return (
        <>
          {typeof errorComponent === 'function'
            ? errorComponent(error === true ? 'An error occurred' : error)
            : errorComponent}
        </>
      );
    }
    return <DefaultError error={error} />;
  }

  return <>{children}</>;
}
