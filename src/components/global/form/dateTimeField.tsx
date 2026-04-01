'use client';

import * as React from 'react';
import { CalendarIcon, Clock3Icon } from 'lucide-react';
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

const FORM_DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;
const DISPLAY_DATE_PATTERN = /^(\d{2})\/(\d{2})\/(\d{4})$/;
const FORM_DATE_TIME_PATTERN = /^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2})$/;
const DISPLAY_DATE_TIME_PATTERN =
  /^(\d{2})\/(\d{2})\/(\d{4})\s+(\d{2}):(\d{2})$/;

type CalendarProps = Omit<
  React.ComponentProps<typeof Calendar>,
  'mode' | 'selected' | 'defaultMonth' | 'onSelect'
>;

type TimeParts = {
  hour: string;
  minute: string;
};

const DEFAULT_TIME_PARTS: TimeParts = {
  hour: '00',
  minute: '00',
};

type DateTimeFieldBaseProps = Omit<
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

type ControlledDateTimeFieldProps<
  TFieldValues extends FieldValues,
  TName extends FieldPathByValue<TFieldValues, string>,
> = Omit<
  DateTimeFieldBaseProps,
  'value' | 'defaultValue' | 'onChange' | 'name'
> & {
  control: Control<TFieldValues>;
  name: TName;
  rules?: Omit<
    RegisterOptions<TFieldValues, TName>,
    'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'
  >;
  defaultValue?: FieldPathValue<TFieldValues, TName>;
};

type UncontrolledDateTimeFieldProps = DateTimeFieldBaseProps & {
  control?: never;
  rules?: never;
};

type DateTimeFieldProps<
  TFieldValues extends FieldValues,
  TName extends FieldPathByValue<TFieldValues, string>,
> =
  | ControlledDateTimeFieldProps<TFieldValues, TName>
  | UncontrolledDateTimeFieldProps;

function createDateFromParts(
  day: string,
  month: string,
  year: string,
  hour = '00',
  minute = '00'
) {
  const parsedDay = Number(day);
  const parsedMonth = Number(month);
  const parsedYear = Number(year);
  const parsedHour = Number(hour);
  const parsedMinute = Number(minute);

  if (
    !Number.isInteger(parsedDay) ||
    !Number.isInteger(parsedMonth) ||
    !Number.isInteger(parsedYear) ||
    !Number.isInteger(parsedHour) ||
    !Number.isInteger(parsedMinute)
  ) {
    return undefined;
  }

  if (
    parsedHour < 0 ||
    parsedHour > 23 ||
    parsedMinute < 0 ||
    parsedMinute > 59
  ) {
    return undefined;
  }

  const date = new Date(
    parsedYear,
    parsedMonth - 1,
    parsedDay,
    parsedHour,
    parsedMinute,
    0
  );

  if (
    Number.isNaN(date.getTime()) ||
    date.getFullYear() !== parsedYear ||
    date.getMonth() !== parsedMonth - 1 ||
    date.getDate() !== parsedDay ||
    date.getHours() !== parsedHour ||
    date.getMinutes() !== parsedMinute
  ) {
    return undefined;
  }

  return date;
}

function formatDateTimeForForm(date: Date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  const hour = `${date.getHours()}`.padStart(2, '0');
  const minute = `${date.getMinutes()}`.padStart(2, '0');
  return `${year}-${month}-${day}T${hour}:${minute}`;
}

function formatDateTimeForDisplay(date: Date) {
  const day = `${date.getDate()}`.padStart(2, '0');
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const year = date.getFullYear();
  const hour = `${date.getHours()}`.padStart(2, '0');
  const minute = `${date.getMinutes()}`.padStart(2, '0');
  return `${day}/${month}/${year} ${hour}:${minute}`;
}

function parseDateTimeValue(value: string | undefined) {
  if (!value) {
    return undefined;
  }

  const trimmedValue = value.trim();
  const formMatch = trimmedValue.match(FORM_DATE_TIME_PATTERN);

  if (formMatch) {
    const [, year, month, day, hour, minute] = formMatch;

    return createDateFromParts(day, month, year, hour, minute);
  }

  const displayMatch = trimmedValue.match(DISPLAY_DATE_TIME_PATTERN);

  if (displayMatch) {
    const [, day, month, year, hour, minute] = displayMatch;

    return createDateFromParts(day, month, year, hour, minute);
  }

  return undefined;
}

