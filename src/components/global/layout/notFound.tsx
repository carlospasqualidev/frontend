import { useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';

export function NotFoundRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    void navigate({ to: '/', replace: true });
  }, [navigate]);

  return null;
}
