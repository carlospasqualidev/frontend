import { useNavigate, useSearch } from '@tanstack/react-router';
import { Bell, CreditCard, Shield, UserCog } from 'lucide-react';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BillingTab } from '@/screens/account/billingTab';
import { NotificationsTab } from '@/screens/account/notificationsTab';
import { ProfileTab } from '@/screens/account/profileTab';
import { SecurityTab } from '@/screens/account/securityTab';

const TABS = ['profile', 'security', 'notifications', 'billing'] as const;
type TabValue = (typeof TABS)[number];

function isTabValue(value: unknown): value is TabValue {
  return (
    typeof value === 'string' && (TABS as readonly string[]).includes(value)
  );
}

export function AccountPage() {
  const search = useSearch({ strict: false }) as { tab?: string };
  const navigate = useNavigate();

  const activeTab: TabValue = isTabValue(search.tab) ? search.tab : 'profile';

  const setTab = (next: string) => {
    void navigate({
      to: '.',
      search: (previous: Record<string, unknown>) => ({
        ...previous,
        tab: next === 'profile' ? undefined : next,
      }),
      replace: true,
    });
  };

  return (
    <Tabs value={activeTab} onValueChange={setTab}>
      <TabsList variant="line">
        <TabsTrigger value="profile">
          <UserCog />
          Perfil
        </TabsTrigger>
        <TabsTrigger value="security">
          <Shield />
          Segurança
        </TabsTrigger>
        <TabsTrigger value="notifications">
          <Bell />
          Notificações
        </TabsTrigger>
        <TabsTrigger value="billing">
          <CreditCard />
          Pagamento
        </TabsTrigger>
      </TabsList>

      <TabsContent value="profile" className="pt-4">
        <ProfileTab />
      </TabsContent>

      <TabsContent value="security" className="pt-4">
        <SecurityTab />
      </TabsContent>

      <TabsContent value="notifications" className="pt-4">
        <NotificationsTab />
      </TabsContent>

      <TabsContent value="billing" className="pt-4">
        <BillingTab />
      </TabsContent>
    </Tabs>
  );
}
