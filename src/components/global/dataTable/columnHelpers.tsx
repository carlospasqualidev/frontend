import { Fragment, type ReactNode } from 'react';
import type { Column, ColumnDef } from '@tanstack/react-table';
import { ArrowUpDownIcon, MoreHorizontalIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

/**
 * Coluna de seleção com checkbox (cabeçalho "selecionar todas" + checkbox por
 * linha). Espalhe no início da lista de `columns` para habilitar a seleção e o
 * rodapé de contagem da `DataTable`.
 *
 * ```tsx
 * export const columns: ColumnDef<Payment>[] = [
 *   selectColumn(),
 *   { accessorKey: 'status', header: 'Status' },
 * ];
 * ```
 */
// eslint-disable-next-line react-refresh/only-export-components
export function selectColumn<TData>(): ColumnDef<TData> {
  return {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Selecionar todas"
      />
    ),
    cell: ({ row }) => (
      // Wrapper isola o clique do checkbox do `onRowClick` da DataTable —
      // marcar/desmarcar uma linha não deve disparar a navegação.
      <div onClick={(event) => event.stopPropagation()}>
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Selecionar linha"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  };
}

interface SortableHeaderProps<TData, TValue> {
  column: Column<TData, TValue>;
  children: React.ReactNode;
}

/**
 * Cabeçalho de coluna clicável que alterna a ordenação. Use no `header` da
 * coluna:
 *
 * ```tsx
 * {
 *   accessorKey: 'email',
 *   header: ({ column }) => <SortableHeader column={column}>E-mail</SortableHeader>,
 * }
 * ```
 */
export function SortableHeader<TData, TValue>({
  column,
  children,
}: SortableHeaderProps<TData, TValue>) {
  return (
    <Button
      variant="ghost"
      onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
    >
      {children}
      <ArrowUpDownIcon />
    </Button>
  );
}

export interface DataTableRowAction<TData> {
  /** Texto exibido no item do menu. */
  label: string;
  /** Callback executado ao selecionar o item; recebe a linha original. */
  onSelect: (row: TData) => void;
  /** Ícone opcional renderizado antes do label. */
  icon?: ReactNode;
  /** Renderiza um separador acima deste item. */
  separatorBefore?: boolean;
  /** Aplica o estilo destrutivo ao item. */
  destructive?: boolean;
  /** Desabilita o item. */
  disabled?: boolean;
}

interface ActionsColumnOptions<TData> {
  /** Itens do menu — lista fixa ou função que recebe a linha. */
  actions:
    | DataTableRowAction<TData>[]
    | ((row: TData) => DataTableRowAction<TData>[]);
  /** Rótulo opcional exibido no topo do menu (ex.: "Ações"). */
  label?: string;
  /** id da coluna. Padrão: `'actions'`. */
  id?: string;
  /** Texto acessível do botão que abre o menu. Padrão: `'Abrir menu'`. */
  triggerLabel?: string;
}

/**
 * Coluna de ações por linha: um botão "⋯" que abre um menu com os itens
 * informados. Espalhe no fim da lista de `columns`.
 *
 * ```tsx
 * actionsColumn<Payment>({
 *   label: 'Ações',
 *   actions: [
 *     {
 *       label: 'Copiar ID',
 *       onSelect: (payment) => navigator.clipboard.writeText(payment.id),
 *     },
 *     { label: 'Excluir', destructive: true, separatorBefore: true, onSelect: remove },
 *   ],
 * })
 * ```
 *
 * `actions` também aceita uma função da linha, para variar os itens por linha.
 */
// eslint-disable-next-line react-refresh/only-export-components
export function actionsColumn<TData>({
  actions,
  label,
  id = 'actions',
  triggerLabel = 'Abrir menu',
}: ActionsColumnOptions<TData>): ColumnDef<TData> {
  return {
    id,
    enableHiding: false,
    enableSorting: false,
    cell: ({ row }) => {
      const items =
        typeof actions === 'function' ? actions(row.original) : actions;

      return (
        // Wrapper isola o clique do menu de ações do `onRowClick` da DataTable —
        // abrir o menu e selecionar uma ação não devem disparar a navegação.
        <div onClick={(event) => event.stopPropagation()}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <span className="sr-only">{triggerLabel}</span>
                <MoreHorizontalIcon />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {label && <DropdownMenuLabel>{label}</DropdownMenuLabel>}
              {items.map((action) => (
                <Fragment key={action.label}>
                  {action.separatorBefore && <DropdownMenuSeparator />}
                  <DropdownMenuItem
                    variant={action.destructive ? 'destructive' : 'default'}
                    disabled={action.disabled}
                    onClick={() => action.onSelect(row.original)}
                  >
                    {action.icon}
                    {action.label}
                  </DropdownMenuItem>
                </Fragment>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  };
}
