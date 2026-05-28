import {
  PlaygroundConfirmDialogControlled,
  PlaygroundConfirmDialogDefault,
  PlaygroundConfirmDialogDestructive,
} from './playgroundConfirmDialog';

import { PlaygroundHeader } from '@/screens/playground/components';

export function PlaygroundConfirmDialogPage() {
  return (
    <div className="space-y-6">
      <PlaygroundHeader
        title="ConfirmDialog"
        description="Abstração global sobre o AlertDialog do shadcn. Suporta uncontrolled (trigger) e controlled (open/setOpen). Loading interno automático e auto-close após onConfirm resolver."
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <PlaygroundConfirmDialogDestructive />
        <PlaygroundConfirmDialogDefault />
        <PlaygroundConfirmDialogControlled />
      </div>
    </div>
  );
}
