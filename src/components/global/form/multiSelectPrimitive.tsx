import * as React from 'react';
import { ChevronDownIcon, SearchIcon, XIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';

export type MultiSelectOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

type MultiSelectProps = {
  options: MultiSelectOption[];
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
  /** Texto exibido quando nada está selecionado. */
  placeholder?: string;
  /** Exibe um campo de busca no topo da lista. */
  searchable?: boolean;
  searchPlaceholder?: string;
  /** Texto exibido quando a busca não retorna opções. */
  emptyText?: string;
  /**
   * Máximo de rótulos exibidos no gatilho antes de resumir para
   * "N selecionados".
   */
  maxDisplay?: number;
  size?: 'sm' | 'default';
  disabled?: boolean;
  id?: string;
  name?: string;
  className?: string;
  'aria-invalid'?: boolean;
};

function MultiSelect({
  options,
  value,
  defaultValue,
  onValueChange,
  placeholder = 'Selecione...',
  searchable = false,
  searchPlaceholder = 'Buscar...',
  emptyText = 'Nenhuma opção encontrada.',
  maxDisplay = 3,
  size = 'default',
  disabled,
  id,
  name,
  className,
  'aria-invalid': ariaInvalid,
}: MultiSelectProps) {
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = React.useState<string[]>(
    defaultValue ?? []
  );
  const selected = isControlled ? value : internalValue;

  const [search, setSearch] = React.useState('');

  const setSelected = (next: string[]) => {
    if (!isControlled) {
      setInternalValue(next);
    }
    onValueChange?.(next);
  };

  const toggle = (optionValue: string) => {
    setSelected(
      selected.includes(optionValue)
        ? selected.filter((item) => item !== optionValue)
        : [...selected, optionValue]
    );
  };

  const selectedLabels = options
    .filter((option) => selected.includes(option.value))
    .map((option) => option.label);

  const display =
    selectedLabels.length === 0
      ? null
      : selectedLabels.length > maxDisplay
        ? `${selectedLabels.length} selecionados`
        : selectedLabels.join(', ');

  const normalizedSearch = search.trim().toLowerCase();
  const filteredOptions =
    searchable && normalizedSearch
      ? options.filter((option) =>
          option.label.toLowerCase().includes(normalizedSearch)
        )
      : options;

  return (
    <Popover
      onOpenChange={(open) => {
        if (!open) {
          setSearch('');
        }
      }}
    >
      <PopoverTrigger
        id={id}
        type="button"
        role="combobox"
        disabled={disabled}
        aria-invalid={ariaInvalid}
        data-slot="multi-select-trigger"
        data-size={size}
        className={cn(
          "flex w-fit items-center justify-between gap-1.5 rounded-lg border border-input bg-transparent py-2 pr-2 pl-2.5 text-sm whitespace-nowrap transition-colors outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 data-[size=default]:h-8 data-[size=sm]:h-7 data-[size=sm]:rounded-[min(var(--radius-md),10px)] dark:bg-input/30 dark:hover:bg-input/50 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
          className
        )}
      >
        <span
          className={cn(
            'line-clamp-1 text-left',
            !display && 'text-muted-foreground'
          )}
        >
          {display ?? placeholder}
        </span>
        <ChevronDownIcon className="size-4 text-muted-foreground" />
      </PopoverTrigger>

      {name &&
        selected.map((item) => (
          <input key={item} type="hidden" name={name} value={item} />
        ))}

      <PopoverContent
        align="start"
        data-slot="multi-select-content"
        className="w-(--radix-popover-trigger-width) gap-1.5 p-1"
      >
        {searchable && (
          <div className="relative">
            <SearchIcon className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={searchPlaceholder}
              className="h-8 w-full rounded-md border border-input bg-transparent pr-2.5 pl-8 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
            />
          </div>
        )}

        <ScrollArea viewportClassName="max-h-72">
          <div role="group">
            {filteredOptions.length === 0 ? (
              <p className="px-1.5 py-6 text-center text-sm text-muted-foreground">
                {emptyText}
              </p>
            ) : (
              filteredOptions.map((option) => {
                const checked = selected.includes(option.value);
                return (
                  <label
                    key={option.value}
                    data-slot="multi-select-item"
                    data-checked={checked || undefined}
                    className="flex w-full cursor-pointer items-center gap-2 rounded-md py-1.5 pr-2 pl-1.5 text-sm select-none hover:bg-accent hover:text-accent-foreground has-disabled:pointer-events-none has-disabled:opacity-50"
                  >
                    <Checkbox
                      checked={checked}
                      disabled={option.disabled}
                      onCheckedChange={() => toggle(option.value)}
                    />
                    <span className="flex-1">{option.label}</span>
                  </label>
                );
              })
            )}
          </div>
        </ScrollArea>

        {selected.length > 0 && (
          <button
            type="button"
            onClick={() => setSelected([])}
            className="flex items-center justify-center gap-1.5 rounded-md py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <XIcon className="size-3.5" />
            Limpar seleção
          </button>
        )}
      </PopoverContent>
    </Popover>
  );
}

export { MultiSelect };
