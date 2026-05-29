import {
  ArrowDownRight,
  ArrowUpRight,
  Mail,
  Minus,
  UserPlus,
  Users,
  Zap,
} from 'lucide-react';

import { Typography } from '@/components/ui/typography';
import { cn } from '@/lib/utils';
import { HOME_STATS, type HomeStat } from '@/screens/home/homeMockData';

const STAT_ICON: Record<HomeStat['id'], React.ComponentType> = {
  totalUsers: Users,
  newUsers: UserPlus,
  activeSessions: Zap,
  pendingInvites: Mail,
};

const TREND_ICON: Record<HomeStat['trend'], React.ComponentType> = {
  up: ArrowUpRight,
  down: ArrowDownRight,
  neutral: Minus,
};

function deltaColor(stat: HomeStat): string {
  if (stat.trend === 'neutral') return 'text-muted-foreground';
  const isPositive = stat.trend === 'up';
  const isGood = stat.invertSentiment ? !isPositive : isPositive;
  return isGood ? 'text-emerald-600 dark:text-emerald-500' : 'text-rose-600 dark:text-rose-500';
}

interface StatCardProps {
  stat: HomeStat;
}

function StatCard({ stat }: StatCardProps) {
  const Icon = STAT_ICON[stat.id];
  const TrendIcon = TREND_ICON[stat.trend];

  return (
    <article className="space-y-3 rounded-2xl border border-border/70 bg-card p-5 shadow-sm sm:rounded-3xl dark:shadow-none">
      <div className="flex items-center justify-between gap-3">
        <Typography variant="small" className="text-muted-foreground">
          {stat.label}
        </Typography>
        <span className="flex size-8 items-center justify-center rounded-full bg-muted text-muted-foreground [&>svg]:size-4">
          <Icon />
        </span>
      </div>
      <Typography as="strong" variant="h2" className="block">
        {stat.value}
      </Typography>
      <div className="flex items-center gap-2 text-xs">
        <span
          className={cn(
            'inline-flex items-center gap-1 font-medium [&>svg]:size-3',
            deltaColor(stat)
          )}
        >
          <TrendIcon />
          {stat.delta}
        </span>
        <Typography as="span" variant="muted" className="text-xs">
          {stat.hint}
        </Typography>
      </div>
    </article>
  );
}

export function StatsGrid() {
  return (
    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {HOME_STATS.map((stat) => (
        <StatCard key={stat.id} stat={stat} />
      ))}
    </section>
  );
}
