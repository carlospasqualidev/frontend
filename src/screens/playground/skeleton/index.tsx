import {
  PlaygroundSkeletonMonetary,
  PlaygroundSkeletonProfile,
  PlaygroundSkeletonStatus,
  PlaygroundSkeletonTextFields,
} from './playgroundSkeleton';

import { PlaygroundHeader } from '@/screens/playground/components';

export function PlaygroundSkeletonPage() {
  return (
    <div className="space-y-6">
      <PlaygroundHeader
        title="Skeleton"
        description="Skeletons semânticos focados na informação dinâmica — a estrutura (rótulos e descrições) permanece visível enquanto os valores carregam."
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <PlaygroundSkeletonMonetary />
        <PlaygroundSkeletonTextFields />
        <PlaygroundSkeletonStatus />
        <PlaygroundSkeletonProfile />
      </div>
    </div>
  );
}
