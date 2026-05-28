import { PlaygroundModal } from './playgroundModal';

import { PlaygroundHeader } from '@/screens/playground/components';

export function PlaygroundModalPage() {
  return (
    <div className="space-y-6">
      <PlaygroundHeader
        title="Modal"
        description="Modal responsivo do projeto: abre como dialog no desktop e como drawer no mobile."
      />

      <PlaygroundModal />
    </div>
  );
}
