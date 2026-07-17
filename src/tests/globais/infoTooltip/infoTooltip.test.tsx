import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { InfoTooltip } from '@/components/global/infoTooltip/infoTooltip';

describe('InfoTooltip (global)', () => {
  it('renderiza o gatilho com o rótulo acessível padrão', () => {
    render(<InfoTooltip label="Ajuda" />);
    expect(
      screen.getByRole('button', { name: 'Mais informações' })
    ).toBeInTheDocument();
  });

  it('aceita um rótulo de gatilho customizado', () => {
    render(<InfoTooltip label="Ajuda" triggerLabel="Detalhes do campo" />);
    expect(
      screen.getByRole('button', { name: 'Detalhes do campo' })
    ).toBeInTheDocument();
  });

  it('revela o conteúdo ao focar o gatilho', async () => {
    const user = userEvent.setup();
    render(<InfoTooltip label="Formato padrão: CSV" />);

    await user.tab();
    // Radix renderiza o conteúdo (pode haver cópia acessível duplicada).
    expect(
      (await screen.findAllByText('Formato padrão: CSV')).length
    ).toBeGreaterThan(0);
  });
});
