import type { IUser } from '@/types/user/types';

/**
 * Referência mutável e isolada do usuário autenticado.
 *
 * Existe para quebrar o ciclo de imports entre `errorHandlers` (que precisa do
 * usuário ao reportar erros) e `useSessionStore` (que importa `sessionService`,
 * que por sua vez depende de `errorHandlers`).
 *
 * A `useSessionStore` mantém esta referência sincronizada via `setUser`/`signOut`.
 */
let currentUser: IUser | null = null;

export const sessionUserRef = {
  set(user: IUser | null) {
    currentUser = user;
  },
  get(): IUser | null {
    return currentUser;
  },
};
