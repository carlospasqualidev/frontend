import {
  Activity,
  KeyRound,
  LogIn,
  Pencil,
  Shield,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';

import { Card } from '@/components/global/card/card';
import { Empty } from '@/components/global/empty/empty';
import { Typography } from '@/components/ui/typography';
import { dateFormatter } from '@/lib/dateTime/dateFormatter';
import { getUserActivity } from '@/screens/users/utils/mockUsers';
import {
  type ManagedUser,
  type UserActivityType,
} from '@/screens/users/utils/types';

interface ActivityTabProps {
  user: ManagedUser;
}

const ACTIVITY_ICON: Record<
  UserActivityType,
  React.ComponentType<{ className?: string }>
> = {
  login: LogIn,
  'invite-accepted': UserCheck,
  'role-change': ShieldCheck,
  'password-changed': KeyRound,
  'profile-updated': Pencil,
  'session-revoked': Shield,
};

export function ActivityTab({ user }: ActivityTabProps) {
  const events = getUserActivity(user);

  if (events.length === 0) {
    return (
      <Empty
        title="Sem atividade registrada"
        description="Eventos aparecerão aqui assim que o usuário interagir com o sistema."
        icon={<Activity />}
      />
    );
  }

  return (
    <Card
      title="Histórico recente"
      description="Eventos relevantes ordenados do mais novo para o mais antigo."
    >
      <ol className="space-y-4">
        {events.map((event, index) => {
          const Icon = ACTIVITY_ICON[event.type];
          const isLast = index === events.length - 1;
          return (
            <li key={event.id} className="flex gap-3">
              <div className="flex flex-col items-center">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
                  <Icon className="size-4" />
                </span>
                {isLast ? null : (
                  <span className="my-1 w-px flex-1 bg-border" aria-hidden />
                )}
              </div>
              <div className="space-y-1 pb-2">
                <Typography as="p" variant="small">
                  {event.message}
                </Typography>
                <Typography variant="muted" className="text-xs">
                  {dateFormatter({
                    date: event.occurredAt,
                    hasTimeStamp: false,
                  })}
                </Typography>
              </div>
            </li>
          );
        })}
      </ol>
    </Card>
  );
}
