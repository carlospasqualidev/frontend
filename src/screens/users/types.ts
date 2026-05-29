export type UserRole = 'admin' | 'manager' | 'member' | 'viewer';

export type UserStatus = 'active' | 'inactive' | 'pending' | 'blocked';

export interface ManagedUser {
  id: string;
  name: string;
  email: string;
  image: string | null;
  role: UserRole;
  status: UserStatus;
  /** Data (`aaaa-mm-dd`) em que o convite/registro foi aceito. */
  createdAt: string;
  /** Último login (`aaaa-mm-dd`). `null` quando o usuário ainda não acessou. */
  lastLoginAt: string | null;
}

export const USER_ROLE_LABELS: Record<UserRole, string> = {
  admin: 'Administrador',
  manager: 'Gestor',
  member: 'Membro',
  viewer: 'Visualizador',
};

export const USER_STATUS_LABELS: Record<UserStatus, string> = {
  active: 'Ativo',
  inactive: 'Inativo',
  pending: 'Pendente',
  blocked: 'Bloqueado',
};

export const USER_ROLE_OPTIONS: { value: UserRole; label: string }[] = (
  Object.keys(USER_ROLE_LABELS) as UserRole[]
).map((value) => ({ value, label: USER_ROLE_LABELS[value] }));

export const USER_STATUS_OPTIONS: { value: UserStatus; label: string }[] = (
  Object.keys(USER_STATUS_LABELS) as UserStatus[]
).map((value) => ({ value, label: USER_STATUS_LABELS[value] }));

export type UserActivityType =
  | 'login'
  | 'invite-accepted'
  | 'role-change'
  | 'password-changed'
  | 'profile-updated'
  | 'session-revoked';

export interface UserActivityEvent {
  id: string;
  type: UserActivityType;
  message: string;
  /** Data ISO (`aaaa-mm-dd`). */
  occurredAt: string;
}

export interface UserPermission {
  id: string;
  label: string;
  description: string;
  granted: boolean;
}

export interface UserSession {
  id: string;
  device: string;
  browser: string;
  location: string;
  ip: string;
  /** Data ISO do último uso (`aaaa-mm-dd`). */
  lastActiveAt: string;
  /** Se é a sessão pela qual o usuário está logado agora. */
  current: boolean;
}
