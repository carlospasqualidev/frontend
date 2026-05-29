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
import { findUserById } from '@/screens/users/mockUsers';
import { ActivityTab } from '@/screens/users/userDetails/activityTab';
import { OverviewTab } from '@/screens/users/userDetails/overviewTab';
import { PermissionsTab } from '@/screens/users/userDetails/permissionsTab';
import { SessionsTab } from '@/screens/users/userDetails/sessionsTab';

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
