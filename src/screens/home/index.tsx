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
    value: 'Sessão validada',
    description:
      'Rotas protegidas passam por SessionValidation, que confirma a sessão no backend antes de renderizar o conteúdo.',
  },
  {
    title: 'Layout',
    value: 'Shell único',
    description:
      'Toda a área autenticada compartilha o mesmo Layout, com Sidebar, header, breadcrumb e um Outlet central.',
  },
  {
    title: 'Organização',
    value: 'Por screen',
    description:
      'Cada tela vive em screens/<feature> com o seu routes.ts co-localizado, montado na árvore em routes.tsx.',
  },
];

export function DashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Painel"
        description="Área inicial autenticada do template. Já nasce dentro do shell principal com Sidebar, header e breadcrumb, pronta para crescer com novas telas sem duplicar estrutura."
        actions={<Button size="lg">Nova ação</Button>}
      />

      <div className="grid gap-4 lg:grid-cols-3">
        {DASHBOARD_METRICS.map((metric) => (
          <DashboardStatCard key={metric.title} {...metric} />
        ))}
      </div>

      <section className="grid gap-4 lg:grid-cols-2">
        <article className="rounded-3xl border border-border/70 bg-background p-6 shadow-sm">
          <p className="text-sm font-semibold text-foreground">
            Fluxo de inicialização
          </p>
          <ol className="mt-4 space-y-3 text-sm leading-6 text-muted-foreground">
            <li>
              1. <code>SessionValidation</code> chama{' '}
              <code>sessionService.validate()</code> (<code>GET /users/me</code>)
              enviando os cookies (<code>withCredentials</code>).
            </li>
            <li>
              2. Enquanto valida, exibe <code>SessionValidationScreen</code>; o
              usuário autenticado é guardado em <code>useSessionStore</code>{' '}
              (Zustand).
            </li>
            <li>
              3. Se a validação falha, redireciona para <code>/login</code>; se
              ok, renderiza o <code>Layout</code> protegido com o{' '}
              <code>Outlet</code>.
            </li>
          </ol>
        </article>

        <article className="rounded-3xl border border-border/70 bg-background p-6 shadow-sm">
          <p className="text-sm font-semibold text-foreground">
            Como adicionar uma tela
          </p>
          <ol className="mt-4 space-y-3 text-sm leading-6 text-muted-foreground">
            <li>
              1. Crie <code>screens/&lt;feature&gt;/index.tsx</code> exportando o
              componente da tela.
            </li>
            <li>
              2. Crie <code>screens/&lt;feature&gt;/routes.ts</code> com{' '}
              <code>createRoute</code> + <code>lazyRouteComponent</code> para
              herdar o code-splitting.
            </li>
            <li>
              3. Registre a rota na árvore em <code>routes.tsx</code>.
            </li>
          </ol>
        </article>
      </section>
    </div>
  );
}
