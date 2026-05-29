import { Link, useNavigate } from '@tanstack/react-router';
import { z } from 'zod';

import { SessionTemplate } from './sessionTemplate';

import { useSessionStore } from '@/hooks/useSessionStore';
import { useZodForm } from '@/lib/forms/useZodForm';
import { sessionService } from '@/services/session/sessionService';
import { Button } from '@/components/global/button/button';
import { InputField } from '@/components/global/form/inputField';
import {
  AppleIcon,
  GoogleIcon,
  MetaIcon,
} from '@/components/global/socialIcons/socialIcons';
import { Card, CardContent } from '@/components/ui/card';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldSeparator,
} from '@/components/ui/field';
import { Typography } from '@/components/ui/typography';

const loginSchema = z.object({
  email: z.email('Informe um e-mail válido.').trim(),
  password: z.string().min(1, 'Informe sua senha.'),
});

export function LoginScreen() {
  const navigate = useNavigate();
  const { setUser } = useSessionStore();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useZodForm({
    schema: loginSchema,
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    const { user } = await sessionService.signIn(values);
    setUser(user);
    navigate({ to: '/', replace: true });
  });

  return (
    <SessionTemplate>
      <div className="flex flex-col gap-6">
        <Card className="overflow-hidden p-0">
          <CardContent className="grid p-0 md:grid-cols-2">
            <div className="relative hidden bg-muted md:block">
              <img
                src="/placeholder.svg"
                alt="Imagem"
                className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
              />
            </div>
            <form className="p-6 md:p-8" noValidate onSubmit={onSubmit}>
              <FieldGroup>
                <div className="flex flex-col items-center gap-2 text-center">
                  <Typography as="h1" variant="h3">
                    Bem-vindo de volta
                  </Typography>
                  <Typography variant="muted" className="text-balance">
                    Faça login na sua conta
                  </Typography>
                </div>

                <InputField
                  id="email"
                  label="E-mail"
                  type="email"
                  placeholder="m@example.com"
                  autoComplete="email"
                  errors={errors.email}
                  disabled={isSubmitting}
                  {...register('email')}
                />

                <InputField
                  id="password"
                  label="Senha"
                  type="password"
                  autoComplete="current-password"
                  errors={errors.password}
                  disabled={isSubmitting}
                  {...register('password')}
                />

                <Field>
                  <Button type="submit" loading={isSubmitting}>
                    Entrar
                  </Button>
                  <FieldError errors={[errors.root]} />
                </Field>

                <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                  Ou continue com
                </FieldSeparator>

                <Field className="grid grid-cols-3 gap-4">
                  <Button
                    variant="outline"
                    type="button"
                    disabled={isSubmitting}
                  >
                    <AppleIcon />
                    <span className="sr-only">Entrar com Apple</span>
                  </Button>
                  <Button
                    variant="outline"
                    type="button"
                    disabled={isSubmitting}
                  >
                    <GoogleIcon />
                    <span className="sr-only">Entrar com Google</span>
                  </Button>
                  <Button
                    variant="outline"
                    type="button"
                    disabled={isSubmitting}
                  >
                    <MetaIcon />
                    <span className="sr-only">Entrar com Meta</span>
                  </Button>
                </Field>

                <FieldDescription className="text-center">
                  Não tem uma conta? <Link to="/signup">Criar conta</Link>
                </FieldDescription>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>
      </div>
    </SessionTemplate>
  );
}
