import { describe, expect, it } from 'vitest';

import { cn } from '@/lib/utils';

describe('cn', () => {
  it('mescla classes condicionais ignorando valores falsy', () => {
    expect(cn('a', { b: false }, undefined, 'c')).toBe('a c');
  });

  it('resolve conflitos do tailwind mantendo a última classe', () => {
    expect(cn('px-2', 'px-4')).toBe('px-4');
  });
});
