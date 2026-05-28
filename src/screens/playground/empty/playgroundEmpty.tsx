import { Inbox, Search, Users } from 'lucide-react';

import { Card } from '@/components/global/card/card';
import { Empty } from '@/components/global/empty/empty';
import { Button } from '@/components/ui/button';

export function PlaygroundEmptyMinimal() {
  return (
    <Card
      title="Empty - Mínimo"
      description="Apenas título e descrição. Útil para mensagens informativas sem CTA."
    >
      <Empty
        title="Nenhum resultado encontrado"
        description="Ajuste os filtros e tente uma nova busca."
      />
    </Card>
  );
}

export function PlaygroundEmptyWithIcon() {
  return (
    <Card
      title="Empty - Com ícone"
      description="O ícone é renderizado dentro de EmptyMedia com a variante padrão (fundo muted, cantos arredondados)."
    >
      <Empty
        title="Caixa de entrada vazia"
        description="Mensagens novas aparecem aqui assim que chegarem."
        icon={<Inbox />}
      />
    </Card>
  );
}

export function PlaygroundEmptyWithAction() {
  return (
    <Card
      title="Empty - Com ação"
      description="Children opcional para CTA. Combina ícone, texto e ação primária em um único bloco."
    >
      <Empty
        title="Nenhum usuário cadastrado"
        description="Cadastre o primeiro usuário da equipe para começar a usar o sistema."
        icon={<Users />}
      >
        <Button>Cadastrar usuário</Button>
      </Empty>
    </Card>
  );
}

export function PlaygroundEmptySearch() {
  return (
    <Card
      title="Empty - Busca sem resultado"
      description="Caso de uso típico em listas filtradas: ícone de busca, descrição orientativa e ação para limpar."
    >
      <Empty
        title="Nenhum resultado para a busca"
        description="Tente termos diferentes ou remova os filtros aplicados."
        icon={<Search />}
      >
        <Button variant="outline">Limpar filtros</Button>
      </Empty>
    </Card>
  );
}
