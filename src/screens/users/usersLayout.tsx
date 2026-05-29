import { Outlet } from '@tanstack/react-router';

/**
 * Layout vazio que existe apenas para aninhar as rotas filhas (`/users`,
 * `/users/$userId`) sob um pai comum. Isso permite que o breadcrumb global
 * monte a cadeia "Usuários › Detalhes do usuário" via `useMatches()`.
 */
export function UsersLayout() {
  return <Outlet />;
}
