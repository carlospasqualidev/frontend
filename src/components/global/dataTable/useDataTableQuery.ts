import * as React from 'react';
import { type SortingState } from '@tanstack/react-table';

import { type DataTableFilterValues } from './filters';

export interface DataTableQuery {
  /** Página atual (0-based). */
  page: number;
  /** Linhas por página. */
  pageSize: number;
  /** Ordenação atual (geralmente 0 ou 1 coluna). */
  sort: SortingState;
  /** Filtros aplicados (já sem valores vazios). */
  filters: DataTableFilterValues;
}

interface UseDataTableQueryOptions {
  /** Linhas por página. Padrão: `50`. */
  pageSize?: number;
  /** Ordenação inicial. */
  defaultSorting?: SortingState;
  /** Filtros iniciais. */
  defaultFilters?: DataTableFilterValues;
}

export interface UseDataTableQueryResult {
  /** Estado atual para montar a busca no backend (use na `queryKey`/params). */
  query: DataTableQuery;
  /** Props já prontas para espalhar na `<DataTable />`. */
  tableProps: {
    pageIndex: number;
    onPageChange: (pageIndex: number) => void;
    pageSize: number;
    onSortingChange: (sorting: SortingState) => void;
    onSearch: (filters: DataTableFilterValues) => void;
    defaultFilterValues?: DataTableFilterValues;
  };
}

/** Alteração parcial do estado, aplicada de uma vez (página/ordenação/filtros). */
export type DataTableQueryPatch = Partial<{
  page: number;
  sort: SortingState;
  filters: DataTableFilterValues;
}>;

/**
 * Monta `query` + `tableProps` a partir do estado atual e de um `patch` que
 * aplica as mudanças (em uma única operação). Compartilhado entre o hook com
 * estado local (`useDataTableQuery`) e o com estado na URL (`useDataTableUrlQuery`).
 */
export function buildDataTableResult(
  state: {
    page: number;
    pageSize: number;
    sort: SortingState;
    filters: DataTableFilterValues;
  },
  patch: (next: DataTableQueryPatch) => void,
  defaultFilterValues?: DataTableFilterValues
): UseDataTableQueryResult {
  return {
    query: {
      page: state.page,
      pageSize: state.pageSize,
      sort: state.sort,
      filters: state.filters,
    },
    tableProps: {
      pageSize: state.pageSize,
      pageIndex: state.page,
      onPageChange: (page) => patch({ page }),
      // Nova ordenação/busca sempre volta para a primeira página.
      onSortingChange: (sort) => patch({ sort, page: 0 }),
      onSearch: (filters) => patch({ filters, page: 0 }),
      defaultFilterValues,
    },
  };
}

/**
 * Reúne num só lugar o estado server-side da `DataTable` (página, ordenação e
 * filtros) e os resets de página, devolvendo:
 * - `query`: os valores para montar a busca no backend (`queryKey`/params);
 * - `tableProps`: as props já fiadas para espalhar na `<DataTable />`.
 *
 * Trocar filtros ou ordenação volta automaticamente para a primeira página.
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
export function useDataTableQuery(
  options: UseDataTableQueryOptions = {}
): UseDataTableQueryResult {
  const { pageSize = 50, defaultSorting, defaultFilters } = options;

  const [page, setPage] = React.useState(0);
  const [sort, setSort] = React.useState<SortingState>(defaultSorting ?? []);
  const [filters, setFilters] = React.useState<DataTableFilterValues>(
    defaultFilters ?? {}
  );

  const patch = (next: DataTableQueryPatch) => {
    if (next.page !== undefined) setPage(next.page);
    if (next.sort !== undefined) setSort(next.sort);
    if (next.filters !== undefined) setFilters(next.filters);
  };

  return buildDataTableResult(
    { page, pageSize, sort, filters },
    patch,
    defaultFilters
  );
}
