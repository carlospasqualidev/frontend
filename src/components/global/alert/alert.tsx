import * as React from 'react';
import {
  CircleAlert,
  CircleCheck,
  Info,
  TriangleAlert,
} from 'lucide-react';

import {
  Alert as AlertPrimitive,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert';
import { cn } from '@/lib/utils';

type AlertVariant = 'default' | 'info' | 'success' | 'warning' | 'error';

interface IAlert {
  title: string;
  description?: string;
  variant?: AlertVariant;
  /** Sobrescreve o ícone padrão da variante. Passe `null` para omitir. */
  icon?: React.ReactNode;
  className?: string;
}

const variantClasses = new Map<AlertVariant, string>([
  ['default', ''],
  [
    'info',
    'border-sky-200 bg-sky-50 text-sky-900 dark:border-sky-900 dark:bg-sky-950 dark:text-sky-100',
  ],
  [
    'success',
    'border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-100',
  ],
  [
    'warning',
    'border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-100',
  ],
  [
    'error',
    'border-red-200 bg-red-50 text-red-900 dark:border-red-900 dark:bg-red-950 dark:text-red-100',
  ],
]);

const variantDescriptionClasses = new Map<AlertVariant, string>([
  ['default', ''],
  ['info', 'text-sky-800 dark:text-sky-200/85'],
  ['success', 'text-emerald-800 dark:text-emerald-200/85'],
  ['warning', 'text-amber-800 dark:text-amber-200/85'],
  ['error', 'text-red-800 dark:text-red-200/85'],
]);

const defaultIcons = new Map<AlertVariant, React.ReactNode>([
  ['default', null],
  ['info', <Info />],
  ['success', <CircleCheck />],
  ['warning', <TriangleAlert />],
  ['error', <CircleAlert />],
]);

/**
 * Banner inline para mensagens contextuais (info/success/warning/error).
 *
 * - `title`: obrigatório, sempre visível.
 * - `description`: opcional.
 * - `variant`: cor + ícone padrão. Sem `variant` ou `default`, fica neutro.
 * - `icon`: sobrescreve o ícone padrão. Passe `null` para omitir o ícone.
 */
export function Alert({
  title,
  description,
  variant = 'default',
  icon,
  className,
}: IAlert) {
  const resolvedIcon = icon === undefined ? defaultIcons.get(variant) : icon;

  return (
    <AlertPrimitive className={cn(variantClasses.get(variant), className)}>
      {resolvedIcon}
      <AlertTitle>{title}</AlertTitle>
      {description ? (
        <AlertDescription className={variantDescriptionClasses.get(variant)}>
          {description}
        </AlertDescription>
      ) : null}
    </AlertPrimitive>
  );
}
