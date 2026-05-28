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
import { Switch as BaseSwitch } from '@/components/ui/switch';

type SwitchBaseProps = React.ComponentProps<typeof BaseSwitch> & {
  label: string;
  description?: string;
  errors?: TFormFieldErrors;
};

type ControlledSwitchProps<
  TFieldValues extends FieldValues,
  TName extends FieldPathByValue<TFieldValues, boolean>,
> = Omit<
  SwitchBaseProps,
  'checked' | 'defaultChecked' | 'onCheckedChange' | 'name'
> & {
  control: Control<TFieldValues>;
  name: TName;
  rules?: Omit<
    RegisterOptions<TFieldValues, TName>,
    'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'
  >;
  defaultValue?: FieldPathValue<TFieldValues, TName>;
};

type UncontrolledSwitchProps = SwitchBaseProps & {
  control?: never;
  name?: string;
  rules?: never;
};

type SwitchProps<
  TFieldValues extends FieldValues,
  TName extends FieldPathByValue<TFieldValues, boolean>,
> = ControlledSwitchProps<TFieldValues, TName> | UncontrolledSwitchProps;

function SwitchBase({
  label,
  description,
  errors,
  ...props
}: SwitchBaseProps) {
  const allErrors = resolveFieldErrors(errors);
  const invalid = hasFieldErrors(allErrors);
  const { 'aria-invalid': ariaInvalid, ...switchProps } = props;
  const resolvedAriaInvalid = ariaInvalid ?? (invalid || undefined);

  return (
    <BaseField data-invalid={invalid}>
      <BaseField orientation="horizontal">
        <BaseSwitch
          aria-invalid={resolvedAriaInvalid}
          {...switchProps}
          className="cursor-pointer"
        />
        {label && (
          <FieldLabel htmlFor={props.id} className="cursor-pointer">
            {label}
          </FieldLabel>
        )}
      </BaseField>
      {description && <FieldDescription>{description}</FieldDescription>}
      <FieldError errors={allErrors} />
    </BaseField>
  );
}

function ControlledSwitch<
  TFieldValues extends FieldValues,
  TName extends FieldPathByValue<TFieldValues, boolean>,
>({
  control,
  name,
  rules,
  defaultValue,
  label,
  description,
  errors,
  ...props
}: ControlledSwitchProps<TFieldValues, TName>) {
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
    <SwitchBase
      {...props}
      label={label}
      description={description}
      name={field.name}
      checked={Boolean(field.value)}
      onCheckedChange={(checked) => field.onChange(Boolean(checked))}
      errors={resolveFieldErrors(fieldError, errors)}
      disabled={props.disabled ?? field.disabled}
    />
  );
}

export function Switch<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPathByValue<TFieldValues, boolean> = FieldPathByValue<
    TFieldValues,
    boolean
  >,
>(props: SwitchProps<TFieldValues, TName>) {
  if ('control' in props && props.control) {
    return <ControlledSwitch {...props} />;
  }

  return <SwitchBase {...props} />;
}
