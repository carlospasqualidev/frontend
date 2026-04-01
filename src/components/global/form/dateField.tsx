'use client';

import * as React from 'react';
import { CalendarIcon, Clock2Icon, XIcon } from 'lucide-react';
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
import { Input } from '@/components/ui/input';
import {
  PopoverAnchor,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

const FORM_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const DISPLAY_DATE_PATTERN = /^\d{2}\/\d{2}\/\d{4}$/;

type CalendarProps = Omit<
  React.ComponentProps<typeof Calendar>,
  'mode' | 'selected' | 'defaultMonth' | 'onSelect'
>;

type DateFieldBaseProps = Omit<
  React.ComponentProps<'input'>,
  'type' | 'value' | 'defaultValue' | 'onChange' | 'onBlur'
> & {
  label: string;
  description?: string;
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
> = Omit<DateFieldBaseProps, 'value' | 'defaultValue' | 'onChange' | 'name'> & {
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

function createDateFromParts(day: string, month: string, year: string) {
  const parsedDay = Number(day);
  const parsedMonth = Number(month);
  const parsedYear = Number(year);

  if (
    !Number.isInteger(parsedDay) ||
    !Number.isInteger(parsedMonth) ||
    !Number.isInteger(parsedYear)
  ) {
    return undefined;
  }

  const date = new Date(parsedYear, parsedMonth - 1, parsedDay);

  if (
    Number.isNaN(date.getTime()) ||
    date.getFullYear() !== parsedYear ||
    date.getMonth() !== parsedMonth - 1 ||
    date.getDate() !== parsedDay
  ) {
    return undefined;
  }

  return date;
}

function formatDateForForm(date: Date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function formatDateForDisplay(date: Date) {
  const day = `${date.getDate()}`.padStart(2, '0');
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

function parseDateValue(value: string | undefined) {
  if (!value) {
    return undefined;
  }

  if (FORM_DATE_PATTERN.test(value)) {
    const [year, month, day] = value.split('-');
    return createDateFromParts(day, month, year);
  }

  if (DISPLAY_DATE_PATTERN.test(value)) {
    const [day, month, year] = value.split('/');
    return createDateFromParts(day, month, year);
  }

  return undefined;
}

function formatDisplayValue(value: string | undefined) {
  const parsedDate = parseDateValue(value);

  if (parsedDate) {
    return formatDateForDisplay(parsedDate);
  }

  return value ?? '';
}

function clampDateSegment(value: string, max: number) {
  if (value.length < 2) {
    return value;
  }

  return `${Math.min(Number(value), max)}`.padStart(2, '0');
}

function maskDisplayValue(value: string) {
  const isoDateMatch = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);

  if (isoDateMatch) {
    const [, year, month, day] = isoDateMatch;
    return `${clampDateSegment(day, 31)}/${clampDateSegment(month, 12)}/${year}`;
  }

  const sanitizedWithSeparators = value.replace(/[^\d/]/g, '');
  const hasSeparators = sanitizedWithSeparators.includes('/');

  if (hasSeparators) {
    const segments = sanitizedWithSeparators.split('/').slice(0, 3);
    const [rawDay = '', rawMonth = '', rawYear = ''] = segments;

    const day = clampDateSegment(rawDay.slice(0, 2), 31);
    const month = clampDateSegment(rawMonth.slice(0, 2), 12);
    const year = rawYear.slice(0, 4);

    let nextValue = day;
    const hasMonthPart =
      segments.length > 1 || sanitizedWithSeparators.endsWith('/');
    const shouldStartYearPart =
      day.length === 2 &&
      month.length === 2 &&
      rawYear.length === 0 &&
      !sanitizedWithSeparators.endsWith('/');
    const hasYearPart = rawYear.length > 0 || shouldStartYearPart;

    if (hasMonthPart) {
      nextValue = `${nextValue}/${month}`;
    }

    if (hasYearPart) {
      nextValue = `${nextValue}/${year}`;
    }

    return nextValue;
  }

  const digits = value.replace(/\D/g, '').slice(0, 8);

  if (!digits) {
    return '';
  }

  const day = clampDateSegment(digits.slice(0, 2), 31);
  const month = clampDateSegment(digits.slice(2, 4), 12);
  const year = digits.slice(4, 8);

  return [day, month, year].filter(Boolean).join('/');
}

function parseDisplayValueToFormValue(value: string) {
  const parsedDate = parseDateValue(value);

  if (!parsedDate) {
    return undefined;
  }

  return formatDateForForm(parsedDate);
}

function resolveDateInMonth(monthDate: Date, preferredDay: number) {
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const maxDay = new Date(year, month + 1, 0).getDate();
  const safeDay = Math.min(Math.max(preferredDay, 1), maxDay);

  return new Date(year, month, safeDay);
}

function DateFieldBase({
  id,
  name,
  label,
  description,
  placeholder = 'dd/mm/aaaa',
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
  const isControlled = value !== undefined;
  const resolvedValue = isControlled ? (value ?? '') : internalValue;
  const [displayValue, setDisplayValue] = React.useState(() =>
    formatDisplayValue(resolvedValue)
  );

  const allErrors = resolveFieldErrors(errors);
  const invalid = hasFieldErrors(allErrors);
  const resolvedAriaInvalid = ariaInvalid ?? (invalid || undefined);
  const selectedDate = React.useMemo(
    () => parseDateValue(resolvedValue),
    [resolvedValue]
  );

  React.useEffect(() => {
    setDisplayValue(formatDisplayValue(resolvedValue));
  }, [resolvedValue]);

  const commitValue = React.useCallback(
    (nextValue: string) => {
      if (!isControlled) {
        setInternalValue(nextValue);
      }

      onChange?.(nextValue);
    },
    [isControlled, onChange]
  );

  const handleInputChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const nextDisplayValue = maskDisplayValue(event.target.value);
      const nextFormValue = parseDisplayValueToFormValue(nextDisplayValue);

      setDisplayValue(nextDisplayValue);

      if (!nextDisplayValue) {
        commitValue('');
        return;
      }

      commitValue(nextFormValue ?? nextDisplayValue);
    },
    [commitValue]
  );

  const handleCalendarSelect = React.useCallback(
    (nextDate: Date | undefined) => {
      const nextFormValue = nextDate ? formatDateForForm(nextDate) : '';
      const nextDisplayValue = nextDate ? formatDateForDisplay(nextDate) : '';

      setDisplayValue(nextDisplayValue);
      commitValue(nextFormValue);
      onBlur?.();
      setOpen(false);
    },
    [commitValue, onBlur]
  );

  const handleCalendarMonthChange = React.useCallback(
    (nextMonth: Date) => {
      const preferredDay = selectedDate?.getDate() ?? 1;
      const nextDate = resolveDateInMonth(nextMonth, preferredDay);

      setDisplayValue(formatDateForDisplay(nextDate));
      commitValue(formatDateForForm(nextDate));
      calendarProps?.onMonthChange?.(nextMonth);
    },
    [calendarProps, commitValue, selectedDate]
  );

  const handleClearValue = React.useCallback(() => {
    setDisplayValue('');
    commitValue('');
    onBlur?.();
    setOpen(false);
  }, [commitValue, onBlur]);

  const handleSetNow = React.useCallback(() => {
    const now = new Date();

    setDisplayValue(formatDateForDisplay(now));
    commitValue(formatDateForForm(now));
    onBlur?.();
  }, [commitValue, onBlur]);

  const handleInputBlur = React.useCallback(() => {
    const nextFormValue = parseDisplayValueToFormValue(displayValue);

    if (nextFormValue) {
      setDisplayValue(formatDisplayValue(nextFormValue));
      commitValue(nextFormValue);
    }

    onBlur?.();
  }, [commitValue, displayValue, onBlur]);
  const hasValue = displayValue.trim().length > 0;

  return (
    <BaseField data-invalid={invalid}>
      {label && <FieldLabel htmlFor={id}>{label}</FieldLabel>}

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverAnchor asChild>
          <div className="relative">
            <Input
              {...props}
              id={id}
              name={name}
              type="text"
              inputMode="numeric"
              autoComplete="off"
              placeholder={placeholder}
              value={displayValue}
              disabled={disabled}
              aria-invalid={resolvedAriaInvalid}
              className={cn('pr-28', className)}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
            />

            {hasValue && (
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                disabled={disabled}
                aria-label="Limpar data"
                className="absolute top-1/2 right-16 -translate-y-1/2! transition-colors active:-translate-y-1/2!"
                onClick={handleClearValue}
              >
                <XIcon className="size-4 text-muted-foreground" />
              </Button>
            )}

            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              disabled={disabled}
              aria-label="Definir data atual"
              className="absolute top-1/2 right-9 -translate-y-1/2! transition-colors active:-translate-y-1/2!"
              onClick={handleSetNow}
            >
              <Clock2Icon className="size-4 text-muted-foreground" />
            </Button>

            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                disabled={disabled}
                aria-label="Abrir calendário"
                className="absolute top-1/2 right-1 -translate-y-1/2! transition-colors active:-translate-y-1/2!"
              >
                <CalendarIcon className="size-4 text-muted-foreground" />
              </Button>
            </PopoverTrigger>
          </div>
        </PopoverAnchor>

        <PopoverContent className="w-auto overflow-hidden p-0" align="center">
          <Calendar
            mode="single"
            selected={selectedDate}
            defaultMonth={selectedDate}
            onSelect={handleCalendarSelect}
            onMonthChange={handleCalendarMonthChange}
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
