import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { FileDropzone } from '@/components/global/fileDropzone/fileDropzone';

function makeFile(name: string, type = 'text/csv'): File {
  return new File(['a,b,c'], name, { type });
}

describe('FileDropzone (global)', () => {
  it('mostra a área de soltar quando não há arquivo', () => {
    render(<FileDropzone file={null} onFileChange={() => undefined} />);
    expect(
      screen.getByRole('button', { name: 'Selecionar arquivo' })
    ).toBeInTheDocument();
    expect(
      screen.getByText('Arraste o arquivo aqui ou clique para selecionar')
    ).toBeInTheDocument();
  });

  it('exibe o hint quando fornecido', () => {
    render(
      <FileDropzone
        file={null}
        onFileChange={() => undefined}
        hint="Formatos aceitos: .xlsx, .csv"
      />
    );
    expect(
      screen.getByText('Formatos aceitos: .xlsx, .csv')
    ).toBeInTheDocument();
  });

  it('dispara onFileChange ao selecionar pelo input', async () => {
    const handleChange = vi.fn();
    const { container } = render(
      <FileDropzone
        file={null}
        onFileChange={handleChange}
        accept=".csv"
        id="file-input"
      />
    );

    const input = container.querySelector<HTMLInputElement>('#file-input')!;
    await userEvent.upload(input, makeFile('planilha.csv'));

    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleChange.mock.calls[0][0]).toBeInstanceOf(File);
  });

  it('aceita arquivo compatível via drag-and-drop', () => {
    const handleChange = vi.fn();
    render(
      <FileDropzone file={null} onFileChange={handleChange} accept=".csv" />
    );

    const dropzone = screen.getByRole('button', { name: 'Selecionar arquivo' });
    fireEvent.drop(dropzone, {
      dataTransfer: { files: [makeFile('planilha.csv')] },
    });

    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it('ignora arquivo incompatível com accept no drag-and-drop', () => {
    const handleChange = vi.fn();
    render(
      <FileDropzone file={null} onFileChange={handleChange} accept=".csv" />
    );

    const dropzone = screen.getByRole('button', { name: 'Selecionar arquivo' });
    fireEvent.drop(dropzone, {
      dataTransfer: { files: [makeFile('imagem.png', 'image/png')] },
    });

    expect(handleChange).not.toHaveBeenCalled();
  });

  it('mostra a prévia e remove o arquivo', async () => {
    const handleChange = vi.fn();
    render(
      <FileDropzone file={makeFile('planilha.csv')} onFileChange={handleChange} />
    );

    expect(screen.getByText('planilha.csv')).toBeInTheDocument();

    await userEvent.click(
      screen.getByRole('button', { name: 'Remover arquivo' })
    );
    expect(handleChange).toHaveBeenCalledWith(null);
  });

  it('não interage quando desabilitado', () => {
    const handleChange = vi.fn();
    render(
      <FileDropzone file={null} onFileChange={handleChange} disabled accept=".csv" />
    );

    const dropzone = screen.getByRole('button', { name: 'Selecionar arquivo' });
    fireEvent.drop(dropzone, {
      dataTransfer: { files: [makeFile('planilha.csv')] },
    });
    expect(handleChange).not.toHaveBeenCalled();
  });
});
