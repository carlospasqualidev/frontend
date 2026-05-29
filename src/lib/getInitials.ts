/**
 * Devolve as iniciais de um nome para uso em avatares quando não há imagem.
 * Um nome único → duas primeiras letras; múltiplos → primeira + última inicial.
 */
export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return (
    parts[0]!.charAt(0) + parts[parts.length - 1]!.charAt(0)
  ).toUpperCase();
}
