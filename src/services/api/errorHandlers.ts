import axios from 'axios';
import { toast } from 'sonner';

import type { ICatchHandler, IThenHandler } from '@/services/api/types';

export const sendErrorMessage = async ({ error }: { error: Error }) => {
  if (import.meta.env.PROD) {
    axios.post('https://ada-logs.herokuapp.com/api/errors/create', {
      projectName: import.meta.env.VITE_PROJECT_NAME,
      environment: import.meta.env.VITE_PROJECT_ENVIRONMENT,
      side: import.meta.env.VITE_PROJECT_SIDE,
      errorStack: error.stack,
      extraInfo: {
        url: window.location.href,
        user: localStorage.getItem('user') ?? '',
      },
    });
  }
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
