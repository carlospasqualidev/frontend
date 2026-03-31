import { Link } from '@tanstack/react-router';

import { Button } from '@/components/ui/button';
import {
  PlaygroundHeader,
  PlaygroundLinkCard,
} from '@/screens/playground/components';

export function PlaygroundNavigationDetailsPage() {
  return (
    <div className="space-y-6">
      <PlaygroundHeader
        title="Detalhes"
        description="Nível intermediário do playground, pensado para testar se o breadcrumb mantém a sequência correta antes do destino final."
        actions={
          <Button asChild variant="outline">
            <Link to="/playground/navigation/details/history">
              Ir para Histórico
            </Link>
          </Button>
        }
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <PlaygroundLinkCard
          title="Voltar para Testes de Navegação"
          description="Retorna um nível na árvore para validar a navegação reversa."
          to="/playground/navigation"
        />
        <PlaygroundLinkCard
          title="Abrir Histórico"
          description="Segue para o último nível da trilha de testes."
          to="/playground/navigation/details/history"
        />
      </div>
    </div>
  );
}
