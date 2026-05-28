import { z } from 'zod';

/**
 * Schema dos search params usados pela `DataTable` server-side. Plugue
 * `validateDataTableSearch` no `validateSearch` da rota para persistir
 * página/ordenação/filtros na URL (URLs filtradas compartilháveis).
 */
const filterValueSchema = z.union([
  z.string(),
  z.array(z.string()),
  z.object({ from: z.string(), to: z.string() }),
]);

export const dataTableSearchSchema = z.object({
  page: z.number().optional(),
  sort: z.array(z.object({ id: z.string(), desc: z.boolean() })).optional(),
  filters: z.record(z.string(), filterValueSchema).optional(),
});

export type DataTableSearch = z.infer<typeof dataTableSearchSchema>;

/**
 * Valida os search params da rota. Em caso de URL inválida, ignora (volta ao
 * estado padrão) em vez de quebrar a navegação.
 *
 * ```ts
 * createRoute({ validateSearch: validateDataTableSearch, ... });
 * ```
 */
export function validateDataTableSearch(
  search: Record<string, unknown>
): DataTableSearch {
  return dataTableSearchSchema.catch({}).parse(search);
}
