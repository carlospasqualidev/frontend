import { ErrorBoundary } from 'react-error-boundary';
import { RouterProvider } from '@tanstack/react-router';

import { Toaster } from '@/components/ui/sonner';
import { ErrorFallback } from '@/components/global/errorFallback';
import { router } from '@/routes';
import { sendErrorMessage } from '@/services/api/errorHandlers';

export function App() {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={(error: any) => {
        sendErrorMessage({ error });
      }}
    >
      <Toaster />
      <RouterProvider router={router} />
    </ErrorBoundary>
  );
}

export default App;
