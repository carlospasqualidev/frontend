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
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

type TextAreaBaseProps = React.ComponentProps<'textarea'> & {
  label: string;
  description?: string;
  errors?: TFormFieldErrors;
};

type ControlledTextAreaProps<
  TFieldValues extends FieldValues,
  TName extends FieldPathByValue<TFieldValues, string>,
> = Omit<
  TextAreaBaseProps,
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

type UncontrolledTextAreaProps = TextAreaBaseProps & {
  control?: never;
  rules?: never;
};

type TextAreaProps<
  TFieldValues extends FieldValues,
  TName extends FieldPathByValue<TFieldValues, string>,
> = ControlledTextAreaProps<TFieldValues, TName> | UncontrolledTextAreaProps;

function TextAreaBase({
  label,
  description,
  errors,
  className,
  'aria-invalid': ariaInvalid,
  ...props
}: TextAreaBaseProps) {
  const allErrors = resolveFieldErrors(errors);
  const invalid = hasFieldErrors(allErrors);
  const resolvedAriaInvalid = ariaInvalid ?? (invalid || undefined);

  return (
    <BaseField data-invalid={invalid}>
      {label && <FieldLabel htmlFor={props.id}>{label}</FieldLabel>}
      <Textarea
        aria-invalid={resolvedAriaInvalid}
        {...props}
        className={cn('min-h-28 resize-none', className)}
      />
      {description && <FieldDescription>{description}</FieldDescription>}
      <FieldError errors={allErrors} />
    </BaseField>
  );
}

function ControlledTextArea<
  TFieldValues extends FieldValues,
  TName extends FieldPathByValue<TFieldValues, string>,
>({
  control,
  name,
  rules,
  defaultValue,
  errors,
  ...props
}: ControlledTextAreaProps<TFieldValues, TName>) {
  const {
    field,
    fieldState: { error: fieldError },
  } = useController({ control, name, rules, defaultValue });

  return (
    <TextAreaBase
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
 * Campo de textarea integrado ao react-hook-form.
 *
 * - **Não controlado**: espalhe `register('campo')` e passe `errors`.
 * - **Controlado**: passe `control` + `name` (mesmo padrão de `InputField`,
 *   `Select`, `Checkbox`, `DateField` e `DateTimeField`).
 */
export function TextArea<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPathByValue<TFieldValues, string> = FieldPathByValue<
    TFieldValues,
    string
  >,
>(props: TextAreaProps<TFieldValues, TName>) {
  if ('control' in props && props.control) {
    return <ControlledTextArea {...props} />;
  }

  return <TextAreaBase {...props} />;
}
