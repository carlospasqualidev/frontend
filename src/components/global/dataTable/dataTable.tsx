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
import { SkeletonText } from '@/components/global/skeleton/skeleton';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const SKELETON_WIDTHS = ['w-20', 'w-32', 'w-24', 'w-28', 'w-16'];

/**
 * Quantidade fixa de linhas exibidas no estado de carregamento. Não acompanha
 * o `pageSize` — preencher uma página inteira (ex.: 25/50 linhas) de skeletons
 * deixa a tela alta demais e ruidosa. Um punhado de linhas já comunica "tabela
 * carregando" sem custo visual.
 */
export const SKELETON_ROW_COUNT = 8;

declare module '@tanstack/react-table' {
  // Permite que cada coluna passe classes Tailwind para o `<th>`/`<td>` —
  // útil para alinhamento, largura mínima e estilo. Não use para esconder
  // colunas em breakpoints estreitos: a regra do projeto é rolagem horizontal
  // do container (`overflow-x-auto`), não ocultar informação em mobile.
  // Os generics replicam a assinatura original do `ColumnMeta` no tanstack;
  // a augmentation deste projeto só usa `className`.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
  /**
   * Quando definido, cada linha vira clicável e dispara este callback com a
   * linha original (`row.original`) — útil para navegar para uma tela de
   * detalhes. Botões/menus dentro de células (`actionsColumn`, `selectColumn`)
   * não disparam o clique da linha; eles param a propagação automaticamente.
   */
  onRowClick?: (row: TData) => void;
  /**
   * URL de destino da linha (ex.: `/users/${row.id}`). Complementa `onRowClick`
   * para dar à linha o comportamento de um link nativo: clique do meio (scroll)
   * ou Ctrl/Cmd/Shift+clique abrem a URL em nova aba; o clique normal continua
   * disparando `onRowClick` (navegação SPA pelo consumidor). Forneça os dois
   * juntos quando a linha leva a uma tela de detalhes.
   */
  getRowHref?: (row: TData) => string;
  /**
   * Exibe um número fixo de linhas (`SKELETON_ROW_COUNT`) com skeletons no lugar
   * do conteúdo das células. Filtros e cabeçalho permanecem visíveis e
   * interativos; a paginação é desabilitada durante o load para evitar disparos
   * em estado inconsistente.
   */
  isLoading?: boolean;
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
  pageSize = 25,
  emptyMessage = 'Nenhum resultado.',
  onSortingChange,
  filters,
  onSearch,
  defaultFilterValues,
  onRowClick,
  getRowHref,
  isLoading = false,
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
          isLoading={isLoading}
        />
      ) : null}

      <div className="overflow-x-auto rounded-md border">
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
            {isLoading ? (
              Array.from({ length: SKELETON_ROW_COUNT }).map((_, rowIndex) => (
                <TableRow
                  key={`skeleton-${rowIndex}`}
                  className="hover:bg-transparent"
                >
                  {table.getVisibleLeafColumns().map((column, colIndex) => {
                    const meta = column.columnDef.meta as
                      | { className?: string }
                      | undefined;
                    const width =
                      SKELETON_WIDTHS[
                        (rowIndex + colIndex) % SKELETON_WIDTHS.length
                      ];
                    return (
                      <TableCell key={column.id} className={meta?.className}>
                        <SkeletonText className={width} />
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => {
                const href = getRowHref?.(row.original);
                const interactive = !!onRowClick || !!href;

                const openInNewTab = () => {
                  if (href) {
                    window.open(href, '_blank', 'noopener,noreferrer');
                  }
                };

                return (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}
                    onClick={
                      interactive
                        ? (event) => {
                            // Ctrl/Cmd/Shift+clique abre em nova aba, como num
                            // link nativo; o clique normal segue a navegação SPA.
                            if (
                              href &&
                              (event.metaKey || event.ctrlKey || event.shiftKey)
                            ) {
                              openInNewTab();
                              return;
                            }
                            onRowClick?.(row.original);
                          }
                        : undefined
                    }
                    onAuxClick={
                      href
                        ? (event) => {
                            // Botão do meio (scroll) abre o destino em nova aba.
                            if (event.button === 1) {
                              event.preventDefault();
                              openInNewTab();
                            }
                          }
                        : undefined
                    }
                    onMouseDown={
                      href
                        ? (event) => {
                            // Evita o cursor de autoscroll do clique do meio.
                            if (event.button === 1) event.preventDefault();
                          }
                        : undefined
                    }
                    onKeyDown={
                      interactive
                        ? (event) => {
                            // Só dispara quando o foco está na própria linha —
                            // Enter/Espaço em botões/checkboxes dentro de células
                            // têm `event.target` diferente e são ignorados aqui.
                            if (event.target !== event.currentTarget) return;
                            if (event.key === 'Enter' || event.key === ' ') {
                              event.preventDefault();
                              onRowClick?.(row.original);
                            }
                          }
                        : undefined
                    }
                    role={href ? 'link' : onRowClick ? 'button' : undefined}
                    tabIndex={interactive ? 0 : undefined}
                    className={
                      interactive
                        ? 'cursor-pointer focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none'
                        : undefined
                    }
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
                );
              })
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
                      <Button variant="outline" onClick={() => onSearch({})}>
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
          disabled={pageIndex === 0 || isLoading}
        >
          Anterior
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(pageIndex + 1)}
          disabled={isLoading || data.length < pageSize}
        >
          Próxima
        </Button>
      </div>
    </div>
  );
}
