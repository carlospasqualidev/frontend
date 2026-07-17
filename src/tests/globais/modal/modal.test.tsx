import { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { Modal, ModalFooter } from '@/components/global/modal/modal';

function Harness({
  initialOpen = false,
  onBack,
  backLabel,
}: {
  initialOpen?: boolean;
  onBack?: () => void;
  backLabel?: string;
}) {
  const [open, setOpen] = useState(initialOpen);

  return (
    <>
      <button type="button" onClick={() => setOpen(true)}>
        Abrir
      </button>
      <Modal
        open={open}
        setOpen={setOpen}
        title="Editar perfil"
        description="Atualize seus dados."
        onBack={onBack}
        backLabel={backLabel}
      >
        <p>Conteúdo do modal</p>
      </Modal>
    </>
  );
}

describe('Modal (global)', () => {
  beforeEach(() => {
    // Desktop por padrão (matchMedia mock retorna false para max-width: 767px).
    window.matchMedia = (query) =>
      ({
        matches: false,
        media: query,
        onchange: null,
        addListener: () => undefined,
        removeListener: () => undefined,
        addEventListener: () => undefined,
        removeEventListener: () => undefined,
        dispatchEvent: () => false,
      }) as MediaQueryList;
  });

  it('não renderiza conteúdo quando open=false', () => {
    render(<Harness />);

    expect(screen.queryByText('Editar perfil')).not.toBeInTheDocument();
    expect(screen.queryByText('Conteúdo do modal')).not.toBeInTheDocument();
  });

  it('renderiza title, description e children quando aberto', async () => {
    render(<Harness />);

    await userEvent.click(screen.getByRole('button', { name: 'Abrir' }));

    expect(screen.getByText('Editar perfil')).toBeInTheDocument();
    expect(screen.getByText('Atualize seus dados.')).toBeInTheDocument();
    expect(screen.getByText('Conteúdo do modal')).toBeInTheDocument();
  });

  it('inicializa aberto quando open=true desde o start', () => {
    render(<Harness initialOpen />);

    expect(screen.getByText('Editar perfil')).toBeInTheDocument();
  });

  it('não mostra o botão de voltar quando onBack não é informado', () => {
    render(<Harness initialOpen />);

    expect(screen.queryByRole('button', { name: 'Voltar' })).not.toBeInTheDocument();
  });

  it('mostra o botão de voltar com o rótulo padrão e dispara onBack ao clicar', async () => {
    const onBack = vi.fn();
    render(<Harness initialOpen onBack={onBack} />);

    await userEvent.click(screen.getByRole('button', { name: 'Voltar' }));

    expect(onBack).toHaveBeenCalledTimes(1);
  });

  it('usa backLabel como nome acessível do botão de voltar', () => {
    render(<Harness initialOpen onBack={() => undefined} backLabel="Trocar etapa" />);

    expect(screen.getByRole('button', { name: 'Trocar etapa' })).toBeInTheDocument();
  });
});

describe('ModalFooter (global)', () => {
  it('renderiza os botões de ação passados como children', () => {
    render(
      <ModalFooter>
        <button type="button">Salvar</button>
      </ModalFooter>
    );

    expect(screen.getByRole('button', { name: 'Salvar' })).toBeInTheDocument();
  });
});
