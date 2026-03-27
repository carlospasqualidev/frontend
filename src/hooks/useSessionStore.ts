import { create } from 'zustand';

import type { ISessionStore } from '@/types/session/types';

export const useSessionStore = create<ISessionStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  signIn: (token) => {
    localStorage.setItem('authToken', token);
  },
  signOut: () => {
    set({ user: null });
    localStorage.removeItem('authToken');
  },
}));

export const useAuthStore = useSessionStore;
