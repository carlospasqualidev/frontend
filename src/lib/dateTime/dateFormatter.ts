import type { IDateFormatterValue } from './types';

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
 * @param params.showHours Quando `hasTimeStamp` for `true`, define se as horas devem ser exibidas
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
 *   showHours: true,
 * });
 * // → "31/03/2026 11:35" (exemplo em UTC-3)

 * @example
 * // Data com hora relevante, mas sem exibir a hora
 * dateFormatter({
 *   date: '2026-03-31T14:35:20Z',
 *   hasTimeStamp: true,
 *   showHours: false,
 * });
 * // → "31/03/2026"
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
export function dateFormatter({ date, hasTimeStamp, showHours }: IDateFormatterValue) {
  if (!date) return '-';

  const d = new Date(date);

  // feito separado pra garantir que o navegador exiba corretamente
  if (hasTimeStamp) {
    if (!showHours) {
      return d.toLocaleDateString(undefined, {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      });
    }

    return d.toLocaleString(undefined, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  return d.toLocaleDateString(undefined, {
    timeZone: 'UTC',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}
