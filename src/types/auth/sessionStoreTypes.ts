import type { IUser } from '../user/userTypes';

export interface AuthState {
  user: IUser | null;
  setUser: (user: IUser | null) => void;
  signIn: (token: string) => void;
  signOut: () => void;
}
