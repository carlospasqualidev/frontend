import type { IDateValueWithTimeStamp } from './types';

/**
 * Formata datas para exibição considerando diferenças de timezone entre frontend e backend.
 *
 * Regras:
 * - Se `hasTimeStamp = true`: exibe data + hora no fuso local do usuário
 * - Se `hasTimeStamp = false`: força UTC para evitar deslocamento de dia
 *   (caso comum: backend envia `00:00` e o navegador converte para o dia anterior)
 *
 * @param params.date Data a ser formatada
 * @param params.hasTimeStamp Indica se a data possui hora relevante
 *
 * @returns Data formatada ou '-' se não informada
 *
 * @example
 * // Data sem hora relevante (backend envia 00:00)
 * dateFormatter({
 *   date: '2026-03-31T00:00:00Z',
 *   hasTimeStamp: false,
 * });
 * // → "31/03/2026 00:00"
 * // (evita virar 30/03 por causa do fuso)
 *
 * @example
 * // Data com hora relevante
 * dateFormatter({
 *   date: '2026-03-31T14:35:20Z',
 *   hasTimeStamp: true,
 * });
 * // → "31/03/2026 11:35" (exemplo em UTC-3)
 *
 * @example
 * // Data simples sem timezone explícito
 * dateFormatter({
 *   date: '2026-03-31',
 *   hasTimeStamp: false,
 * });
 * // → "31/03/2026 00:00"
 *
 * @example
 * // Sem data
 * dateFormatter({
 *   date: null,
 *   hasTimeStamp: false,
 * });
 * // → "-"
 */
export function dateFormatter({ date, hasTimeStamp }: IDateValueWithTimeStamp) {
  if (!date) return '-';

  if (hasTimeStamp) {
    return new Date(date).toLocaleString().substring(0, 17);
  }

  return new Date(date)
    .toLocaleString(undefined, { timeZone: 'UTC' })
    .substring(0, 17);
}
