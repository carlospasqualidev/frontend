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
  type FormFieldErrors,
  hasFieldErrors,
  resolveFieldErrors,
} from '@/lib/forms/errors';
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
import {
  DEFAULT_TIME_PARTS,
  extractTimeParts,
  formatDateTimeForDisplay,
  formatDateTimeForForm,
  formatDisplayValue,
  getSegmentDigitCount,
  maskDisplayValue,
  normalizeTimeParts,
  parseDateTimeValue,
  parseDateValue,
  parseDisplayValueToFormValue,
  resolveDateInMonth,
  type TimeParts,
} from '@/lib/dateTime/dateTimeFieldUtils';

type CalendarProps = Omit<
  React.ComponentProps<typeof Calendar>,
  'mode' | 'selected' | 'defaultMonth' | 'onSelect'
>;

type DateTimeFieldBaseProps = Omit<
  React.ComponentProps<'input'>,
  'type' | 'value' | 'defaultValue' | 'onChange' | 'onBlur'
> & {
  label: string;
  description?: string;
  errors?: FormFieldErrors;
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
  const popoverContentRef = React.useRef<HTMLDivElement>(null);
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
        const input = inputRef.current;

        if (input && document.activeElement === input) {
          input.setSelectionRange(nextCaret, nextCaret);
        }
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

  const handleClearValue = React.useCallback(() => {
    setDisplayValue('');
    setTimeDraft(DEFAULT_TIME_PARTS);
    commitValue('');
    onBlur?.();
    setOpen(false);
  }, [commitValue, onBlur]);

  const handleSetNow = React.useCallback(() => {
    const now = new Date();
    const nowTime = extractTimeParts(now);
    commitDateAndTime(now, nowTime);

    onBlur?.();
  }, [commitDateAndTime, onBlur]);

  const handleInputBlur = React.useCallback(
    (event: React.FocusEvent<HTMLInputElement>) => {
      if (open) {
        return;
      }

      const nextFocusedElement = event.relatedTarget;

      if (
        nextFocusedElement instanceof HTMLElement &&
        popoverContentRef.current?.contains(nextFocusedElement)
      ) {
        return;
      }

      const nextFormValue = parseDisplayValueToFormValue(displayValue);

      if (nextFormValue) {
        const parsedNextDate = parseDateTimeValue(nextFormValue);

        if (parsedNextDate) {
          commitDateAndTime(parsedNextDate, extractTimeParts(parsedNextDate));
        }
      }

      onBlur?.();
    },
    [commitDateAndTime, displayValue, onBlur, open]
  );

  const handleTimeInputChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const [hour = '', minute = ''] = event.target.value.split(':');

      setTimeDraft({
        hour: hour.slice(0, 2),
        minute: minute.slice(0, 2),
      });
    },
    []
  );

  const handleTimeInputBlur = React.useCallback(
    (event: React.FocusEvent<HTMLInputElement>) => {
      const nextFocusedElement = event.relatedTarget;

      if (
        nextFocusedElement instanceof HTMLElement &&
        popoverContentRef.current?.contains(nextFocusedElement)
      ) {
        return;
      }

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
            commitDateAndTime(parsedNextDate, normalized);
          }
        }
      }
    },
    [commitDateAndTime, displayValue, onBlur, selectedDate, timeDraft]
  );

  const timeInputValue = React.useMemo(() => {
    const normalized = normalizeTimeParts({
      hour: timeDraft.hour || '00',
      minute: timeDraft.minute || '00',
    });
    return `${normalized.hour}:${normalized.minute}`;
  }, [timeDraft.hour, timeDraft.minute]);
  const hasValue = displayValue.trim().length > 0;

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
                aria-label="Limpar data e horário"
                className="absolute top-1/2 right-16 -translate-y-1/2! active:-translate-y-1/2!"
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
              aria-label="Definir horário atual"
              className="absolute top-1/2 right-9 -translate-y-1/2! active:-translate-y-1/2!"
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
                aria-label="Abrir calendário e horário"
                className="absolute top-1/2 right-1 -translate-y-1/2! active:-translate-y-1/2!"
              >
                <CalendarIcon className="size-4 text-muted-foreground" />
              </Button>
            </PopoverTrigger>
          </div>
        </PopoverAnchor>

        <PopoverContent
          ref={popoverContentRef}
          className="w-auto overflow-hidden p-0"
          align="center"
        >
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
            <div className="mb-2 flex justify-center gap-1.5 text-[13px] font-medium text-muted-foreground">
              Horário
            </div>
            <div className="mb-0.5 flex items-center justify-center">
              <div className="relative">
                <Clock2Icon className="pointer-events-none absolute top-1/2 left-2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="time"
                  step={60}
                  min="00:00"
                  max="23:59"
                  value={timeInputValue}
                  className="h-8 w-[5.2rem] appearance-none pr-2 pl-7 text-xs tabular-nums [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none [&::-webkit-datetime-edit-millisecond-field]:hidden [&::-webkit-datetime-edit-second-field]:m-0 [&::-webkit-datetime-edit-second-field]:hidden [&::-webkit-datetime-edit-second-field]:p-0"
                  onChange={handleTimeInputChange}
                  onBlur={handleTimeInputBlur}
                  disabled={disabled}
                  aria-label="Horário"
                />
              </div>
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

function isControlled<
  TFieldValues extends FieldValues,
  TName extends FieldPathByValue<TFieldValues, string>,
>(
  props: DateTimeFieldProps<TFieldValues, TName>
): props is ControlledDateTimeFieldProps<TFieldValues, TName> {
  return 'control' in props;
}

export function DateTimeField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPathByValue<TFieldValues, string> = FieldPathByValue<
    TFieldValues,
    string
  >,
>(props: DateTimeFieldProps<TFieldValues, TName>) {
  if (isControlled(props)) {
    return <ControlledDateTimeField {...props} />;
  }

  return <DateTimeFieldBase {...props} />;
}
