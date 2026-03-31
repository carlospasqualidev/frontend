import { create } from 'zustand';

import type { ISessionStore } from '@/types/session/types';
import { sessionService } from '@/services/session/sessionService';

export const useSessionStore = create<ISessionStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  signOut: async () => {
    await sessionService.signOut();
    set({ user: null });
  },
}));
