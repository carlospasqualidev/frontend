import { CaseList, type IDateCase } from './caseList';

import { Card } from '@/components/global/card/card';
import { transformIntoInputDate } from '@/lib/dateTime/transformIntoInputDate';

const cases: IDateCase[] = [
  {
    call: "{ date: '2026-03-31T00:00:00.000Z', hasTimeStamp: false }",
    hint: 'Para <input type="date"> — fatia só a parte YYYY-MM-DD, sem fuso.',
    run: () =>
      transformIntoInputDate({
        date: '2026-03-31T00:00:00.000Z',
        hasTimeStamp: false,
      }),
  },
  {
    call: "{ date: '2026-03-31T14:35:20.000Z', hasTimeStamp: true }",
    hint: 'Para <input type="datetime-local"> — converte o instante para o fuso local.',
    run: () =>
      transformIntoInputDate({
        date: '2026-03-31T14:35:20.000Z',
        hasTimeStamp: true,
      }),
  },
  {
    call: '{ date: null, hasTimeStamp: true }',
    hint: 'Sem data — retorna string vazia (deixa o input vazio).',
    run: () => transformIntoInputDate({ date: null, hasTimeStamp: true }),
  },
];

export function TransformIntoInputDateCard() {
  return (
    <Card
      title="transformIntoInputDate"
      description="Preenche inputs de data e datetime-local."
    >
      <CaseList fnName="transformIntoInputDate" cases={cases} />
    </Card>
  );
}
