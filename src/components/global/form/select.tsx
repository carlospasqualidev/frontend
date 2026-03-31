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
  placeholder?: string;
  options: { value: string; label: string }[];
}

export function Select({
  id,
  label,
  description,
  placeholder,
  options,
  ...props
}: ISelect) {
  return (
    <BaseField>
      {label && <FieldLabel htmlFor={id}>{label}</FieldLabel>}

      <BaseSelect {...props}>
        <SelectTrigger id={id}>
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
    </BaseField>
  );
}
