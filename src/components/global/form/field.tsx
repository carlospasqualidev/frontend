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
import { DateInput } from '@/components/ui/date-input';
import { Input } from '@/components/ui/input';

interface IField extends React.ComponentProps<'input'> {
  label: string;
  description?: string;
  errors?: TFormFieldErrors;
}

export function Field({
  label,
  description,
  type,
  'aria-invalid': ariaInvalid,
  errors,
  ...props
}: IField) {
  const allErrors = resolveFieldErrors(errors);
  const invalid = hasFieldErrors(allErrors);

  const resolvedAriaInvalid = ariaInvalid ?? (invalid || undefined);

  return (
    <BaseField data-invalid={invalid}>
      {label && <FieldLabel htmlFor={props.id}>{label}</FieldLabel>}
      {type === 'date' ? (
        <DateInput aria-invalid={resolvedAriaInvalid} {...props} />
      ) : (
        <Input type={type} aria-invalid={resolvedAriaInvalid} {...props} />
      )}
      {description && <FieldDescription>{description}</FieldDescription>}
      <FieldError errors={allErrors} />
    </BaseField>
  );
}
