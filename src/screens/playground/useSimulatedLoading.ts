import { useEffect, useState } from 'react';

const LOADING_MS = 2000;

/**
 * Hook de demo: dispara um `isLoading` que volta a `false` após 2s. Útil para
 * exemplificar componentes com estado de loading sem montar um mock de rede.
 */
export function useSimulatedLoading() {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isLoading) return;
    const timeout = setTimeout(() => setIsLoading(false), LOADING_MS);
    return () => clearTimeout(timeout);
  }, [isLoading]);

  return { isLoading, start: () => setIsLoading(true) };
}
