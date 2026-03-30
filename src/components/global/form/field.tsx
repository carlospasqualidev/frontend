import {
  Field as BaseField,
  FieldDescription,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';

interface IField extends React.ComponentProps<'input'> {
  label: string;
  description?: string;
}

export function Field({ label, description, ...props }: IField) {
  return (
    <BaseField>
      {label && <FieldLabel htmlFor={props.id}>{label}</FieldLabel>}
      <Input {...props} />
      {description && <FieldDescription>{description}</FieldDescription>}
    </BaseField>
  );
}
