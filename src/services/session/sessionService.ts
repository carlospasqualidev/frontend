/* -----------------------------------------------------------------------------
 * MODO FAKE DE SESSÃO (sem backend)
 * -----------------------------------------------------------------------------
 * Este arquivo está rodando uma implementação FALSA do `sessionService` para
 * permitir navegar pelo template do frontend sem o `server` ligado.
 * O "cookie de sessão" aqui é um cookie comum (JS-acessível) que guarda o
 * usuário fictício em base64. Não é HTTP-only — não use em produção.
 *
 * Comportamento:
 *   - signIn(email, password):  aceita QUALQUER credencial válida pelo schema
 *                               (qualquer e-mail e qualquer senha não-vazia).
 *                               Grava o cookie e retorna um usuário derivado
 *                               do e-mail informado.
 *   - signUp(name, email, ...): grava o cookie com o nome informado.
 *   - signOut():                limpa o cookie.
 *   - validate():               lê o cookie. Se não houver, lança (assim
 *                               `SessionValidation` redireciona pro /login,
 *                               igual ao backend real respondendo 401).
 *
 * COMO VOLTAR PARA O BACKEND REAL:
 *   1. Apague tudo daqui até a linha "FIM DO MODO FAKE".
 *   2. Descomente o bloco "IMPLEMENTAÇÃO REAL" no final do arquivo.
 *   3. Apague também o arquivo `fakeSessionCookie.ts` (vizinho deste).
 *   4. Garanta que `VITE_API_URL` no `.env` aponta para o backend e suba o
 *      `server` (`npm run dev` em `../server`).
 * -------------------------------------------------------------------------- */

import {
  clearFakeSessionCookie,
  readFakeSessionCookie,
  writeFakeSessionCookie,
} from './fakeSessionCookie';

import type {
  ISignInService,
  ISignInServiceResponse,
  ISignUpService,
  IValidateResponse,
} from '@/services/session/types';
import type { IUser } from '@/types/user/types';

const FAKE_LATENCY_MS = 250;

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function deriveNameFromEmail(email: string) {
  const localPart = email.split('@')[0] ?? 'Usuário';
  return localPart
    .replace(/[._-]+/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase())
    .trim();
}

function buildUser({ name, email }: { name: string; email: string }): IUser {
  return {
    id: `fake-${btoa(email).replace(/=+$/, '')}`,
    name,
    email,
    image: null,
  };
}

async function signIn({
  email,
  password: _password,
}: ISignInService): Promise<ISignInServiceResponse> {
  await delay(FAKE_LATENCY_MS);
  const user = buildUser({ name: deriveNameFromEmail(email), email });
  writeFakeSessionCookie(user);
  return { success: true, user };
}

async function signUp({
  name,
  email,
  password: _password,
}: ISignUpService): Promise<ISignInServiceResponse> {
  await delay(FAKE_LATENCY_MS);
  const user = buildUser({ name, email });
  writeFakeSessionCookie(user);
  return { success: true, user };
}

async function signOut(): Promise<ISignInServiceResponse> {
  await delay(FAKE_LATENCY_MS);
  clearFakeSessionCookie();
  return {
    success: true,
    user: { id: '', name: '', email: '', image: null },
  };
}

async function validate(): Promise<IValidateResponse> {
  await delay(FAKE_LATENCY_MS);
  const user = readFakeSessionCookie();
  if (!user) {
    throw new Error('Sessão fake ausente.');
  }
  return { user };
}

export const sessionService = {
  signIn,
  signUp,
  validate,
  signOut,
};

/* ----------------------------- FIM DO MODO FAKE ----------------------------- */

/* -----------------------------------------------------------------------------
 * IMPLEMENTAÇÃO REAL (descomente ao voltar para o backend)
 * -------------------------------------------------------------------------- */
/*
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
*/
