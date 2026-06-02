import { Card } from '@/components/global/card/card';
import { Typography } from '@/components/ui/typography';
import { dateFormatter } from '@/lib/dateTime/dateFormatter';
import {
  userRoleLabels,
  userStatusLabels,
  type ManagedUser,
} from '@/screens/users/types';

interface OverviewTabProps {
  user: ManagedUser;
}

interface DefinitionItemProps {
  label: string;
  children: React.ReactNode;
}

function DefinitionItem({ label, children }: DefinitionItemProps) {
  return (
    <div className="space-y-1">
      <Typography variant="small" className="text-muted-foreground">
        {label}
      </Typography>
      <div className="text-sm">{children}</div>
    </div>
  );
}

export function OverviewTab({ user }: OverviewTabProps) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card
        title="Identificação"
        description="Dados principais associados à conta."
      >
        <dl className="grid gap-4 sm:grid-cols-2">
          <DefinitionItem label="Nome">{user.name}</DefinitionItem>
          <DefinitionItem label="E-mail">{user.email}</DefinitionItem>
          <DefinitionItem label="Papel">
            {userRoleLabels.get(user.role)}
          </DefinitionItem>
          <DefinitionItem label="Status">
            {userStatusLabels.get(user.status)}
          </DefinitionItem>
          <DefinitionItem label="ID interno">
            <code className="rounded bg-muted px-1.5 py-0.5 text-xs">
              {user.id}
            </code>
          </DefinitionItem>
        </dl>
      </Card>

      <Card title="Acesso" description="Quando a conta foi criada e usada.">
        <dl className="grid gap-4 sm:grid-cols-2">
          <DefinitionItem label="Cadastrado em">
            {dateFormatter({ date: user.createdAt, hasTimeStamp: false })}
          </DefinitionItem>
          <DefinitionItem label="Último acesso">
            {user.lastLoginAt
              ? dateFormatter({ date: user.lastLoginAt, hasTimeStamp: false })
              : 'Nunca acessou'}
          </DefinitionItem>
        </dl>
      </Card>
    </div>
  );
}
