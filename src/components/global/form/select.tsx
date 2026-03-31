import { Select as SelectPrimitive } from 'radix-ui';
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
} from '../../../lib/forms/errors';

import {
  Field as BaseField,
  FieldDescription,
  FieldError,
  FieldLabel,
} from '@/components/ui/field';
import {
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
  Select as BaseSelect,
} from '@/components/ui/select';

type SelectBaseProps = React.ComponentProps<typeof SelectPrimitive.Root> & {
  id?: string;
  label: string;
  description?: string;
  placeholder?: string;
  errors?: TFormFieldErrors;
  'aria-invalid'?: boolean;
  options: { value: string; label: string }[];
};

type ControlledSelectProps<
  TFieldValues extends FieldValues,
  TName extends FieldPathByValue<TFieldValues, string>,
> = Omit<
  SelectBaseProps,
  'value' | 'defaultValue' | 'onValueChange' | 'name'
> & {
  control: Control<TFieldValues>;
  name: TName;
  rules?: Omit<
    RegisterOptions<TFieldValues, TName>,
    'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'
  >;
  defaultValue?: FieldPathValue<TFieldValues, TName>;
};

type UncontrolledSelectProps = SelectBaseProps & {
  control?: never;
  name?: string;
  rules?: never;
};

type SelectProps<
  TFieldValues extends FieldValues,
  TName extends FieldPathByValue<TFieldValues, string>,
> = ControlledSelectProps<TFieldValues, TName> | UncontrolledSelectProps;

function SelectBase({
  id,
  label,
  description,
  placeholder,
  errors,
  options,
  'aria-invalid': ariaInvalid,
  ...props
}: SelectBaseProps) {
  const allErrors = resolveFieldErrors(errors);
  const invalid = hasFieldErrors(allErrors);
  const resolvedAriaInvalid = ariaInvalid ?? (invalid || undefined);

  return (
    <BaseField data-invalid={invalid}>
      {label && <FieldLabel htmlFor={id}>{label}</FieldLabel>}

      <BaseSelect {...props}>
        <SelectTrigger id={id} aria-invalid={resolvedAriaInvalid}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {options.map(({ label, value }) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </BaseSelect>

      {description && <FieldDescription>{description}</FieldDescription>}
      <FieldError errors={allErrors} />
    </BaseField>
  );
}

function ControlledSelect<
  TFieldValues extends FieldValues,
  TName extends FieldPathByValue<TFieldValues, string>,
>({
  control,
  name,
  rules,
  defaultValue,
  errors,
  ...props
}: ControlledSelectProps<TFieldValues, TName>) {
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
    <SelectBase
      {...props}
      name={field.name}
      value={typeof field.value === 'string' ? field.value : ''}
      onValueChange={field.onChange}
      errors={resolveFieldErrors(fieldError, errors)}
      disabled={props.disabled ?? field.disabled}
    />
  );
}

export function Select<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPathByValue<TFieldValues, string> = FieldPathByValue<
    TFieldValues,
    string
  >,
>(props: SelectProps<TFieldValues, TName>) {
  if ('control' in props && props.control) {
    return <ControlledSelect {...props} />;
  }

  return <SelectBase {...props} />;
}
