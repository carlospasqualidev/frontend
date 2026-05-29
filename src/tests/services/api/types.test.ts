import { describe, expect, it } from 'vitest';

import { hasResponseMessage } from '@/services/api/types';

describe('hasResponseMessage', () => {
  it('aceita objeto com `message: string`', () => {
    expect(hasResponseMessage({ message: 'Falha.' })).toBe(true);
  });

  it('rejeita objeto sem `message`', () => {
    expect(hasResponseMessage({ status: 500 })).toBe(false);
  });

  it('rejeita `message` não-string', () => {
    expect(hasResponseMessage({ message: 42 })).toBe(false);
    expect(hasResponseMessage({ message: null })).toBe(false);
  });

  it('rejeita null e primitivos', () => {
    expect(hasResponseMessage(null)).toBe(false);
    expect(hasResponseMessage(undefined)).toBe(false);
    expect(hasResponseMessage('mensagem direta')).toBe(false);
  });
});
