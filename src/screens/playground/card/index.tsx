import { PlaygroundCard } from './playgroundCard';

import { PlaygroundHeader } from '@/screens/playground/components';

export function PlaygroundCardPage() {
  return (
    <div className="space-y-6">
      <PlaygroundHeader
        title="Card"
        description="Abstração global de card sobre o primitivo do shadcn. Recebe título, descrição e children como conteúdo."
      />

      <PlaygroundCard />
    </div>
  );
}
