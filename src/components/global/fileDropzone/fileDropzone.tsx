import { useId, useRef, useState, type DragEvent } from 'react';
import { FileSpreadsheet, Upload, X } from 'lucide-react';

import { Button } from '@/components/global/button/button';
import { Typography } from '@/components/ui/typography';
import { cn } from '@/lib/utils';

interface IFileDropzone {
  /** Arquivo selecionado (controlado). `null` = nenhum. */
  file: File | null;
  /** Disparado ao escolher, arrastar-e-soltar ou remover (`null`). */
  onFileChange: (file: File | null) => void;
  /** Filtro de extensões/MIME, ex.: `".xlsx,.csv"` (igual ao input nativo). */
  accept?: string;
  /** Texto auxiliar abaixo do título (ex.: formatos aceitos). */
  hint?: string;
  disabled?: boolean;
  /** `id` do input escondido — associe uma `FieldLabel htmlFor` a ele. */
  id?: string;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(kb < 10 ? 1 : 0)} KB`;
  return `${(kb / 1024).toFixed(1)} MB`;
}

/** Extensão (com ponto, minúscula) do nome do arquivo, ou `''` se não houver. */
function fileExtension(name: string): string {
  const dot = name.lastIndexOf('.');
  return dot >= 0 ? name.slice(dot).toLowerCase() : '';
}

/** O arquivo casa com o filtro `accept` (extensões `.xlsx` e/ou MIME `type/*`)? */
function matchesAccept(file: File, accept?: string): boolean {
  const patterns = (accept ?? '')
    .split(',')
    .map((pattern) => pattern.trim().toLowerCase())
    .filter(Boolean);
  if (patterns.length === 0) return true;

  const extension = fileExtension(file.name);
  const mime = file.type.toLowerCase();
  return patterns.some((pattern) => {
    if (pattern.startsWith('.')) return extension === pattern;
    if (pattern.endsWith('/*')) return mime.startsWith(pattern.slice(0, -1));
    return mime === pattern;
  });
}

/**
 * Área de upload com arrastar-e-soltar, seleção por clique/teclado e prévia do
 * arquivo escolhido (nome + tamanho + remover). Controlado por `file`.
 */
export function FileDropzone({
  file,
  onFileChange,
  accept,
  hint,
  disabled,
  id,
}: IFileDropzone) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  function openPicker() {
    if (!disabled) inputRef.current?.click();
  }

  function clearInput() {
    if (inputRef.current) inputRef.current.value = '';
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setDragging(false);
    if (disabled) return;
    const dropped = event.dataTransfer.files?.[0];
    if (dropped && matchesAccept(dropped, accept)) onFileChange(dropped);
  }

  return (
    <div>
      {/* Sibling do alvo clicável: o click programático não recai no dropzone. */}
      <input
        ref={inputRef}
        id={inputId}
        type="file"
        accept={accept}
        className="sr-only"
        disabled={disabled}
        onChange={(event) => onFileChange(event.target.files?.[0] ?? null)}
      />

      {file ? (
        <div className="flex items-center gap-3 rounded-lg border bg-muted/30 p-3">
          <FileSpreadsheet className="size-8 shrink-0 text-muted-foreground" />
          <div className="min-w-0 flex-1">
            <Typography as="p" variant="small" className="truncate font-medium">
              {file.name}
            </Typography>
            <Typography as="p" variant="muted">
              {formatFileSize(file.size)}
            </Typography>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Remover arquivo"
            disabled={disabled}
            onClick={() => {
              onFileChange(null);
              clearInput();
            }}
          >
            <X />
          </Button>
        </div>
      ) : (
        <div
          role="button"
          tabIndex={disabled ? -1 : 0}
          aria-disabled={disabled}
          aria-label="Selecionar arquivo"
          onClick={openPicker}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              openPicker();
            }
          }}
          onDragOver={(event) => {
            event.preventDefault();
            if (!disabled) setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          className={cn(
            'flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed p-6 text-center transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none',
            disabled
              ? 'cursor-not-allowed opacity-50'
              : 'cursor-pointer hover:border-ring hover:bg-muted/40',
            dragging && !disabled && 'border-ring bg-muted/60'
          )}
        >
          <Upload className="size-6 text-muted-foreground" />
          <Typography as="p" variant="small" className="font-medium">
            Arraste o arquivo aqui ou clique para selecionar
          </Typography>
          {hint && (
            <Typography as="p" variant="muted">
              {hint}
            </Typography>
          )}
        </div>
      )}
    </div>
  );
}
