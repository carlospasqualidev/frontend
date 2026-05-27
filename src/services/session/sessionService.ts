import { api } from '@/services/api';
import type {
  ISignInService,
  ISignInServiceResponse,
  ISignUpService,
  IValidateResponse,
} from '@/services/session/types';

async function signIn(data: ISignInService) {
  return api.post<ISignInServiceResponse>('/client/session/login', data);
}

async function signUp(data: ISignUpService) {
  return api.post<ISignInServiceResponse>('/client/session/register', data);
}

async function signOut() {
  return api.post<ISignInServiceResponse>('/client/session/logout');
}

async function validate() {
  return api.get<IValidateResponse>('/client/users/me');
}

export const sessionService = {
  signIn,
  signUp,
  validate,
  signOut,
};
