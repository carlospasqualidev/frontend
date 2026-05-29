import { Bell, CreditCard, Shield, UserCog } from 'lucide-react';

import { UrlTabs } from '@/components/global/tabs/urlTabs';
import { BillingTab } from '@/screens/account/billingTab';
import { NotificationsTab } from '@/screens/account/notificationsTab';
import { ProfileTab } from '@/screens/account/profileTab';
import { SecurityTab } from '@/screens/account/securityTab';

export function AccountPage() {
  return (
    <UrlTabs
      defaultValue="profile"
      items={[
        {
          value: 'profile',
          icon: <UserCog />,
          label: 'Perfil',
          content: <ProfileTab />,
        },
        {
          value: 'security',
          icon: <Shield />,
          label: 'Segurança',
          content: <SecurityTab />,
        },
        {
          value: 'notifications',
          icon: <Bell />,
          label: 'Notificações',
          content: <NotificationsTab />,
        },
        {
          value: 'billing',
          icon: <CreditCard />,
          label: 'Pagamento',
          content: <BillingTab />,
        },
      ]}
    />
  );
}
