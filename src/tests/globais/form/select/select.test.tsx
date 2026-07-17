import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Select } from '@/components/global/form/select';

const options = [
  { value: 'admin', label: 'Administrador' },
  { value: 'editor', label: 'Editor' },
];

describe('Select (global)', () => {
  it('renderiza o rótulo e o gatilho', () => {
    render(<Select id="role" label="Papel" options={options} />);

    expect(screen.getByText('Papel')).toBeInTheDocument();
    expect(screen.getByLabelText('Papel')).toBeInTheDocument();
  });

  it('com srOnlyLabel, mantém o rótulo acessível mas oculto visualmente', () => {
    render(<Select id="role" label="Papel" srOnlyLabel options={options} />);

    // O gatilho continua acessível pelo rótulo (leitor de tela o encontra)...
    expect(screen.getByLabelText('Papel')).toBeInTheDocument();
    // ...mas o rótulo fica visualmente oculto (classe utilitária sr-only).
    expect(screen.getByText('Papel')).toHaveClass('sr-only');
  });
});
