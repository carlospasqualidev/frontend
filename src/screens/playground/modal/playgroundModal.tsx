import { useState } from 'react';

import { Card } from '@/components/global/card/card';
import { Modal } from '@/components/global/modal/modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

function ModalContent({
  setIsModalOpen,
  isModalOpen,
}: {
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <Modal
      title="Edit Profile"
      description="Make changes to your profile here."
      open={isModalOpen}
      setOpen={setIsModalOpen}
    >
      <form className={cn('grid items-start gap-6')}>
        <div className="grid gap-3">
          <Label htmlFor="email">Email</Label>
          <Input type="email" id="email" defaultValue="shadcn@example.com" />
        </div>
        <div className="grid gap-3">
          <Label htmlFor="username">Username</Label>
          <Input id="username" defaultValue="@shadcn" />
        </div>
        <Button>Save changes</Button>
      </form>
    </Modal>
  );
}

export function PlaygroundModal() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <Card
      title="Modal"
      description="Teste o modal responsivo do projeto. No desktop ele abre como dialog; no mobile, como drawer."
    >
      <ModalContent isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />

      <Button
        onClick={(event) => {
          // Tira o foco do trigger antes do drawer abrir. Como o `Modal` é
          // controlado por estado externo (e não por `DrawerTrigger`), a vaul
          // não sabe relinquir o foco sozinha — sem isso, o `aria-hidden` que
          // ela aplica no fundo cai sobre um botão ainda focado e o Chrome
          // bloqueia (violação WCAG).
          event.currentTarget.blur();
          setIsModalOpen(true);
        }}
      >
        Abrir Modal
      </Button>
    </Card>
  );
}
