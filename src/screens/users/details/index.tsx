import { useNavigate, useParams } from '@tanstack/react-router';
import {
  Activity,
  MonitorSmartphone,
  Pencil,
  Shield,
  UserCog,
} from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/global/button/button';
import { Empty } from '@/components/global/empty/empty';
import { PageActions } from '@/components/global/layout/pageActions';
import { UrlTabs } from '@/components/global/tabs/urlTabs';
import { findUserById } from '@/screens/users/utils/mockUsers';
import { ActivityTab } from '@/screens/users/details/activityTab';
import { OverviewTab } from '@/screens/users/details/overviewTab';
import { PermissionsTab } from '@/screens/users/details/permissionsTab';
import { SessionsTab } from '@/screens/users/details/sessionsTab';

export function UserDetailsPage() {
  const { userId } = useParams({ strict: false });
  const navigate = useNavigate();
  const user = userId ? findUserById(userId) : undefined;

  if (!user) {
    return (
      <Empty
        title="Usuário não encontrado"
        description="O identificador é inválido ou o usuário foi removido."
      >
        <Button variant="outline" onClick={() => navigate({ to: '/users' })}>
          Voltar para a lista
        </Button>
      </Empty>
    );
  }

  return (
    <>
      <PageActions>
        <Button
          aria-label="Editar usuário"
          onClick={() => toast(`Editar ${user.name}.`)}
        >
          <Pencil />
          <span className="hidden sm:inline">Editar</span>
        </Button>
      </PageActions>

      <UrlTabs
        defaultValue="overview"
        items={[
          {
            value: 'overview',
            icon: <UserCog />,
            label: 'Visão geral',
            content: <OverviewTab user={user} />,
          },
          {
            value: 'activity',
            icon: <Activity />,
            label: 'Atividade',
            content: <ActivityTab user={user} />,
          },
          {
            value: 'permissions',
            icon: <Shield />,
            label: 'Permissões',
            content: <PermissionsTab user={user} />,
          },
          {
            value: 'sessions',
            icon: <MonitorSmartphone />,
            label: 'Sessões',
            content: <SessionsTab user={user} />,
          },
        ]}
      />
    </>
  );
}
