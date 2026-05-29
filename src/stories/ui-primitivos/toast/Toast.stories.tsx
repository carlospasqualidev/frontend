import { toast } from 'sonner';
import type { Meta, StoryObj } from '@storybook/tanstack-react';

import { Button } from '@/components/global/button/button';
import { Card } from '@/components/global/card/card';

const meta = {
  title: 'UI primitivos/Toast (Sonner)',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Notificações disparadas via `toast` do `sonner`. O `Toaster` é montado uma vez no `Layout` do app; aqui já está no decorator do preview. Em interceptors do `api`, erros disparam toast automaticamente — não duplique no caller.',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

const fakeRequest = (shouldFail = false) =>
  new Promise<{ id: string }>((resolve, reject) => {
    setTimeout(() => {
      if (shouldFail) reject(new Error('Falha simulada.'));
      else resolve({ id: 'rec_1234' });
    }, 1500);
  });

export const Vitrine: Story = {
  render: () => (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card title="Variantes" description="Tipos básicos de toast.">
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => toast('Mensagem padrão.')}>Default</Button>
          <Button
            variant="outline"
            onClick={() => toast.success('Registro salvo.')}
          >
            Success
          </Button>
          <Button
            variant="outline"
            onClick={() => toast.info('Sincronização iniciada.')}
          >
            Info
          </Button>
          <Button
            variant="outline"
            onClick={() => toast.warning('Sessão expira em 5 min.')}
          >
            Warning
          </Button>
          <Button
            variant="destructive"
            onClick={() => toast.error('Falha ao salvar o registro.')}
          >
            Error
          </Button>
        </div>
      </Card>

      <Card
        title="Com descrição"
        description="Mensagem secundária abaixo do título."
      >
        <Button
          onClick={() =>
            toast.success('Registro atualizado', {
              description: 'As alterações foram sincronizadas com o servidor.',
            })
          }
        >
          Disparar
        </Button>
      </Card>

      <Card
        title="Com ação"
        description="Botão de ação no próprio toast — útil para 'Desfazer'."
      >
        <Button
          onClick={() =>
            toast('Item movido para a lixeira', {
              action: {
                label: 'Desfazer',
                onClick: () => toast.success('Item restaurado.'),
              },
            })
          }
        >
          Mover para lixeira
        </Button>
      </Card>

      <Card
        title="Loading manual"
        description="Toast de carregamento atualizado quando a promise resolve."
      >
        <Button
          onClick={() => {
            const id = toast.loading('Enviando relatório...');
            setTimeout(() => {
              toast.success('Relatório enviado.', { id });
            }, 1500);
          }}
        >
          Enviar relatório
        </Button>
      </Card>

      <Card
        title="Promise"
        description="Estados loading → success/error encadeados automaticamente."
      >
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={() =>
              toast.promise(fakeRequest(false), {
                loading: 'Processando pagamento...',
                success: 'Pagamento confirmado.',
                error: 'Falha no pagamento.',
              })
            }
          >
            Promise — sucesso
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              toast.promise(fakeRequest(true), {
                loading: 'Processando pagamento...',
                success: 'Pagamento confirmado.',
                error: 'Falha no pagamento.',
              })
            }
          >
            Promise — falha
          </Button>
        </div>
      </Card>
    </div>
  ),
};
