import { useEffect, useState, type PropsWithChildren } from 'react';
import { useNavigate } from '@tanstack/react-router';

import { SessionValidationScreen } from './sessionValidationScreen';

import { useSessionStore } from '@/hooks/useSessionStore';
import { sessionService } from '@/services/session/sessionService';

export function SessionValidation({ children }: PropsWithChildren) {
  const [isReady, setIsReady] = useState(false);
  const { setUser, signOut, user } = useSessionStore();
  const navigate = useNavigate();

  useEffect(() => {
    async function bootstrapSession() {
      try {
        if (user) {
          setIsReady(true);
          return;
        }

        const data = await sessionService.validate();

        setUser(data.user);
        setIsReady(true);
      } catch {
        setUser(null);
        await signOut().catch(() => undefined);
        await navigate({ to: '/login', replace: true });
      }
    }

    void bootstrapSession();
  }, [navigate, setUser, signOut]);

  if (!isReady) {
    return <SessionValidationScreen />;
  }

  return children;
}
