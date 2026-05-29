import { z } from 'zod';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { InputField } from './inputField';

import { useZodForm } from '@/lib/forms/useZodForm';

describe('InputField (global) — modo uncontrolled', () => {
  it('renderiza label e propaga onChange', async () => {
    const handleChange = vi.fn();
    render(
      <InputField
        id="name"
        label="Nome"
        placeholder="Digite seu nome"
        onChange={handleChange}
      />
    );

    expect(screen.getByText('Nome')).toBeInTheDocument();

    await userEvent.type(screen.getByPlaceholderText('Digite seu nome'), 'Ana');

    expect(handleChange).toHaveBeenCalled();
  });

  it('exibe description e errors quando informados', () => {
    render(
      <InputField
        id="email"
        label="E-mail"
        description="Será usado para login."
        errors={{ message: 'E-mail inválido.' }}
      />
    );

    expect(screen.getByText('Será usado para login.')).toBeInTheDocument();
    expect(screen.getByText('E-mail inválido.')).toBeInTheDocument();
  });

  it('marca aria-invalid quando há erro', () => {
    render(
      <InputField
        id="email"
        label="E-mail"
        errors={{ message: 'E-mail inválido.' }}
      />
    );

    const input = screen.getByLabelText('E-mail');
    expect(input).toHaveAttribute('aria-invalid', 'true');
  });
});

describe('InputField (global) — modo controlled', () => {
  it('integra com react-hook-form via useZodForm + control', async () => {
    const schema = z.object({ name: z.string().trim().min(1, 'Obrigatório.') });
    const onValid = vi.fn();

    function Harness() {
      const { control, handleSubmit } = useZodForm({
        schema,
        defaultValues: { name: '' },
      });

      return (
        <form onSubmit={handleSubmit(onValid)}>
          <InputField
            id="name"
            name="name"
            control={control}
            label="Nome"
            placeholder="Digite"
          />
          <button type="submit">Enviar</button>
        </form>
      );
    }

    render(<Harness />);

    await userEvent.type(screen.getByPlaceholderText('Digite'), 'Ana');
    await userEvent.click(screen.getByRole('button', { name: 'Enviar' }));

    expect(onValid).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'Ana' }),
      expect.anything()
    );
  });

  it('exibe erro de validação do Zod quando submit falha', async () => {
    const schema = z.object({
      name: z.string().trim().min(1, 'Informe o nome.'),
    });

    function Harness() {
      const { control, handleSubmit } = useZodForm({
        schema,
        defaultValues: { name: '' },
      });

      return (
        <form onSubmit={handleSubmit(() => undefined)}>
          <InputField id="name" name="name" control={control} label="Nome" />
          <button type="submit">Enviar</button>
        </form>
      );
    }

    render(<Harness />);

    await userEvent.click(screen.getByRole('button', { name: 'Enviar' }));

    expect(await screen.findByText('Informe o nome.')).toBeInTheDocument();
  });
});
