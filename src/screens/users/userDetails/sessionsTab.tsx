import { MonitorSmartphone } from 'lucide-react';
import { toast } from 'sonner';

import { Card } from '@/components/global/card/card';
import { Empty } from '@/components/global/empty/empty';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Typography } from '@/components/ui/typography';
import { dateFormatter } from '@/lib/dateTime/dateFormatter';
import { getUserSessions } from '@/screens/users/mockUsers';
import { type ManagedUser } from '@/screens/users/types';

interface SessionsTabProps {
  user: ManagedUser;
}

export function SessionsTab({ user }: SessionsTabProps) {
  const sessions = getUserSessions(user);

  if (sessions.length === 0) {
    return (
      <Empty
        title="Sem sessões ativas"
        description="O usuário ainda não acessou o sistema."
        icon={<MonitorSmartphone />}
      />
    );
  }

  return (
    <Card
      title="Sessões ativas"
      description="Dispositivos conectados a esta conta. Encerre sessões suspeitas para forçar o reenvio do login."
    >
      <ul className="space-y-3">
        {sessions.map((session, index) => (
          <li key={session.id} className="space-y-3">
            {index > 0 ? <Separator /> : null}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0 space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <Typography as="span" variant="small">
                    {session.device}
                  </Typography>
                  {session.current ? (
                    <Badge variant="default">Sessão atual</Badge>
                  ) : null}
                </div>
                <Typography variant="muted" className="text-xs">
                  {session.browser} · {session.location} · {session.ip}
                </Typography>
                <Typography variant="muted" className="text-xs">
                  Último uso em{' '}
                  {dateFormatter({
                    date: session.lastActiveAt,
                    hasTimeStamp: false,
                  })}
                </Typography>
              </div>
              <Button
                variant="outline"
                size="sm"
                disabled={session.current}
                onClick={() => toast(`Sessão em ${session.device} encerrada.`)}
              >
                Encerrar
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}
