import { CaseList, type IDateCase } from './caseList';

import { Card } from '@/components/global/card/card';
import { transformIntoDatabaseDate } from '@/lib/dateTime/transformIntoDatabaseDate';

const cases: IDateCase[] = [
  {
    call: "{ date: '2026-03-31T14:30:00.000Z', hasTimeStamp: true }",
    hint: 'Instante — momento exato em UTC (toISOString).',
    run: () =>
      transformIntoDatabaseDate({
        date: '2026-03-31T14:30:00.000Z',
        hasTimeStamp: true,
      }),
  },
  {
    call: "{ date: '2026-03-31', hasTimeStamp: false, databaseDateHasTimeStamp: false }",
    hint: 'Dia de calendário — meia-noite UTC.',
    run: () =>
      transformIntoDatabaseDate({
        date: '2026-03-31',
        hasTimeStamp: false,
        databaseDateHasTimeStamp: false,
      }),
  },
  {
    call: "{ date: '2026-03-31', hasTimeStamp: false, databaseDateHasTimeStamp: true }",
    hint: 'Banco datetime — meia-noite no fuso local.',
    run: () =>
      transformIntoDatabaseDate({
        date: '2026-03-31',
        hasTimeStamp: false,
        databaseDateHasTimeStamp: true,
      }),
  },
  {
    call: '{ date: null, hasTimeStamp: false }',
    hint: 'Sem data — retorna null.',
    run: () => transformIntoDatabaseDate({ date: null, hasTimeStamp: false }),
  },
];

export function TransformIntoDatabaseDateCard() {
  return (
    <Card
      title="transformIntoDatabaseDate"
      description="Persiste a data via body do request."
    >
      <CaseList fnName="transformIntoDatabaseDate" cases={cases} />
    </Card>
  );
}
