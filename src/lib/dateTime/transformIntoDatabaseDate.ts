import type { IDateValue } from './types';
import { inputHasTimeStamp, parseLocalDate } from './utils';

interface ITransformIntoDatabaseDate extends IDateValue {
  databaseDateHasTimeStamp?: boolean;
}

/**
 * Converte a data vinda do input para o formato ISO (UTC) usado ao salvar no backend.
 *
 * Regras:
 * - Se o input tiver data e hora, salva o instante exato em UTC
 * - Se o input tiver apenas data e o banco salvar datetime, usa meia-noite local
 * - Se o input tiver apenas data e o banco salvar apenas data, usa meia-noite UTC
 *
 * @example
 * // Input date salvando em campo date
 * transformIntoDatabaseDate({
 *   date: '2026-03-31',
 *   databaseDateHasTimeStamp: false,
 * });
 * // → "2026-03-31T00:00:00.000Z"
 *
 * @example
 * // Input datetime-local salvando em campo datetime
 * transformIntoDatabaseDate({
 *   date: '2026-03-31T14:30',
 * });
 * // → "2026-03-31T17:30:00.000Z"
 *
 * @example
 * // Input date salvando em campo datetime
 * transformIntoDatabaseDate({
 *   date: '2026-03-31',
 *   databaseDateHasTimeStamp: true,
 * });
 * // → "2026-03-31T03:00:00.000Z"
 */
export function transformIntoDatabaseDate({
  date,
  databaseDateHasTimeStamp = false,
}: ITransformIntoDatabaseDate) {
  if (!date) return null;

  if (inputHasTimeStamp(date)) {
    return new Date(date).toISOString();
  }

  const onlyDate = parseLocalDate(date);

  if (databaseDateHasTimeStamp) {
    onlyDate.setHours(0, 0, 0, 0);
  } else {
    onlyDate.setUTCHours(0, 0, 0, 0);
  }

  return onlyDate.toISOString();
}
