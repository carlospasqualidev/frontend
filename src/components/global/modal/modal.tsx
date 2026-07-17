import * as React from 'react';
import { ChevronLeft } from 'lucide-react';

import { Button } from '@/components/ui/button';
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
import { cn } from '@/lib/utils';

/**
 * Largura do modal no desktop (Dialog). No mobile o Drawer é sempre full-width,
 * então `size` não o afeta. `default` cobre a maioria dos formulários; `lg`/`xl`
 * para conteúdo largo (ex.: tabelas ou dois painéis lado a lado).
 */
export type ModalSize = 'default' | 'lg' | 'xl';

function sizeClassName(size: ModalSize): string {
  switch (size) {
    case 'lg':
      return 'sm:max-w-3xl';
    case 'xl':
      return 'sm:max-w-5xl';
    case 'default':
    default:
      return 'sm:max-w-lg';
  }
}

interface IModal {
  title: string;
  description: string;
  children: React.ReactNode;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  /** Largura no desktop. Padrão: `default`. */
  size?: ModalSize;
  /**
   * Quando definido, mostra um botão-ícone de voltar à esquerda do título/descrição
   * (alinhado verticalmente entre eles). Use em fluxos com passos (ex.: escolher
   * uma opção → formulário) para voltar ao passo anterior sem fechar o modal.
   */
  onBack?: () => void;
  /** Rótulo acessível do botão de voltar (padrão: "Voltar"). */
  backLabel?: string;
}

/**
 * Cabeçalho do modal com botão de voltar opcional. O botão fica à esquerda,
 * centralizado verticalmente contra o bloco título+descrição.
 */
function ModalHeaderContent({
  title,
  description,
  onBack,
  backLabel = 'Voltar',
  Title,
  Description,
}: {
  title: string;
  description: string;
  onBack?: () => void;
  backLabel?: string;
  Title: React.ElementType;
  Description: React.ElementType;
}) {
  const heading = (
    <div className="flex flex-col gap-1">
      <Title>{title}</Title>
      <Description>{description}</Description>
    </div>
  );

  if (!onBack) return heading;

  return (
    <div className="flex items-center gap-2">
      <Button
        type="button"
        variant="ghost"
        size="icon-lg"
        aria-label={backLabel}
        onClick={onBack}
        className="-ml-1 shrink-0"
      >
        <ChevronLeft className="size-5" />
      </Button>
      {heading}
    </div>
  );
}

export function Modal({
  title,
  description,
  children,
  open,
  setOpen,
  size = 'default',
  onBack,
  backLabel,
}: IModal) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent>
          <DrawerHeader className="text-left">
            <ModalHeaderContent
              title={title}
              description={description}
              onBack={onBack}
              backLabel={backLabel}
              Title={DrawerTitle}
              Description={DrawerDescription}
            />
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
      <DialogContent className={sizeClassName(size)}>
        <DialogHeader>
          <ModalHeaderContent
            title={title}
            description={description}
            onBack={onBack}
            backLabel={backLabel}
            Title={DialogTitle}
            Description={DialogDescription}
          />
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}

/**
 * Rodapé padrão de ações de um modal: o(s) botão(ões) ocupam 100% da largura do
 * modal (empilhados quando há mais de um). Use para agrupar o(s) botão(ões) de
 * ação (Salvar/Criar) de QUALQUER modal do projeto, garantindo o mesmo padrão em
 * todos. A largura total vem do `flex flex-col` (align-items: stretch estica os
 * filhos). Em modais de edição, o botão de salvar deve renderizar apenas quando
 * o formulário está _dirty_ (ver CLAUDE.md).
 */
export function ModalFooter({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return <div className={cn('flex flex-col gap-2', className)}>{children}</div>;
}
