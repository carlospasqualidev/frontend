import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Alert } from '@/components/global/alert/alert';

describe('Alert (global)', () => {
  it('renderiza o título (obrigatório) e a descrição quando informada', () => {
    render(<Alert title="Pagamento confirmado" description="Tudo certo." />);

    expect(screen.getByText('Pagamento confirmado')).toBeInTheDocument();
    expect(screen.getByText('Tudo certo.')).toBeInTheDocument();
  });

  it('omite a descrição quando não é passada', () => {
    render(<Alert title="Apenas título" />);

    expect(screen.getByText('Apenas título')).toBeInTheDocument();
    expect(screen.queryByText('Tudo certo.')).not.toBeInTheDocument();
  });

  it('exibe o ícone padrão da variante', () => {
    const { container } = render(<Alert variant="success" title="Sucesso" />);

    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('não exibe ícone na variante default', () => {
    const { container } = render(<Alert title="Neutro" />);

    expect(container.querySelector('svg')).not.toBeInTheDocument();
  });

  it('permite sobrescrever o ícone via prop icon', () => {
    render(
      <Alert
        variant="info"
        title="Custom"
        icon={<svg data-testid="custom-icon" />}
      />
    );

    expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
  });

  it('omite o ícone quando icon={null}, mesmo com variante que tem ícone padrão', () => {
    const { container } = render(
      <Alert variant="error" title="Sem ícone" icon={null} />
    );

    expect(container.querySelector('svg')).not.toBeInTheDocument();
  });
});
