export type FormFieldError = { message?: string } | undefined;
export type FormFieldErrors = FormFieldError | FormFieldError[];

export function resolveFieldErrors(
  ...inputs: Array<FormFieldErrors | undefined>
) {
  return inputs.flatMap((input) =>
    input === undefined ? [] : Array.isArray(input) ? input : [input]
  );
}

export function hasFieldErrors(errors: FormFieldError[]) {
  return errors.some(Boolean);
}
