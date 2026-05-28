import { ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';

import { Card } from '@/components/global/card/card';
import { Badge } from '@/components/ui/badge';

export function PlaygroundBadgeVariants() {
  return (
    <Card
      title="Badge - Variantes"
      description="Todas as variantes disponíveis no componente Badge do shadcn."
    >
      <div className="flex flex-wrap gap-2">
        <Badge>Default</Badge>
        <Badge variant="secondary">Secondary</Badge>
        <Badge variant="destructive">Destructive</Badge>
        <Badge variant="outline">Outline</Badge>
        <Badge variant="ghost">Ghost</Badge>
        <Badge variant="link">Link</Badge>
      </div>
    </Card>
  );
}

export function PlaygroundBadgeWithIcons() {
  return (
    <Card
      title="Badge - Com ícones"
      description="Badges com ícones do lucide-react no início ou no fim do conteúdo."
    >
      <div className="flex flex-wrap gap-2">
        <Badge>
          <CheckCircle2 />
          Concluído
        </Badge>
        <Badge variant="secondary">
          <Sparkles />
          Novo
        </Badge>
        <Badge variant="outline">
          Próximo passo
          <ArrowRight />
        </Badge>
      </div>
    </Card>
  );
}

export function PlaygroundBadgeStatus() {
  return (
    <Card
      title="Badge - Status"
      description="Exemplo de uso prático: pílulas de status com variantes mapeadas para o significado."
    >
      <div className="flex flex-wrap gap-2">
        <Badge>Ativo</Badge>
        <Badge variant="secondary">Pendente</Badge>
        <Badge variant="outline">Rascunho</Badge>
        <Badge variant="destructive">Cancelado</Badge>
      </div>
    </Card>
  );
}