function parseDateValue(value: string | undefined) {
  if (!value) {
    return undefined;
  }

  const trimmedValue = value.trim();
  const formDateTimeMatch = trimmedValue.match(FORM_DATE_TIME_PATTERN);

  if (formDateTimeMatch) {
    const [, year, month, day] = formDateTimeMatch;
    return createDateFromParts(day, month, year);
  }

  const formDateMatch = trimmedValue.match(FORM_DATE_PATTERN);

  if (formDateMatch) {
    const [, year, month, day] = formDateMatch;
    return createDateFromParts(day, month, year);
  }

  const displayDateTimeMatch = trimmedValue.match(DISPLAY_DATE_TIME_PATTERN);

  if (displayDateTimeMatch) {
    const [, day, month, year] = displayDateTimeMatch;
    return createDateFromParts(day, month, year);
  }

  const displayDateMatch = trimmedValue.match(DISPLAY_DATE_PATTERN);

  if (displayDateMatch) {
    const [, day, month, year] = displayDateMatch;
    return createDateFromParts(day, month, year);
  }

  return undefined;
}

function formatDisplayValue(value: string | undefined) {
  const parsedDate = parseDateTimeValue(value);

  if (parsedDate) {
    return formatDateTimeForDisplay(parsedDate);
  }

  return value ?? '';
}

function clampSegment(value: string, max: number) {
  if (value.length < 2) {
    return value;
  }

  return `${Math.min(Number(value), max)}`.padStart(2, '0');
}

function maskDatePart(
  value: string,
  options?: { shouldAutoStartYear?: boolean }
) {
  const shouldAutoStartYear = options?.shouldAutoStartYear ?? true;
  const sanitizedWithSeparators = value.replace(/[^\d/]/g, '');
  const hasSeparators = sanitizedWithSeparators.includes('/');

  if (hasSeparators) {
    const segments = sanitizedWithSeparators.split('/').slice(0, 3);
    const [rawDay = '', rawMonth = '', rawYear = ''] = segments;
    const rawMonthDigits = rawMonth.replace(/\D/g, '');
    const rawYearDigits = rawYear.replace(/\D/g, '');

    const day = clampSegment(rawDay.slice(0, 2), 31);
    const month = clampSegment(rawMonthDigits.slice(0, 2), 12);
    const year = `${rawMonthDigits.slice(2)}${rawYearDigits}`.slice(0, 4);

    let nextValue = day;
    const hasMonthPart =
      segments.length > 1 || sanitizedWithSeparators.endsWith('/');
    const shouldStartYearPart =
      shouldAutoStartYear &&
      day.length === 2 &&
      month.length === 2 &&
      year.length === 0 &&
      !sanitizedWithSeparators.endsWith('/');
    const hasYearSeparator =
      sanitizedWithSeparators.endsWith('/') && segments.length > 2;
    const hasYearPart =
      rawYear.length > 0 || shouldStartYearPart || hasYearSeparator;

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

  const day = clampSegment(digits.slice(0, 2), 31);
  const month = clampSegment(digits.slice(2, 4), 12);
  const year = digits.slice(4, 8);

  return [day, month, year].filter(Boolean).join('/');
}

function maskTimePart(value: string) {
  const sanitizedWithSeparators = value.replace(/[^\d:]/g, '');
  const hasSeparators = sanitizedWithSeparators.includes(':');

  if (hasSeparators) {
    const segments = sanitizedWithSeparators.split(':').slice(0, 2);
    const [rawHour = '', rawMinute = ''] = segments;

    const hour = clampSegment(rawHour.slice(0, 2), 23);
    const minute = clampSegment(rawMinute.slice(0, 2), 59);

    let nextValue = hour;
    const hasMinutePart =
      segments.length > 1 || sanitizedWithSeparators.endsWith(':');

    if (hasMinutePart) {
      nextValue = `${nextValue}:${minute}`;
    }

    return nextValue;
  }

  const digits = value.replace(/\D/g, '').slice(0, 4);

  if (!digits) {
    return '';
  }

  const hour = clampSegment(digits.slice(0, 2), 23);
  const minute = clampSegment(digits.slice(2, 4), 59);
  let nextValue = hour;

  if (digits.length > 2) {
    nextValue = `${nextValue}:${minute}`;
  }

  return nextValue;
}

function maskDisplayValue(
  value: string,
  options?: { shouldAutoStartTime?: boolean; shouldAutoStartYear?: boolean }
) {
  const shouldAutoStartTime = options?.shouldAutoStartTime ?? true;
  const shouldAutoStartYear = options?.shouldAutoStartYear ?? true;
  const isoMatch = value.match(/^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2})$/);

  if (isoMatch) {
    const [, year, month, day, hour, minute] = isoMatch;

    return `${clampSegment(day, 31)}/${clampSegment(month, 12)}/${year} ${clampSegment(hour, 23)}:${clampSegment(minute, 59)}`;
  }

  const sanitized = value.replace(/[^\d/: ]/g, '');
  const [rawDatePart = '', rawTimePart = ''] = sanitized.split(/\s+/, 2);
  const maskedDatePart = maskDatePart(rawDatePart, {
    shouldAutoStartYear,
  });
  const maskedTimePart = maskTimePart(rawTimePart);
  const hasTypedSpace = sanitized.includes(' ');
  const shouldStartTimePart =
    shouldAutoStartTime &&
    !hasTypedSpace &&
    !rawTimePart &&
    DISPLAY_DATE_PATTERN.test(maskedDatePart);

  if (hasTypedSpace || rawTimePart || shouldStartTimePart) {
    if (!rawTimePart) {
      return `${maskedDatePart} `;
    }

    return `${maskedDatePart} ${maskedTimePart}`.trimEnd();
  }

  return maskedDatePart;
}

