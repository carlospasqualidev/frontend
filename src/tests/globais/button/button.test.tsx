import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Button } from '@/components/global/button/button';

describe('Button (global)', () => {
  it('renderiza children e dispara onClick em estado normal', async () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Salvar</Button>);

    const button = screen.getByRole('button', { name: 'Salvar' });
    await userEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('exibe spinner e desabilita o botão quando loading=true', () => {
    render(<Button loading>Salvar</Button>);

    const button = screen.getByRole('button', { name: /salvar/i });
    expect(button).toBeDisabled();
    // O spinner do lucide renderiza um SVG dentro do botão
    expect(button.querySelector('svg')).toBeInTheDocument();
  });

  it('não dispara onClick enquanto loading=true', async () => {
    const handleClick = vi.fn();
    render(
      <Button loading onClick={handleClick}>
        Salvar
      </Button>
    );

    await userEvent.click(screen.getByRole('button', { name: /salvar/i }));

    expect(handleClick).not.toHaveBeenCalled();
  });

  it('respeita disabled passado explicitamente sem precisar de loading', () => {
    render(<Button disabled>Salvar</Button>);

    expect(screen.getByRole('button', { name: 'Salvar' })).toBeDisabled();
  });
});
