import * as React from 'react';

import {
  Card as CardPrimitive,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface ICard {
  title: string;
  description: string;
  children: React.ReactNode;
  className?: string;
}

export function Card({ title, description, children, className }: ICard) {
  return (
    <CardPrimitive
      className={cn(
        'rounded-2xl border border-border/70 shadow-sm ring-0 sm:rounded-3xl dark:shadow-none',
        className
      )}
    >
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </CardPrimitive>
  );
}
