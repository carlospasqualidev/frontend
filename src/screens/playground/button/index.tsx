import {
  PlaygroundButtonDisabledVsLoading,
  PlaygroundButtonFormSubmit,
  PlaygroundButtonLoading,
  PlaygroundButtonLoadingVariants,
} from './playgroundButton';

import { PlaygroundHeader } from '@/screens/playground/components';

export function PlaygroundButtonPage() {
  return (
    <div className="space-y-6">
      <PlaygroundHeader
        title="Button"
        description="Abstração global do Button do shadcn com prop loading: exibe spinner, desabilita o botão e mantém o label visível durante o request."
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <PlaygroundButtonLoading />
        <PlaygroundButtonLoadingVariants />
        <PlaygroundButtonFormSubmit />
        <PlaygroundButtonDisabledVsLoading />
      </div>
    </div>
  );
}
