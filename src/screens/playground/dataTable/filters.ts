import {
  dateFilter,
  dateRangeFilter,
  multiSelectFilter,
  textFilter,
} from '@/components/global/dataTable/filters';

// Definição declarativa dos filtros, no mesmo estilo das `columns`.
export const filters = [
  textFilter({
    key: 'email',
    label: 'E-mail',
    placeholder: 'Buscar por e-mail...',
  }),
  multiSelectFilter({
    key: 'status',
    label: 'Status',
    placeholder: 'Todos os status',
    options: [
      { value: 'pending', label: 'Pendente' },
      { value: 'processing', label: 'Processando' },
      { value: 'success', label: 'Pago' },
      { value: 'failed', label: 'Falhou' },
    ],
  }),
  dateFilter({ key: 'createdAt', label: 'Criado em' }),
  dateRangeFilter({ key: 'period', label: 'Período' }),
];
