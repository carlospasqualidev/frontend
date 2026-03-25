import { ErrorBoundary } from 'react-error-boundary';
import { RouterProvider } from '@tanstack/react-router';

import { ErrorFallback } from '@/components/global/errorFallback';
import { errorHandler } from '@/lib/utils';
import { router } from '@/routes';

export function App() {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={(error: any) => {
        errorHandler({ error });
      }}
    >
      <RouterProvider router={router} />
    </ErrorBoundary>
  );
}

export default App;
