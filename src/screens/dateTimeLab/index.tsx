import { DateFormatterCard } from './dateFormatterCard';
import { TransformIntoDatabaseDateCard } from './transformIntoDatabaseDateCard';
import { TransformIntoDatabaseQueryDateCard } from './transformIntoDatabaseQueryDateCard';
import { TransformIntoInputDateCard } from './transformIntoInputDateCard';

import { PageHeader } from '@/components/global/pageHeader/pageHeader';

const localTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

export function DateTimeLabPage() {
  return (
    <main className="mx-auto min-h-svh w-full max-w-6xl space-y-4 p-4 sm:p-6">
      <PageHeader
        title="Laboratório de datas"
        description={`Exemplo fixo de cada utilitário de dateTime/, cobrindo toda variação de parâmetro. Resultados de instante e banco datetime usam o fuso local: ${localTimeZone}.`}
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <DateFormatterCard />
        <TransformIntoInputDateCard />
        <TransformIntoDatabaseDateCard />
        <TransformIntoDatabaseQueryDateCard />
      </div>
    </main>
  );
}
