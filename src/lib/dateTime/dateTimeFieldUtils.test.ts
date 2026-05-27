import { describe, expect, it } from 'vitest';

import {
  createDateFromParts,
  extractTimeParts,
  formatDateTimeForDisplay,
  formatDateTimeForForm,
  maskDisplayValue,
  normalizeTimeParts,
  parseDateTimeValue,
  parseDisplayValueToFormValue,
} from '@/lib/dateTime/dateTimeFieldUtils';

describe('createDateFromParts (data + hora)', () => {
  it('cria uma data/hora válida', () => {
    const date = createDateFromParts('31', '12', '2026', '14', '30');
    expect(formatDateTimeForForm(date as Date)).toBe('2026-12-31T14:30');
  });

  it('rejeita hora fora do intervalo', () => {
    expect(createDateFromParts('31', '12', '2026', '25', '00')).toBeUndefined();
  });

  it('rejeita data inexistente', () => {
    expect(createDateFromParts('31', '02', '2026', '10', '00')).toBeUndefined();
  });
});

describe('parseDateTimeValue', () => {
  it('aceita formato ISO', () => {
    expect(
      formatDateTimeForDisplay(parseDateTimeValue('2026-12-31T14:30') as Date)
    ).toBe('31/12/2026 14:30');
  });

  it('aceita formato de exibição', () => {
    expect(
      formatDateTimeForForm(parseDateTimeValue('31/12/2026 14:30') as Date)
    ).toBe('2026-12-31T14:30');
  });
});

describe('maskDisplayValue', () => {
  it('mantém um valor de exibição já completo', () => {
    expect(maskDisplayValue('31/12/2026 14:30')).toBe('31/12/2026 14:30');
  });

  it('converte ISO para exibição', () => {
    expect(maskDisplayValue('2026-12-31T14:30')).toBe('31/12/2026 14:30');
  });
});

describe('parseDisplayValueToFormValue', () => {
  it('converte exibição completa em ISO', () => {
    expect(parseDisplayValueToFormValue('31/12/2026 14:30')).toBe(
      '2026-12-31T14:30'
    );
  });

  it('retorna undefined quando incompleto', () => {
    expect(parseDisplayValueToFormValue('31/12/2026')).toBeUndefined();
  });
});

describe('normalizeTimeParts', () => {
  it('preenche com zero à esquerda', () => {
    expect(normalizeTimeParts({ hour: '5', minute: '9' })).toEqual({
      hour: '05',
      minute: '09',
    });
  });

  it('limita hora e minuto aos máximos', () => {
    expect(normalizeTimeParts({ hour: '99', minute: '99' })).toEqual({
      hour: '23',
      minute: '59',
    });
  });
});

describe('extractTimeParts', () => {
  it('extrai hora/minuto de uma data', () => {
    expect(extractTimeParts(new Date(2026, 0, 1, 8, 5))).toEqual({
      hour: '08',
      minute: '05',
    });
  });

  it('retorna o padrão quando não há data', () => {
    expect(extractTimeParts(undefined)).toEqual({ hour: '00', minute: '00' });
  });
});
