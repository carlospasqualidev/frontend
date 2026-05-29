import { describe, expect, it } from 'vitest';

import {
  createDateFromParts,
  formatDateForDisplay,
  formatDateForForm,
  maskDisplayValue,
  parseDateValue,
  parseDisplayValueToFormValue,
} from '@/lib/dateTime/dateFieldUtils';

describe('createDateFromParts', () => {
  it('cria uma data válida', () => {
    const date = createDateFromParts('15', '03', '2026');
    expect(date).toBeInstanceOf(Date);
    expect(formatDateForForm(date as Date)).toBe('2026-03-15');
  });

  it('rejeita datas inexistentes (ex.: 31/02)', () => {
    expect(createDateFromParts('31', '02', '2026')).toBeUndefined();
  });

  it('rejeita partes não numéricas', () => {
    expect(createDateFromParts('aa', '03', '2026')).toBeUndefined();
  });
});

describe('parseDateValue', () => {
  it('aceita formato ISO (aaaa-mm-dd)', () => {
    expect(formatDateForDisplay(parseDateValue('2026-03-15') as Date)).toBe(
      '15/03/2026'
    );
  });

  it('aceita formato de exibição (dd/mm/aaaa)', () => {
    expect(formatDateForForm(parseDateValue('15/03/2026') as Date)).toBe(
      '2026-03-15'
    );
  });

  it('retorna undefined para valor vazio ou inválido', () => {
    expect(parseDateValue('')).toBeUndefined();
    expect(parseDateValue('abc')).toBeUndefined();
  });
});

describe('maskDisplayValue', () => {
  it('formata dígitos crus em dd/mm/aaaa', () => {
    expect(maskDisplayValue('15032026')).toBe('15/03/2026');
  });

  it('limita dia e mês aos máximos', () => {
    expect(maskDisplayValue('99')).toBe('31');
    expect(maskDisplayValue('1399')).toBe('13/12');
  });

  it('converte uma data ISO para exibição', () => {
    expect(maskDisplayValue('2026-03-15')).toBe('15/03/2026');
  });
});

describe('parseDisplayValueToFormValue', () => {
  it('converte exibição válida em ISO', () => {
    expect(parseDisplayValueToFormValue('31/12/2026')).toBe('2026-12-31');
  });

  it('retorna undefined para data inválida', () => {
    expect(parseDisplayValueToFormValue('99/99/2026')).toBeUndefined();
  });
});
