import * as React from 'react';
import {
  type ColumnDef,
  type RowData,
  type SortingState,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Search } from 'lucide-react';

import {
  DataTableFilters,
  type DataTableFilter,
  type DataTableFilterValues,
} from './filters';

import { Empty } from '@/components/global/empty/empty';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

declare module '@tanstack/react-table' {
  // Permite que cada coluna passe classes Tailwind para o `<th>`/`<td>` —
  // útil para esconder colunas em breakpoints estreitos (`hidden md:table-cell`).
  interface ColumnMeta<TData extends RowData, TValue> {
    className?: string;
  }
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  /** Linhas da página atual, já paginadas/filtradas/ordenadas pelo backend. */
  data: TData[];
  /** Página atual (0-based), controlada pelo consumidor. */
  pageIndex: number;
  /**
   * Chamado ao navegar; use o novo índice (0-based) para buscar a página
   * correspondente no backend. "Próxima" é desabilitado quando `data` vem com
   * menos de `pageSize` linhas — sinal de que não há mais registros, dispensando
   * um `COUNT` total.
   */
  onPageChange: (pageIndex: number) => void;
  /** Quantidade de linhas por página (usada para detectar a última página). Padrão: `50`. */
  pageSize?: number;
  /** Mensagem exibida quando não há resultados. */
  emptyMessage?: string;
  /**
   * Chamado quando o usuário clica num cabeçalho ordenável (`SortableHeader`).
   * Use o estado de ordenação para refazer a busca no backend (a tabela não
   * ordena localmente).
   */
  onSortingChange?: (sorting: SortingState) => void;
  /**
   * Cabeçalho de filtros (server-side). Defina os campos de forma declarativa,
   * no mesmo estilo das `columns` (ver `textFilter`, `selectFilter`,
   * `dateFilter`, `dateRangeFilter`). Os valores só são enviados via `onSearch`
   * ao clicar em "Buscar".
   */
  filters?: DataTableFilter[];
  /** Chamado ao clicar em "Buscar"/"Limpar". Use os valores para buscar no backend. */
  onSearch?: (values: DataTableFilterValues) => void;
  /** Valores iniciais dos filtros. */
  defaultFilterValues?: DataTableFilterValues;
}

/**
 * Tabela de dados server-side construída sobre o TanStack Table, no estilo do
 * shadcn/ui. É um componente de **apresentação + interação**: não pagina, não
 * filtra e não ordena localmente — `data` já vem pronta do backend e cada ação
 * do usuário dispara um callback para você refazer a busca.
 *
 * Normalmente usado com o hook `useDataTableQuery`, que já entrega as props
 * prontas:
 *
 * ```tsx
 * const { query, tableProps } = useDataTableQuery({ pageSize: 50 });
 *
 * const { data } = useQuery({
 *   queryKey: ['payments', query],
 *   queryFn: () => api.get('/payments', { params: query }),
 * });
 *
 * <DataTable columns={columns} data={data ?? []} filters={filters} {...tableProps} />
 * ```
 */
export function DataTable<TData, TValue>({
  columns,
  data,
  pageIndex,
  onPageChange,
  pageSize = 50,
  emptyMessage = 'Nenhum resultado.',
  onSortingChange,
  filters,
  onSearch,
  defaultFilterValues,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [rowSelection, setRowSelection] = React.useState({});

  const hasActiveFilters =
    !!defaultFilterValues && Object.keys(defaultFilterValues).length > 0;

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    // Ordenação no servidor: a tabela só guarda o estado (para o indicador no
    // cabeçalho) e avisa o consumidor; não reordena as linhas localmente.
    manualSorting: true,
    onSortingChange: (updater) => {
      const next = typeof updater === 'function' ? updater(sorting) : updater;
      setSorting(next);
      onSortingChange?.(next);
    },
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      rowSelection,
    },
  });

  return (
    <div>
      {filters?.length ? (
        <DataTableFilters
          // Reseta os campos quando os valores iniciais mudam por fora (ex.:
          // back/forward do navegador com filtros na URL).
          key={JSON.stringify(defaultFilterValues ?? {})}
          filters={filters}
          defaultValues={defaultFilterValues}
          onSearch={(values) => onSearch?.(values)}
        />
      ) : null}

      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const meta = header.column.columnDef.meta as
                    | { className?: string }
                    | undefined;
                  return (
                    <TableHead key={header.id} className={meta?.className}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => {
                    const meta = cell.column.columnDef.meta as
                      | { className?: string }
                      | undefined;
                    return (
                      <TableCell key={cell.id} className={meta?.className}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            ) : (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={columns.length} className="py-6">
                  <Empty
                    title={emptyMessage}
                    description={
                      hasActiveFilters
                        ? 'Ajuste os filtros ou remova-os para ver os registros.'
                        : 'Ainda não há registros para exibir.'
                    }
                    icon={<Search />}
                  >
                    {hasActiveFilters && onSearch ? (
                      <Button
                        variant="outline"
                        onClick={() => onSearch({})}
                      >
                        Limpar filtros
                      </Button>
                    ) : null}
                  </Empty>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(pageIndex - 1)}
          disabled={pageIndex === 0}
        >
          Anterior
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(pageIndex + 1)}
          disabled={data.length < pageSize}
        >
          Próxima
        </Button>
      </div>
    </div>
  );
}