function parseDisplayValueToFormValue(value: string) {
  const match = value.trim().match(DISPLAY_DATE_TIME_PATTERN);

  if (!match) {
    return undefined;
  }

  const [, day, month, year, hour, minute] = match;
  if (hour === undefined || minute === undefined) {
    return undefined;
  }

  const date = createDateFromParts(day, month, year, hour, minute);

  if (!date) {
    return undefined;
  }

  return formatDateTimeForForm(date);
}

function resolveDateInMonth(monthDate: Date, preferredDay: number) {
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const maxDay = new Date(year, month + 1, 0).getDate();
  const safeDay = Math.min(Math.max(preferredDay, 1), maxDay);

  return new Date(year, month, safeDay);
}

function extractTimeParts(date: Date | undefined): TimeParts {
  if (!date) {
    return DEFAULT_TIME_PARTS;
  }

  return {
    hour: `${date.getHours()}`.padStart(2, '0'),
    minute: `${date.getMinutes()}`.padStart(2, '0'),
  };
}

function normalizeTimeParts(parts: TimeParts): TimeParts {
  return {
    hour: clampSegment(parts.hour.padStart(2, '0').slice(0, 2), 23).padStart(
      2,
      '0'
    ),
    minute: clampSegment(
      parts.minute.padStart(2, '0').slice(0, 2),
      59
    ).padStart(2, '0'),
  };
}

function setTimePartValue(
  parts: TimeParts,
  part: keyof TimeParts,
  value: string
): TimeParts {
  if (part === 'hour') {
    return {
      ...parts,
      hour: value,
    };
  }

  return {
    ...parts,
    minute: value,
  };
}

function getTimePartValue(parts: TimeParts, part: keyof TimeParts) {
  if (part === 'hour') {
    return parts.hour;
  }

  return parts.minute;
}

function getSegmentDigitCount(value: string, segmentIndex: number) {
  const segments = value.split(/[/: ]/);

  if (segmentIndex === 0) {
    return segments[0]?.replace(/\D/g, '').length ?? 0;
  }

  if (segmentIndex === 1) {
    return segments[1]?.replace(/\D/g, '').length ?? 0;
  }

  if (segmentIndex === 2) {
    return segments[2]?.replace(/\D/g, '').length ?? 0;
  }

  if (segmentIndex === 3) {
    return segments[3]?.replace(/\D/g, '').length ?? 0;
  }

  if (segmentIndex === 4) {
    return segments[4]?.replace(/\D/g, '').length ?? 0;
  }

  return 0;
}

