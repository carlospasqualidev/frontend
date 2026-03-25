import axios from 'axios';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const errorHandler = async ({ error }: { error: Error }) => {
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
