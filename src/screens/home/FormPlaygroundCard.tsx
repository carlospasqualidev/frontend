import { useState } from 'react';
import { Controller } from 'react-hook-form';
import { z } from 'zod';

import { Checkbox } from '@/components/global/form/checkbox';
import { Field } from '@/components/global/form/field';
import { Select } from '@/components/global/form/select';
import { TextArea } from '@/components/global/form/textArea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FieldDescription, FieldError, FieldGroup } from '@/components/ui/field';
import { useZodForm } from '@/lib/forms/useZodForm';

const departmentOptions = [
  { label: 'Financeiro', value: 'financeiro' },
  { label: 'Operacoes', value: 'operacoes' },
  { label: 'Recursos Humanos', value: 'rh' },
  { label: 'Tecnologia', value: 'tecnologia' },
] as const;

const employeeStatusOptions = [
  { label: 'Ativo', value: 'ativo' },
  { label: 'Ferias', value: 'ferias' },
  { label: 'Desligado', value: 'desligado' },
] as const;

const formDefaults = {
  fullName: '',
  businessEmail: '',
  role: '',
  admissionDate: '',
  department: '',
  status: 'ativo',
  observations: '',
  receiveReports: true,
  acceptTerms: false,
};

const formSchema = z.object({
  fullName: z.string().trim().min(3, 'Informe o nome completo.'),
  businessEmail: z
    .string()
    .trim()
    .min(1, 'Informe o e-mail corporativo.')
    .email('Informe um e-mail valido.'),
  role: z.string().trim().min(2, 'Informe o cargo.'),
  admissionDate: z
    .string()
    .min(1, 'Informe a data de admissao.')
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Use uma data valida.'),
  department: z
    .string()
    .min(1, 'Selecione um departamento.')
    .refine(
      (value) => departmentOptions.some((option) => option.value === value),
      'Selecione um departamento valido.'
    ),
  status: z
    .string()
    .refine(
      (value) => employeeStatusOptions.some((option) => option.value === value),
      'Selecione um status valido.'
    ),
  observations: z
    .string()
    .trim()
    .min(10, 'Escreva pelo menos 10 caracteres nas observacoes.'),
  receiveReports: z.boolean(),
  acceptTerms: z.boolean().refine(Boolean, 'Voce precisa aceitar os termos.'),
});

type FormData = z.output<typeof formSchema>;

export function FormPlaygroundCard() {
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
    <Card className="border-border/70 shadow-sm">
      <CardHeader className="space-y-2">
        <CardTitle>Formulario de teste</CardTitle>
        <FieldDescription>
          Este formulario exercita os inputs globais com `react-hook-form` e
          `zod`, incluindo digitacao manual no campo de data.
        </FieldDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-6" noValidate onSubmit={onSubmit}>
          <FieldGroup className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Field
                id="fullName"
                label="Nome completo"
                placeholder="Victor Casagrande"
                autoComplete="name"
                aria-invalid={Boolean(errors.fullName)}
                disabled={isSubmitting}
                {...register('fullName')}
              />
              <FieldError errors={[errors.fullName]} />
            </div>

            <div className="space-y-2">
              <Field
                id="businessEmail"
                label="E-mail corporativo"
                type="email"
                placeholder="victor@empresa.com.br"
                autoComplete="email"
                aria-invalid={Boolean(errors.businessEmail)}
                disabled={isSubmitting}
                {...register('businessEmail')}
              />
              <FieldError errors={[errors.businessEmail]} />
            </div>

            <div className="space-y-2">
              <Field
                id="role"
                label="Cargo"
                placeholder="Analista financeiro"
                aria-invalid={Boolean(errors.role)}
                disabled={isSubmitting}
                {...register('role')}
              />
              <FieldError errors={[errors.role]} />
            </div>

            <div className="space-y-2">
              <Field
                id="admissionDate"
                label="Data de admissao"
                type="date"
                aria-invalid={Boolean(errors.admissionDate)}
                disabled={isSubmitting}
                {...register('admissionDate')}
              />
              <FieldError errors={[errors.admissionDate]} />
            </div>

            <div className="space-y-2">
              <Controller
                name="department"
                control={control}
                render={({ field }) => (
                  <Select
                    id="department"
                    label="Departamento"
                    placeholder="Selecione um departamento"
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={isSubmitting}
                    options={departmentOptions.map((option) => ({
                      label: option.label,
                      value: option.value,
                    }))}
                  />
                )}
              />
              <FieldError errors={[errors.department]} />
            </div>

            <div className="space-y-2">
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <Select
                    id="status"
                    label="Status"
                    placeholder="Selecione um status"
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={isSubmitting}
                    options={employeeStatusOptions.map((option) => ({
                      label: option.label,
                      value: option.value,
                    }))}
                  />
                )}
              />
              <FieldError errors={[errors.status]} />
            </div>
          </FieldGroup>

          <div className="space-y-2">
            <TextArea
              id="observations"
              label="Observacoes"
              placeholder="Descreva aqui um caso de uso real para validar espacamento, foco e mensagens."
              aria-invalid={Boolean(errors.observations)}
              disabled={isSubmitting}
              {...register('observations')}
            />
            <FieldError errors={[errors.observations]} />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Controller
                name="receiveReports"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    id="receiveReports"
                    label="Receber relatorios por e-mail"
                    description="Bom para testar o checkbox em um estado positivo."
                    checked={field.value}
                    onCheckedChange={(checked) => field.onChange(Boolean(checked))}
                    disabled={isSubmitting}
                  />
                )}
              />
              <FieldError errors={[errors.receiveReports]} />
            </div>

            <div className="space-y-2">
              <Controller
                name="acceptTerms"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    id="acceptTerms"
                    label="Aceito os termos internos"
                    description="Este campo deve falhar se voce tentar enviar sem marcar."
                    checked={field.value}
                    onCheckedChange={(checked) => field.onChange(Boolean(checked))}
                    disabled={isSubmitting}
                  />
                )}
              />
              <FieldError errors={[errors.acceptTerms]} />
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Validando...' : 'Enviar formulario'}
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
              Limpar formulario
            </Button>
          </div>

          <div className="rounded-2xl border border-dashed border-border/70 bg-muted/30 p-4">
            <p className="text-sm font-medium text-foreground">
              Ultimo envio valido
            </p>
            <pre className="mt-3 overflow-x-auto text-sm leading-6 text-muted-foreground">
              {JSON.stringify(lastSubmission, null, 2)}
            </pre>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
