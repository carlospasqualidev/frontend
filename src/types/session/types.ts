import type { IUser } from '../user/types';

export interface ISignInService {
  username: string;
  password: string;
}

export interface ISignInServiceResponse {
  success: boolean;
}

export type IValidateResponse = IUser;

export interface ISessionStore {
  user: IUser | null;
  setUser: (user: IUser | null) => void;
  signIn: (token: string) => void;
  signOut: () => void;
}
