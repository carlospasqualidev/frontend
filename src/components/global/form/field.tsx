import {
  Field as BaseField,
  FieldDescription,
  FieldLabel,
} from '@/components/ui/field';
import { DateInput } from '@/components/ui/date-input';
import { Input } from '@/components/ui/input';

interface IField extends React.ComponentProps<'input'> {
  label: string;
  description?: string;
}

export function Field({ label, description, ...props }: IField) {
  const { type, ...inputProps } = props;

  return (
    <BaseField>
      {label && <FieldLabel htmlFor={props.id}>{label}</FieldLabel>}
      {type === 'date' ? (
        <DateInput {...inputProps} />
      ) : (
        <Input type={type} {...inputProps} />
      )}
      {description && <FieldDescription>{description}</FieldDescription>}
    </BaseField>
  );
}
