import * as React from 'react';

import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

type DateInputProps = Omit<React.ComponentProps<'input'>, 'type'>;

function hasDateValue(
  value: React.ComponentProps<'input'>['value'] | undefined,
  defaultValue: React.ComponentProps<'input'>['defaultValue'] | undefined
) {
  return Boolean(value ?? defaultValue);
}

function DateInput({
  className,
  onChange,
  value,
  defaultValue,
  ...props
}: DateInputProps) {
  const [filled, setFilled] = React.useState(() =>
    hasDateValue(value, defaultValue)
  );

  React.useEffect(() => {
    if (value !== undefined) {
      setFilled(Boolean(value));
    }
  }, [value]);

  return (
    <Input
      type="date"
      value={value}
      defaultValue={defaultValue}
      data-empty={filled ? 'false' : 'true'}
      onChange={(event) => {
        setFilled(Boolean(event.target.value));
        onChange?.(event);
      }}
      className={cn(
        'scheme-light dark:scheme-dark',
        '[&::-webkit-calendar-picker-indicator]:cursor-pointer',
        '[&::-webkit-calendar-picker-indicator]:opacity-60',
        '[&::-webkit-calendar-picker-indicator]:transition-opacity',
        'hover:[&::-webkit-calendar-picker-indicator]:opacity-100',
        '[&::-webkit-date-and-time-value]:min-h-6',
        '[&::-webkit-date-and-time-value]:text-left',
        '[&::-webkit-datetime-edit]:inline-flex',
        '[&::-webkit-datetime-edit]:min-h-6',
        '[&::-webkit-datetime-edit]:items-center',
        '[&::-webkit-datetime-edit-fields-wrapper]:p-0',
        '[&[data-empty=true]::-webkit-date-and-time-value]:text-muted-foreground',
        '[&[data-empty=true]::-webkit-datetime-edit]:text-muted-foreground',
        className
      )}
      {...props}
    />
  );
}

export { DateInput };
