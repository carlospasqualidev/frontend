import type { ReactNode } from 'react';

import { Button } from '@/components/ui/button';

type PageHeaderProps = {
  title: string;
  description: string;
  actions?: ReactNode;
};

type DashboardStatCardProps = {
  title: string;
  value: string;
  description: string;
};

export function DashboardStatCard({
  title,
  value,
  description,
}: DashboardStatCardProps) {
  return (
    <article className="rounded-3xl border border-border/70 bg-background p-5 shadow-sm">
      <p className="text-xs font-medium tracking-[0.22em] text-muted-foreground uppercase">
        {title}
      </p>
      <strong className="mt-4 block text-3xl font-semibold text-foreground">
        {value}
      </strong>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        {description}
      </p>
    </article>
  );
}

export function PageHeader({ title, description, actions }: PageHeaderProps) {
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

const DASHBOARD_METRICS = [
  {
    title: 'Proteção',
    value: 'Sessão primeiro',
    description:
      'As rotas protegidas aguardam a validação da sessão no backend antes de renderizar o conteúdo.',
  },
  {
    title: 'Layout',
    value: '1 shell',
    description:
      'Toda área autenticada compartilha o mesmo layout com Sidebar, header e outlet central.',
  },
  {
    title: 'Expansão',
    value: 'Por feature',
    description:
      'Novos módulos entram em `modules/<feature>` sem espalhar páginas, hooks e services pelo projeto.',
  },
];

const MODULE_STRATEGY_TEXT = (
  <p className="mt-4 text-sm leading-6 text-muted-foreground">
    Para adicionar um módulo futuro, crie <code>pages</code>,{' '}
    <code>components</code>, <code>services</code>, <code>schemas</code> e{' '}
    <code>types</code> dentro de <code>modules/&lt;nome&gt;</code> apenas se
    fizer sentido para aquela feature. Depois componha as rotas no{' '}
    <code>route-tree</code> sem mexer na estrutura dos módulos existentes.
  </p>
);

export function DashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Painel"
        description="Esta página representa a área inicial autenticada do sistema. Ela já nasce dentro do shell principal com Sidebar, pronta para crescer com novos módulos sem duplicar estrutura."
        actions={<Button size="lg">Nova ação</Button>}
      />

      <div className="grid gap-4 lg:grid-cols-3">
        {DASHBOARD_METRICS.map((metric) => (
          <DashboardStatCard key={metric.title} {...metric} />
        ))}
      </div>

      <section className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <article className="rounded-3xl border border-border/70 bg-background p-6 shadow-sm">
          <p className="text-sm font-semibold text-foreground">
            Fluxo sugerido ao iniciar a aplicação
          </p>
          <ol className="mt-4 space-y-3 text-sm leading-6 text-muted-foreground">
            <li>
              1. O provider de auth faz bootstrap da sessão chamando
              `/api/auth/session` com `credentials: include`.
            </li>
            <li>
              2. O TanStack Router usa `beforeLoad` para decidir se a rota
              pública ou protegida pode continuar.
            </li>
            <li>
              3. Se autenticado, o usuário entra no shell `/`; caso contrário,
              é redirecionado para `/login`.
            </li>
          </ol>
        </article>
        {Array.from({ length: 9 }).map((_, index) => (
          <article
            key={index}
            className="rounded-3xl border border-border/70 bg-background p-6 shadow-sm"
          >
            <p className="text-sm font-semibold text-foreground">
              Estratégia para novos módulos
            </p>
            {MODULE_STRATEGY_TEXT}
          </article>
        ))}
      </section>
    </div>
  );
}
