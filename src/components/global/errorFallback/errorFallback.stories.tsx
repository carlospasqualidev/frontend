import type { Meta, StoryObj } from '@storybook/tanstack-react';

import { ErrorFallback } from './index';

const meta = {
  title: 'Globais/ErrorFallback',
  component: ErrorFallback,
  parameters: {
    docs: {
      description: {
        component:
          'Tela cheia exibida pelo `react-error-boundary` quando um erro não é tratado. O botão de retry invoca `resetErrorBoundary` para limpar a árvore e reativar a sessão.',
      },
    },
    layout: 'fullscreen',
  },
} satisfies Meta<typeof ErrorFallback>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Padrao: Story = {
  args: {
    error: new Error('Erro simulado'),
    resetErrorBoundary: () => undefined,
  },
};
