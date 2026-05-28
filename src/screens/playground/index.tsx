import { PlaygroundHeader, PlaygroundLinkCard } from './components';

const links = [
  {
    title: 'Playground de Formulários',
    description:
      'Mantém o formulário de testes em uma rota filha para validar o breadcrumb com 2 níveis.',
    to: '/playground/form',
  },
  {
    title: 'Testes de Navegação',
    description:
      'Abre uma área com links mais profundos para validar o breadcrumb com 3 ou mais níveis.',
    to: '/playground/navigation',
  },
  {
    title: 'Data Table',
    description:
      'Tabela com TanStack Table (shadcn/ui): ordenação, filtro, paginação, seleção e visibilidade de colunas.',
    to: '/playground/data-table',
  },
  {
    title: 'Card',
    description:
      'Abstração global de card sobre o primitivo do shadcn. Recebe título, descrição e children.',
    to: '/playground/card',
  },
  {
    title: 'Badge',
    description:
      'Variantes, ícones e casos de uso do componente Badge do shadcn.',
    to: '/playground/badge',
  },
  {
    title: 'Empty',
    description:
      'Abstração global de empty state com ícone, título, descrição e CTA opcional.',
    to: '/playground/empty',
  },
  {
    title: 'Skeleton',
    description:
      'Skeletons semânticos focados na informação dinâmica, mantendo a estrutura visível.',
    to: '/playground/skeleton',
  },
  {
    title: 'Modal',
    description:
      'Modal responsivo: dialog no desktop, drawer no mobile.',
    to: '/playground/modal',
  },
  {
    title: 'Button',
    description:
      'Abstração do Button do shadcn com prop loading: spinner, disable automático e prevenção de duplo clique.',
    to: '/playground/button',
  },
];

export function PlaygroundPage() {
  return (
    <div className="space-y-6">
      <PlaygroundHeader
        title="Playground"
        description="Área dedicada para experimentar componentes, estados e fluxos de navegação sem impactar as telas principais."
      />

      <div className="grid gap-4 lg:grid-cols-2">
        {links.map((link) => (
          <PlaygroundLinkCard key={link.to} {...link} />
        ))}
      </div>
    </div>
  );
}
