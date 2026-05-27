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
  resolveFieldErrors,
  hasFieldErrors,
} from '@/lib/forms/errors';
import {
  Field as BaseField,
  FieldDescription,
  FieldError,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';

type InputFieldBaseProps = React.ComponentProps<'input'> & {
  label: string;
  description?: string;
  errors?: TFormFieldErrors;
};

type ControlledInputFieldProps<
  TFieldValues extends FieldValues,
  TName extends FieldPathByValue<TFieldValues, string>,
> = Omit<
  InputFieldBaseProps,
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

type UncontrolledInputFieldProps = InputFieldBaseProps & {
  control?: never;
  rules?: never;
};

type InputFieldProps<
  TFieldValues extends FieldValues,
  TName extends FieldPathByValue<TFieldValues, string>,
> =
  | ControlledInputFieldProps<TFieldValues, TName>
  | UncontrolledInputFieldProps;

function InputFieldBase({
  label,
  description,
  type,
  id,
  'aria-invalid': ariaInvalid,
  errors,
  ...props
}: InputFieldBaseProps) {
  const allErrors = resolveFieldErrors(errors);
  const invalid = hasFieldErrors(allErrors);
  const resolvedAriaInvalid = ariaInvalid ?? (invalid || undefined);

  return (
    <BaseField data-invalid={invalid}>
      {label && <FieldLabel htmlFor={id}>{label}</FieldLabel>}

      <Input id={id} type={type} aria-invalid={resolvedAriaInvalid} {...props} />
      {description && <FieldDescription>{description}</FieldDescription>}
      <FieldError errors={allErrors} />
    </BaseField>
  );
}

function ControlledInputField<
  TFieldValues extends FieldValues,
  TName extends FieldPathByValue<TFieldValues, string>,
>({
  control,
  name,
  rules,
  defaultValue,
  errors,
  ...props
}: ControlledInputFieldProps<TFieldValues, TName>) {
  const {
    field,
    fieldState: { error: fieldError },
  } = useController({ control, name, rules, defaultValue });

  return (
    <InputFieldBase
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

/**
 * Campo de input integrado ao react-hook-form.
 *
 * - **Não controlado**: espalhe `register('campo')` e passe `errors`.
 * - **Controlado**: passe `control` + `name` (mesmo padrão de `Select`,
 *   `Checkbox`, `DateField` e `DateTimeField`).
 */
export function InputField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPathByValue<TFieldValues, string> = FieldPathByValue<
    TFieldValues,
    string
  >,
>(props: InputFieldProps<TFieldValues, TName>) {
  if ('control' in props && props.control) {
    return <ControlledInputField {...props} />;
  }

  return <InputFieldBase {...props} />;
}
