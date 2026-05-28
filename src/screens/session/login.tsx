import { Link, useNavigate } from '@tanstack/react-router';
import { z } from 'zod';

import { SessionTemplate } from './sessionTemplate';

import { useSessionStore } from '@/hooks/useSessionStore';
import { useZodForm } from '@/lib/forms/useZodForm';
import { sessionService } from '@/services/session/sessionService';
import { Button } from '@/components/global/button/button';
import { InputField } from '@/components/global/form/inputField';
import { Card, CardContent } from '@/components/ui/card';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldSeparator,
} from '@/components/ui/field';

const loginSchema = z.object({
  email: z.email().trim().min(1, 'Informe seu e-mail.'),
  password: z.string().min(8, 'Informe sua senha.'),
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
    await sessionService.signIn(values).then(({ user }) => {
      setUser(user);
      navigate({ to: '/' });
    });
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
                  <h1 className="text-2xl font-bold">Bem-vindo de volta</h1>
                  <p className="text-balance text-muted-foreground">
                    Faça login na sua conta
                  </p>
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

                <div className="space-y-1">
                  <InputField
                    id="password"
                    label="Senha"
                    type="password"
                    autoComplete="current-password"
                    errors={errors.password}
                    disabled={isSubmitting}
                    {...register('password')}
                  />
                  <div className="flex justify-end">
                    <a
                      href="#"
                      className="text-sm underline-offset-2 hover:underline"
                    >
                      Esqueceu sua senha?
                    </a>
                  </div>
                </div>

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
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                      <path
                        d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"
                        fill="currentColor"
                      />
                    </svg>
                    <span className="sr-only">Entrar com Apple</span>
                  </Button>
                  <Button
                    variant="outline"
                    type="button"
                    disabled={isSubmitting}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                      <path
                        d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                        fill="currentColor"
                      />
                    </svg>
                    <span className="sr-only">Entrar com Google</span>
                  </Button>
                  <Button
                    variant="outline"
                    type="button"
                    disabled={isSubmitting}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                      <path
                        d="M6.915 4.03c-1.968 0-3.683 1.28-4.871 3.113C.704 9.208 0 11.883 0 14.449c0 .706.07 1.369.21 1.973a6.624 6.624 0 0 0 .265.86 5.297 5.297 0 0 0 .371.761c.696 1.159 1.818 1.927 3.593 1.927 1.497 0 2.633-.671 3.965-2.444.76-1.012 1.144-1.626 2.663-4.32l.756-1.339.186-.325c.061.1.121.196.183.3l2.152 3.595c.724 1.21 1.665 2.556 2.47 3.314 1.046.987 1.992 1.22 3.06 1.22 1.075 0 1.876-.355 2.455-.843a3.743 3.743 0 0 0 .81-.973c.542-.939.861-2.127.861-3.745 0-2.72-.681-5.357-2.084-7.45-1.282-1.912-2.957-2.93-4.716-2.93-1.047 0-2.088.467-3.053 1.308-.652.57-1.257 1.29-1.82 2.05-.69-.875-1.335-1.547-1.958-2.056-1.182-.966-2.315-1.303-3.454-1.303z"
                        fill="currentColor"
                      />
                    </svg>
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
        <FieldDescription className="px-6 text-center">
          Ao continuar, você concorda com nossos{' '}
          <a href="#">Termos de Serviço</a> e{' '}
          <a href="#">Política de Privacidade</a>.
        </FieldDescription>
      </div>
    </SessionTemplate>
  );
}
