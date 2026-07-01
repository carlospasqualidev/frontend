import type { Meta, StoryObj } from '@storybook/tanstack-react';

import { Card } from '@/components/global/card/card';
import { Typography } from '@/components/ui/typography';
import { dateFormatter } from '@/lib/dateTime/dateFormatter';
import { transformIntoDatabaseDate } from '@/lib/dateTime/transformIntoDatabaseDate';
import { transformIntoDatabaseQueryDate } from '@/lib/dateTime/transformIntoDatabaseQueryDate';
import { transformIntoInputDate } from '@/lib/dateTime/transformIntoInputDate';
import { cn } from '@/lib/utils';

const localTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

const meta = {
  title: 'Padrões/Datas',
  parameters: {
    layout: 'padded',
  },
} satisfies Meta;

export default meta;

// ============================================================================
// Lista de casos — roda cada utilitário com um argumento fixo e mostra a saída
// ============================================================================

interface DateCase {
  call: string;
  hint: string;
  run: () => string | null;
}

function formatOutput(value: string | null): { text: string; empty: boolean } {
  if (value === null) return { text: 'null', empty: true };
  if (value === '') return { text: '"" (string vazia)', empty: true };
  return { text: value, empty: false };
}

function resolveCase({ run }: DateCase): {
  text: string;
  failed: boolean;
  empty: boolean;
} {
  try {
    const { text, empty } = formatOutput(run());
    return { text, empty, failed: false };
  } catch (error) {
    return {
      text: error instanceof Error ? error.message : String(error),
      failed: true,
      empty: false,
    };
  }
}

function CaseList({ fnName, cases }: { fnName: string; cases: DateCase[] }) {
  return (
    <ul className="divide-y divide-border/60">
      {cases.map((dateCase) => {
        const { text, failed, empty } = resolveCase(dateCase);

        return (
          <li
            key={dateCase.call}
            className="space-y-1.5 py-3 first:pt-0 last:pb-0"
          >
            <code className="block text-xs break-all text-muted-foreground">
              {fnName}({dateCase.call})
            </code>
            <code
              className={cn(
                'block text-sm font-medium break-all',
                failed
                  ? 'text-destructive'
                  : empty
                    ? 'text-muted-foreground'
                    : 'text-primary'
              )}
            >
              → {text}
            </code>
            <Typography variant="muted" className="text-xs">
              {dateCase.hint}
            </Typography>
          </li>
        );
      })}
    </ul>
  );
}

// ============================================================================
// dateFormatter — exibição para o usuário
// ============================================================================

const dateFormatterCases: DateCase[] = [
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

function DateFormatterDemo() {
  return (
    <Card title="dateFormatter" description="Exibe a data para o usuário.">
      <CaseList fnName="dateFormatter" cases={dateFormatterCases} />
    </Card>
  );
}

// ============================================================================
// transformIntoInputDate — preencher inputs
// ============================================================================

const inputDateCases: DateCase[] = [
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

function TransformIntoInputDateDemo() {
  return (
    <Card
      title="transformIntoInputDate"
      description="Preenche inputs de data e datetime-local."
    >
      <CaseList fnName="transformIntoInputDate" cases={inputDateCases} />
    </Card>
  );
}

// ============================================================================
// transformIntoDatabaseDate — persistir via body
// ============================================================================

const databaseDateCases: DateCase[] = [
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

function TransformIntoDatabaseDateDemo() {
  return (
    <Card
      title="transformIntoDatabaseDate"
      description="Persiste a data via body do request."
    >
      <CaseList fnName="transformIntoDatabaseDate" cases={databaseDateCases} />
    </Card>
  );
}

// ============================================================================
// transformIntoDatabaseQueryDate — filtros via query
// ============================================================================

const databaseQueryDateCases: DateCase[] = [
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

function TransformIntoDatabaseQueryDateDemo() {
  return (
    <Card
      title="transformIntoDatabaseQueryDate"
      description="Monta bordas de intervalo para filtros via query."
    >
      <CaseList
        fnName="transformIntoDatabaseQueryDate"
        cases={databaseQueryDateCases}
      />
    </Card>
  );
}

// ============================================================================
// Vitrine — todos os utilitários lado a lado
// ============================================================================

function DateTimeShowcase() {
  return (
    <section className="space-y-4">
      <Typography variant="muted">
        Exemplo fixo de cada utilitário de <code>dateTime/</code>, cobrindo toda
        variação de parâmetro. Resultados de instante e banco datetime usam o
        fuso local: <strong>{localTimeZone}</strong>.
      </Typography>

      <div className="grid gap-4 lg:grid-cols-2">
        <DateFormatterDemo />
        <TransformIntoInputDateDemo />
        <TransformIntoDatabaseDateDemo />
        <TransformIntoDatabaseQueryDateDemo />
      </div>
    </section>
  );
}

// ============================================================================
// Exports
// ============================================================================

export const Vitrine: StoryObj<typeof DateTimeShowcase> = {
  render: () => <DateTimeShowcase />,
};

export const DateFormatter: StoryObj<typeof DateFormatterDemo> = {
  render: () => <DateFormatterDemo />,
};

export const TransformIntoInputDate: StoryObj<
  typeof TransformIntoInputDateDemo
> = {
  render: () => <TransformIntoInputDateDemo />,
};

export const TransformIntoDatabaseDate: StoryObj<
  typeof TransformIntoDatabaseDateDemo
> = {
  render: () => <TransformIntoDatabaseDateDemo />,
};

export const TransformIntoDatabaseQueryDate: StoryObj<
  typeof TransformIntoDatabaseQueryDateDemo
> = {
  render: () => <TransformIntoDatabaseQueryDateDemo />,
};
