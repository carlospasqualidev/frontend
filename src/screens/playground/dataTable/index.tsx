import { type SortingState } from '@tanstack/react-table';

import { PlaygroundHeader } from '../components';

import { columns, type Payment } from './columns';
import { filters } from './filters';

import type {
  DataTableFilterValues,
  DateRangeValue,
} from '@/components/global/dataTable/filters';
import { DataTable } from '@/components/global/dataTable/dataTable';
import { useDataTableUrlQuery } from '@/components/global/dataTable/useDataTableUrlQuery';

// Simula o "banco" do backend. Em produção, a busca, a ordenação e a paginação
// abaixo aconteceriam no servidor (ex.: via react-query), nunca em memória.
const DATABASE: Payment[] = [
  {
    id: '728ed52f',
    amount: 100,
    status: 'pending',
    email: 'm@example.com',
    createdAt: '2026-01-05',
  },
  {
    id: '489e1d42',
    amount: 125,
    status: 'processing',
    email: 'example@gmail.com',
    createdAt: '2026-01-18',
  },
  {
    id: 'a3f9c1b8',
    amount: 250,
    status: 'success',
    email: 'ana.silva@example.com',
    createdAt: '2026-02-02',
  },
  {
    id: 'c7d2e4a1',
    amount: 75,
    status: 'failed',
    email: 'joao@empresa.com.br',
    createdAt: '2026-02-14',
  },
  {
    id: 'f1b6a9e3',
    amount: 320,
    status: 'success',
    email: 'maria@example.com',
    createdAt: '2026-03-01',
  },
  {
    id: 'b2c8d5f7',
    amount: 45,
    status: 'pending',
    email: 'carlos@example.com',
    createdAt: '2026-03-09',
  },
  {
    id: 'e9a4c6b2',
    amount: 180,
    status: 'processing',
    email: 'beatriz@example.com',
    createdAt: '2026-03-22',
  },
  {
    id: 'd5f3b8a6',
    amount: 99,
    status: 'success',
    email: 'pedro@example.com',
    createdAt: '2026-04-04',
  },
  {
    id: 'a8c2e7d9',
    amount: 410,
    status: 'failed',
    email: 'lucas@example.com',
    createdAt: '2026-04-17',
  },
  {
    id: 'c4b9f1e5',
    amount: 60,
    status: 'pending',
    email: 'julia@example.com',
    createdAt: '2026-05-01',
  },
  {
    id: 'f7d3a2c8',
    amount: 215,
    status: 'success',
    email: 'rafael@example.com',
    createdAt: '2026-05-12',
  },
  {
    id: 'b1e6c9a4',
    amount: 88,
    status: 'processing',
    email: 'fernanda@example.com',
    createdAt: '2026-05-20',
  },
];

const PAGE_SIZE = 5;

function sortValue(payment: Payment, columnId: string): string {
  return columnId === 'email' ? payment.email : payment.createdAt;
}

// Simula a resposta do backend: aplica filtros + ordenação e devolve só a página.
function queryDatabase(
  filterValues: DataTableFilterValues,
  sorting: SortingState,
  pageIndex: number
): Payment[] {
  const email =
    typeof filterValues.email === 'string'
      ? filterValues.email.toLowerCase()
      : '';
  const statuses = Array.isArray(filterValues.status)
    ? filterValues.status
    : [];
  const createdAt =
    typeof filterValues.createdAt === 'string' ? filterValues.createdAt : '';
  const period: DateRangeValue =
    filterValues.period &&
    !Array.isArray(filterValues.period) &&
    typeof filterValues.period === 'object'
      ? filterValues.period
      : { from: '', to: '' };

  const matches = DATABASE.filter((payment) => {
    if (email && !payment.email.toLowerCase().includes(email)) return false;
    if (statuses.length > 0 && !statuses.includes(payment.status)) return false;
    if (createdAt && payment.createdAt !== createdAt) return false;
    if (period.from && payment.createdAt < period.from) return false;
    if (period.to && payment.createdAt > period.to) return false;
    return true;
  });

  const sort = sorting[0];
  const ordered = sort
    ? [...matches].sort((a, b) => {
        const result = sortValue(a, sort.id).localeCompare(
          sortValue(b, sort.id)
        );
        return sort.desc ? -result : result;
      })
    : matches;

  return ordered.slice(
    pageIndex * PAGE_SIZE,
    pageIndex * PAGE_SIZE + PAGE_SIZE
  );
}

export function PlaygroundDataTablePage() {
  // Um único hook concentra página, ordenação e filtros (+ resets de página).
  // `defaultFilters`/`defaultSorting` deixam os campos já preenchidos e a
  // primeira busca já sai filtrada/ordenada.
  const { query, tableProps } = useDataTableUrlQuery({
    pageSize: PAGE_SIZE,
    defaultFilters: {
      status: ['success', 'pending'],
      period: { from: '2026-02-01', to: '2026-05-31' },
    },
    defaultSorting: [{ id: 'createdAt', desc: true }],
  });

  // Em produção isto seria um useQuery; aqui o "backend" é a função simulada.
  const pageData = queryDatabase(query.filters, query.sort, query.page);

  return (
    <div className="space-y-6">
      <PlaygroundHeader
        title="Data Table"
        description="Tabela 100% server-side: filtros, ordenação e paginação são delegados ao backend. Os filtros vão ao servidor ao clicar em 'Buscar', clicar num cabeçalho reordena no servidor, e 'Próxima' é desabilitado quando a página vem incompleta."
      />

      <div className="rounded-2xl border border-border/70 bg-background p-3 shadow-sm sm:rounded-3xl sm:p-5">
        <DataTable
          columns={columns}
          data={pageData}
          filters={filters}
          {...tableProps}
        />
      </div>
    </div>
  );
}
