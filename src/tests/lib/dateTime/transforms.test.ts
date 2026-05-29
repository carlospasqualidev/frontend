import { describe, expect, it } from 'vitest';

import { dateFormatter } from '@/lib/dateTime/dateFormatter';
import { transformIntoDatabaseDate } from '@/lib/dateTime/transformIntoDatabaseDate';
import { transformIntoDatabaseQueryDate } from '@/lib/dateTime/transformIntoDatabaseQueryDate';
import { transformIntoInputDate } from '@/lib/dateTime/transformIntoInputDate';

describe('dateFormatter', () => {
  it('retorna "-" para data vazia', () => {
    expect(dateFormatter({ date: null, hasTimeStamp: false })).toBe('-');
    expect(dateFormatter({ date: undefined, hasTimeStamp: false })).toBe('-');
  });

  it('força UTC quando hasTimeStamp=false (evita deslocar de dia)', () => {
    // Backend manda meia-noite UTC; sem forçar UTC, o navegador rebateria
    // para o dia anterior em fusos negativos.
    expect(
      dateFormatter({
        date: '2026-03-31T00:00:00Z',
        hasTimeStamp: false,
      })
    ).toMatch(/31\/03\/2026/);
  });
});

describe('transformIntoInputDate', () => {
  it('retorna string vazia quando não há data', () => {
    expect(transformIntoInputDate({ date: null, hasTimeStamp: true })).toBe('');
  });

  it('mantém apenas a parte de data quando hasTimeStamp=false', () => {
    expect(
      transformIntoInputDate({
        date: '2026-03-31T00:00:00.000Z',
        hasTimeStamp: false,
      })
    ).toBe('2026-03-31');
  });
});

describe('transformIntoDatabaseDate', () => {
  it('retorna null para data vazia', () => {
    expect(transformIntoDatabaseDate({ date: null })).toBeNull();
  });

  it('preserva instante exato quando o input já tem hora (T...)', () => {
    expect(
      transformIntoDatabaseDate({ date: '2026-03-31T14:30:00.000Z' })
    ).toBe('2026-03-31T14:30:00.000Z');
  });

  it('para input só-data com banco só-data: meia-noite UTC', () => {
    expect(
      transformIntoDatabaseDate({
        date: '2026-03-31',
        databaseDateHasTimeStamp: false,
      })
    ).toBe('2026-03-31T00:00:00.000Z');
  });
});

describe('transformIntoDatabaseQueryDate', () => {
  it('retorna string vazia para data vazia', () => {
    expect(transformIntoDatabaseQueryDate({ date: null, type: 'start' })).toBe(
      ''
    );
  });

  it('para input só-data e banco só-data: ignora o type (sempre 00:00 UTC)', () => {
    expect(
      transformIntoDatabaseQueryDate({
        date: '2026-03-31',
        type: 'start',
        databaseDateHasTimeStamp: false,
      })
    ).toBe('2026-03-31T00:00:00.000Z');

    expect(
      transformIntoDatabaseQueryDate({
        date: '2026-03-31',
        type: 'end',
        databaseDateHasTimeStamp: false,
      })
    ).toBe('2026-03-31T23:59:59.999Z');
  });
});
