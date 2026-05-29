import { useState } from 'react';
import { z } from 'zod';
import type { Meta, StoryObj } from '@storybook/tanstack-react';

import { Card } from '@/components/global/card/card';
import { Checkbox } from '@/components/global/form/checkbox';
import { DateField } from '@/components/global/form/dateField';
import { DateTimeField } from '@/components/global/form/dateTimeField';
import { InputField } from '@/components/global/form/inputField';
import { MultiSelect } from '@/components/global/form/multiSelect';
import { Select } from '@/components/global/form/select';
import { Switch } from '@/components/global/form/switch';
import { TextArea } from '@/components/global/form/textArea';
import { Button } from '@/components/ui/button';
import { FieldGroup } from '@/components/ui/field';
import { Typography } from '@/components/ui/typography';
import { useZodForm } from '@/lib/forms/useZodForm';

const departmentOptions = [
  { label: 'Financeiro', value: 'financeiro' },
  { label: 'Operações', value: 'operacoes' },
  { label: 'Recursos Humanos', value: 'rh' },
  { label: 'Tecnologia', value: 'tecnologia' },
] as const;

const employeeStatusOptions = [
  { label: 'Ativo', value: 'ativo' },
  { label: 'Férias', value: 'ferias' },
  { label: 'Desligado', value: 'desligado' },
] as const;

const benefitOptions = [
  { label: 'Vale-refeição', value: 'vale_refeicao' },
  { label: 'Vale-transporte', value: 'vale_transporte' },
  { label: 'Plano de saúde', value: 'plano_saude' },
  { label: 'Plano odontológico', value: 'plano_odontologico' },
  { label: 'Gympass', value: 'gympass' },
] as const;

const formDefaults = {
  fullName: '',
  businessEmail: '',
  role: '',
  admissionDate: '',
  admissionDateTime: '',
  department: '',
  status: 'ativo',
  benefits: [] as string[],
  observations: '',
  receiveReports: true,
  acceptTerms: false,
  adminAccess: false,
};

const formSchema = z.object({
  fullName: z.string().trim().min(3, 'Informe o nome completo.'),
  businessEmail: z
    .string()
    .trim()
    .min(1, 'Informe o e-mail corporativo.')
    .email('Informe um e-mail válido.'),
  role: z.string().trim().min(2, 'Informe o cargo.'),
  admissionDate: z
    .string()
    .min(1, 'Informe a data de admissão.')
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Use uma data válida.'),
  admissionDateTime: z
    .string()
    .min(1, 'Informe a data e hora de admissão.')
    .regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/, 'Use uma data e hora válida.'),
  department: z
    .string()
    .min(1, 'Selecione um departamento.')
    .refine(
      (value) => departmentOptions.some((option) => option.value === value),
      'Selecione um departamento válido.'
    ),
  status: z
    .string()
    .refine(
      (value) => employeeStatusOptions.some((option) => option.value === value),
      'Selecione um status válido.'
    ),
  benefits: z
    .array(z.string())
    .min(1, 'Selecione pelo menos um benefício.')
    .refine(
      (values) =>
        values.every((value) =>
          benefitOptions.some((option) => option.value === value)
        ),
      'Selecione apenas benefícios válidos.'
    ),
  observations: z
    .string()
    .trim()
    .min(10, 'Escreva pelo menos 10 caracteres nas observações.'),
  receiveReports: z.boolean(),
  acceptTerms: z.boolean().refine(Boolean, 'Você precisa aceitar os termos.'),
  adminAccess: z.boolean(),
});

type FormData = z.output<typeof formSchema>;

