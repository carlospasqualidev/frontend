import { PlaygroundOptimisticUpdate } from './playgroundOptimisticUpdate';

import { PlaygroundHeader } from '@/screens/playground/components';

export function PlaygroundOptimisticUpdatePage() {
  return (
    <div className="space-y-6">
      <PlaygroundHeader
        title="Optimistic update"
        description="Padrão de mutação otimista com TanStack Query: a UI antecipa o resultado, e faz rollback se o servidor recusar."
      />

      <PlaygroundOptimisticUpdate />
    </div>
  );
}
