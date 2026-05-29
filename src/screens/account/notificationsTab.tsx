import { toast } from 'sonner';

import { Card } from '@/components/global/card/card';
import { Switch } from '@/components/ui/switch';
import { Typography } from '@/components/ui/typography';

interface NotificationSetting {
  id: string;
  label: string;
  description: string;
  defaultChecked: boolean;
}

const CHANNELS: NotificationSetting[] = [
  {
    id: 'channel-email',
    label: 'E-mail',
    description: 'Receba notificações no e-mail cadastrado.',
    defaultChecked: true,
  },
  {
    id: 'channel-push',
    label: 'Push',
    description: 'Avisos no navegador e celular.',
    defaultChecked: true,
  },
  {
    id: 'channel-inapp',
    label: 'Dentro do sistema',
    description: 'Indicador no sino da barra superior.',
    defaultChecked: true,
  },
];

const EVENTS: NotificationSetting[] = [
  {
    id: 'event-activity',
    label: 'Atividade da conta',
    description: 'Novos logins, alterações no perfil e em permissões.',
    defaultChecked: true,
  },
  {
    id: 'event-security',
    label: 'Alertas de segurança',
    description: 'Acessos suspeitos e tentativas bloqueadas.',
    defaultChecked: true,
  },
  {
    id: 'event-product',
    label: 'Atualizações do produto',
    description: 'Novas funcionalidades e melhorias relevantes.',
    defaultChecked: false,
  },
  {
    id: 'event-marketing',
    label: 'Conteúdo e promoções',
    description: 'Newsletters, dicas e ofertas ocasionais.',
    defaultChecked: false,
  },
];

interface SettingRowProps {
  setting: NotificationSetting;
}

function SettingRow({ setting }: SettingRowProps) {
  return (
    <li className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
      <div className="min-w-0 space-y-0.5">
        <Typography as="span" variant="small" className="block">
          {setting.label}
        </Typography>
        <Typography variant="muted" className="text-xs">
          {setting.description}
        </Typography>
      </div>
      <Switch
        id={setting.id}
        defaultChecked={setting.defaultChecked}
        aria-label={setting.label}
        onCheckedChange={(checked) =>
          toast(
            checked
              ? `${setting.label}: ativado.`
              : `${setting.label}: desativado.`
          )
        }
      />
    </li>
  );
}

export function NotificationsTab() {
  return (
    <div className="grid gap-4">
      <Card
        title="Canais"
        description="Onde você quer ser notificado sobre eventos do sistema."
      >
        <ul className="divide-y divide-border/60">
          {CHANNELS.map((channel) => (
            <SettingRow key={channel.id} setting={channel} />
          ))}
        </ul>
      </Card>

      <Card
        title="Eventos"
        description="Quais tipos de evento disparam uma notificação."
      >
        <ul className="divide-y divide-border/60">
          {EVENTS.map((event) => (
            <SettingRow key={event.id} setting={event} />
          ))}
        </ul>
      </Card>
    </div>
  );
}
