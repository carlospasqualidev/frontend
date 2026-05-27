/**
 * Helpers puros de data/hora para o componente `DateTimeField`.
 *
 * Formatos suportados:
 * - "form" (ISO curto): `aaaa-mm-ddThh:mm`
 * - "display" (pt-BR): `dd/mm/aaaa hh:mm`
 *
 * Mantidos fora do componente para serem testáveis isoladamente.
 */
export const FORM_DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;
export const DISPLAY_DATE_PATTERN = /^(\d{2})\/(\d{2})\/(\d{4})$/;
export const FORM_DATE_TIME_PATTERN = /^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2})$/;
export const DISPLAY_DATE_TIME_PATTERN =
  /^(\d{2})\/(\d{2})\/(\d{4})\s+(\d{2}):(\d{2})$/;

export type TimeParts = {
  hour: string;
  minute: string;
};

export const DEFAULT_TIME_PARTS: TimeParts = {
  hour: '00',
  minute: '00',
};

export function createDateFromParts(
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

export function formatDateTimeForForm(date: Date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  const hour = `${date.getHours()}`.padStart(2, '0');
  const minute = `${date.getMinutes()}`.padStart(2, '0');
  return `${year}-${month}-${day}T${hour}:${minute}`;
}

export function formatDateTimeForDisplay(date: Date) {
  const day = `${date.getDate()}`.padStart(2, '0');
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const year = date.getFullYear();
  const hour = `${date.getHours()}`.padStart(2, '0');
  const minute = `${date.getMinutes()}`.padStart(2, '0');
  return `${day}/${month}/${year} ${hour}:${minute}`;
}

export function parseDateTimeValue(value: string | undefined) {
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

export function parseDateValue(value: string | undefined) {
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

export function formatDisplayValue(value: string | undefined) {
  const parsedDate = parseDateTimeValue(value);

  if (parsedDate) {
    return formatDateTimeForDisplay(parsedDate);
  }

  return value ?? '';
}

export function clampSegment(value: string, max: number) {
  if (value.length < 2) {
    return value;
  }

  return `${Math.min(Number(value), max)}`.padStart(2, '0');
}

export function maskDatePart(
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

export function maskTimePart(value: string) {
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

export function maskDisplayValue(
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

export function parseDisplayValueToFormValue(value: string) {
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

export function resolveDateInMonth(monthDate: Date, preferredDay: number) {
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const maxDay = new Date(year, month + 1, 0).getDate();
  const safeDay = Math.min(Math.max(preferredDay, 1), maxDay);

  return new Date(year, month, safeDay);
}

export function extractTimeParts(date: Date | undefined): TimeParts {
  if (!date) {
    return DEFAULT_TIME_PARTS;
  }

  return {
    hour: `${date.getHours()}`.padStart(2, '0'),
    minute: `${date.getMinutes()}`.padStart(2, '0'),
  };
}

export function normalizeTimeParts(parts: TimeParts): TimeParts {
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

export function getSegmentDigitCount(value: string, segmentIndex: number) {
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
