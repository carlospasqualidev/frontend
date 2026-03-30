import { Select as SelectPrimitive } from 'radix-ui';

import {
  Field as BaseField,
  FieldDescription,
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

interface ISelect extends React.ComponentProps<typeof SelectPrimitive.Root> {
  id?: string;
  label: string;
  description?: string;
  options: { value: string; label: string }[];
}

export function Select({
  id,
  label,
  description,
  options,
  value,
  ...props
}: ISelect) {
  return (
    <BaseField>
      {label && <FieldLabel htmlFor={id}>{label}</FieldLabel>}

      <BaseSelect {...props}>
        <SelectTrigger id={id}>
          <SelectValue placeholder={value} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {options.map(({ label, value }) => (
              <SelectItem value={value}>{label}</SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </BaseSelect>

      {description && <FieldDescription>{description}</FieldDescription>}
    </BaseField>
  );
}
