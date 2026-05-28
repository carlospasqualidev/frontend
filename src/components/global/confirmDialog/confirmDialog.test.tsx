import { useState } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { ConfirmDialog } from './confirmDialog';

describe('ConfirmDialog (global) — modo uncontrolled', () => {
  it('abre via trigger e renderiza title/description', async () => {
    render(
      <ConfirmDialog
        title="Excluir registro?"
        description="Esta ação não pode ser desfeita."
        confirmLabel="Excluir"
        destructive
        trigger={<button type="button">Excluir</button>}
        onConfirm={() => undefined}
      />
    );

    await userEvent.click(screen.getByRole('button', { name: 'Excluir' }));

    expect(screen.getByText('Excluir registro?')).toBeInTheDocument();
    expect(
      screen.getByText('Esta ação não pode ser desfeita.')
    ).toBeInTheDocument();
  });

  it('dispara onConfirm e fecha o dialog após confirmar', async () => {
    const handleConfirm = vi.fn();
    render(
      <ConfirmDialog
        title="Excluir?"
        description="..."
        confirmLabel="Excluir"
        destructive
        trigger={<button type="button">Abrir</button>}
        onConfirm={handleConfirm}
      />
    );

    await userEvent.click(screen.getByRole('button', { name: 'Abrir' }));
    await userEvent.click(
      screen.getAllByRole('button', { name: 'Excluir' })[0]
    );

    expect(handleConfirm).toHaveBeenCalledTimes(1);
    await waitFor(() => {
      expect(screen.queryByText('Excluir?')).not.toBeInTheDocument();
    });
  });

  it('cancela sem disparar onConfirm', async () => {
    const handleConfirm = vi.fn();
    render(
      <ConfirmDialog
        title="Excluir?"
        description="..."
        trigger={<button type="button">Abrir</button>}
        onConfirm={handleConfirm}
      />
    );

    await userEvent.click(screen.getByRole('button', { name: 'Abrir' }));
    await userEvent.click(screen.getByRole('button', { name: 'Cancelar' }));

    expect(handleConfirm).not.toHaveBeenCalled();
    await waitFor(() => {
      expect(screen.queryByText('Excluir?')).not.toBeInTheDocument();
    });
  });
});

describe('ConfirmDialog (global) — modo controlled', () => {
  function ControlledHarness({
    onConfirm,
  }: {
    onConfirm: () => void | Promise<void>;
  }) {
    const [open, setOpen] = useState(false);

    return (
      <>
        <button type="button" onClick={() => setOpen(true)}>
          Abrir via externo
        </button>
        <ConfirmDialog
          open={open}
          setOpen={setOpen}
          title="Excluir registro?"
          description="Esta ação não pode ser desfeita."
          confirmLabel="Excluir"
          destructive
          onConfirm={onConfirm}
        />
      </>
    );
  }

  it('abre via setOpen externo e dispara onConfirm', async () => {
    const handleConfirm = vi.fn();
    render(<ControlledHarness onConfirm={handleConfirm} />);

    await userEvent.click(
      screen.getByRole('button', { name: 'Abrir via externo' })
    );
    expect(screen.getByText('Excluir registro?')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Excluir' }));

    expect(handleConfirm).toHaveBeenCalledTimes(1);
    await waitFor(() => {
      expect(screen.queryByText('Excluir registro?')).not.toBeInTheDocument();
    });
  });
});
