import { Link } from '@tanstack/react-router';

import { FormPlaygroundCard } from './FormPlaygroundCard';

import { PlaygroundHeader } from '@/screens/playground/components';
import { Button } from '@/components/ui/button';

export function PlaygroundFormPage() {
  return (
    <div className="space-y-6">
      <PlaygroundHeader
        title="Playground de Formulários"
        description="Página usada para validar os wrappers de formulário, mensagens de erro e interações com `react-hook-form`."
        actions={
          <Button asChild variant="outline">
            <Link to="/playground/navigation">Ir para Testes de Navegação</Link>
          </Button>
        }
      />

      <FormPlaygroundCard />
    </div>
  );
}
