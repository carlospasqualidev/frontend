import * as React from 'react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { useIsMobile } from '@/hooks/useMobile';

interface IModal {
  title: string;
  description: string;
  children: React.ReactNode;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function Modal({ title, description, children, open, setOpen }: IModal) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent>
          <DrawerHeader className="text-left">
            <DrawerTitle>{title}</DrawerTitle>

            <DrawerDescription>{description}</DrawerDescription>
          </DrawerHeader>
          {/*
            Scroll NATIVO (não `ScrollArea` do Radix): no Drawer (vaul) o gesto
            de toque só rola quando o container é um overflow nativo — o vaul
            usa isso para diferenciar "rolar conteúdo" de "arrastar o drawer".
            `flex-1 min-h-0` limita a altura ao espaço restante do drawer,
            habilitando o scroll interno.
          */}
          <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-4">
            {children}
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>

          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}
