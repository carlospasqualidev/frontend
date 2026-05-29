import { useNavigate, useParams, useSearch } from '@tanstack/react-router';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { findUserById } from '@/screens/users/mockUsers';
import { ActivityTab } from '@/screens/users/userDetails/activityTab';
import { OverviewTab } from '@/screens/users/userDetails/overviewTab';
import { PermissionsTab } from '@/screens/users/userDetails/permissionsTab';
import { SessionsTab } from '@/screens/users/userDetails/sessionsTab';

const TABS = ['overview', 'activity', 'permissions', 'sessions'] as const;
type TabValue = (typeof TABS)[number];

function isTabValue(value: unknown): value is TabValue {
  return (
    typeof value === 'string' && (TABS as readonly string[]).includes(value)
  );
}

export function UserDetailsPage() {
  const { userId } = useParams({ strict: false });
  const search = useSearch({ strict: false }) as { tab?: string };
  const navigate = useNavigate();
  const user = userId ? findUserById(userId) : undefined;

  const activeTab: TabValue = isTabValue(search.tab) ? search.tab : 'overview';

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

  const setTab = (next: string) => {
    void navigate({
      to: '.',
      search: (previous: Record<string, unknown>) => ({
        ...previous,
        tab: next === 'overview' ? undefined : next,
      }),
      replace: true,
    });
  };

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

      <Tabs value={activeTab} onValueChange={setTab}>
        <TabsList variant="line">
          <TabsTrigger value="overview">
            <UserCog />
            Visão geral
          </TabsTrigger>
          <TabsTrigger value="activity">
            <Activity />
            Atividade
          </TabsTrigger>
          <TabsTrigger value="permissions">
            <Shield />
            Permissões
          </TabsTrigger>
          <TabsTrigger value="sessions">
            <MonitorSmartphone />
            Sessões
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="pt-4">
          <OverviewTab user={user} />
        </TabsContent>

        <TabsContent value="activity" className="pt-4">
          <ActivityTab user={user} />
        </TabsContent>

        <TabsContent value="permissions" className="pt-4">
          <PermissionsTab user={user} />
        </TabsContent>

        <TabsContent value="sessions" className="pt-4">
          <SessionsTab user={user} />
        </TabsContent>
      </Tabs>
    </>
  );
}
