import { Checkbox as CheckboxPrimitive } from 'radix-ui';

import {
  Field as BaseField,
  FieldDescription,
  FieldLabel,
} from '@/components/ui/field';
import { Checkbox as BaseCheckbox } from '@/components/ui/checkbox';

interface IField extends React.ComponentProps<typeof CheckboxPrimitive.Root> {
  label: string;
  description?: string;
}

export function Checkbox({ label, description, ...props }: IField) {
  return (
    <BaseField>
      <BaseField orientation="horizontal">
        <BaseCheckbox {...props} />
        {label && <FieldLabel htmlFor={props.id}>{label}</FieldLabel>}
      </BaseField>
      {description && <FieldDescription>{description}</FieldDescription>}
    </BaseField>
  );
}
