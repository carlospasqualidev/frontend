import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const mockNavigate = vi.fn();
vi.mock('@tanstack/react-router', async () => {
  const actual = await vi.importActual('@tanstack/react-router');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

import { Link } from '@/components/global/link/link';

describe('Link (global)', () => {
  it('renderiza um anchor com href e classes padrão', () => {
    render(
      <Link href="https://example.com" className="custom-class">
        Exemplo
      </Link>
    );

    const anchor = screen.getByRole('link', { name: 'Exemplo' });
    expect(anchor).toHaveAttribute('href', 'https://example.com');
    expect(anchor).toHaveClass('custom-class');
    expect(anchor).not.toHaveAttribute('rel');
  });

  it('adiciona rel noreferrer noopener quando target _blank não passa rel', () => {
    render(
      <Link href="https://example.com" target="_blank">
        Nova aba
      </Link>
    );

    const anchor = screen.getByRole('link', { name: 'Nova aba' });
    expect(anchor).toHaveAttribute('target', '_blank');
    expect(anchor).toHaveAttribute('rel', 'noreferrer noopener');
  });

  it('preserva o onClick sem cancelar o comportamento nativo', async () => {
    const handleClick = vi.fn();
    render(
      <Link href="https://example.com" onClick={handleClick}>
        Clique
      </Link>
    );

    await userEvent.click(screen.getByRole('link', { name: 'Clique' }));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('navega internamente via roteador quando o href for same-origin', async () => {
    render(<Link href="/login">Login interno</Link>);

    const link = screen.getByRole('link', { name: 'Login interno' });
    await userEvent.click(link);

    expect(mockNavigate).toHaveBeenCalledWith({ to: '/login', replace: false });
  });
});
