import * as React from 'react';

import {
  Card as CardPrimitive,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface ICard {
  title: string;
  description?: string;
  /**
   * Ação do cabeçalho (ex.: botão "Adicionar …"), renderizada **alinhada à
   * direita** do título/descrição. Use isto para a ação primária de uma seção —
   * não coloque o botão de adicionar solto acima/dentro do conteúdo.
   */
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function Card({ title, description, action, children, className }: ICard) {
  return (
    <CardPrimitive
      className={cn(
        'rounded-2xl border border-border/70 shadow-sm ring-0 sm:rounded-3xl dark:shadow-none',
        className
      )}
    >
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
        {action && <CardAction>{action}</CardAction>}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </CardPrimitive>
  );
}
