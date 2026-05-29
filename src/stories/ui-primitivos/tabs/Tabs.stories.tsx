import { Bell, Lock, User } from 'lucide-react';
import type { Meta, StoryObj } from '@storybook/tanstack-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const meta = {
  title: 'UI primitivos/Tabs',
  component: Tabs,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Alterna entre seções dentro de uma mesma tela (perfil, configurações, abas de detalhes). Padrão recomendado pelo shadcn: `Tabs` por fora, e cada `TabsContent` envolve seu próprio `Card` com header, conteúdo e footer.',
      },
    },
  },
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ContaSenha: Story = {
  render: () => (
    <Tabs defaultValue="account" className="w-100">
      <TabsList>
        <TabsTrigger value="account">Conta</TabsTrigger>
        <TabsTrigger value="password">Senha</TabsTrigger>
      </TabsList>

      <TabsContent value="account">
        <Card>
          <CardHeader>
            <CardTitle>Conta</CardTitle>
            <CardDescription>
              Atualize seus dados pessoais. Salve quando terminar.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            <div className="grid gap-3">
              <Label htmlFor="tabs-account-name">Nome</Label>
              <Input id="tabs-account-name" defaultValue="Ana Silva" />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="tabs-account-username">Usuário</Label>
              <Input id="tabs-account-username" defaultValue="@anasilva" />
            </div>
          </CardContent>
          <CardFooter>
            <Button>Salvar alterações</Button>
          </CardFooter>
        </Card>
      </TabsContent>

      <TabsContent value="password">
        <Card>
          <CardHeader>
            <CardTitle>Senha</CardTitle>
            <CardDescription>
              Altere sua senha. Após salvar, você será desconectado.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            <div className="grid gap-3">
              <Label htmlFor="tabs-password-current">Senha atual</Label>
              <Input id="tabs-password-current" type="password" />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="tabs-password-new">Nova senha</Label>
              <Input id="tabs-password-new" type="password" />
            </div>
          </CardContent>
          <CardFooter>
            <Button>Atualizar senha</Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Padrão clássico do shadcn (conta/senha). Cada aba contém um `Card` completo com header, formulário e CTA.',
      },
    },
  },
};

export const ComIcones: Story = {
  render: () => (
    <Tabs defaultValue="profile" className="w-120">
      <TabsList>
        <TabsTrigger value="profile">
          <User />
          Perfil
        </TabsTrigger>
        <TabsTrigger value="security">
          <Lock />
          Segurança
        </TabsTrigger>
        <TabsTrigger value="notifications">
          <Bell />
          Notificações
        </TabsTrigger>
      </TabsList>

      <TabsContent value="profile">
        <Card>
          <CardHeader>
            <CardTitle>Perfil</CardTitle>
            <CardDescription>
              Informações públicas exibidas para outros usuários.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            <div className="grid gap-3">
              <Label htmlFor="tabs-icon-name">Nome de exibição</Label>
              <Input id="tabs-icon-name" defaultValue="Ana Silva" />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="tabs-icon-bio">Bio</Label>
              <Input
                id="tabs-icon-bio"
                defaultValue="Designer de produto · São Paulo"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button>Salvar</Button>
          </CardFooter>
        </Card>
      </TabsContent>

      <TabsContent value="security">
        <Card>
          <CardHeader>
            <CardTitle>Segurança</CardTitle>
            <CardDescription>
              Autenticação e proteção da sua conta.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="tabs-icon-2fa">Autenticação em 2 fatores</Label>
                <p className="text-xs text-muted-foreground">
                  Exige código adicional ao fazer login.
                </p>
              </div>
              <Switch id="tabs-icon-2fa" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="tabs-icon-alerts">Alertas de login</Label>
                <p className="text-xs text-muted-foreground">
                  Receba notificação de novos dispositivos.
                </p>
              </div>
              <Switch id="tabs-icon-alerts" />
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="notifications">
        <Card>
          <CardHeader>
            <CardTitle>Notificações</CardTitle>
            <CardDescription>
              Canais habilitados e tipos de evento.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="tabs-icon-email-notif">Por e-mail</Label>
              <Switch id="tabs-icon-email-notif" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="tabs-icon-push">Push no celular</Label>
              <Switch id="tabs-icon-push" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="tabs-icon-newsletter">Newsletter mensal</Label>
              <Switch id="tabs-icon-newsletter" />
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Triggers com ícone (Lucide) — uso comum em telas de configuração.',
      },
    },
  },
};

export const VarianteLine: Story = {
  render: () => (
    <Tabs defaultValue="overview" className="w-120">
      <TabsList variant="line">
        <TabsTrigger value="overview">Visão geral</TabsTrigger>
        <TabsTrigger value="activity">Atividade</TabsTrigger>
        <TabsTrigger value="settings">Ajustes</TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="pt-4">
        <Card>
          <CardHeader>
            <CardTitle>Visão geral</CardTitle>
            <CardDescription>
              Resumo consolidado das métricas principais.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Pageviews, conversões e tempo médio na sessão dos últimos 7 dias.
            </p>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="activity" className="pt-4">
        <Card>
          <CardHeader>
            <CardTitle>Atividade</CardTitle>
            <CardDescription>
              Histórico recente de eventos do usuário.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Últimos logins, mudanças de configuração e ações relevantes.
            </p>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="settings" className="pt-4">
        <Card>
          <CardHeader>
            <CardTitle>Ajustes</CardTitle>
            <CardDescription>
              Configurações específicas desta seção.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Preferências locais que afetam apenas a visão atual.
            </p>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Variante `line` — sublinhado embaixo do trigger ativo, sem fundo. Visual mais discreto, útil dentro de cartões/telas densas.',
      },
    },
  },
};
