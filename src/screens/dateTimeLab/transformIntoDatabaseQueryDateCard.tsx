import { CaseList, type IDateCase } from './caseList';

import { Card } from '@/components/global/card/card';
import { transformIntoDatabaseQueryDate } from '@/lib/dateTime/transformIntoDatabaseQueryDate';

const cases: IDateCase[] = [
  {
    call: "{ date: '2026-03-31T14:30:00.000Z', type: 'start', hasTimeStamp: true }",
    hint: 'Instante — momento exato em UTC (o type é ignorado).',
    run: () =>
      transformIntoDatabaseQueryDate({
        date: '2026-03-31T14:30:00.000Z',
        type: 'start',
        hasTimeStamp: true,
      }),
  },
  {
    call: "{ date: '2026-03-31', type: 'start', hasTimeStamp: false, databaseDateHasTimeStamp: false }",
    hint: 'Dia de calendário — borda inicial em UTC (00:00:00.000Z).',
    run: () =>
      transformIntoDatabaseQueryDate({
        date: '2026-03-31',
        type: 'start',
        hasTimeStamp: false,
        databaseDateHasTimeStamp: false,
      }),
  },
  {
    call: "{ date: '2026-03-31', type: 'end', hasTimeStamp: false, databaseDateHasTimeStamp: false }",
    hint: 'Dia de calendário — borda final em UTC (23:59:59.999Z).',
    run: () =>
      transformIntoDatabaseQueryDate({
        date: '2026-03-31',
        type: 'end',
        hasTimeStamp: false,
        databaseDateHasTimeStamp: false,
      }),
  },
  {
    call: "{ date: '2026-03-31', type: 'start', hasTimeStamp: false, databaseDateHasTimeStamp: true }",
    hint: 'Banco datetime — borda inicial no fuso local (00:00:00.000).',
    run: () =>
      transformIntoDatabaseQueryDate({
        date: '2026-03-31',
        type: 'start',
        hasTimeStamp: false,
        databaseDateHasTimeStamp: true,
      }),
  },
  {
    call: "{ date: '2026-03-31', type: 'end', hasTimeStamp: false, databaseDateHasTimeStamp: true }",
    hint: 'Banco datetime — borda final no fuso local (23:59:59.999).',
    run: () =>
      transformIntoDatabaseQueryDate({
        date: '2026-03-31',
        type: 'end',
        hasTimeStamp: false,
        databaseDateHasTimeStamp: true,
      }),
  },
  {
    call: "{ date: null, type: 'start', hasTimeStamp: false }",
    hint: 'Sem data — retorna string vazia.',
    run: () =>
      transformIntoDatabaseQueryDate({
        date: null,
        type: 'start',
        hasTimeStamp: false,
      }),
  },
];

export function TransformIntoDatabaseQueryDateCard() {
  return (
    <Card
      title="transformIntoDatabaseQueryDate"
      description="Monta bordas de intervalo para filtros via query."
    >
      <CaseList fnName="transformIntoDatabaseQueryDate" cases={cases} />
    </Card>
  );
}
