import axios from 'axios';
import { toast } from 'sonner';

import { env } from '@/lib/env';
import type { ICatchHandler, IThenHandler } from '@/services/api/types';

/**
 * Envia o erro para um serviço de log externo, se `VITE_ERROR_LOG_URL`
 * estiver configurado. Só dispara em produção. Nunca lança — falhas no
 * reporte não devem derrubar a aplicação.
 */
export const sendErrorMessage = async ({ error }: { error: unknown }) => {
  if (!import.meta.env.PROD || !env.VITE_ERROR_LOG_URL) {
    return;
  }

  const errorStack = error instanceof Error ? error.stack : String(error);

  // Import dinâmico para evitar dependência circular com a store de sessão.
  const { useSessionStore } = await import('@/hooks/useSessionStore');
  const user = useSessionStore.getState().user;

  await axios
    .post(env.VITE_ERROR_LOG_URL, {
      projectName: env.VITE_PROJECT_NAME,
      environment: env.VITE_PROJECT_ENVIRONMENT,
      side: env.VITE_PROJECT_SIDE,
      errorStack,
      extraInfo: {
        url: window.location.href,
        user: user ? JSON.stringify(user) : '',
      },
    })
    .catch(() => undefined);
};

export const catchHandler = (err: ICatchHandler) => {
  if (err.response?.data) {
    if (err.response.data.message)
      toast.error(err.response.data.message, { id: 'errorToastId' });
    else toast.error(`Erro ${err.response.status}`, { id: 'errorToastId' });
  } else {
    toast.error('Erro de comunicação', { id: 'errorToastId' });
  }
};

export const thenHandler = (res: IThenHandler) => {
  if (res?.data?.message) {
    toast.success(res.data.message);
  }
};