function DateTimeFieldBase({
  id,
  name,
  label,
  description,
  placeholder = 'dd/mm/aaaa hh:mm',
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
}: DateTimeFieldBaseProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [open, setOpen] = React.useState(false);
  const [internalValue, setInternalValue] = React.useState(defaultValue ?? '');
  const isControlled = value !== undefined;
  const resolvedValue = isControlled ? (value ?? '') : internalValue;
  const parsedDateTime = React.useMemo(
    () => parseDateTimeValue(resolvedValue),
    [resolvedValue]
  );
  const selectedDate = React.useMemo(
    () => parseDateValue(resolvedValue),
    [resolvedValue]
  );
  const [displayValue, setDisplayValue] = React.useState(() =>
    formatDisplayValue(resolvedValue)
  );
  const [timeDraft, setTimeDraft] = React.useState<TimeParts>(() =>
    extractTimeParts(parsedDateTime)
  );

  const allErrors = resolveFieldErrors(errors);
  const invalid = hasFieldErrors(allErrors);
  const resolvedAriaInvalid = ariaInvalid ?? (invalid || undefined);

  React.useEffect(() => {
    setDisplayValue(formatDisplayValue(resolvedValue));
    setTimeDraft(extractTimeParts(parsedDateTime));
  }, [parsedDateTime, resolvedValue]);

  const commitValue = React.useCallback(
    (nextValue: string) => {
      if (!isControlled) {
        setInternalValue(nextValue);
      }

      onChange?.(nextValue);
    },
    [isControlled, onChange]
  );

  const commitDateAndTime = React.useCallback(
    (date: Date, nextTimeParts: TimeParts) => {
      const normalized = normalizeTimeParts(nextTimeParts);
      const nextDate = new Date(date);

      nextDate.setHours(
        Number(normalized.hour),
        Number(normalized.minute),
        0,
        0
      );

      setTimeDraft(normalized);
      setDisplayValue(formatDateTimeForDisplay(nextDate));
      commitValue(formatDateTimeForForm(nextDate));
    },
    [commitValue]
  );

  const handleInputChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const inputEvent = event.nativeEvent as InputEvent | undefined;
      const isDeleting = inputEvent?.inputType?.startsWith('delete') ?? false;
      const rawValue = event.target.value;
      const rawCaret = event.target.selectionStart ?? rawValue.length;
      const maskOptions = {
        shouldAutoStartTime: !isDeleting,
        shouldAutoStartYear: !isDeleting,
      };
      const nextRawChar = rawValue.charAt(rawCaret);
      const prefixMaskOptions = {
        shouldAutoStartTime: !isDeleting && nextRawChar !== ' ',
        shouldAutoStartYear: !isDeleting && nextRawChar !== '/',
      };
      const nextDisplayValue = maskDisplayValue(rawValue, maskOptions);
      const maskedPrefix = maskDisplayValue(
        rawValue.slice(0, rawCaret),
        prefixMaskOptions
      );
      const nextFormValue = parseDisplayValueToFormValue(nextDisplayValue);
      let nextCaret = Math.min(maskedPrefix.length, nextDisplayValue.length);
      const separatorsBeforeCaret =
        nextDisplayValue.slice(0, nextCaret).match(/[/: ]/g)?.length ?? 0;
      const segmentIndex = separatorsBeforeCaret;
      const currentSegmentDigits = getSegmentDigitCount(
        nextDisplayValue,
        segmentIndex
      );
      const requiredDigits =
        nextRawChar === ' '
          ? 4
          : nextRawChar === '/' || nextRawChar === ':'
            ? 2
            : 0;
      const shouldAdvanceOverSeparator =
        !isDeleting &&
        inputEvent?.inputType === 'insertText' &&
        ['/', ' ', ':'].includes(nextRawChar) &&
        nextCaret === rawCaret &&
        currentSegmentDigits >= requiredDigits;

      if (shouldAdvanceOverSeparator) {
        nextCaret = Math.min(nextCaret + 1, nextDisplayValue.length);
      }

      setDisplayValue(nextDisplayValue);
      requestAnimationFrame(() => {
        inputRef.current?.setSelectionRange(nextCaret, nextCaret);
      });

      if (!nextDisplayValue) {
        commitValue('');
        setTimeDraft(DEFAULT_TIME_PARTS);
        return;
      }

      commitValue(nextFormValue ?? nextDisplayValue);
    },
    [commitValue]
  );

  const handleCalendarSelect = React.useCallback(
    (nextDate: Date | undefined) => {
      if (!nextDate) {
        setDisplayValue('');
        setTimeDraft(DEFAULT_TIME_PARTS);
        commitValue('');
        onBlur?.();
        setOpen(false);
        return;
      }

      commitDateAndTime(nextDate, timeDraft);
      onBlur?.();
      setOpen(false);
    },
    [commitDateAndTime, commitValue, onBlur, timeDraft]
  );

  const handleCalendarMonthChange = React.useCallback(
    (nextMonth: Date) => {
      const preferredDay = selectedDate?.getDate() ?? 1;
      const nextDate = resolveDateInMonth(nextMonth, preferredDay);

      commitDateAndTime(nextDate, timeDraft);
      calendarProps?.onMonthChange?.(nextMonth);
    },
    [calendarProps, commitDateAndTime, selectedDate, timeDraft]
  );

  const handleInputBlur = React.useCallback(() => {
    const nextFormValue = parseDisplayValueToFormValue(displayValue);

    if (nextFormValue) {
      const parsedNextDate = parseDateTimeValue(nextFormValue);

      if (parsedNextDate) {
        commitDateAndTime(parsedNextDate, extractTimeParts(parsedNextDate));
      }
    }

    onBlur?.();
  }, [commitDateAndTime, displayValue, onBlur]);

  const handleTimePartChange = React.useCallback(
    (part: keyof TimeParts, max: number, rawValue: string) => {
      const digits = rawValue.replace(/\D/g, '').slice(0, 2);
      const nextValue = clampSegment(digits, max);

      setTimeDraft((previous) => setTimePartValue(previous, part, nextValue));
    },
    []
  );

  const handleTimePartBlur = React.useCallback(
    (part: keyof TimeParts) => {
      const normalized = normalizeTimeParts(timeDraft);

      setTimeDraft(normalized);

      if (selectedDate) {
        commitDateAndTime(selectedDate, normalized);
        onBlur?.();
      }

      if (!selectedDate && displayValue) {
        const nextFormValue = parseDisplayValueToFormValue(displayValue);

        if (nextFormValue) {
          const parsedNextDate = parseDateTimeValue(nextFormValue);

          if (parsedNextDate) {
            const nextParts = setTimePartValue(
              extractTimeParts(parsedNextDate),
              part,
              getTimePartValue(normalized, part)
            );
            commitDateAndTime(parsedNextDate, nextParts);
          }
        }
      }
    },
    [commitDateAndTime, displayValue, onBlur, selectedDate, timeDraft]
  );

  return (
    <BaseField data-invalid={invalid}>
      {label && <FieldLabel htmlFor={id}>{label}</FieldLabel>}

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverAnchor asChild>
          <div className="relative">
            <Input
              {...props}
              ref={inputRef}
              id={id}
              name={name}
              type="text"
              inputMode="numeric"
              autoComplete="off"
              placeholder={placeholder}
              value={displayValue}
              disabled={disabled}
              aria-invalid={resolvedAriaInvalid}
              className={cn('pr-10', className)}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
            />

            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                disabled={disabled}
                aria-label="Abrir calendário e horário"
                className="absolute top-1/2 right-1 -translate-y-1/2"
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

          <div className="border-t border-border/60 bg-muted/20 px-2 py-1.5">
            <div className="mb-1 flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
              <Clock3Icon className="size-3" />
              Horário
            </div>
            <div className="grid grid-cols-[auto_auto_auto] items-center justify-center gap-1">
              <Input
                value={timeDraft.hour}
                inputMode="numeric"
                placeholder="hh"
                maxLength={2}
                className="h-7 w-12 px-1 text-center text-xs tabular-nums"
                onChange={(event) =>
                  handleTimePartChange('hour', 23, event.target.value)
                }
                onBlur={() => handleTimePartBlur('hour')}
                disabled={disabled}
                aria-label="Hora"
              />
              <span className="text-muted-foreground">:</span>
              <Input
                value={timeDraft.minute}
                inputMode="numeric"
                placeholder="mm"
                maxLength={2}
                className="h-7 w-12 px-1 text-center text-xs tabular-nums"
                onChange={(event) =>
                  handleTimePartChange('minute', 59, event.target.value)
                }
                onBlur={() => handleTimePartBlur('minute')}
                disabled={disabled}
                aria-label="Minuto"
              />
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {description && <FieldDescription>{description}</FieldDescription>}
      <FieldError errors={allErrors} />
    </BaseField>
  );
}

function ControlledDateTimeField<
  TFieldValues extends FieldValues,
  TName extends FieldPathByValue<TFieldValues, string>,
>({
  control,
  name,
  rules,
  defaultValue,
  errors,
  ...props
}: ControlledDateTimeFieldProps<TFieldValues, TName>) {
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
    <DateTimeFieldBase
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

export function DateTimeField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPathByValue<TFieldValues, string> = FieldPathByValue<
    TFieldValues,
    string
  >,
>(props: DateTimeFieldProps<TFieldValues, TName>) {
  if ('control' in props && props.control) {
    return <ControlledDateTimeField {...props} />;
  }

  return <DateTimeFieldBase {...props} />;
}
