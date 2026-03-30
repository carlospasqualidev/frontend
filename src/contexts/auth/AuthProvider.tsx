import { useEffect, useState, type PropsWithChildren } from 'react';
import { useNavigate } from '@tanstack/react-router';

import { useSessionStore } from '../../hooks/useSessionStore';

import { SessionValidationScreen } from './SessionValidationScreen';

import { sessionService } from '@/services/session/sessionService';

export function AuthProvider({ children }: PropsWithChildren) {
  const [isReady, setIsReady] = useState(false);
  const { setUser, signOut, user } = useSessionStore();
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    async function bootstrapSession() {
      try {
        if (user) {
          setIsReady(true);
          return;
        }

        const data = await sessionService.validate();

        if (isMounted) {
          setUser(data.user);
          setIsReady(true);
        }
      } catch {
        if (isMounted) {
          setUser(null);
          await signOut().catch(() => undefined);
          await navigate({ to: '/login', replace: true });
        }
      }
    }

    void bootstrapSession();

    return () => {
      isMounted = false;
    };
  }, [navigate, setUser, signOut]);

  if (!isReady) {
    return <SessionValidationScreen />;
  }

  return children;
}
