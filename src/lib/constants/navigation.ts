import {
  LayoutDashboardIcon,
  Settings2Icon,
  type LucideIcon,
} from 'lucide-react';

export type AuthenticatedNavigationItem = {
  title: string;
  description: string;
  to: '/app' | '/app/settings';
  icon: LucideIcon;
};

export const authenticatedNavigation: AuthenticatedNavigationItem[] = [
  {
    title: 'Dashboard',
    description: 'Visao inicial do workspace autenticado.',
    to: '/app',
    icon: LayoutDashboardIcon,
  },
  {
    title: 'Settings',
    description: 'Configuracoes de sessao, layout e expansao futura.',
    to: '/app/settings',
    icon: Settings2Icon,
  },
];
