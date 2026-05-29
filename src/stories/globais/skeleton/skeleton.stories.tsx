import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/tanstack-react';

import {
  SkeletonAvatar,
  SkeletonBadge,
  SkeletonText,
  SkeletonValue,
} from '@/components/global/skeleton/skeleton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/global/card/card';
import { Typography } from '@/components/ui/typography';

const meta = {
  title: 'Globais/Skeleton',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Quatro presets prontos para os principais formatos de dado: texto, valor, badge e avatar. **Skeleton só no dado, nunca no card inteiro** — rótulos, títulos e estrutura permanecem visíveis durante o load.',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

const LOADING_MS = 2000;

function useSimulatedLoading() {
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    if (!isLoading) return;
    const timeout = setTimeout(() => setIsLoading(false), LOADING_MS);
    return () => clearTimeout(timeout);
  }, [isLoading]);

  return { isLoading, reload: () => setIsLoading(true) };
}

function ShowcaseInternal() {
  const { isLoading, reload } = useSimulatedLoading();

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button variant="outline" onClick={reload} disabled={isLoading}>
          Recarregar tudo
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Presets" description="Os 4 formatos disponíveis.">
          <div className="space-y-4">
            <div className="space-y-2">
              <Typography variant="muted">SkeletonText</Typography>
              <SkeletonText />
            </div>
            <div className="space-y-2">
              <Typography variant="muted">SkeletonValue</Typography>
              <SkeletonValue />
            </div>
            <div className="space-y-2">
              <Typography variant="muted">SkeletonBadge</Typography>
              <SkeletonBadge />
            </div>
            <div className="space-y-2">
              <Typography variant="muted">SkeletonAvatar</Typography>
              <SkeletonAvatar />
            </div>
          </div>
        </Card>

        <Card
          title="Valor monetário"
          description="Apenas o valor exibe skeleton; rótulo permanece."
        >
          <div className="space-y-1">
            <Typography variant="muted">Saldo disponível</Typography>
            {isLoading ? (
              <SkeletonValue />
            ) : (
              <Typography variant="h3">R$ 12.480,00</Typography>
            )}
          </div>
        </Card>

        <Card
          title="Campos de texto"
          description="Rótulos permanecem; só os valores ficam em skeleton."
        >
          <div className="space-y-3">
            {[
              { label: 'Nome', value: 'Ana Silva', width: 'w-40' },
              {
                label: 'E-mail',
                value: 'ana.silva@empresa.com',
                width: 'w-48',
              },
              { label: 'Departamento', value: 'Financeiro', width: 'w-28' },
            ].map((field) => (
              <div
                key={field.label}
                className="flex items-center justify-between"
              >
                <Typography as="span" variant="muted">
                  {field.label}
                </Typography>
                {isLoading ? (
                  <SkeletonText className={field.width} />
                ) : (
                  <Typography as="span" variant="small">
                    {field.value}
                  </Typography>
                )}
              </div>
            ))}
          </div>
        </Card>

        <Card
          title="Status e perfil"
          description="Badge e avatar com skeleton específico."
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Typography as="span" variant="muted">
                Status
              </Typography>
              {isLoading ? <SkeletonBadge /> : <Badge>Ativo</Badge>}
            </div>

            <div className="flex items-center gap-3">
              {isLoading ? (
                <SkeletonAvatar />
              ) : (
                <div className="flex size-10 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground">
                  AS
                </div>
              )}
              <div className="space-y-1">
                {isLoading ? (
                  <>
                    <SkeletonText className="w-32" />
                    <SkeletonText className="w-24" />
                  </>
                ) : (
                  <>
                    <Typography variant="small">Ana Silva</Typography>
                    <p className="text-xs text-muted-foreground">
                      Analista financeiro
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

export const Vitrine: Story = {
  render: () => <ShowcaseInternal />,
};
