/**
 * Dados mockados que alimentam os blocos da home. Substituir cada exportação
 * por uma chamada ao backend quando a API estiver disponível — a forma do
 * objeto não precisa mudar.
 */

export interface HomeStat {
  id: string;
  label: string;
  value: string;
  /** Variação relativa ao período anterior, ex.: `+12.4%`. */
  delta: string;
  /** Sentido do delta — usado para colorir e escolher o ícone de seta. */
  trend: 'up' | 'down' | 'neutral';
  /**
   * Quando `true`, uma alta é interpretada como negativa (ex.: convites
   * pendentes acumulados). Inverte apenas a cor — o sinal continua o mesmo.
   */
  invertSentiment?: boolean;
  hint: string;
}

export const HOME_STATS: HomeStat[] = [
  {
    id: 'totalUsers',
    label: 'Usuários totais',
    value: '1.284',
    delta: '+8,3%',
    trend: 'up',
    hint: 'vs. mês anterior',
  },
  {
    id: 'newUsers',
    label: 'Novos este mês',
    value: '146',
    delta: '+22,1%',
    trend: 'up',
    hint: 'vs. mês anterior',
  },
  {
    id: 'activeSessions',
    label: 'Sessões ativas',
    value: '312',
    delta: '-4,2%',
    trend: 'down',
    hint: 'últimas 24h',
  },
  {
    id: 'pendingInvites',
    label: 'Convites pendentes',
    value: '17',
    delta: '+5',
    trend: 'up',
    invertSentiment: true,
    hint: 'aguardando aceite',
  },
];

export interface DailyActivityPoint {
  /** Rótulo curto (`Seg`, `Ter`, ...). */
  label: string;
  value: number;
}

export const WEEKLY_ACTIVITY: DailyActivityPoint[] = [
  { label: 'Seg', value: 24 },
  { label: 'Ter', value: 32 },
  { label: 'Qua', value: 41 },
  { label: 'Qui', value: 28 },
  { label: 'Sex', value: 47 },
  { label: 'Sáb', value: 14 },
  { label: 'Dom', value: 9 },
];

export type PendingTaskKind = 'invite' | 'review' | 'billing' | 'security';

export interface PendingTask {
  id: string;
  kind: PendingTaskKind;
  title: string;
  description: string;
  /** Texto curto à direita, ex.: "vence hoje", "3 itens". */
  hint: string;
}

export const PENDING_TASKS: PendingTask[] = [
  {
    id: 'task-invites',
    kind: 'invite',
    title: 'Aprovar convites',
    description: 'Há 5 convites aguardando aprovação de um administrador.',
    hint: '5 itens',
  },
  {
    id: 'task-review-permissions',
    kind: 'review',
    title: 'Revisar permissões',
    description: 'Contas com acesso amplo sem atividade nos últimos 60 dias.',
    hint: '8 contas',
  },
  {
    id: 'task-billing',
    kind: 'billing',
    title: 'Fatura próxima do vencimento',
    description: 'A próxima fatura do plano vence em 3 dias.',
    hint: 'vence em 3d',
  },
  {
    id: 'task-security',
    kind: 'security',
    title: 'Alertas de segurança',
    description: 'Dois logins a partir de localizações incomuns.',
    hint: '2 alertas',
  },
];

export type RecentActivityType =
  | 'user-added'
  | 'role-changed'
  | 'invite-sent'
  | 'login'
  | 'security-alert';

export interface RecentActivityItem {
  id: string;
  type: RecentActivityType;
  message: string;
  /** Texto pré-formatado, ex.: "há 12 min", "ontem", "há 2 d". */
  relativeTime: string;
}

export const RECENT_ACTIVITY: RecentActivityItem[] = [
  {
    id: 'evt-001',
    type: 'user-added',
    message: 'Priscila Camargo entrou no espaço como Membro.',
    relativeTime: 'há 12 min',
  },
  {
    id: 'evt-002',
    type: 'role-changed',
    message: 'Hugo Cardoso teve o papel alterado para Administrador.',
    relativeTime: 'há 47 min',
  },
  {
    id: 'evt-003',
    type: 'security-alert',
    message: 'Login bloqueado para Diego Macedo (localização incomum).',
    relativeTime: 'há 1 h',
  },
  {
    id: 'evt-004',
    type: 'invite-sent',
    message: 'Convite enviado para natalia.quintela@example.com.',
    relativeTime: 'há 3 h',
  },
  {
    id: 'evt-005',
    type: 'login',
    message: 'Mariana Carvalho acessou de um novo dispositivo.',
    relativeTime: 'ontem',
  },
  {
    id: 'evt-006',
    type: 'role-changed',
    message: 'Bruno Souza foi promovido a Gestor.',
    relativeTime: 'há 2 d',
  },
];

export interface QuickAction {
  id: string;
  label: string;
  description: string;
  /** Rota interna para `useNavigate({ to })`, ou `null` para apenas exibir toast. */
  to: string | null;
}

export const QUICK_ACTIONS: QuickAction[] = [
  {
    id: 'qa-invite',
    label: 'Convidar usuário',
    description: 'Envie um convite por e-mail para o time.',
    to: '/users',
  },
  {
    id: 'qa-manage',
    label: 'Gerenciar usuários',
    description: 'Veja a lista completa, filtre por papel e status.',
    to: '/users',
  },
  {
    id: 'qa-audit',
    label: 'Abrir auditoria',
    description: 'Histórico completo de ações de toda a organização.',
    to: null,
  },
  {
    id: 'qa-settings',
    label: 'Configurações',
    description: 'Preferências do espaço, integrações e cobrança.',
    to: null,
  },
];
