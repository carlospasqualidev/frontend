/**
 * Memória em runtime dos search params (filtros/ordenação/página) por rota.
 *
 * Permite voltar a uma listagem — pelo breadcrumb ou por um "Cancelar"/"Voltar"
 * — com os mesmos filtros que estavam ativos, mesmo depois de entrar num
 * detalhe/criar (onde a URL não carrega os filtros da lista). A URL continua
 * sendo a fonte de verdade; isto só lembra o último estado por caminho para
 * restaurá-lo ao navegar de volta. Reinicia no reload (aí a URL restaura).
 */
const searchByPath = new Map<string, Record<string, unknown>>();

function normalizePath(pathname: string): string {
  if (!pathname || pathname === '/') return '/';
  return pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
}

/** Registra o search atual de um caminho (chamado a cada navegação). */
export function rememberSearch(
  pathname: string,
  search: Record<string, unknown>
): void {
  searchByPath.set(normalizePath(pathname), search);
}

/** Recupera o último search conhecido de um caminho (`{}` se não houver). */
export function getRememberedSearch(pathname: string): Record<string, unknown> {
  return searchByPath.get(normalizePath(pathname)) ?? {};
}
