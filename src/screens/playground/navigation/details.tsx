import { Link } from '@tanstack/react-router';

import { Button } from '@/components/ui/button';
import { PlaygroundHeader, PlaygroundLinkCard } from '@/screens/playground/components';

export function PlaygroundNavigationDetailsPage() {
  return (
    <div className="space-y-6">
      <PlaygroundHeader
        title="Details"
        description="Nivel intermediario do playground, pensado para testar se o breadcrumb mantem a sequencia correta antes do destino final."
        actions={
          <Button asChild variant="outline">
            <Link to="/playground/navigation/details/history">
              Ir para History
            </Link>
          </Button>
        }
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <PlaygroundLinkCard
          title="Voltar para Navigation"
          description="Retorna um nivel na arvore para validar a navegacao reversa."
          to="/playground/navigation"
        />
        <PlaygroundLinkCard
          title="Abrir History"
          description="Segue para o ultimo nivel da trilha de testes."
          to="/playground/navigation/details/history"
        />
      </div>
    </div>
  );
}
