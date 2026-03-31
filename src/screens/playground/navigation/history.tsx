import { Link } from '@tanstack/react-router';

import { Button } from '@/components/ui/button';
import { PlaygroundHeader, PlaygroundLinkCard } from '@/screens/playground/components';

export function PlaygroundNavigationHistoryPage() {
  return (
    <div className="space-y-6">
      <PlaygroundHeader
        title="History"
        description="Ultimo nivel da arvore de testes. Ideal para confirmar breadcrumbs mais profundos e links de retorno."
        actions={
          <Button asChild variant="outline">
            <Link to="/playground">Voltar para Playground</Link>
          </Button>
        }
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <PlaygroundLinkCard
          title="Details"
          description="Retorna um passo na hierarquia atual."
          to="/playground/navigation/details"
        />
        <PlaygroundLinkCard
          title="Home"
          description="Sai do playground e volta para a pagina inicial autenticada."
          to="/"
        />
      </div>
    </div>
  );
}
