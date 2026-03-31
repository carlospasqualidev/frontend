import { PlaygroundHeader, PlaygroundLinkCard } from '../components';

const links = [
  {
    title: 'Details',
    description:
      'Primeiro nivel de aprofundamento para validar o breadcrumb com uma trilha mais longa.',
    to: '/playground/navigation/details',
  },
  {
    title: 'History',
    description:
      'Atalho direto para um nivel ainda mais profundo da arvore de navegacao.',
    to: '/playground/navigation/details/history',
  },
];

export function PlaygroundNavigationPage() {
  return (
    <div className="space-y-6">
      <PlaygroundHeader
        title="Navigation Tests"
        description="Colecao de paginas simples para confirmar se o breadcrumb acompanha corretamente as rotas validas do router."
      />

      <div className="grid gap-4 lg:grid-cols-2">
        {links.map((link) => (
          <PlaygroundLinkCard key={link.to} {...link} />
        ))}
      </div>
    </div>
  );
}
