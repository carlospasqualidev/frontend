import { PlaygroundCrud } from './playgroundCrud';

import { PlaygroundHeader } from '@/screens/playground/components';

export function PlaygroundCrudPage() {
  return (
    <div className="space-y-6">
      <PlaygroundHeader
        title="CRUD end-to-end"
        description="Padrão completo amarrando lista, criação, edição e remoção. Usa Card + Modal + Form + ConfirmDialog em conjunto."
      />

      <PlaygroundCrud />
    </div>
  );
}
