import {
  FieldSet,
  FieldLegend,
  FieldDescription,
  FieldGroup as BaseFieldGroup,
} from '@/components/ui/field';

interface IFieldGroup {
  title?: string;
  description?: string;
  children: React.ReactNode;
}

export function FieldGroup({ children, title, description }: IFieldGroup) {
  return (
    <BaseFieldGroup>
      <FieldSet>
        {title && <FieldLegend>{title}</FieldLegend>}
        {description && <FieldDescription>{description}</FieldDescription>}
        {children}
      </FieldSet>
    </BaseFieldGroup>
  );
}
