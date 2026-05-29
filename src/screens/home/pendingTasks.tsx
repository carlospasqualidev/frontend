import {
  AlertTriangle,
  CreditCard,
  Mail,
  ShieldCheck,
  type LucideIcon,
} from 'lucide-react';
import { toast } from 'sonner';

import { Card } from '@/components/global/card/card';
import { Button } from '@/components/ui/button';
import { Typography } from '@/components/ui/typography';
import {
  PENDING_TASKS,
  type PendingTask,
  type PendingTaskKind,
} from '@/screens/home/homeMockData';

const TASK_ICON: Record<PendingTaskKind, LucideIcon> = {
  invite: Mail,
  review: ShieldCheck,
  billing: CreditCard,
  security: AlertTriangle,
};

interface PendingTasksProps {
  className?: string;
}

export function PendingTasks({ className }: PendingTasksProps) {
  return (
    <Card
      title="Pendências"
      description="Itens que precisam da sua atenção."
      className={className}
    >
      <ul className="divide-y divide-border/60">
        {PENDING_TASKS.map((task) => (
          <PendingTaskItem key={task.id} task={task} />
        ))}
      </ul>
    </Card>
  );
}

interface PendingTaskItemProps {
  task: PendingTask;
}

function PendingTaskItem({ task }: PendingTaskItemProps) {
  const Icon = TASK_ICON[task.kind];

  return (
    <li className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
      <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground [&>svg]:size-4">
        <Icon />
      </span>
      <div className="min-w-0 flex-1 space-y-1">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <Typography as="span" variant="small">
            {task.title}
          </Typography>
          <Typography as="span" variant="muted" className="text-xs">
            {task.hint}
          </Typography>
        </div>
        <Typography variant="muted" className="text-xs">
          {task.description}
        </Typography>
      </div>
      <Button
        size="sm"
        variant="ghost"
        onClick={() => toast(`Abrir: ${task.title}`)}
      >
        Abrir
      </Button>
    </li>
  );
}
