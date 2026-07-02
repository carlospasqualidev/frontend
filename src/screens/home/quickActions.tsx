import { useNavigate } from '@tanstack/react-router';
import { ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

import { Card } from '@/components/global/card/card';
import { Typography } from '@/components/ui/typography';
import {
  QUICK_ACTIONS,
  type QuickAction,
} from '@/screens/home/utils/homeMockData';

interface QuickActionsProps {
  className?: string;
}

export function QuickActions({ className }: QuickActionsProps) {
  const navigate = useNavigate();

  const open = (action: QuickAction) => {
    if (action.to) {
      void navigate({ to: action.to });
      return;
    }
    toast(`${action.label} ainda não está disponível.`);
  };

  return (
    <Card
      title="Acesso rápido"
      description="Atalhos para as ações mais comuns do espaço."
      className={className}
    >
      <ul className="grid gap-2 sm:grid-cols-2">
        {QUICK_ACTIONS.map((action) => (
          <li key={action.id}>
            <button
              type="button"
              onClick={() => open(action)}
              className="group flex w-full items-start gap-3 rounded-2xl border border-border/70 bg-background p-4 text-left transition-colors hover:bg-muted/60 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            >
              <div className="min-w-0 flex-1 space-y-1">
                <Typography as="span" variant="small" className="block">
                  {action.label}
                </Typography>
                <Typography variant="muted" className="text-xs">
                  {action.description}
                </Typography>
              </div>
              <ArrowRight className="mt-0.5 size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
            </button>
          </li>
        ))}
      </ul>
    </Card>
  );
}
