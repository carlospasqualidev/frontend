import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const typographyVariants = cva('text-foreground', {
  variants: {
    variant: {
      hero: 'font-heading text-3xl font-semibold tracking-tight text-balance sm:text-4xl',
      h1: 'font-heading text-4xl font-extrabold tracking-tight text-balance',
      h2: 'font-heading text-3xl font-semibold tracking-tight text-balance',
      h3: 'font-heading text-2xl font-semibold tracking-tight text-balance',
      lead: 'text-base leading-7 text-muted-foreground sm:text-lg',
      p: 'text-base leading-7',
      small: 'text-sm leading-none font-medium',
      muted: 'text-sm leading-6 text-muted-foreground',
    },
    align: {
      left: 'text-left',
      center: 'text-center',
      right: 'text-right',
    },
  },
  defaultVariants: {
    variant: 'p',
    align: 'left',
  },
});

type TypographyProps = React.HTMLAttributes<HTMLElement> &
  VariantProps<typeof typographyVariants> & {
    as?: React.ElementType;
  };

function Typography({
  as: Comp = 'p',
  variant,
  align,
  className,
  ...props
}: TypographyProps) {
  return (
    <Comp
      data-slot="typography"
      data-variant={variant}
      className={cn(typographyVariants({ variant, align }), className)}
      {...props}
    />
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export { Typography, typographyVariants };
