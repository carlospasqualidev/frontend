import type { Meta, StoryObj } from '@storybook/tanstack-react';

import { Link } from '@/components/global/link/link';
import { Card } from '@/components/global/card/card';

const meta = {
  title: 'Globais/Link',
  component: Link,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Componente de link que preserva o comportamento nativo de <a>. Use `href` para caminhos internos e externos; o wrapper faz roteamento cliente para same-origin sem impedir nova aba, middle click ou links especiais.',
      },
    },
  },
} satisfies Meta<typeof Link>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    href: 'https://example.com',
    target: '_blank',
    children: 'Abrir exemplo em nova aba',
  },
  render: (args) => (
    <Card
      title="Link padrão"
      description="Link que mantém o comportamento nativo do navegador."
    >
      <Link {...args} />
    </Card>
  ),
};

export const Internal: Story = {
  args: {
    href: '/login',
    children: 'Ir para login',
  },
  render: (args) => (
    <Card
      title="Link interno"
      description="Use `href` para caminhos internos também."
    >
      <Link {...args} />
    </Card>
  ),
};
