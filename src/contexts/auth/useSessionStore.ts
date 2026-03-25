import { create } from 'zustand';

import type { AuthState } from '@/types/auth/sessionStoreTypes';

export const useSessionStore = create<AuthState>((set) => ({
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
