import { Laptop, MonitorSmartphone, Smartphone } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/global/button/button';
import { Card } from '@/components/global/card/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Typography } from '@/components/ui/typography';

interface AccountSession {
  id: string;
  device: string;
  icon: 'laptop' | 'phone';
  location: string;
  lastActive: string;
  current: boolean;
}

const SESSIONS: AccountSession[] = [
  {
    id: 'sess-current',
    device: 'MacBook Pro · Chrome',
    icon: 'laptop',
    location: 'São Paulo, BR',
    lastActive: 'agora',
    current: true,
  },
  {
    id: 'sess-mobile',
    device: 'iPhone 15 · Safari',
    icon: 'phone',
    location: 'São Paulo, BR',
    lastActive: 'há 2 h',
    current: false,
  },
  {
    id: 'sess-work',
    device: 'Windows 11 · Edge',
    icon: 'laptop',
    location: 'Rio de Janeiro, BR',
    lastActive: 'há 3 d',
    current: false,
  },
];

const DEVICE_ICON = {
  laptop: Laptop,
  phone: Smartphone,
};

export function SecurityTab() {
  return (
    <div className="grid gap-4">
      <Card
        title="Senha"
        description="Use uma senha forte e exclusiva deste sistema."
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Typography variant="muted">
            Última alteração há 4 meses.
          </Typography>
          <Button
            variant="outline"
            onClick={() => toast('Abrir formulário de alteração de senha.')}
          >
            Alterar senha
          </Button>
        </div>
      </Card>

      <Card
        title="Autenticação em 2 fatores"
        description="Exige um código adicional do seu app autenticador a cada login."
      >
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-1">
            <Typography as="span" variant="small" className="block">
              Aplicativo autenticador
            </Typography>
            <Typography variant="muted" className="text-xs">
              Recomendado. Compatível com 1Password, Authy, Google Authenticator.
            </Typography>
          </div>
          <Switch
            defaultChecked
            aria-label="Autenticação em 2 fatores"
            onCheckedChange={(checked) =>
              toast(
                checked
                  ? 'Autenticação em 2 fatores habilitada.'
                  : 'Autenticação em 2 fatores desabilitada.'
              )
            }
          />
        </div>
      </Card>

      <Card
        title="Sessões ativas"
        description="Dispositivos que estão atualmente conectados à sua conta."
      >
        <ul className="space-y-3">
          {SESSIONS.map((session, index) => {
            const Icon = DEVICE_ICON[session.icon];
            return (
              <li key={session.id} className="space-y-3">
                {index > 0 ? <Separator /> : null}
                <div className="flex items-center gap-3">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground [&>svg]:size-5">
                    <Icon />
                  </span>
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <Typography as="span" variant="small">
                        {session.device}
                      </Typography>
                      {session.current ? (
                        <Badge variant="default">Sessão atual</Badge>
                      ) : null}
                    </div>
                    <Typography variant="muted" className="text-xs">
                      {session.location} · ativa {session.lastActive}
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
            );
          })}
        </ul>
        <div className="mt-4 flex justify-end">
          <Button
            variant="ghost"
            onClick={() => toast('Todas as outras sessões foram encerradas.')}
          >
            <MonitorSmartphone />
            Encerrar todas as outras sessões
          </Button>
        </div>
      </Card>
    </div>
  );
}
