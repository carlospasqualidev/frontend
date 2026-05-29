import { create } from 'zustand';

import { sessionUserRef } from '@/services/api/sessionUserRef';
import { sessionService } from '@/services/session/sessionService';
import type { IUser } from '@/types/user/types';

export interface ISessionStore {
  user: IUser | null;
  setUser: (user: IUser | null) => void;
  signOut: () => Promise<void>;
}

export const useSessionStore = create<ISessionStore>((set) => ({
  user: null,
  setUser: (user) => {
    sessionUserRef.set(user);
    set({ user });
  },
  signOut: async () => {
    try {
      await sessionService.signOut();
    } finally {
      sessionUserRef.set(null);
      set({ user: null });
    }
  },
}));
