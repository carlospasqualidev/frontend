import { render, screen } from '@testing-library/react';
import { Inbox } from 'lucide-react';
import { describe, expect, it } from 'vitest';

import { Empty } from './empty';

describe('Empty (global)', () => {
  it('renderiza apenas title e description quando icon/children são omitidos', () => {
    const { container } = render(
      <Empty
        title="Nenhum resultado"
        description="Ajuste os filtros e tente novamente."
      />
    );

    expect(screen.getByText('Nenhum resultado')).toBeInTheDocument();
    expect(
      screen.getByText('Ajuste os filtros e tente novamente.')
    ).toBeInTheDocument();
    // Sem icon: nenhum svg deve estar presente
    expect(container.querySelector('svg')).not.toBeInTheDocument();
  });

  it('renderiza o icon dentro do EmptyMedia quando fornecido', () => {
    const { container } = render(
      <Empty title="Caixa vazia" description="..." icon={<Inbox />} />
    );

    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('renderiza children como ações (CTA opcional)', () => {
    render(
      <Empty title="Sem usuários" description="...">
        <button type="button">Cadastrar</button>
      </Empty>
    );

    expect(
      screen.getByRole('button', { name: 'Cadastrar' })
    ).toBeInTheDocument();
  });
});
