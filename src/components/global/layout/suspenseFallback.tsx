/**
 * Indicador discreto exibido enquanto o chunk JS da próxima rota é baixado.
 * Como `defaultPreload: 'intent'` já pré-carrega rotas no hover, este fallback
 * só aparece em cliques muito rápidos — por isso o tratamento é mínimo: uma
 * barra horizontal de 2px no topo do conteúdo, sem ocupar altura visível.
 *
 * O carregamento de **dados** dentro da tela é responsabilidade da própria
 * tela e deve usar skeletons granulares no lugar do dado — nunca este
 * fallback global como substituto.
 */
export function SuspenseFallback() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Carregando próxima tela"
      className="h-0.5 w-full animate-pulse rounded-full bg-primary/40"
    />
  );
}
