import {
  PlaygroundBadgeStatus,
  PlaygroundBadgeVariants,
  PlaygroundBadgeWithIcons,
} from './playgroundBadge';

import { PlaygroundHeader } from '@/screens/playground/components';

export function PlaygroundBadgePage() {
  return (
    <div className="space-y-6">
      <PlaygroundHeader
        title="Badge"
        description="Variantes e casos de uso do componente Badge do shadcn."
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <PlaygroundBadgeVariants />
        <PlaygroundBadgeWithIcons />
        <PlaygroundBadgeStatus />
      </div>
    </div>
  );
}
