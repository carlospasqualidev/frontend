import { Card } from '@/components/global/card/card';
import { PageHeader } from '@/components/global/pageHeader/pageHeader';
import { Button } from '@/components/ui/button';
import { Typography } from '@/components/ui/typography';

interface DashboardStatCardProps {
  title: string;
  value: string;
  description: string;
}

function DashboardStatCard({
  title,
  value,
  description,
}: DashboardStatCardProps) {
  return (
    <article className="space-y-2 rounded-3xl border border-border/70 bg-card p-5 shadow-sm dark:shadow-none">
      <Typography
        variant="small"
        className="tracking-[0.22em] text-muted-foreground uppercase"
      >
        {title}
      </Typography>
      <Typography as="strong" variant="h2" className="block">
        {value}
      </Typography>
      <Typography variant="muted">{description}</Typography>
    </article>
  );
}

const DASHBOARD_METRICS: DashboardStatCardProps[] = [
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

const BOOTSTRAP_STEPS = [
  'SessionValidation chama sessionService.validate() (GET /users/me) enviando os cookies (withCredentials).',
  'Enquanto valida, exibe SessionValidationScreen; o usuário autenticado é guardado em useSessionStore (Zustand).',
  'Se a validação falha, redireciona para /login; se ok, renderiza o Layout protegido com o Outlet.',
];

const NEW_SCREEN_STEPS = [
  'Crie screens/<feature>/index.tsx exportando o componente da tela.',
  'Crie screens/<feature>/routes.ts com createRoute + lazyRouteComponent.',
  'Registre a rota na árvore em routes.tsx.',
];

function NumberedList({ items }: { items: string[] }) {
  return (
    <ol className="space-y-3">
      {items.map((item, index) => (
        <li key={item} className="flex gap-3">
          <Typography
            as="span"
            variant="small"
            className="shrink-0 text-muted-foreground"
          >
            {index + 1}.
          </Typography>
          <Typography variant="muted">{item}</Typography>
        </li>
      ))}
    </ol>
  );
}

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
        <Card
          title="Fluxo de inicialização"
          description="O que acontece entre o boot e a primeira tela protegida."
        >
          <NumberedList items={BOOTSTRAP_STEPS} />
        </Card>

        <Card
          title="Como adicionar uma tela"
          description="Três passos para uma nova rota dentro do shell autenticado."
        >
          <NumberedList items={NEW_SCREEN_STEPS} />
        </Card>
      </section>
    </div>
  );
}
