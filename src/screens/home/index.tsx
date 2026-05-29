import { useSessionStore } from '@/hooks/useSessionStore';
import { ActivityChart } from '@/screens/home/activityChart';
import { HomeGreeting } from '@/screens/home/homeGreeting';
import { PendingTasks } from '@/screens/home/pendingTasks';
import { QuickActions } from '@/screens/home/quickActions';
import { RecentActivity } from '@/screens/home/recentActivity';
import { StatsGrid } from '@/screens/home/statsGrid';

export function DashboardPage() {
  const user = useSessionStore((state) => state.user);

  return (
    <>
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
