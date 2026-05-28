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
import {
  MultiSelect as BaseMultiSelect,
  type MultiSelectOption,
} from '@/components/ui/multi-select';

type MultiSelectBaseProps = Omit<
  React.ComponentProps<typeof BaseMultiSelect>,
  'options'
> & {
  label: string;
  description?: string;
  errors?: TFormFieldErrors;
  options: MultiSelectOption[];
};

type ControlledMultiSelectProps<
  TFieldValues extends FieldValues,
  TName extends FieldPathByValue<TFieldValues, string[]>,
> = Omit<
  MultiSelectBaseProps,
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

type UncontrolledMultiSelectProps = MultiSelectBaseProps & {
  control?: never;
  name?: string;
  rules?: never;
};

type MultiSelectProps<
  TFieldValues extends FieldValues,
  TName extends FieldPathByValue<TFieldValues, string[]>,
> =
  | ControlledMultiSelectProps<TFieldValues, TName>
  | UncontrolledMultiSelectProps;

function MultiSelectBase({
  id,
  label,
  description,
  errors,
  options,
  'aria-invalid': ariaInvalid,
  ...props
}: MultiSelectBaseProps) {
  const allErrors = resolveFieldErrors(errors);
  const invalid = hasFieldErrors(allErrors);
  const resolvedAriaInvalid = ariaInvalid ?? (invalid || undefined);

  return (
    <BaseField data-invalid={invalid}>
      {label && <FieldLabel htmlFor={id}>{label}</FieldLabel>}

      <BaseMultiSelect
        {...props}
        id={id}
        options={options}
        aria-invalid={resolvedAriaInvalid}
      />

      {description && <FieldDescription>{description}</FieldDescription>}
      <FieldError errors={allErrors} />
    </BaseField>
  );
}

function ControlledMultiSelect<
  TFieldValues extends FieldValues,
  TName extends FieldPathByValue<TFieldValues, string[]>,
>({
  control,
  name,
  rules,
  defaultValue,
  errors,
  ...props
}: ControlledMultiSelectProps<TFieldValues, TName>) {
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
    <MultiSelectBase
      {...props}
      name={field.name}
      value={Array.isArray(field.value) ? field.value : []}
      onValueChange={field.onChange}
      errors={resolveFieldErrors(fieldError, errors)}
      disabled={props.disabled ?? field.disabled}
    />
  );
}

export function MultiSelect<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPathByValue<TFieldValues, string[]> = FieldPathByValue<
    TFieldValues,
    string[]
  >,
>(props: MultiSelectProps<TFieldValues, TName>) {
  if ('control' in props && props.control) {
    return <ControlledMultiSelect {...props} />;
  }

  return <MultiSelectBase {...props} />;
}
