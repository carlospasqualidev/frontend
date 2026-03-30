import {
  Field as BaseField,
  FieldDescription,
  FieldLabel,
} from '@/components/ui/field';
import { Textarea } from '@/components/ui/textarea';

interface IField extends React.ComponentProps<'textarea'> {
  label: string;
  description?: string;
}

export function TextArea({ label, description, ...props }: IField) {
  return (
    <BaseField>
      {label && <FieldLabel htmlFor={props.id}>{label}</FieldLabel>}
      <Textarea {...props} className="resize-none" />
      {description && <FieldDescription>{description}</FieldDescription>}
    </BaseField>
  );
}
