import { create } from 'zustand';

import { sessionService } from '@/services/session/sessionService';
import type { IUser } from '@/types/user/types';

export interface ISessionStore {
  user: IUser | null;
  setUser: (user: IUser | null) => void;
  signOut: () => Promise<void>;
}

export const useSessionStore = create<ISessionStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  signOut: async () => {
    await sessionService.signOut();
    set({ user: null });
  },
}));
