import * as React from 'react';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { type SortingState } from '@tanstack/react-table';

import { type DataTableSearch } from './dataTableSearch';
import { type DataTableFilterValues } from './filters';
import {
  buildDataTableResult,
  type DataTableQueryPatch,
  type UseDataTableQueryResult,
} from './useDataTableQuery';

interface UseDataTableUrlQueryOptions {
  /** Linhas por página. Padrão: `50`. */
  pageSize?: number;
  /** Ordenação inicial; gravada na URL no mount se ela estiver vazia. */
  defaultSorting?: SortingState;
  /** Filtros iniciais; gravados na URL no mount se ela estiver vazia. */
  defaultFilters?: DataTableFilterValues;
}

/**
 * Igual ao `useDataTableQuery`, mas o estado (página/ordenação/filtros) vive nos
 * **search params da URL** — permitindo recarregar e compartilhar URLs filtradas.
 *
 * A rota precisa declarar `validateSearch: validateDataTableSearch`.
 *
 * `defaultSorting`/`defaultFilters` são gravados na URL **uma única vez ao
 * montar** (se os params correspondentes estiverem ausentes), e a partir daí a
 * URL é a única fonte da verdade. Isso garante que "Limpar" fique limpo
 * de verdade — os defaults não voltam na próxima navegação.
 */
export function useDataTableUrlQuery({
  pageSize = 50,
  defaultSorting,
  defaultFilters,
}: UseDataTableUrlQueryOptions = {}): UseDataTableQueryResult {
  const search = useSearch({ strict: false }) as DataTableSearch;
  const navigate = useNavigate();

  // Grava os defaults na URL apenas no primeiro render, e somente para os
  // params ausentes. Depois disso, `seeded` impede que os defaults voltem
  // como fallback ao ler o estado.
  const [seeded, setSeeded] = React.useState(false);
  React.useEffect(() => {
    if (seeded) return;

    const seedSort =
      search.sort === undefined && defaultSorting && defaultSorting.length > 0;
    const seedFilters =
      search.filters === undefined &&
      defaultFilters &&
      Object.keys(defaultFilters).length > 0;

    if (seedSort || seedFilters) {
      void navigate({
        to: '.',
        replace: true,
        search: (previous: Record<string, unknown>) => ({
          ...previous,
          ...(seedSort ? { sort: defaultSorting } : {}),
          ...(seedFilters ? { filters: defaultFilters } : {}),
        }),
      });
    }

    setSeeded(true);
  }, []);

  // Antes do seed (primeiro render), aplica defaults; depois, URL é a verdade.
  const page = typeof search.page === 'number' ? search.page : 0;
  const sort = search.sort ?? (seeded ? [] : (defaultSorting ?? []));
  const filters = search.filters ?? (seeded ? {} : (defaultFilters ?? {}));

  const patch = (next: DataTableQueryPatch) => {
    // Usa apenas o que está REALMENTE na URL como base — sem fallback para
    // defaults — para que valores removidos pelo usuário permaneçam removidos.
    const urlPage = typeof search.page === 'number' ? search.page : 0;
    const urlSort = search.sort ?? [];
    const urlFilters = search.filters ?? {};
    const merged = {
      page: next.page !== undefined ? next.page : urlPage,
      sort: next.sort !== undefined ? next.sort : urlSort,
      filters: next.filters !== undefined ? next.filters : urlFilters,
    };

    void navigate({
      to: '.',
      search: (previous: Record<string, unknown>) => {
        const rest = { ...previous };
        delete rest.page;
        delete rest.sort;
        delete rest.filters;

        // Omite valores padrão/vazios para manter a URL limpa.
        return {
          ...rest,
          ...(merged.page ? { page: merged.page } : {}),
          ...(merged.sort.length ? { sort: merged.sort } : {}),
          ...(Object.keys(merged.filters).length
            ? { filters: merged.filters }
            : {}),
        };
      },
    });
  };

  // `defaultFilterValues` reflete os filtros atuais da URL, para os campos do
  // cabeçalho abrirem preenchidos (inclusive ao recarregar/compartilhar).
  return buildDataTableResult({ page, pageSize, sort, filters }, patch, filters);
}
