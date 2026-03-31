import { Link } from '@tanstack/react-router';

import { FormPlaygroundCard } from './FormPlaygroundCard';

import { PlaygroundHeader } from '@/screens/playground/components';
import { Button } from '@/components/ui/button';

export function PlaygroundFormPage() {
  return (
    <div className="space-y-6">
      <PlaygroundHeader
        title="Form Playground"
        description="Pagina usada para validar os wrappers de formulario, mensagens de erro e interacoes com react-hook-form."
        actions={
          <Button asChild variant="outline">
            <Link to="/playground/navigation">Ir para Navigation Tests</Link>
          </Button>
        }
      />

      <FormPlaygroundCard />
    </div>
  );
}
