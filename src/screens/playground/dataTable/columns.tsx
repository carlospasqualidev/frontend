import type { ColumnDef } from '@tanstack/react-table';
import { toast } from 'sonner';

import {
  actionsColumn,
  selectColumn,
  SortableHeader,
} from '@/components/global/dataTable/columnHelpers';

export type Payment = {
  id: string;
  amount: number;
  status: 'pending' | 'processing' | 'success' | 'failed';
  email: string;
  /** Data de criação no formato ISO curto (`aaaa-mm-dd`). */
  createdAt: string;
};

export const columns: ColumnDef<Payment>[] = [
  selectColumn(),
  {
    accessorKey: 'status',
    header: 'Status',
  },
  {
    accessorKey: 'email',
    header: ({ column }) => (
      <SortableHeader column={column}>E-mail</SortableHeader>
    ),
  },

  {
    accessorKey: 'amount',
    header: () => <div className="text-right">Valor</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue('amount'));
      const formatted = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format(amount);

      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <SortableHeader column={column}>Criado em</SortableHeader>
    ),
    cell: ({ row }) => {
      const [year, month, day] = (row.getValue('createdAt') as string).split(
        '-'
      );
      return `${day}/${month}/${year}`;
    },
  },
  actionsColumn<Payment>({
    label: 'Ações',

    actions: [
      {
        label: 'Copiar ID do pagamento',
        onSelect: (payment) => {
          navigator.clipboard.writeText(payment.id);
          toast.success('ID copiado para a área de transferência.');
        },
      },
      {
        label: 'Ver cliente',
        separatorBefore: true,
        onSelect: (payment) => toast(`Cliente: ${payment.email}`),
      },
      {
        label: 'Ver detalhes do pagamento',
        onSelect: (payment) =>
          toast(`Pagamento ${payment.id}: R$ ${payment.amount}`),
      },
    ],
  }),
];
