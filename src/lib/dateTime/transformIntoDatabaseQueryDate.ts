import type { IDateValue } from './types';
import { inputHasTimeStamp, parseLocalDate } from './utils';

interface ITransformIntoDatabaseQueryDate extends IDateValue {
  type: 'start' | 'end';
  databaseDateHasTimeStamp?: boolean;
}

/**
 * Converte a data vinda do input para o formato ISO (UTC) usado em queries no backend.
 *
 * Possibilidades atendidas:
 * - Input com data filtra registros com data
 * - Input com data e hora filtra registros com data e hora
 * - Input com data filtra registros com data e hora
 *
 * Regras:
 * - Se o input tiver data e hora, retorna o instante exato em UTC
 * - Se o banco salvar data com hora, o intervalo é calculado no fuso local
 * - Se o banco salvar apenas data, o intervalo é calculado em UTC
 *
 * @example
 * // Input date filtrando campo date
 * transformIntoDatabaseQueryDate({
 *   date: '2026-03-31',
 *   type: 'start',
 *   databaseDateHasTimeStamp: false,
 * });
 * // → "2026-03-31T00:00:00.000Z"
 *
 * @example
 * // Input date filtrando campo datetime
 * transformIntoDatabaseQueryDate({
 *   date: '2026-03-31',
 *   type: 'end',
 *   databaseDateHasTimeStamp: true,
 * });
 * // → "2026-04-01T02:59:59.999Z"
 */
export function transformIntoDatabaseQueryDate({
  date,
  type,
  databaseDateHasTimeStamp = false,
}: ITransformIntoDatabaseQueryDate) {
  if (!date) return '';

  if (inputHasTimeStamp(date)) {
    return new Date(date).toISOString();
  }

  const onlyDate = parseLocalDate(date);

  if (databaseDateHasTimeStamp) {
    if (type === 'start') {
      onlyDate.setHours(0, 0, 0, 0);
    }

    if (type === 'end') {
      onlyDate.setHours(23, 59, 59, 999);
    }
  } else {
    if (type === 'start') {
      onlyDate.setUTCHours(0, 0, 0, 0);
    }

    if (type === 'end') {
      onlyDate.setUTCHours(23, 59, 59, 999);
    }
  }

  return onlyDate.toISOString();
}
