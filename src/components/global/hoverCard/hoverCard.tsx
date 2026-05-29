import * as React from 'react';

import {
  HoverCard as HoverCardPrimitive,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';

interface IHoverCard {
  trigger: React.ReactNode;
  children: React.ReactNode;
  align?: 'start' | 'center' | 'end';
  side?: 'top' | 'right' | 'bottom' | 'left';
  openDelay?: number;
  closeDelay?: number;
  className?: string;
}

/**
 * Preview detalhado exibido ao passar o mouse / focar no trigger.
 *
 * - `trigger`: elemento que dispara a abertura (link, avatar, badge).
 * - `children`: conteúdo do preview.
 *
 * O trigger é envelopado como `asChild`, então passe um elemento focável real
 * (botão, link, etc.).
 */
export function HoverCard({
  trigger,
  children,
  align = 'center',
  side,
  openDelay,
  closeDelay,
  className,
}: IHoverCard) {
  return (
    <HoverCardPrimitive openDelay={openDelay} closeDelay={closeDelay}>
      <HoverCardTrigger asChild>{trigger}</HoverCardTrigger>
      <HoverCardContent align={align} side={side} className={className}>
        {children}
      </HoverCardContent>
    </HoverCardPrimitive>
  );
}
