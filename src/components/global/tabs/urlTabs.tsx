import * as React from 'react';
import { useNavigate, useSearch } from '@tanstack/react-router';

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

export interface UrlTabItem {
  value: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
  content: React.ReactNode;
}

interface IUrlTabs {
  items: UrlTabItem[];
  defaultValue: string;
  /** Chave do search param na URL. Default: `'tab'`. */
  searchKey?: string;
  listClassName?: string;
  contentClassName?: string;
}

/**
 * Abas com valor ativo sincronizado a um search param da URL.
 *
 * Quando `value === defaultValue`, a chave é removida da URL (deixa a aba
 * "padrão" sem ?tab=...). Outros search params da rota são preservados.
 */
export function UrlTabs({
  items,
  defaultValue,
  searchKey = 'tab',
  listClassName,
  contentClassName,
}: IUrlTabs) {
  const search = useSearch({ strict: false }) as Record<string, unknown>;
  const navigate = useNavigate();

  const validValues = React.useMemo(
    () => new Set(items.map((item) => item.value)),
    [items]
  );

  const candidate = search[searchKey];
  const activeTab =
    typeof candidate === 'string' && validValues.has(candidate)
      ? candidate
      : defaultValue;

  const setTab = (next: string) => {
    void navigate({
      to: '.',
      search: (previous: Record<string, unknown>) => ({
        ...previous,
        [searchKey]: next === defaultValue ? undefined : next,
      }),
      replace: true,
    });
  };

  return (
    <Tabs value={activeTab} onValueChange={setTab}>
      <TabsList variant="line" className={listClassName}>
        {items.map((item) => (
          <TabsTrigger key={item.value} value={item.value}>
            {item.icon}
            {item.label}
          </TabsTrigger>
        ))}
      </TabsList>

      {items.map((item) => (
        <TabsContent
          key={item.value}
          value={item.value}
          className={cn('pt-4', contentClassName)}
        >
          {item.content}
        </TabsContent>
      ))}
    </Tabs>
  );
}
