import { api } from '../api';

import type {
  ISignInService,
  ISignInServiceResponse,
  IValidateResponse,
} from '@/types/session/types';

async function signIn(data: ISignInService) {
  return api.post<ISignInServiceResponse>('/auth/login', data);
}

async function signOut() {
  return api.post<ISignInServiceResponse>('/auth/logout');
}

async function validate() {
  return api.get<IValidateResponse>('/users/validate-token');
}

export const sessionService = {
  signIn,
  validate,
  signOut,
};
