/* eslint-disable security/detect-object-injection -- resolver maps schema paths into react-hook-form errors */
import type {
  FieldError,
  FieldErrors,
  FieldValues,
  Resolver,
} from 'react-hook-form';
import { z } from 'zod';

type FormSchema = z.ZodObject;

type FormValues<TSchema extends FormSchema> = z.input<TSchema> & FieldValues;
type FormOutput<TSchema extends FormSchema> = z.output<TSchema>;

function normalizePath(path: readonly PropertyKey[]) {
  if (path.length === 0) {
    return ['root'];
  }

  return path
    .filter((segment): segment is string | number => typeof segment !== 'symbol')
    .map((segment) => String(segment));
}

function setPathValue(
  target: Record<string, unknown>,
  path: string[],
  value: FieldError,
  validateAllFieldCriteria: boolean
) {
  let cursor = target;

  path.forEach((key, index) => {
    const isLeaf = index === path.length - 1;

    if (!isLeaf) {
      cursor[key] ??= {};
      cursor = cursor[key] as Record<string, unknown>;
      return;
    }

    const currentError = cursor[key] as FieldError | undefined;

    if (!currentError) {
      cursor[key] = value;
      return;
    }

    if (!validateAllFieldCriteria) {
      return;
    }

    cursor[key] = {
      ...currentError,
      types: {
        ...(currentError.types ?? {}),
        [value.type]: value.message ?? '',
      },
    };
  });
}

function toFieldErrors<TFieldValues extends FieldValues>(
  error: z.ZodError,
  validateAllFieldCriteria: boolean
) {
  const fieldErrors: FieldErrors<TFieldValues> = {};

  error.issues.forEach((issue) => {
    setPathValue(
      fieldErrors as Record<string, unknown>,
      normalizePath(issue.path),
      {
        type: issue.code,
        message: issue.message,
      },
      validateAllFieldCriteria
    );
  });

  return fieldErrors;
}

export function zodResolver<TSchema extends FormSchema>(
  schema: TSchema
): Resolver<FormValues<TSchema>, unknown, FormOutput<TSchema>> {
  return async (values, _context, options) => {
    const result = await schema.safeParseAsync(values);

    if (result.success) {
      return {
        values: result.data as FormOutput<TSchema>,
        errors: {},
      };
    }

    return {
      values: {},
      errors: toFieldErrors<FormValues<TSchema>>(
        result.error,
        options.criteriaMode === 'all'
      ),
    };
  };
}
