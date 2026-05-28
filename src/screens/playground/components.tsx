import type { ReactNode } from 'react';
import { Link } from '@tanstack/react-router';

import { Card } from '@/components/global/card/card';
import { Button } from '@/components/ui/button';
import { Typography } from '@/components/ui/typography';

type PlaygroundHeaderProps = {
  title: string;
  description: string;
  actions?: ReactNode;
};

type PlaygroundLinkCardProps = {
  title: string;
  description: string;
  to: string;
};

export function PlaygroundHeader({
  title,
  description,
  actions,
}: PlaygroundHeaderProps) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-border/70 bg-card p-4 shadow-sm sm:rounded-3xl sm:p-6 lg:flex-row lg:items-center lg:justify-between dark:shadow-none">
      <div className="space-y-2">
        <Typography as="h1" variant="h3">
          {title}
        </Typography>
        <Typography variant="muted" className="max-w-2xl">
          {description}
        </Typography>
      </div>
      {actions ? <div className="shrink-0">{actions}</div> : null}
    </div>
  );
}

export function PlaygroundLinkCard({
  title,
  description,
  to,
}: PlaygroundLinkCardProps) {
  return (
    <Card title={title} description={description}>
      <Button asChild>
        <Link to={to}>Abrir página</Link>
      </Button>
    </Card>
  );
}
