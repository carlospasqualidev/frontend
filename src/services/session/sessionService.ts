import { api } from '../api';

import type {
  ISignInService,
  ISignInServiceResponse,
  IValidateResponse,
} from '@/services/session/types';

async function signIn(data: ISignInService) {
  return api.post<ISignInServiceResponse>('/session/login', data);
}

async function signOut() {
  return api.post<ISignInServiceResponse>('/session/logout');
}

async function validate() {
  return api.get<IValidateResponse>('/users/me');
}

export const sessionService = {
  signIn,
  validate,
  signOut,
};
