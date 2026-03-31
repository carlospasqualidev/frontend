import { PlaygroundHeader, PlaygroundLinkCard } from '../components';

const links = [
  {
    title: 'Detalhes',
    description:
      'Primeiro nível de aprofundamento para validar o breadcrumb com uma trilha mais longa.',
    to: '/playground/navigation/details',
  },
  {
    title: 'Histórico',
    description:
      'Atalho direto para um nível ainda mais profundo da árvore de navegação.',
    to: '/playground/navigation/details/history',
  },
];

export function PlaygroundNavigationPage() {
  return (
    <div className="space-y-6">
      <PlaygroundHeader
        title="Testes de Navegação"
        description="Coleção de páginas simples para confirmar se o breadcrumb acompanha corretamente as rotas válidas do router."
      />

      <div className="grid gap-4 lg:grid-cols-2">
        {links.map((link) => (
          <PlaygroundLinkCard key={link.to} {...link} />
        ))}
      </div>
    </div>
  );
}
