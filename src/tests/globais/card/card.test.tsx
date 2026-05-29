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
});
