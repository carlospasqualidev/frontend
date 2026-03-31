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
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface IField extends React.ComponentProps<'textarea'> {
  label: string;
  description?: string;
  errors?: TFormFieldErrors;
}

export function TextArea({
  label,
  description,
  errors,
  className,
  'aria-invalid': ariaInvalid,
  ...props
}: IField) {
  const allErrors = resolveFieldErrors(errors);
  const invalid = hasFieldErrors(allErrors);
  const resolvedAriaInvalid = ariaInvalid ?? (invalid || undefined);

  return (
    <BaseField data-invalid={invalid}>
      {label && <FieldLabel htmlFor={props.id}>{label}</FieldLabel>}
      <Textarea
        aria-invalid={resolvedAriaInvalid}
        {...props}
        className={cn('resize-none', className)}
      />
      {description && <FieldDescription>{description}</FieldDescription>}
      <FieldError errors={allErrors} />
    </BaseField>
  );
}
