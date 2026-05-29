import { useState } from 'react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { z } from 'zod';

import { Button } from '@/components/global/button/button';
import { Card } from '@/components/global/card/card';
import { ConfirmDialog } from '@/components/global/confirmDialog/confirmDialog';
import { InputField } from '@/components/global/form/inputField';
import { Select } from '@/components/global/form/select';
import { Modal } from '@/components/global/modal/modal';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useZodForm } from '@/lib/forms/useZodForm';

const roleOptions = [
  { label: 'Administrador', value: 'admin' },
  { label: 'Editor', value: 'editor' },
  { label: 'Visualizador', value: 'viewer' },
] as const;

const roleLabel: Record<Person['role'], string> = {
  admin: 'Administrador',
  editor: 'Editor',
  viewer: 'Visualizador',
};

interface Person {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'editor' | 'viewer';
}

const personSchema = z.object({
  name: z.string().trim().min(1, 'Informe o nome.'),
  email: z.string().trim().email('Informe um e-mail válido.'),
  role: z.enum(['admin', 'editor', 'viewer']),
});

type PersonFormValues = z.output<typeof personSchema>;

const INITIAL_PEOPLE: Person[] = [
  {
    id: '1',
    name: 'Ana Silva',
    email: 'ana.silva@empresa.com',
    role: 'admin',
  },
  {
    id: '2',
    name: 'João Pereira',
    email: 'joao.pereira@empresa.com',
    role: 'editor',
  },
  {
    id: '3',
    name: 'Maria Costa',
    email: 'maria.costa@empresa.com',
    role: 'viewer',
  },
];

function PersonForm({
  initial,
  onSave,
}: {
  initial: Person | null;
  onSave: (values: PersonFormValues) => void;
}) {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useZodForm({
    schema: personSchema,
    defaultValues: initial ?? { name: '', email: '', role: 'viewer' },
  });

  const onSubmit = handleSubmit(async (values) => {
    await new Promise((resolve) => setTimeout(resolve, 600));
    onSave(values);
  });

  return (
    <form className="space-y-4" noValidate onSubmit={onSubmit}>
      <InputField
        id="crud-name"
        label="Nome"
        placeholder="Nome completo"
        errors={errors.name}
        disabled={isSubmitting}
        {...register('name')}
      />

      <InputField
        id="crud-email"
        label="E-mail"
        type="email"
        placeholder="email@empresa.com"
        errors={errors.email}
        disabled={isSubmitting}
        {...register('email')}
      />

      <Select
        id="crud-role"
        name="role"
        control={control}
        label="Papel"
        placeholder="Selecione o papel"
        disabled={isSubmitting}
        options={roleOptions.map((option) => ({
          label: option.label,
          value: option.value,
        }))}
      />

      <Button type="submit" loading={isSubmitting} className="w-full">
        {initial ? 'Salvar alterações' : 'Cadastrar'}
      </Button>
    </form>
  );
}

export function PlaygroundCrud() {
  const [people, setPeople] = useState<Person[]>(INITIAL_PEOPLE);
  const [editing, setEditing] = useState<Person | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const openCreate = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const openEdit = (person: Person) => {
    setEditing(person);
    setModalOpen(true);
  };

  const handleSave = (values: PersonFormValues) => {
    if (editing) {
      setPeople((prev) =>
        prev.map((p) => (p.id === editing.id ? { ...p, ...values } : p))
      );
      toast.success('Registro atualizado.');
    } else {
      setPeople((prev) => [...prev, { id: crypto.randomUUID(), ...values }]);
      toast.success('Registro cadastrado.');
    }
    setModalOpen(false);
  };

  const handleDelete = async (person: Person) => {
    await new Promise((resolve) => setTimeout(resolve, 600));
    setPeople((prev) => prev.filter((p) => p.id !== person.id));
    toast.success(`${person.name} foi removido(a).`);
  };

  return (
    <Card
      title="CRUD - Pessoas"
      description="Fluxo completo amarrando DataTable + Modal + Form + ConfirmDialog. Estado em memória — substitua por TanStack Query em uso real."
    >
      <div className="space-y-4">
        <div className="flex justify-end">
          <Button onClick={openCreate}>
            <Plus />
            Novo
          </Button>
        </div>

        <Modal
          title={editing ? 'Editar pessoa' : 'Cadastrar pessoa'}
          description={
            editing
              ? 'Atualize os dados e salve para confirmar.'
              : 'Preencha os dados para adicionar uma nova pessoa.'
          }
          open={modalOpen}
          setOpen={setModalOpen}
        >
          <PersonForm
            key={editing?.id ?? 'new'}
            initial={editing}
            onSave={handleSave}
          />
        </Modal>

        <div className="overflow-x-auto rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>E-mail</TableHead>
                <TableHead>Papel</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {people.map((person) => (
                <TableRow key={person.id}>
                  <TableCell className="font-medium">{person.name}</TableCell>
                  <TableCell>{person.email}</TableCell>
                  <TableCell>{roleLabel[person.role]}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEdit(person)}
                        aria-label={`Editar ${person.name}`}
                      >
                        <Pencil />
                      </Button>
                      <ConfirmDialog
                        title={`Remover ${person.name}?`}
                        description="Esta ação não pode ser desfeita."
                        confirmLabel="Remover"
                        destructive
                        trigger={
                          <Button
                            variant="ghost"
                            size="icon"
                            aria-label={`Remover ${person.name}`}
                          >
                            <Trash2 />
                          </Button>
                        }
                        onConfirm={() => handleDelete(person)}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </Card>
  );
}
