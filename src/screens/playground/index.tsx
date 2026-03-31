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
