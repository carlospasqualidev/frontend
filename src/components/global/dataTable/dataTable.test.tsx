import type { ColumnDef } from '@tanstack/react-table';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { actionsColumn, selectColumn } from './columnHelpers';
import { DataTable } from './dataTable';
import { textFilter, type DataTableFilter } from './filters';

interface Row {
  id: string;
  email: string;
}

const columns: ColumnDef<Row>[] = [
  { accessorKey: 'email', header: 'E-mail' },
];

const filters: DataTableFilter[] = [
  textFilter({
    key: 'email',
    label: 'E-mail',
    placeholder: 'Buscar por e-mail',
  }),
];

describe('DataTable', () => {
  it('renderiza linhas quando há dados', () => {
    const data: Row[] = [
      { id: '1', email: 'ana@example.com' },
      { id: '2', email: 'joao@example.com' },
    ];

    render(
      <DataTable
        columns={columns}
        data={data}
        pageIndex={0}
        onPageChange={() => undefined}
      />
    );

    expect(screen.getByText('ana@example.com')).toBeInTheDocument();
    expect(screen.getByText('joao@example.com')).toBeInTheDocument();
  });

  it('mostra empty state sem filtros ativos', () => {
    render(
      <DataTable
        columns={columns}
        data={[]}
        pageIndex={0}
        onPageChange={() => undefined}
      />
    );

    expect(
      screen.getByText('Ainda não há registros para exibir.')
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Limpar filtros' })
    ).not.toBeInTheDocument();
  });

  it('mostra "Limpar filtros" no empty state quando há filtros ativos', async () => {
    const handleSearch = vi.fn();

    render(
      <DataTable
        columns={columns}
        data={[]}
        pageIndex={0}
        onPageChange={() => undefined}
        filters={filters}
        defaultFilterValues={{ email: 'ana@example.com' }}
        onSearch={handleSearch}
      />
    );

    const clearButton = screen.getByRole('button', { name: 'Limpar filtros' });
    expect(clearButton).toBeInTheDocument();

    await userEvent.click(clearButton);
    expect(handleSearch).toHaveBeenCalledWith({});
  });

  describe('isLoading', () => {
    it('renderiza pageSize linhas de skeleton e desabilita a paginação', () => {
      const data: Row[] = [{ id: '1', email: 'ana@example.com' }];

      const { container } = render(
        <DataTable
          columns={columns}
          data={data}
          pageIndex={1}
          onPageChange={() => undefined}
          pageSize={3}
          isLoading
        />
      );

      expect(screen.queryByText('ana@example.com')).not.toBeInTheDocument();
      expect(
        container.querySelectorAll('[data-slot="skeleton"]')
      ).toHaveLength(3);
      expect(screen.getByRole('button', { name: 'Anterior' })).toBeDisabled();
      expect(screen.getByRole('button', { name: 'Próxima' })).toBeDisabled();
    });

    it('mantém filtros visíveis e interativos durante o loading', async () => {
      const handleSearch = vi.fn();

      render(
        <DataTable
          columns={columns}
          data={[]}
          pageIndex={0}
          onPageChange={() => undefined}
          filters={filters}
          onSearch={handleSearch}
          isLoading
        />
      );

      const emailInput = screen.getByPlaceholderText('Buscar por e-mail');
      await userEvent.type(emailInput, 'ana');
      await userEvent.click(screen.getByRole('button', { name: 'Buscar' }));

      expect(handleSearch).toHaveBeenCalledWith({ email: 'ana' });
    });
  });

  it('desabilita "Anterior" na primeira página', () => {
    render(
      <DataTable
        columns={columns}
        data={[{ id: '1', email: 'a@b.com' }]}
        pageIndex={0}
        onPageChange={() => undefined}
        pageSize={1}
      />
    );

    expect(screen.getByRole('button', { name: 'Anterior' })).toBeDisabled();
  });

  it('desabilita "Próxima" quando a página vem com menos linhas que pageSize', () => {
    render(
      <DataTable
        columns={columns}
        data={[{ id: '1', email: 'a@b.com' }]}
        pageIndex={0}
        onPageChange={() => undefined}
        pageSize={5}
      />
    );

    expect(screen.getByRole('button', { name: 'Próxima' })).toBeDisabled();
  });

  describe('onRowClick', () => {
    const data: Row[] = [
      { id: '1', email: 'ana@example.com' },
      { id: '2', email: 'joao@example.com' },
    ];

    it('não torna a linha clicável quando onRowClick não é definido', () => {
      render(
        <DataTable
          columns={columns}
          data={data}
          pageIndex={0}
          onPageChange={() => undefined}
        />
      );

      expect(screen.queryAllByRole('button', { name: /@example\.com/ })).toHaveLength(0);
    });

    it('dispara onRowClick com a linha original quando a linha é clicada', async () => {
      const handleRowClick = vi.fn();

      render(
        <DataTable
          columns={columns}
          data={data}
          pageIndex={0}
          onPageChange={() => undefined}
          onRowClick={handleRowClick}
        />
      );

      await userEvent.click(screen.getByText('ana@example.com'));

      expect(handleRowClick).toHaveBeenCalledTimes(1);
      expect(handleRowClick).toHaveBeenCalledWith(data[0]);
    });

    it('dispara onRowClick ao pressionar Enter com a linha focada', async () => {
      const handleRowClick = vi.fn();

      render(
        <DataTable
          columns={columns}
          data={data}
          pageIndex={0}
          onPageChange={() => undefined}
          onRowClick={handleRowClick}
        />
      );

      const rows = screen.getAllByRole('button');
      const firstRow = rows.find((el) => el.tagName === 'TR');
      expect(firstRow).toBeDefined();

      firstRow!.focus();
      await userEvent.keyboard('{Enter}');

      expect(handleRowClick).toHaveBeenCalledWith(data[0]);
    });

    it('não dispara onRowClick ao clicar no menu de ações da linha', async () => {
      const handleRowClick = vi.fn();
      const handleAction = vi.fn();

      const columnsWithActions = [
        ...columns,
        actionsColumn<Row>({
          actions: [{ label: 'Editar', onSelect: handleAction }],
        }),
      ];

      render(
        <DataTable
          columns={columnsWithActions}
          data={data}
          pageIndex={0}
          onPageChange={() => undefined}
          onRowClick={handleRowClick}
        />
      );

      const triggers = screen.getAllByRole('button', { name: 'Abrir menu' });
      await userEvent.click(triggers[0]);

      expect(handleRowClick).not.toHaveBeenCalled();

      await userEvent.click(screen.getByRole('menuitem', { name: 'Editar' }));

      expect(handleAction).toHaveBeenCalledWith(data[0]);
      expect(handleRowClick).not.toHaveBeenCalled();
    });

    it('não dispara onRowClick ao clicar no checkbox de seleção', async () => {
      const handleRowClick = vi.fn();

      const columnsWithSelect = [selectColumn<Row>(), ...columns];

      render(
        <DataTable
          columns={columnsWithSelect}
          data={data}
          pageIndex={0}
          onPageChange={() => undefined}
          onRowClick={handleRowClick}
        />
      );

      const rowCheckbox = screen.getAllByRole('checkbox', {
        name: 'Selecionar linha',
      })[0];
      await userEvent.click(rowCheckbox);

      expect(handleRowClick).not.toHaveBeenCalled();
    });
  });
});
