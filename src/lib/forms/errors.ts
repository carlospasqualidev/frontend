export type TFormFieldError = { message?: string } | undefined;
export type TFormFieldErrors = TFormFieldError | TFormFieldError[];

export function resolveFieldErrors(
  ...inputs: Array<TFormFieldErrors | undefined>
) {
  return inputs.flatMap((input) =>
    input === undefined ? [] : Array.isArray(input) ? input : [input]
  );
}

export function hasFieldErrors(errors: TFormFieldError[]) {
  return errors.some(Boolean);
}
