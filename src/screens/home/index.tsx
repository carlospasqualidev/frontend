import { useNavigate } from '@tanstack/react-router';
import { UserPlus } from 'lucide-react';

import { PageActions } from '@/components/global/layout/pageActions';
import { Button } from '@/components/ui/button';
import { useSessionStore } from '@/hooks/useSessionStore';
import { ActivityChart } from '@/screens/home/activityChart';
import { HomeGreeting } from '@/screens/home/homeGreeting';
import { PendingTasks } from '@/screens/home/pendingTasks';
import { QuickActions } from '@/screens/home/quickActions';
import { RecentActivity } from '@/screens/home/recentActivity';
import { StatsGrid } from '@/screens/home/statsGrid';

export function DashboardPage() {
  const user = useSessionStore((state) => state.user);
  const navigate = useNavigate();

  return (
    <>
      <PageActions>
        <Button
          aria-label="Convidar usuário"
          onClick={() => navigate({ to: '/users' })}
        >
          <UserPlus />
          <span className="hidden sm:inline">Convidar usuário</span>
        </Button>
      </PageActions>

      <HomeGreeting userName={user?.name} />
      <StatsGrid />

      <div className="grid gap-4 lg:grid-cols-3">
        <ActivityChart className="lg:col-span-2" />
        <PendingTasks />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <RecentActivity />
        <QuickActions />
      </div>
    </>
  );
}
