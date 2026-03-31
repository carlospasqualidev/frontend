import type { ReactNode } from 'react';
import { Link } from '@tanstack/react-router';

import { Button } from '@/components/ui/button';

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

type PlaygroundPreviewCardProps = {
  title: string;
  description: string;
  children: ReactNode;
};

export function PlaygroundHeader({
  title,
  description,
  actions,
}: PlaygroundHeaderProps) {
  return (
    <div className="flex flex-col gap-4 rounded-3xl border border-border/70 bg-background p-6 shadow-sm lg:flex-row lg:items-center lg:justify-between">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-foreground">{title}</h1>
        <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
          {description}
        </p>
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
    <article className="rounded-3xl border border-border/70 bg-background p-5 shadow-sm">
      <p className="text-lg font-semibold text-foreground">{title}</p>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        {description}
      </p>
      <Button asChild className="mt-5">
        <Link to={to}>Abrir página</Link>
      </Button>
    </article>
  );
}

export function PlaygroundPreviewCard({
  title,
  description,
  children,
}: PlaygroundPreviewCardProps) {
  return (
    <article className="rounded-3xl border border-border/70 bg-background p-5 shadow-sm">
      <p className="text-lg font-semibold text-foreground">{title}</p>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        {description}
      </p>
      <div className="mt-5">{children}</div>
    </article>
  );
}
