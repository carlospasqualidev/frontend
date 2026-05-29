import { type PropsWithChildren } from 'react';
import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';

import { ThemeProvider, useTheme } from '@/hooks/useThemeProvider';

function wrapper({ children }: PropsWithChildren) {
  return (
    <ThemeProvider defaultTheme="light" disableTransitionOnChange={false}>
      {children}
    </ThemeProvider>
  );
}

describe('useThemeProvider', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('light', 'dark');
  });

  it('aplica o tema padrão na raiz do documento', () => {
    renderHook(() => useTheme(), { wrapper });

    expect(document.documentElement.classList.contains('light')).toBe(true);
  });

  it('persiste e aplica o tema ao chamar setTheme', () => {
    const { result } = renderHook(() => useTheme(), { wrapper });

    act(() => {
      result.current.setTheme('dark');
    });

    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(localStorage.getItem('theme')).toBe('dark');
  });

  it('lança erro quando usado fora do provider', () => {
    expect(() => renderHook(() => useTheme())).toThrow(
      /must be used within a ThemeProvider/
    );
  });
});
