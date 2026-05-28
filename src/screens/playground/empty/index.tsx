import {
  PlaygroundEmptyMinimal,
  PlaygroundEmptySearch,
  PlaygroundEmptyWithAction,
  PlaygroundEmptyWithIcon,
} from './playgroundEmpty';

import { PlaygroundHeader } from '@/screens/playground/components';

export function PlaygroundEmptyPage() {
  return (
    <div className="space-y-6">
      <PlaygroundHeader
        title="Empty"
        description="Abstração global de empty state com ícone, título, descrição e CTA opcional."
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <PlaygroundEmptyMinimal />
        <PlaygroundEmptyWithIcon />
        <PlaygroundEmptyWithAction />
        <PlaygroundEmptySearch />
      </div>
    </div>
  );
}
