import { Card } from '@/components/global/card/card';
import { Typography } from '@/components/ui/typography';
import { cn } from '@/lib/utils';
import { WEEKLY_ACTIVITY } from '@/screens/home/utils/homeMockData';

interface ActivityChartProps {
  className?: string;
}

/**
 * Mini gráfico de barras 100% CSS — sem dependência de biblioteca de gráficos.
 * Cada barra é uma `<div>` com altura relativa ao valor máximo da série.
 * Quando crescer (séries múltiplas, eixos, tooltips), considere plugar uma
 * lib como `recharts` ou `visx`.
 */
export function ActivityChart({ className }: ActivityChartProps) {
  const max = Math.max(...WEEKLY_ACTIVITY.map((point) => point.value));
  const total = WEEKLY_ACTIVITY.reduce((sum, point) => sum + point.value, 0);

  return (
    <Card
      title="Atividade da semana"
      description={`${total} logins nos últimos 7 dias`}
      className={className}
    >
      <div className="flex h-48 items-end gap-2 sm:gap-3">
        {WEEKLY_ACTIVITY.map((point) => {
          const heightPercent = max > 0 ? (point.value / max) * 100 : 0;
          return (
            <div
              key={point.label}
              className="flex flex-1 flex-col items-center gap-2"
            >
              <span className="w-full text-center text-xs font-medium text-muted-foreground">
                {point.value}
              </span>
              <div
                className={cn(
                  'w-full rounded-md bg-primary/80 transition-[height] hover:bg-primary',
                  'min-h-1'
                )}
                style={{ height: `${heightPercent}%` }}
                aria-label={`${point.label}: ${point.value} logins`}
              />
              <Typography
                as="span"
                variant="small"
                className="text-xs text-muted-foreground"
              >
                {point.label}
              </Typography>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
