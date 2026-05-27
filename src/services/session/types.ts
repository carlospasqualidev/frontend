import type { IUser } from '@/types/user/types';

export interface ISignInService {
  email: string;
  password: string;
}

export interface ISignUpService {
  name: string;
  email: string;
  password: string;
}

export interface ISignInServiceResponse {
  success: boolean;
  user: IUser;
}

export interface IValidateResponse {
  user: IUser;
}
