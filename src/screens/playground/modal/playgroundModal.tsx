import { useState } from 'react';

import { PlaygroundPreviewCard } from '../components';

import { Modal } from '@/components/global/modal/modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';

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
    <PlaygroundPreviewCard
      title="Modal"
      description="Teste o modal responsivo do projeto. No desktop ele abre como dialog; no mobile, como drawer."
    >
      <ModalContent isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />

      <Button
        onClick={() => {
          setIsModalOpen(true);
        }}
      >
        Abrir Modal
      </Button>
    </PlaygroundPreviewCard>
  );
}
