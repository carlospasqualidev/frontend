import { PlaygroundHeader, PlaygroundLinkCard } from './components';

const links = [
  {
    title: 'Form Playground',
    description:
      'Mantem o formulario de testes em uma rota filha para validar breadcrumb com 2 niveis.',
    to: '/playground/form',
  },
  {
    title: 'Navigation Tests',
    description:
      'Abre uma area com links mais profundos para validar breadcrumb com 3 ou mais niveis.',
    to: '/playground/navigation',
  },
];

export function PlaygroundPage() {
  return (
    <div className="space-y-6">
      <PlaygroundHeader
        title="Playground"
        description="Area dedicada para experimentar componentes, estados e fluxos de navegacao sem impactar as telas principais."
      />

      <div className="grid gap-4 lg:grid-cols-2">
        {links.map((link) => (
          <PlaygroundLinkCard key={link.to} {...link} />
        ))}
      </div>
    </div>
  );
}
