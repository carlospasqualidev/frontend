import * as React from 'react';
import { toast } from 'sonner';
import type { Meta, StoryObj } from '@storybook/tanstack-react';

import { ConfirmDialog } from '@/components/global/confirmDialog/confirmDialog';
import { Button } from '@/components/global/button/button';
import { Card } from '@/components/global/card/card';

const CONFIRM_MS = 1500;

const meta = {
  title: 'Globais/ConfirmDialog',
  component: ConfirmDialog,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Confirmação para ações destrutivas/reversíveis. **Uncontrolled** (`trigger` + estado interno) ou **controlled** (`open`/`setOpen`). Loading interno automático e auto-close em sucesso.',
      },
    },
  },
  args: {
    title: '',
    description: '',
    trigger: null,
    onConfirm: () => undefined,
  },
} satisfies Meta<typeof ConfirmDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

function ControlledDemo() {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="space-y-3">
      <ConfirmDialog
        open={open}
        setOpen={setOpen}
        title="Arquivar item?"
        description="O item será movido para a lista de arquivados."
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
    </div>
  );
}

export const Vitrine: Story = {
  render: () => (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card
        title="Destrutivo (uncontrolled)"
        description="Trigger abre o dialog; estado interno."
      >
        <ConfirmDialog
          title="Excluir registro?"
          description="Esta ação não pode ser desfeita."
          confirmLabel="Excluir"
          destructive
          trigger={<Button variant="destructive">Excluir</Button>}
          onConfirm={async () => {
            await new Promise((resolve) => setTimeout(resolve, CONFIRM_MS));
            toast.success('Registro excluído.');
          }}
        />
      </Card>

      <Card
        title="Padrão (uncontrolled)"
        description="Confirmação para ações reversíveis."
      >
        <ConfirmDialog
          title="Publicar agora?"
          description="O conteúdo ficará visível para todos os usuários."
          confirmLabel="Publicar"
          trigger={<Button>Publicar</Button>}
          onConfirm={async () => {
            await new Promise((resolve) => setTimeout(resolve, CONFIRM_MS));
            toast.success('Publicado.');
          }}
        />
      </Card>

      <Card
        title="Controlled"
        description="Abre por atalho, evento programático ou múltiplos triggers."
      >
        <ControlledDemo />
      </Card>

      <Card
        title="Erro propagando do onConfirm"
        description="Quando a promise lança, o dialog permanece aberto, o botão sai do loading e o erro sobe — em produção, o interceptor do `api` já mostra o toast."
      >
        <ConfirmDialog
          title="Encerrar todas as sessões?"
          description="Todos os outros dispositivos precisarão fazer login novamente."
          confirmLabel="Encerrar todas"
          destructive
          trigger={<Button variant="destructive">Encerrar todas</Button>}
          onConfirm={async () => {
            await new Promise((resolve) => setTimeout(resolve, CONFIRM_MS));
            toast.error('Falha ao encerrar sessões. Tente novamente.');
            throw new Error('Falha simulada na API.');
          }}
        />
      </Card>
    </div>
  ),
};
