/* -----------------------------------------------------------------------------
 * Helper EXCLUSIVO do modo fake de sessão.
 * Leia o cabeçalho de `sessionService.ts` para contexto e instruções de
 * remoção. Quando voltar a usar o backend real, apague este arquivo inteiro.
 * -------------------------------------------------------------------------- */

import type { IUser } from '@/types/user/types';

const COOKIE_NAME = 'fake_session_user';
const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

function encodeUser(user: IUser): string {
  return btoa(unescape(encodeURIComponent(JSON.stringify(user))));
}

function decodeUser(value: string): IUser | null {
  try {
    const parsed = JSON.parse(decodeURIComponent(escape(atob(value))));
    if (
      parsed &&
      typeof parsed.id === 'string' &&
      typeof parsed.name === 'string' &&
      typeof parsed.email === 'string'
    ) {
      return parsed as IUser;
    }
    return null;
  } catch {
    return null;
  }
}

function readCookieValue(name: string): string | null {
  const cookies = document.cookie ? document.cookie.split('; ') : [];
  for (const entry of cookies) {
    const separator = entry.indexOf('=');
    if (separator === -1) continue;
    const key = entry.slice(0, separator);
    if (key === name) {
      return entry.slice(separator + 1);
    }
  }
  return null;
}

export function readFakeSessionCookie(): IUser | null {
  const raw = readCookieValue(COOKIE_NAME);
  return raw ? decodeUser(raw) : null;
}

export function writeFakeSessionCookie(user: IUser): void {
  const value = encodeUser(user);
  document.cookie = `${COOKIE_NAME}=${value}; Path=/; Max-Age=${COOKIE_MAX_AGE_SECONDS}; SameSite=Lax`;
}

export function clearFakeSessionCookie(): void {
  document.cookie = `${COOKIE_NAME}=; Path=/; Max-Age=0; SameSite=Lax`;
}
