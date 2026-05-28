import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/global/button/button';
import { Card } from '@/components/global/card/card';
import { ConfirmDialog } from '@/components/global/confirmDialog/confirmDialog';

const CONFIRM_MS = 1500;

export function PlaygroundConfirmDialogDestructive() {
  return (
    <Card
      title="ConfirmDialog - Destrutivo (uncontrolled)"
      description="Modo padrão: passe trigger e o componente gerencia o estado interno. Sem useState no consumidor."
    >
      <ConfirmDialog
        title="Excluir registro?"
        description="Esta ação não pode ser desfeita. O registro será removido permanentemente."
        confirmLabel="Excluir"
        destructive
        trigger={<Button variant="destructive">Excluir</Button>}
        onConfirm={async () => {
          await new Promise((resolve) => setTimeout(resolve, CONFIRM_MS));
          toast.success('Registro excluído.');
        }}
      />
    </Card>
  );
}

export function PlaygroundConfirmDialogDefault() {
  return (
    <Card
      title="ConfirmDialog - Padrão (uncontrolled)"
      description="Confirmação não destrutiva. Útil para ações reversíveis que ainda merecem um double-check."
    >
      <ConfirmDialog
        title="Publicar agora?"
        description="O conteúdo ficará visível para todos os usuários imediatamente."
        confirmLabel="Publicar"
        trigger={<Button>Publicar</Button>}
        onConfirm={async () => {
          await new Promise((resolve) => setTimeout(resolve, CONFIRM_MS));
          toast.success('Publicado.');
        }}
      />
    </Card>
  );
}

export function PlaygroundConfirmDialogControlled() {
  const [open, setOpen] = useState(false);

  return (
    <Card
      title="ConfirmDialog - Controlled"
      description="Modo controlled para casos onde o dialog precisa abrir de fora — atalho de teclado, evento programático, ou múltiplos triggers compartilhando o mesmo dialog."
    >
      <ConfirmDialog
        open={open}
        setOpen={setOpen}
        title="Arquivar item?"
        description="O item será movido para a lista de arquivados e sairá da visualização padrão."
        confirmLabel="Arquivar"
        onConfirm={async () => {
          await new Promise((resolve) => setTimeout(resolve, CONFIRM_MS));
          toast.success('Item arquivado.');
        }}
      />

      <div className="flex flex-wrap gap-2">
        <Button variant="outline" onClick={() => setOpen(true)}>
          Abrir via botão
        </Button>
        <Button
          variant="ghost"
          onClick={() => {
            toast.info('Abrindo dialog em 1 segundo...');
            setTimeout(() => setOpen(true), 1000);
          }}
        >
          Abrir via timer
        </Button>
      </div>
    </Card>
  );
}
