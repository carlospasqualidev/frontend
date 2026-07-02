import {
  LogIn,
  Mail,
  ShieldAlert,
  ShieldCheck,
  UserPlus,
  type LucideIcon,
} from 'lucide-react';

import { Card } from '@/components/global/card/card';
import { Typography } from '@/components/ui/typography';
import {
  RECENT_ACTIVITY,
  type RecentActivityType,
} from '@/screens/home/utils/homeMockData';

const ACTIVITY_ICON: Record<RecentActivityType, LucideIcon> = {
  'user-added': UserPlus,
  'role-changed': ShieldCheck,
  'invite-sent': Mail,
  login: LogIn,
  'security-alert': ShieldAlert,
};

const SECURITY_TONE =
  'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300';
const DEFAULT_TONE = 'bg-muted text-muted-foreground';

interface RecentActivityProps {
  className?: string;
}

export function RecentActivity({ className }: RecentActivityProps) {
  return (
    <Card
      title="Atividade recente"
      description="Últimos eventos relevantes do espaço."
      className={className}
    >
      <ol className="space-y-3">
        {RECENT_ACTIVITY.map((event) => {
          const Icon = ACTIVITY_ICON[event.type];
          const tone =
            event.type === 'security-alert' ? SECURITY_TONE : DEFAULT_TONE;
          return (
            <li key={event.id} className="flex items-start gap-3">
              <span
                className={`mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full [&>svg]:size-4 ${tone}`}
              >
                <Icon />
              </span>
              <div className="min-w-0 flex-1">
                <Typography as="p" variant="small">
                  {event.message}
                </Typography>
                <Typography variant="muted" className="text-xs">
                  {event.relativeTime}
                </Typography>
              </div>
            </li>
          );
        })}
      </ol>
    </Card>
  );
}
