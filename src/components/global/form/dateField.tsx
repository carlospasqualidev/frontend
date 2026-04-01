'use client';

import * as React from 'react';
import {
  useController,
  type Control,
  type FieldPathByValue,
  type FieldPathValue,
  type FieldValues,
  type RegisterOptions,
} from 'react-hook-form';

import {
  type TFormFieldErrors,
  hasFieldErrors,
  resolveFieldErrors,
} from '../../../lib/forms/errors';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Field as BaseField,
  FieldDescription,
  FieldError,
  FieldLabel,
} from '@/components/ui/field';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { parseLocalDate } from '@/lib/dateTime/utils';
import { cn } from '@/lib/utils';

const dateFormatter = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
});

type CalendarProps = Omit<
  React.ComponentProps<typeof Calendar>,
  'mode' | 'selected' | 'defaultMonth' | 'onSelect'
>;

type DateFieldBaseProps = Omit<
  React.ComponentProps<typeof Button>,
  'children' | 'value' | 'defaultValue' | 'onChange' | 'onBlur'
> & {
  id?: string;
  name?: string;
  label: string;
  description?: string;
  placeholder?: string;
  errors?: TFormFieldErrors;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  calendarProps?: CalendarProps;
};

type ControlledDateFieldProps<
  TFieldValues extends FieldValues,
  TName extends FieldPathByValue<TFieldValues, string>,
> = Omit<
  DateFieldBaseProps,
  'value' | 'defaultValue' | 'onChange' | 'onBlur' | 'name'
> & {
  control: Control<TFieldValues>;
  name: TName;
  rules?: Omit<
    RegisterOptions<TFieldValues, TName>,
    'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'
  >;
  defaultValue?: FieldPathValue<TFieldValues, TName>;
};

type UncontrolledDateFieldProps = DateFieldBaseProps & {
  control?: never;
  rules?: never;
};

type DateFieldProps<
  TFieldValues extends FieldValues,
  TName extends FieldPathByValue<TFieldValues, string>,
> = ControlledDateFieldProps<TFieldValues, TName> | UncontrolledDateFieldProps;

function formatDateForForm(date: Date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function parseDateValue(value: string | undefined) {
  if (!value) {
    return undefined;
  }

  return parseLocalDate(value);
}

function DateFieldBase({
  id,
  name,
  label,
  description,
  placeholder = 'Selecione uma data',
  errors,
  value,
  defaultValue,
  onChange,
  onBlur,
  disabled,
  className,
  'aria-invalid': ariaInvalid,
  calendarProps,
  ...props
}: DateFieldBaseProps) {
  const [open, setOpen] = React.useState(false);
  const [internalValue, setInternalValue] = React.useState(defaultValue ?? '');

  const allErrors = resolveFieldErrors(errors);
  const invalid = hasFieldErrors(allErrors);
  const resolvedAriaInvalid = ariaInvalid ?? (invalid || undefined);
  const isControlled = value !== undefined;
  const resolvedValue = isControlled ? (value ?? '') : internalValue;
  const selectedDate = React.useMemo(
    () => parseDateValue(resolvedValue),
    [resolvedValue]
  );

  const handleValueChange = React.useCallback(
    (nextDate: Date | undefined) => {
      const nextValue = nextDate ? formatDateForForm(nextDate) : '';

      if (!isControlled) {
        setInternalValue(nextValue);
      }

      onChange?.(nextValue);
      onBlur?.();
      setOpen(false);
    },
    [isControlled, onBlur, onChange]
  );

  return (
    <BaseField data-invalid={invalid}>
      {label && <FieldLabel htmlFor={id}>{label}</FieldLabel>}

      <input
        type="hidden"
        name={name}
        value={resolvedValue}
        disabled={disabled}
      />

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            id={id}
            variant="outline"
            aria-invalid={resolvedAriaInvalid}
            disabled={disabled}
            className={cn(
              'w-full justify-start text-left font-normal',
              !resolvedValue && 'text-muted-foreground',
              className
            )}
            onBlur={onBlur}
            {...props}
          >
            {selectedDate ? dateFormatter.format(selectedDate) : placeholder}
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            mode="single"
            selected={selectedDate}
            defaultMonth={selectedDate}
            onSelect={handleValueChange}
            captionLayout="dropdown"
            {...calendarProps}
          />
        </PopoverContent>
      </Popover>

      {description && <FieldDescription>{description}</FieldDescription>}
      <FieldError errors={allErrors} />
    </BaseField>
  );
}

function ControlledDateField<
  TFieldValues extends FieldValues,
  TName extends FieldPathByValue<TFieldValues, string>,
>({
  control,
  name,
  rules,
  defaultValue,
  errors,
  ...props
}: ControlledDateFieldProps<TFieldValues, TName>) {
  const {
    field,
    fieldState: { error: fieldError },
  } = useController({
    control,
    name,
    rules,
    defaultValue,
  });

  return (
    <DateFieldBase
      {...props}
      name={field.name}
      value={typeof field.value === 'string' ? field.value : ''}
      onChange={field.onChange}
      onBlur={field.onBlur}
      errors={resolveFieldErrors(fieldError, errors)}
      disabled={props.disabled ?? field.disabled}
    />
  );
}

export function DateField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPathByValue<TFieldValues, string> = FieldPathByValue<
    TFieldValues,
    string
  >,
>(props: DateFieldProps<TFieldValues, TName>) {
  if ('control' in props && props.control) {
    return <ControlledDateField {...props} />;
  }

  return <DateFieldBase {...props} />;
}
