import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/tanstack-react';

import { Modal } from '@/components/global/modal/modal';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/global/card/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const meta = {
  title: 'Globais/Modal',
  component: Modal,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Dialog no desktop, drawer no mobile (detecção automática via `useIsMobile`). Estado de abertura é controlado pelo consumidor.',
      },
    },
  },
  args: {
    title: '',
    description: '',
    children: null,
    open: false,
    setOpen: () => undefined,
  },
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

function EditProfileDemo() {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Button
        onClick={(event) => {
          event.currentTarget.blur();
          setOpen(true);
        }}
      >
        Abrir modal
      </Button>

      <Modal
        title="Editar perfil"
        description="Atualize seus dados pessoais e salve."
        open={open}
        setOpen={setOpen}
      >
        <form className="grid items-start gap-6">
          <div className="grid gap-3">
            <Label htmlFor="modal-story-email">E-mail</Label>
            <Input
              id="modal-story-email"
              type="email"
              defaultValue="usuario@empresa.com"
            />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="modal-story-username">Usuário</Label>
            <Input id="modal-story-username" defaultValue="@usuario" />
          </div>
          <Button onClick={() => setOpen(false)}>Salvar alterações</Button>
        </form>
      </Modal>
    </>
  );
}

export const Vitrine: Story = {
  render: () => (
    <Card
      title="Modal responsivo"
      description="Abre como dialog no desktop e drawer no mobile (redimensione a janela para testar)."
    >
      <EditProfileDemo />
    </Card>
  ),
};
