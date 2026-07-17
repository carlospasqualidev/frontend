import { Sparkles } from 'lucide-react';
import type { Meta, StoryObj } from '@storybook/tanstack-react';

import { Alert } from '@/components/global/alert/alert';
import { Card } from '@/components/global/card/card';

const meta = {
  title: 'Globais/Alert',
  component: Alert,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Banner inline para mensagens contextuais. Cinco variantes (`default`, `info`, `success`, `warning`, `error`), cada uma com cor e ícone próprios. **Não é um toast** — ele fica no fluxo da página, persistente, próximo ao contexto da mensagem.',
      },
    },
  },
  args: { title: '' },
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Vitrine: Story = {
  render: () => (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card
        title="Variantes"
        description="Cada variante tem cor e ícone padrão correspondente."
      >
        <div className="space-y-3">
          <Alert
            title="Mensagem padrão"
            description="Variante neutra, sem ícone por padrão. Use para conteúdo informativo sem urgência."
          />
          <Alert
            variant="info"
            title="Sincronização em andamento"
            description="Os dados serão atualizados em alguns segundos."
          />
          <Alert
            variant="success"
            title="Pagamento confirmado"
            description="A transação foi processada com sucesso."
          />
          <Alert
            variant="warning"
            title="Sessão expira em 5 minutos"
            description="Salve seu trabalho antes que a sessão seja encerrada."
          />
          <Alert
            variant="error"
            title="Falha ao salvar o registro"
            description="Verifique sua conexão e tente novamente."
          />
        </div>
      </Card>

      <Card
        title="Apenas título"
        description="A description é opcional — para alertas curtos basta o title."
      >
        <div className="space-y-3">
          <Alert variant="info" title="Manutenção programada às 23h." />
          <Alert variant="success" title="Tudo certo por aqui." />
          <Alert variant="warning" title="Operação irreversível." />
          <Alert variant="error" title="Não foi possível conectar." />
        </div>
      </Card>

      <Card
        title="Ícone customizado"
        description="Passe a prop icon para sobrescrever o ícone padrão. Use icon={null} para omitir."
      >
        <div className="space-y-3">
          <Alert
            variant="info"
            title="Novidade exclusiva"
            description="A nova versão do design system saiu — confira o changelog."
            icon={<Sparkles />}
          />
          <Alert
            variant="success"
            title="Sem ícone"
            description="Útil quando o contexto já deixa claro o tipo da mensagem."
            icon={null}
          />
        </div>
      </Card>
    </div>
  ),
};
