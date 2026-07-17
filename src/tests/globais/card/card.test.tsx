import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Card } from '@/components/global/card/card';

describe('Card (global)', () => {
  it('renderiza title, description e children', () => {
    render(
      <Card title="Resumo" description="Visão consolidada do dia.">
        <p>Conteúdo do card</p>
      </Card>
    );

    expect(screen.getByText('Resumo')).toBeInTheDocument();
    expect(screen.getByText('Visão consolidada do dia.')).toBeInTheDocument();
    expect(screen.getByText('Conteúdo do card')).toBeInTheDocument();
  });

  it('renderiza a ação do cabeçalho quando `action` é passado', () => {
    render(
      <Card
        title="Membros"
        description="Pessoas com acesso a este projeto."
        action={<button type="button">Adicionar membro</button>}
      >
        <p>Lista</p>
      </Card>
    );

    expect(
      screen.getByRole('button', { name: 'Adicionar membro' })
    ).toBeInTheDocument();
  });
});
