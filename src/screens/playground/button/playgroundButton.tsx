import { useSimulatedLoading } from '../useSimulatedLoading';

import { Button } from '@/components/global/button/button';
import { Card } from '@/components/global/card/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function PlaygroundButtonLoading() {
  const { isLoading, start } = useSimulatedLoading();

  return (
    <Card
      title="Button - Loading básico"
      description="A prop loading exibe um spinner antes do label, desabilita o botão automaticamente e mantém o texto visível durante o request."
    >
      <Button loading={isLoading} onClick={start}>
        Salvar
      </Button>
    </Card>
  );
}

export function PlaygroundButtonLoadingVariants() {
  const { isLoading, start } = useSimulatedLoading();

  return (
    <Card
      title="Button - Loading nas variantes"
      description="O spinner herda a cor do texto da variante — não precisa de ajuste por caso."
    >
      <div className="space-y-3">
        <div className="flex flex-wrap gap-2">
          <Button loading={isLoading} onClick={start}>
            Default
          </Button>
          <Button loading={isLoading} onClick={start} variant="secondary">
            Secondary
          </Button>
          <Button loading={isLoading} onClick={start} variant="destructive">
            Destructive
          </Button>
          <Button loading={isLoading} onClick={start} variant="outline">
            Outline
          </Button>
          <Button loading={isLoading} onClick={start} variant="ghost">
            Ghost
          </Button>
        </div>
      </div>
    </Card>
  );
}

export function PlaygroundButtonFormSubmit() {
  const { isLoading, start } = useSimulatedLoading();

  return (
    <Card
      title="Button - Submissão de formulário"
      description="Caso real: ao clicar em Enviar, simula uma requisição de 2 segundos. O botão fica desabilitado sozinho — impossível clicar duas vezes."
    >
      <form
        className="space-y-3"
        onSubmit={(event) => {
          event.preventDefault();
          start();
        }}
      >
        <div className="space-y-2">
          <Label htmlFor="playground-button-email">E-mail</Label>
          <Input
            id="playground-button-email"
            type="email"
            placeholder="seu@email.com"
            required
            disabled={isLoading}
          />
        </div>
        <Button type="submit" loading={isLoading}>
          Enviar
        </Button>
      </form>
    </Card>
  );
}

export function PlaygroundButtonDisabledVsLoading() {
  return (
    <Card
      title="Button - Disabled e loading independentes"
      description="loading implica disabled, mas você ainda pode desabilitar por outro motivo (ex.: validação) sem perder o estado de loading."
    >
      <div className="flex flex-wrap gap-2">
        <Button>Normal</Button>
        <Button disabled>Disabled</Button>
        <Button loading>Loading</Button>
        <Button loading disabled>
          Loading + Disabled
        </Button>
      </div>
    </Card>
  );
}
