import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { Button } from '@/components/global/button/button';
import { Card } from '@/components/global/card/card';
import { Typography } from '@/components/ui/typography';

const FOLLOW_KEY = ['playground-follow-status'];

// Estado fake do "servidor". Em uso real, isso vive no backend.
const serverStore = { following: false };

async function fakeGetFollowing(): Promise<boolean> {
  await new Promise((resolve) => setTimeout(resolve, 200));
  return serverStore.following;
}

async function fakeToggleFollowing(): Promise<boolean> {
  await new Promise((resolve) => setTimeout(resolve, 1200));
  if (Math.random() < 0.3) {
    throw new Error('Falha simulada de rede.');
  }
  serverStore.following = !serverStore.following;
  return serverStore.following;
}

export function PlaygroundOptimisticUpdate() {
  const queryClient = useQueryClient();

  const { data: isFollowing = false } = useQuery({
    queryKey: FOLLOW_KEY,
    queryFn: fakeGetFollowing,
  });

  const toggleMutation = useMutation({
    mutationFn: fakeToggleFollowing,
    // onMutate roda ANTES do request: aplica a mudança otimista no cache
    // e devolve um snapshot pra eventual rollback.
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: FOLLOW_KEY });
      const previous = queryClient.getQueryData<boolean>(FOLLOW_KEY);
      queryClient.setQueryData<boolean>(FOLLOW_KEY, (prev = false) => !prev);
      return { previous };
    },
    // onError reverte usando o snapshot capturado no onMutate.
    onError: (_error, _variables, context) => {
      queryClient.setQueryData(FOLLOW_KEY, context?.previous);
      toast.error('Falha ao atualizar — UI revertida.');
    },
    // onSettled sempre revalida — garante alinhamento com o servidor
    // independentemente de sucesso ou erro.
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: FOLLOW_KEY });
    },
  });

  return (
    <Card
      title="Optimistic update"
      description="Padrão TanStack Query: a UI muda na hora; se o request falhar (~30% das vezes aqui, simulando rede instável), o estado faz rollback automaticamente."
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Typography as="span" variant="muted">
            Estado:
          </Typography>
          <Typography as="span" variant="small">
            {isFollowing ? 'Seguindo' : 'Não seguindo'}
          </Typography>
        </div>

        <Button
          variant={isFollowing ? 'outline' : 'default'}
          onClick={() => toggleMutation.mutate()}
        >
          {isFollowing ? 'Deixar de seguir' : 'Seguir'}
        </Button>

        <Typography variant="muted">
          Clique algumas vezes. O botão troca instantaneamente — não há spinner
          porque a UI já reflete o estado pretendido. Quando o request falha, um
          toast avisa e a UI volta sozinha.
        </Typography>
      </div>
    </Card>
  );
}
