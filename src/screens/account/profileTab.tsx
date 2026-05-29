import { Upload } from 'lucide-react';
import { toast } from 'sonner';

import { Card } from '@/components/global/card/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Typography } from '@/components/ui/typography';
import { useSessionStore } from '@/hooks/useSessionStore';
import { getInitials } from '@/screens/users/getInitials';

export function ProfileTab() {
  const user = useSessionStore((state) => state.user);
  if (!user) return null;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    toast.success('Perfil atualizado.');
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <Card
        title="Foto"
        description="Como você aparece para outras pessoas do espaço."
      >
        <div className="flex flex-wrap items-center gap-4">
          <Avatar size="lg" className="size-20">
            <AvatarImage src={user.image ?? undefined} alt={user.name} />
            <AvatarFallback className="text-lg">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => toast('Carregar nova foto.')}
            >
              <Upload />
              Carregar foto
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => toast('Foto removida.')}
            >
              Remover
            </Button>
          </div>
        </div>
      </Card>

      <Card
        title="Informações públicas"
        description="Dados exibidos no seu perfil e em comentários."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="account-name">Nome</Label>
            <Input id="account-name" name="name" defaultValue={user.name} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="account-email">E-mail</Label>
            <Input
              id="account-email"
              name="email"
              type="email"
              defaultValue={user.email}
              readOnly
              aria-readonly
            />
            <Typography variant="muted" className="text-xs">
              Para alterar o e-mail, contate o administrador.
            </Typography>
          </div>
        </div>
        <div className="mt-4 grid gap-2">
          <Label htmlFor="account-bio">Bio</Label>
          <Textarea
            id="account-bio"
            name="bio"
            rows={3}
            placeholder="Conte um pouco sobre você..."
          />
        </div>
      </Card>

      <div className="flex justify-end">
        <Button type="submit">Salvar alterações</Button>
      </div>
    </form>
  );
}
