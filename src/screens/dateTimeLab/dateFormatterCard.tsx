import { CaseList, type IDateCase } from './caseList';

import { Card } from '@/components/global/card/card';
import { dateFormatter } from '@/lib/dateTime/dateFormatter';

const cases: IDateCase[] = [
  {
    call: "{ date: '2026-03-31T00:00:00.000Z', hasTimeStamp: false }",
    hint: 'Dia de calendário — exibe em UTC, o dia não desliza pelo fuso.',
    run: () =>
      dateFormatter({ date: '2026-03-31T00:00:00.000Z', hasTimeStamp: false }),
  },
  {
    call: "{ date: '2026-03-31T14:35:20.000Z', hasTimeStamp: true, showHours: false }",
    hint: 'Instante — só a data, já convertida para o fuso local.',
    run: () =>
      dateFormatter({
        date: '2026-03-31T14:35:20.000Z',
        hasTimeStamp: true,
        showHours: false,
      }),
  },
  {
    call: "{ date: '2026-03-31T14:35:20.000Z', hasTimeStamp: true, showHours: true }",
    hint: 'Instante — data e hora no fuso local.',
    run: () =>
      dateFormatter({
        date: '2026-03-31T14:35:20.000Z',
        hasTimeStamp: true,
        showHours: true,
      }),
  },
  {
    call: '{ date: null, hasTimeStamp: false }',
    hint: 'Sem data — retorna “-”.',
    run: () => dateFormatter({ date: null, hasTimeStamp: false }),
  },
];

export function DateFormatterCard() {
  return (
    <Card title="dateFormatter" description="Exibe a data para o usuário.">
      <CaseList fnName="dateFormatter" cases={cases} />
    </Card>
  );
}
