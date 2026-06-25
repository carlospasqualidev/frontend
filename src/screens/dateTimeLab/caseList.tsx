import { Typography } from '@/components/ui/typography';
import { cn } from '@/lib/utils';

export interface IDateCase {
  call: string;
  hint: string;
  run: () => string | null;
}

function formatOutput(value: string | null): { text: string; empty: boolean } {
  if (value === null) return { text: 'null', empty: true };
  if (value === '') return { text: '"" (string vazia)', empty: true };
  return { text: value, empty: false };
}

interface ICaseOutput {
  text: string;
  failed: boolean;
  empty: boolean;
}

function resolveCase({ run }: IDateCase): ICaseOutput {
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

interface ICaseList {
  fnName: string;
  cases: IDateCase[];
}

export function CaseList({ fnName, cases }: ICaseList) {
  return (
    <ul className="divide-y divide-border/60">
      {cases.map((dateCase) => {
        const { text, failed, empty } = resolveCase(dateCase);

        return (
          <li key={dateCase.call} className="space-y-1.5 py-3 first:pt-0 last:pb-0">
            <code className="block text-xs break-all text-muted-foreground">
              {fnName}({dateCase.call})
            </code>
            <code
              className={cn(
                'block text-sm font-medium break-all',
                failed ? 'text-destructive' : empty ? 'text-muted-foreground' : 'text-primary'
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
