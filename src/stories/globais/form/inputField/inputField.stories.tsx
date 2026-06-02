import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { Meta, StoryObj } from '@storybook/tanstack-react';

import { InputField } from '@/components/global/form/inputField';
import { Card } from '@/components/global/card/card';

const meta = {
  title: 'Formulário/InputField',
  component: InputField,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Campo de input integrado ao `react-hook-form`. **Uncontrolled** via `register` + `errors`, ou **controlled** via `control` + `name` (discriminated union impede misturar os dois modos).',
      },
    },
  },
  args: { label: '' },
} satisfies Meta<typeof InputField>;

export default meta;
type Story = StoryObj<typeof meta>;

const schema = z.object({
  email: z.string().min(1, 'Informe o e-mail.').email('E-mail inválido.'),
});

function UncontrolledFormDemo() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ email: string }>({
    resolver: zodResolver(schema),
    defaultValues: { email: '' },
  });

  return (
    <form
      className="space-y-3"
      onSubmit={handleSubmit(() => undefined)}
      noValidate
    >
      <InputField
        id="email"
        label="E-mail corporativo"
        type="email"
        placeholder="voce@empresa.com"
        errors={errors.email}
        {...register('email')}
      />
      <button
        type="submit"
        className="rounded-md bg-primary px-3 py-1.5 text-sm text-primary-foreground"
      >
        Validar
      </button>
    </form>
  );
}

export const Vitrine: Story = {
  render: () => (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card
        title="Padrão"
        description="Apenas label + placeholder. Modo uncontrolled simples."
      >
        <InputField id="name" label="Nome" placeholder="Digite seu nome" />
      </Card>

      <Card
        title="Com descrição"
        description="A prop description aparece abaixo do input."
      >
        <InputField
          id="username"
          label="Usuário"
          placeholder="@usuario"
          description="Aparece em sua URL pública."
        />
      </Card>

      <Card
        title="Uncontrolled + validação Zod"
        description="Clique em Validar sem preencher para ver a mensagem do schema."
      >
        <UncontrolledFormDemo />
      </Card>

      <Card title="Com erro manual" description="Passa errors direto.">
        <InputField
          id="email-error"
          label="E-mail"
          type="email"
          placeholder="voce@empresa.com"
          defaultValue="invalido"
          errors={{ message: 'E-mail inválido.' }}
        />
      </Card>

      <Card
        title="Desabilitado"
        description="Bloqueia interação mantendo o valor."
      >
        <InputField
          id="email-disabled"
          label="E-mail"
          type="email"
          defaultValue="bloqueado@empresa.com"
          disabled
        />
      </Card>

      <Card
        title="Numérico"
        description="As setas do spinner nativo seguem o tema (color-scheme) — alterne light/dark para conferir."
      >
        <InputField
          id="limit"
          label="Limite diário"
          type="number"
          defaultValue={5}
          min={0}
        />
      </Card>
    </div>
  ),
};
