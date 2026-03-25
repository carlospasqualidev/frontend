import { useEffect, useState, type PropsWithChildren } from 'react';

import { useSessionStore } from './useSessionStore';

import { validateSession } from '@/services/auth/validateSession';

export function AuthProvider({ children }: PropsWithChildren) {
  const [isReady, setIsReady] = useState(false);
  const { setUser, signOut } = useSessionStore();

  useEffect(() => {
    let isMounted = true;

    async function bootstrapSession() {
      const token = localStorage.getItem('authToken');

      if (!token) {
        setUser(null);

        if (isMounted) {
          setIsReady(true);
        }

        return;
      }

      try {
        const user = await validateSession();
        setUser(user);
      } catch {
        signOut();
      } finally {
        if (isMounted) {
          setIsReady(true);
        }
      }
    }

    void bootstrapSession();

    return () => {
      isMounted = false;
    };
  }, [setUser, signOut]);

  if (!isReady) {
    return null;
  }

  return children;
}
