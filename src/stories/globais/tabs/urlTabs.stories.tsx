import { Bell, Receipt, Shield, UserCog } from 'lucide-react';
import {
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  RouterProvider,
} from '@tanstack/react-router';
import type { Meta, StoryObj } from '@storybook/tanstack-react';

import { Card } from '@/components/global/card/card';
import { UrlTabs } from '@/components/global/tabs/urlTabs';
import { Typography } from '@/components/ui/typography';

const meta = {
  title: 'Globais/UrlTabs',
  component: UrlTabs,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Abas com o valor ativo sincronizado a um search param da URL (`?tab=...`). Quando o valor é o `defaultValue`, a chave é removida (mantém a URL limpa).',
      },
    },
  },
  args: {
    items: [],
    defaultValue: '',
  },
} satisfies Meta<typeof UrlTabs>;

export default meta;
type Story = StoryObj<typeof meta>;

function withRouter(Story: () => React.ReactElement) {
  const rootRoute = createRootRoute({ component: () => <Story /> });
  const indexRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/',
    component: () => <Outlet />,
  });
  const router = createRouter({
    routeTree: rootRoute.addChildren([indexRoute]),
    history: createMemoryHistory({ initialEntries: ['/'] }),
  });
  return <RouterProvider router={router} />;
}

export const Vitrine: Story = {
  render: () => (
    <div className="grid gap-6">
      <Card
        title="Padrão de página com abas"
        description="Ícone + label no trigger, conteúdo correspondente abaixo. Sincroniza com `?tab=...` (a aba padrão fica sem param na URL)."
      >
        <UrlTabs
          defaultValue="profile"
          items={[
            {
              value: 'profile',
              icon: <UserCog />,
              label: 'Perfil',
              content: (
                <Typography variant="muted">
                  Dados pessoais, foto e preferências do usuário logado.
                </Typography>
              ),
            },
            {
              value: 'security',
              icon: <Shield />,
              label: 'Segurança',
              content: (
                <Typography variant="muted">
                  Senha, autenticação em 2 fatores e sessões ativas.
                </Typography>
              ),
            },
            {
              value: 'notifications',
              icon: <Bell />,
              label: 'Notificações',
              content: (
                <Typography variant="muted">
                  Canais e tipos de evento que disparam notificações.
                </Typography>
              ),
            },
            {
              value: 'billing',
              icon: <Receipt />,
              label: 'Pagamento',
              content: (
                <Typography variant="muted">
                  Plano atual, método de pagamento e histórico de faturas.
                </Typography>
              ),
            },
          ]}
        />
      </Card>

      <Card
        title="Sem ícones"
        description="Os ícones são opcionais — útil quando as labels já são curtas e auto-explicativas."
      >
        <UrlTabs
          defaultValue="overview"
          searchKey="view"
          items={[
            {
              value: 'overview',
              label: 'Visão geral',
              content: (
                <Typography variant="muted">
                  Resumo do espaço, métricas principais e atividade recente.
                </Typography>
              ),
            },
            {
              value: 'activity',
              label: 'Atividade',
              content: (
                <Typography variant="muted">
                  Histórico cronológico de eventos.
                </Typography>
              ),
            },
          ]}
        />
      </Card>
    </div>
  ),
  decorators: [withRouter],
  parameters: {
    docs: {
      description: {
        story:
          'Padrão usado em `screens/account` e `screens/users/userDetails`. Os search params alheios à aba (filtros, paginação) ficam preservados ao trocar de aba.',
      },
    },
  },
};
