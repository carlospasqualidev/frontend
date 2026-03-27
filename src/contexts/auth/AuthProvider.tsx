import { useEffect, useState, type PropsWithChildren } from 'react';
import { useNavigate } from '@tanstack/react-router';

import { useSessionStore } from '../../hooks/useSessionStore';

import { sessionService } from '@/services/session/sessionService';

export function AuthProvider({ children }: PropsWithChildren) {
  const [isReady, setIsReady] = useState(false);
  const { setUser, signOut } = useSessionStore();
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    async function bootstrapSession() {
      try {
        const user = await sessionService.validate();

        if (isMounted) {
          setUser(user);
        }
      } catch {
        if (isMounted) {
          signOut();
          navigate({ to: '/login' });
        }
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
  }, [navigate, setUser, signOut]);

  if (!isReady) {
    return null;
  }

  return children;
}
