import { toast } from 'sonner';

import { Card } from '@/components/global/card/card';
import { Switch } from '@/components/ui/switch';
import { Typography } from '@/components/ui/typography';
import { getUserPermissions } from '@/screens/users/mockUsers';
import { type ManagedUser } from '@/screens/users/types';

interface PermissionsTabProps {
  user: ManagedUser;
}

export function PermissionsTab({ user }: PermissionsTabProps) {
  const permissions = getUserPermissions(user);

  return (
    <Card
      title="Permissões"
      description="Capacidades atribuídas ao papel deste usuário. Alterações são aplicadas imediatamente."
    >
      <ul className="divide-y divide-border/60">
        {permissions.map((permission) => (
          <li
            key={permission.id}
            className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0"
          >
            <div className="min-w-0 space-y-0.5">
              <Typography as="span" variant="small" className="block">
                {permission.label}
              </Typography>
              <Typography variant="muted" className="text-xs">
                {permission.description}
              </Typography>
            </div>
            <Switch
              defaultChecked={permission.granted}
              aria-label={permission.label}
              onCheckedChange={(checked) =>
                toast(
                  checked
                    ? `Permissão "${permission.label}" concedida.`
                    : `Permissão "${permission.label}" revogada.`
                )
              }
            />
          </li>
        ))}
      </ul>
    </Card>
  );
}
