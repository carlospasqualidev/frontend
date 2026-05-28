import { useEffect, useState } from 'react';

import { Card } from '@/components/global/card/card';
import {
  SkeletonAvatar,
  SkeletonBadge,
  SkeletonText,
  SkeletonValue,
} from '@/components/global/skeleton/skeleton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Typography } from '@/components/ui/typography';

const LOADING_MS = 2000;

function useSimulatedLoading() {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isLoading) return;
    const timeout = setTimeout(() => setIsLoading(false), LOADING_MS);
    return () => clearTimeout(timeout);
  }, [isLoading]);

  return { isLoading, reload: () => setIsLoading(true) };
}

export function PlaygroundSkeletonMonetary() {
  const { isLoading, reload } = useSimulatedLoading();

  return (
    <Card
      title="Skeleton - Valor monetário"
      description="Apenas o valor exibe skeleton; o título e a descrição do dado continuam visíveis."
    >
      <div className="space-y-3">
        <div className="space-y-1">
          <Typography variant="muted">Saldo disponível</Typography>
          {isLoading ? (
            <SkeletonValue />
          ) : (
            <Typography variant="h3">R$ 12.480,00</Typography>
          )}
        </div>

        <Button variant="outline" onClick={reload} disabled={isLoading}>
          Recarregar
        </Button>
      </div>
    </Card>
  );
}

export function PlaygroundSkeletonTextFields() {
  const { isLoading, reload } = useSimulatedLoading();

  return (
    <Card
      title="Skeleton - Campos de texto"
      description="Em um detalhe de registro: os rótulos permanecem; só os valores ficam em skeleton."
    >
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Typography as="span" variant="muted">
            Nome
          </Typography>
          {isLoading ? (
            <SkeletonText className="w-40" />
          ) : (
            <Typography as="span" variant="small">
              Ana Silva
            </Typography>
          )}
        </div>

        <div className="flex items-center justify-between">
          <Typography as="span" variant="muted">
            E-mail
          </Typography>
          {isLoading ? (
            <SkeletonText className="w-48" />
          ) : (
            <Typography as="span" variant="small">
              ana.silva@empresa.com
            </Typography>
          )}
        </div>

        <div className="flex items-center justify-between">
          <Typography as="span" variant="muted">
            Departamento
          </Typography>
          {isLoading ? (
            <SkeletonText className="w-28" />
          ) : (
            <Typography as="span" variant="small">
              Financeiro
            </Typography>
          )}
        </div>

        <Button variant="outline" onClick={reload} disabled={isLoading}>
          Recarregar
        </Button>
      </div>
    </Card>
  );
}

export function PlaygroundSkeletonStatus() {
  const { isLoading, reload } = useSimulatedLoading();

  return (
    <Card
      title="Skeleton - Status"
      description="O badge tem skeleton em formato de pílula; o rótulo do campo continua visível."
    >
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Typography as="span" variant="muted">
            Status
          </Typography>
          {isLoading ? <SkeletonBadge /> : <Badge>Ativo</Badge>}
        </div>

        <Button variant="outline" onClick={reload} disabled={isLoading}>
          Recarregar
        </Button>
      </div>
    </Card>
  );
}

export function PlaygroundSkeletonProfile() {
  const { isLoading, reload } = useSimulatedLoading();

  return (
    <Card
      title="Skeleton - Perfil"
      description="Avatar e nome em skeleton lado a lado; o resto do layout fica intacto."
    >
      <div className="space-y-4">
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

        <Button variant="outline" onClick={reload} disabled={isLoading}>
          Recarregar
        </Button>
      </div>
    </Card>
  );
}