function FormCompletoDemo() {
  const [lastSubmission, setLastSubmission] = useState<FormData | null>(null);

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useZodForm({
    schema: formSchema,
    defaultValues: formDefaults,
  });

  const onSubmit = handleSubmit(async (values) => {
    await new Promise((resolve) => setTimeout(resolve, 250));
    setLastSubmission(values);
  });

  return (
    <Card
      title="Formulário de teste"
      description="Exercita todos os campos globais com react-hook-form + Zod, incluindo digitação manual nos campos de data."
    >
      <form className="space-y-6" noValidate onSubmit={onSubmit}>
        <FieldGroup className="grid gap-4 md:grid-cols-2">
          <InputField
            id="fullName"
            label="Nome completo"
            placeholder="Victor Casagrande"
            autoComplete="name"
            errors={errors.fullName}
            disabled={isSubmitting}
            {...register('fullName')}
          />

          <InputField
            id="businessEmail"
            label="E-mail corporativo"
            type="email"
            placeholder="victor@empresa.com.br"
            autoComplete="email"
            errors={errors.businessEmail}
            disabled={isSubmitting}
            {...register('businessEmail')}
          />

          <InputField
            id="role"
            label="Cargo"
            placeholder="Analista financeiro"
            errors={errors.role}
            disabled={isSubmitting}
            {...register('role')}
          />

          <DateField
            id="admissionDate"
            name="admissionDate"
            control={control}
            label="Data de admissão"
            disabled={isSubmitting}
          />

          <DateTimeField
            id="admissionDateTime"
            name="admissionDateTime"
            control={control}
            label="Data e hora de admissão"
            disabled={isSubmitting}
          />

          <Select
            id="department"
            name="department"
            control={control}
            label="Departamento"
            placeholder="Selecione um departamento"
            disabled={isSubmitting}
            options={departmentOptions.map((option) => ({
              label: option.label,
              value: option.value,
            }))}
          />

          <Select
            id="status"
            name="status"
            control={control}
            label="Status"
            placeholder="Selecione um status"
            disabled={isSubmitting}
            options={employeeStatusOptions.map((option) => ({
              label: option.label,
              value: option.value,
            }))}
          />

          <MultiSelect
            id="benefits"
            name="benefits"
            control={control}
            label="Benefícios"
            placeholder="Selecione os benefícios"
            searchable
            disabled={isSubmitting}
            errors={errors.benefits}
            options={benefitOptions.map((option) => ({
              label: option.label,
              value: option.value,
            }))}
          />

          <TextArea
            id="observations"
            label="Observações"
            placeholder="Descreva aqui um caso de uso real para validar espaçamento, foco e mensagens."
            errors={errors.observations}
            disabled={isSubmitting}
            {...register('observations')}
          />
        </FieldGroup>

        <div className="grid gap-4 md:grid-cols-2">
          <Checkbox
            id="receiveReports"
            name="receiveReports"
            control={control}
            label="Receber relatórios por e-mail"
            description="Bom para testar o checkbox em um estado positivo."
            disabled={isSubmitting}
          />

          <Checkbox
            id="acceptTerms"
            name="acceptTerms"
            control={control}
            label="Aceito os termos internos"
            description="Este campo deve falhar se você tentar enviar sem marcar."
            disabled={isSubmitting}
          />

          <Switch
            id="adminAccess"
            name="adminAccess"
            control={control}
            label="Conceder acesso administrativo"
            description="Toggle de configuração — exercita o Switch global integrado ao react-hook-form."
            disabled={isSubmitting}
          />
        </div>

        <div className="flex flex-wrap gap-3">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Validando...' : 'Enviar formulário'}
          </Button>
          <Button
            type="button"
            variant="outline"
            disabled={isSubmitting}
            onClick={() => {
              reset(formDefaults);
              setLastSubmission(null);
            }}
          >
            Limpar formulário
          </Button>
        </div>

        <div className="rounded-2xl border border-dashed border-border/70 bg-muted/30 p-4">
          <Typography variant="small">Último envio válido</Typography>
          <pre className="mt-3 overflow-x-auto text-sm leading-6 text-muted-foreground">
            {JSON.stringify(lastSubmission, null, 2)}
          </pre>
        </div>
      </form>
    </Card>
  );
}

const meta = {
  title: 'Formulário/Formulário completo',
  component: FormCompletoDemo,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Composição completa que exercita todos os campos globais (`InputField`, `Select`, `MultiSelect`, `DateField`, `DateTimeField`, `Checkbox`, `Switch`, `TextArea`) integrados ao `react-hook-form` + Zod.',
      },
    },
  },
} satisfies Meta<typeof FormCompletoDemo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Completo: Story = {};
