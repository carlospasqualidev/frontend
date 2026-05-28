import { Loader2 } from 'lucide-react';

export function SuspenseFallback() {
  return (
    <div
      role="status"
      aria-label="Carregando"
      className="flex min-h-64 w-full items-center justify-center"
    >
      <Loader2 className="size-6 animate-spin text-muted-foreground" />
    </div>
  );
}
