import type { Meta, StoryObj } from '@storybook/tanstack-react';

import { Typography } from '@/components/ui/typography';

function Introducao() {
  return (
    <article className="prose mx-auto max-w-3xl space-y-6 text-foreground">
      <Typography as="h1" variant="h1">
        Design System
      </Typography>

      <Typography variant="lead">
        Este Storybook documenta os componentes <strong>globais</strong> da
        aplicação (em <code>components/global/</code>), mostrando todas as
        variações, estados e composições que aparecem nas telas reais.
      </Typography>

      <Typography variant="p">
        Cada componente ganha uma <em>Vitrine</em> única que demonstra todas as
        suas variações em uma só tela.
      </Typography>

      <Typography as="h2" variant="h3">
        Como o catálogo está organizado
      </Typography>

      <ul className="list-disc space-y-2 pl-6">
        <li>
          <strong>Globais</strong> — abstrações criadas em cima do shadcn/ui que
          padronizam API, defaults visuais (incluindo dark mode) e integração
          com <code>react-hook-form</code>. São o que você deve consumir nas
          telas, e não o primitivo do shadcn direto.
        </li>
        <li>
          <strong>Formulário</strong> — campos integrados ao{' '}
          <code>react-hook-form</code> + Zod e uma composição completa
          exercitando todos eles juntos.
        </li>
        <li>
          <strong>DataTable</strong> — tabela 100% server-side com filtros,
          ordenação e paginação delegadas ao backend.
        </li>
        <li>
          <strong>Padrões</strong> — fluxos que amarram vários componentes
          (CRUD, optimistic update via TanStack Query).
        </li>
        <li>
          <strong>UI primitivos</strong> — fragmentos do shadcn que não têm
          wrapper global ainda, mas aparecem nas composições.
        </li>
      </ul>

      <Typography as="h2" variant="h3">
        Tema
      </Typography>

      <Typography variant="p">
        O switch de tema (canto superior) aplica <code>light</code>/
        <code>dark</code> no <code>&lt;html&gt;</code> — mesmo mecanismo do app
        real. Use-o para validar contraste, sombras e cores da marca em ambos os
        modos.
      </Typography>

      <Typography as="h2" variant="h3">
        Convenções
      </Typography>

      <ul className="list-disc space-y-2 pl-6">
        <li>
          Stories ficam <strong>co-localizadas</strong> com o componente (
          <code>button/button.stories.tsx</code>, etc.), seguindo o mesmo padrão
          dos arquivos de teste.
        </li>
        <li>
          Textos em <strong>pt-BR</strong>, igual à interface.
        </li>
        <li>Cada story tem uma descrição explicando o caso de uso.</li>
      </ul>
    </article>
  );
}

const meta = {
  title: 'Introdução',
  component: Introducao,
  parameters: {
    layout: 'padded',
    options: { showPanel: false },
  },
} satisfies Meta<typeof Introducao>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Comecar: Story = {};
