import { useQuery } from '@tanstack/react-query';

import { Modal } from '@/components/global/modal/modal';
import { SkeletonText } from '@/components/global/skeleton/skeleton';
import { Badge } from '@/components/ui/badge';
import { Typography } from '@/components/ui/typography';
import { dateFormatter } from '@/lib/dateTime/dateFormatter';
import { useAuditOptions } from '@/screens/audit-logs/utils/useAuditOptions';
import { auditKeys, fetchAuditLogDetail } from '@/services/audit/auditApi';

interface AuditLogDetailModalProps {
  logId: string | null;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <Typography variant="small" className="text-muted-foreground">
        {label}
      </Typography>
      <div className="text-sm break-words">{children}</div>
    </div>
  );
}

function Snapshot({ title, data, changed }: { title: string; data: Record<string, unknown> | null; changed: string[] }) {
  return (
    <div className="space-y-2">
      <Typography as="p" variant="small" className="font-medium">
        {title}
      </Typography>
      {data ? (
        <dl className="space-y-1 rounded-lg border border-border/70 p-3 text-sm">
          {Object.entries(data).map(([key, value]) => (
            <div key={key} className="flex flex-wrap gap-x-2">
              <dt className={changed.includes(key) ? 'font-semibold text-foreground' : 'text-muted-foreground'}>
                {key}:
              </dt>
              <dd className="break-all">{value === null ? '—' : String(value)}</dd>
            </div>
          ))}
        </dl>
      ) : (
        <Typography variant="muted" className="text-sm">
          —
        </Typography>
      )}
    </div>
  );
}

export function AuditLogDetailModal({ logId, open, setOpen }: AuditLogDetailModalProps) {
  const { moduleLabel, actionLabel, entityLabel } = useAuditOptions();

  const { data: log, isPending } = useQuery({
    queryKey: auditKeys.detail(logId ?? ''),
    queryFn: () => fetchAuditLogDetail(logId!),
    enabled: open && !!logId,
    staleTime: 60_000,
  });

  return (
    <Modal
      open={open}
      setOpen={setOpen}
      size="xl"
      title="Detalhe da auditoria"
      description="Quem alterou o quê, com o antes e o depois do registro."
    >
      {isPending || !log ? (
        <div className="space-y-3">
          <SkeletonText className="w-1/2" />
          <SkeletonText className="w-2/3" />
          <SkeletonText className="w-full" />
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Data/hora">
              {dateFormatter({ date: log.createdAt, hasTimeStamp: true, showHours: true })}
            </Field>
            <Field label="Autor">{log.user?.name ?? 'Sistema'}</Field>
            <Field label="Módulo">{moduleLabel(log.module)}</Field>
            <Field label="Ação">
              <Badge variant="secondary">{actionLabel(log.action)}</Badge>
            </Field>
            <Field label="Entidade">{entityLabel(log.entity)}</Field>
            <Field label="ID da entidade">{log.entityId ?? '—'}</Field>
          </div>

          {log.description && <Field label="Resumo">{log.description}</Field>}

          {log.changedFields.length > 0 && (
            <Field label="Campos alterados">
              <div className="flex flex-wrap gap-1">
                {log.changedFields.map((field) => (
                  <Badge key={field} variant="info">
                    {field}
                  </Badge>
                ))}
              </div>
            </Field>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <Snapshot title="Antes" data={log.before} changed={log.changedFields} />
            <Snapshot title="Depois" data={log.after} changed={log.changedFields} />
          </div>
        </div>
      )}
    </Modal>
  );
}
