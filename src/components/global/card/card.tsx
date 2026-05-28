'use client';
import * as React from 'react';

import {
  Card as CardPrimitive,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface ICard {
  title: string;
  description: string;
  children: React.ReactNode;
}

export function Card({ title, description, children }: ICard) {
  return (
    <CardPrimitive className="rounded-2xl border border-border/70 shadow-sm ring-0 sm:rounded-3xl dark:shadow-none">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </CardPrimitive>
  );
}
