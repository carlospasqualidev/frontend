# CLAUDE.md

Guia para o Claude trabalhar neste frontend. Este arquivo é a fonte de verdade para convenções e comportamento esperado — leia o [`README.md`](README.md) para detalhes de stack, scripts e estrutura de pastas.

> O diretório irmão `ultimate-server/` existe apenas como template de backend para fazer o login funcionar. Não é o foco do trabalho — não otimize, refatore ou estenda essa API sem pedido explícito.

---

## Stack

React 19 + Vite 7 + TypeScript • TanStack Router (code-based) + TanStack Query • Zustand • React Hook Form + Zod • Tailwind v4 + shadcn/ui (Radix) • Axios • Sonner • Vitest + Testing Library • ESLint + Prettier + Husky + lint-staged.

Sessão por cookie HTTP-only (consumida pelo template de backend em `../ultimate-server`).

---

## Comportamento esperado

Aja como engenheiro sênior responsável por qualidade e manutenibilidade de longo prazo.

Antes de escrever código:

- Leia o código existente ao redor do arquivo que você vai mexer.
- Identifique padrões, arquitetura e convenções já adotadas.
- Prefira consistência com o código atual a introduzir padrões novos.
- Avalie efeitos colaterais e impacto em outras partes do sistema.

Prioridade ao decidir: **correctness → readability → maintainability → consistency → performance** (performance só quando relevante).

Evite complexidade desnecessária, over-engineering e soluções que desviem da arquitetura atual.

### Estratégia de decisão (quando há múltiplas soluções)

1. A solução correta mais simples
2. A mais legível
3. A mais consistente com o codebase
4. Razoável em performance e escalabilidade

Se uma mudança ameaça introduzir instabilidade, inconsistência ou complexidade desnecessária, prefira a versão mais simples e segura.

---

## Linguagem de código

- Todo código-fonte em **inglês**.
- `camelCase` para variáveis, funções e arquivos `.ts`/`.tsx` próprios.
- `kebab-case` apenas em `components/ui/` (padrão shadcn).
- Nomes claros e que revelem intenção. Sem abreviações desnecessárias.
  - Prefira: `calculateInventoryBalance`, `createUserSession`, `validatePhoneNumber`
  - Evite: `data`, `info`, `handleThing`, `processStuff`
- Código auto-documentado é melhor que comentário. Não escreva comentário que apenas reafirma o que o código já diz.

---

## TypeScript

- **Evite `any`.** Use tipos explícitos ou genéricos.
- Use `interface` para shapes de objeto que podem ser estendidos; `type` para uniões, interseções e aliases.
- Inferência só quando o tipo é óbvio pela atribuição.
- Marque return type explicitamente em funções públicas/exportadas.
- Use `unknown` quando o tipo é genuinamente desconhecido — restrinja antes de usar.

---

## Qualidade de código

- Implementações simples e explícitas.
- Sem abstrações prematuras. Três linhas parecidas é melhor que uma abstração precoce.
- Funções pequenas, com responsabilidade única.
- Composição > herança complexa.
- Remova código redundante/não-usado **apenas dentro do escopo da mudança atual**.
- Sem error handling, fallbacks ou validação para cenários que não podem acontecer. Confie em código interno e garantias do framework. Valide apenas em fronteiras (input do usuário, respostas de API).

### Refatoração

- Não quebre comportamento existente.
- Refatoração incremental e segura > grandes rewrites.
- Mantenha interfaces, APIs e contratos quando possível.
- Limite o escopo da refatoração ao que se relaciona com a tarefa atual.

---

## JSX e markup — menos é mais

Você tende a empilhar `<div>` e classes Tailwind a mais. **Pare**. Cada elemento e cada classe precisa pagar pelo seu lugar. JSX limpo é fundamental — quem lê depois (humano ou Claude) entende a intenção pelo formato, não escava entre wrappers.

### Antes de adicionar uma `<div>`, pergunte

1. Existe pra layout real (flex/grid/spacing)? Mantenha.
2. Tem semântica de página (`<section>`, `<article>`, `<header>`, `<footer>`, `<nav>`, `<aside>`, `<main>`)? Use o elemento certo, não div.
3. Existe só pra agrupar JSX? Troque por **Fragment** (`<>...</>`).
4. Existe só pra aplicar uma classe num filho? Passe a classe pro filho direto.

Se a resposta não é #1 ou #2, a div não deveria estar lá.

### Regras

- **Reuse abstrações globais** (`Card`, `Empty`, `Modal`, `ConfirmDialog`, `Field`) em vez de recriar a estrutura delas com divs e classes soltas.
- **Não empilhe wrappers de layout**: um `flex`/`grid` parent geralmente basta. `<div flex><div flex>` é code smell.
- **Sem classe Tailwind redundante**: nada de `w-full` em elemento block-level, `flex-col` num pai que já é `flex-col`, ou `text-foreground` quando é o default.
- **Prefira styling no elemento certo**, não num wrapper criado pra isso. Se precisa de margem num botão, passe `className` no botão (ou ajuste o `gap` do pai).
- **Não comente o que o JSX já diz**. Componente bem nomeado dispensa `{/* Header */}` em cima de `<Header />`.

### Exemplo

❌ Excesso de wrappers e classes redundantes:

```tsx
<div className="flex flex-col gap-4">
  <div>
    <div className="flex items-center">
      <h2 className="text-lg text-foreground">Resumo</h2>
    </div>
    <div className="mt-2">
      <p className="w-full text-sm text-muted-foreground">Visão do dia.</p>
    </div>
  </div>
  <div>
    <Button onClick={save}>Salvar</Button>
  </div>
</div>
```

✓ Enxuto e legível:

```tsx
<section className="space-y-2">
  <Typography variant="h3">Resumo</Typography>
  <Typography variant="muted">Visão do dia.</Typography>
  <Button onClick={save}>Salvar</Button>
</section>
```

A versão enxuta mostra **o que** o bloco é (uma seção de resumo com 3 elementos) sem o leitor precisar mentalmente desempilhar 5 divs.

---

## Error handling

- Trate erros de forma explícita e previsível. Sem falhas silenciosas.
- `try/catch` em operações que podem lançar (I/O, rede, parsing).
- Log com nível apropriado: `warn` para esperado/recuperável, `error` para falha inesperada.
- **Nunca** exponha stack trace ou detalhes técnicos ao usuário final — use toast/mensagens amigáveis em pt-BR.
- Os interceptors do `api` ([`src/services/api`](src/services/api)) já exibem toasts de erro. Não duplique no chamador a menos que o caso exija tratamento específico.
- Sem `catch` vazio que engole erro.

---

## Segurança

- Valide todo input do usuário com Zod no formulário **antes** de enviar à API.
- Nunca confie em dado vindo do servidor sem tipá-lo — defina o shape esperado.
- Não logue dados sensíveis (senhas, tokens, dados pessoais) — nem em `console.log` durante desenvolvimento.
- Não armazene tokens em `localStorage`/`sessionStorage` — a sessão é por cookie HTTP-only.

---

## Performance

- Code-splitting por rota já está em uso (`lazyRouteComponent`) — mantenha o padrão.
- TanStack Query: configure `staleTime` em queries que não precisam refazer a cada navegação. Não use `useEffect` + `fetch`.
- Liste só o necessário: para tabelas grandes, use paginação server-side via [`useDataTableQuery`](src/components/global/dataTable/useDataTableQuery.ts).
- Memoize (`useMemo`/`useCallback`) apenas com benefício mensurável — não por reflexo.

---

## Testes

- Vitest + Testing Library, ambiente `jsdom`.
- Arquivos `*.test.ts(x)` ao lado do código testado (não em pasta separada).
- Setup global em [`src/test/setup.ts`](src/test/setup.ts).
- Escreva teste para lógica não-trivial: utilidades puras, hooks com lógica, regras de negócio, edge cases.
- Teste o caminho de falha, não só o happy path.
- Testes legíveis — eles documentam o comportamento esperado.
- As abstrações globais (`Button`, `Card`, `Empty`, `ConfirmDialog`) já têm testes que cobrem o contrato público — ao mudar a API delas, atualize o teste junto, não depois.

---

## Git e commits

- Conventional Commits: `feat:`, `fix:`, `refactor:`, `chore:`, `docs:`, `test:`.
- Um commit, uma mudança lógica.
- Mensagens em inglês, modo imperativo: `add user session validation` (não `added`/`adding`).
- PRs pequenos e revisáveis. Se não dá para revisar em 30 min, está grande demais.
- Husky + lint-staged rodam ESLint e Prettier no `pre-commit`. O `pre-push` roda `typecheck + test`. Não pule hooks (`--no-verify`) — se um teste/typecheck quebra, conserte; não bypasse.
- Antes de empurrar manualmente, rode `npm run check` (lint + typecheck + test).

---

## Texto de interface (UI)

Todo texto exposto ao usuário em **português brasileiro (pt-BR)**.

- Gramática e acentuação corretas.
- Linguagem clara, objetiva e profissional.
- Evite jargão técnico para usuários operacionais.
  - Correto: `Falha ao salvar o registro. Tente novamente.`
  - Evite: `Unexpected persistence layer failure.`

---

## Design responsivo

**Não esconda colunas, células ou qualquer conteúdo em mobile.** Quando uma tabela (ou área) não cabe na largura, a solução é **scroll lateral** dentro do container — não esconder informação.

- Tabelas largas: `overflow-x-auto` no container imediato do `<table>`. Deixe a `<table>` ficar mais larga que o viewport e rolar horizontalmente.
- Inputs de filtro: `w-full` em mobile (largura fixa só a partir de `sm:`/`md:`).
- **Não use** `hidden`, `md:hidden`, `md:table-cell` para esconder coluna/campo por breakpoint.
- Se a tabela parece cortada e não rola, o problema é um ancestral com `overflow-hidden` ou container com largura indefinida sendo expandido pelo conteúdo — conserte lá, não escondendo dados.

Esconder coluna em mobile é regressão de UX, não responsividade.

---

## Estrutura de pastas

```
src/
├── assets/              # imagens e estáticos importados
├── components/
│   ├── global/          # abstrações da aplicação (card, modal, empty, skeleton, button, form/, layout/, sidebar/, dataTable/)
│   └── ui/              # primitivos shadcn/ui (gerados via CLI — kebab-case)
├── hooks/               # hooks reutilizáveis (tema, sessão, mobile...)
├── lib/                 # utilidades puras (env, datas, forms, queryClient, cn)
├── screens/             # telas; cada uma com seu routes.ts co-localizado
├── services/            # camada de acesso a dados (api, session...)
├── types/               # tipos de domínio compartilhados
├── index.css            # tokens de design (cor da marca, dark mode, paleta)
├── routes.tsx           # árvore de rotas raiz
└── main.tsx             # entrypoint (providers globais)
```

---

## Convenções do projeto

### Imports

- Use o alias `@/` para imports internos (ex.: `@/components/ui/button`, `@/lib/utils`).
- Não use caminhos relativos longos (`../../../`) — troque por `@/`.

### Rotas (TanStack Router code-based)

- Cada tela em `screens/<nome>/` tem seu próprio `routes.ts` com `createRoute` + `lazyRouteComponent`, e é registrada na árvore em [`src/routes.tsx`](src/routes.tsx).
- Rotas protegidas ficam sob `protectedLayoutRoute` (que envolve `SessionValidation` + `Layout`). Login/signup ficam fora dela.
- `defaultPreload: 'intent'` já está ativo — não precise reconfigurar.
- Use `staticData: { breadcrumb: '...' }` para alimentar o breadcrumb global.

Esqueleto para nova tela + rota:

```ts
// src/screens/minha-tela/routes.ts
import { createRoute, lazyRouteComponent } from '@tanstack/react-router';
import { protectedLayoutRoute } from '@/routes';

export const minhaTelaRoute = createRoute({
  getParentRoute: () => protectedLayoutRoute,
  path: '/minha-tela',
  staticData: { breadcrumb: 'Minha tela' },
  component: lazyRouteComponent(() => import('.'), 'MinhaTela'),
});
```

Depois, registre em [`src/routes.tsx`](src/routes.tsx).

### HTTP

- Use a instância `api` de [`src/services/api`](src/services/api) — ela já trata `baseURL`, `withCredentials: true` (cookie) e toasts via interceptors. **Não crie axios direto.**
- Para server state: TanStack Query (`useQuery` / `useMutation`) com o `queryClient` de [`src/lib/queryClient.ts`](src/lib/queryClient.ts). Não use `useEffect` + `fetch`.

**Optimistic updates** — quando a mutação é simples (toggle, delete, edit de campo único) e o servidor raramente recusa, antecipe o resultado no cache pra UI parecer instantânea:

```tsx
const mutation = useMutation({
  mutationFn: api.toggleFollow,
  onMutate: async () => {
    await queryClient.cancelQueries({ queryKey: KEY });
    const previous = queryClient.getQueryData(KEY);
    queryClient.setQueryData(KEY, (prev) => !prev); // mudança otimista
    return { previous }; // snapshot pro rollback
  },
  onError: (_err, _vars, context) => {
    queryClient.setQueryData(KEY, context?.previous); // rollback
    toast.error('Falha ao atualizar.');
  },
  onSettled: () => queryClient.invalidateQueries({ queryKey: KEY }), // revalida
});
```

Veja o padrão demonstrado na story `Padrões/OptimisticUpdate` no Storybook (`npm run storybook`). Use só onde a latência percebida vale o risco de inconsistência momentânea — pra fluxos críticos (pagamento, perfil), prefira o pattern padrão com loading visível.

### Sessão e autenticação

- Sessão por cookie HTTP-only. `SessionValidation` ([`src/components/global/layout/sessionValidation.tsx`](src/components/global/layout/sessionValidation.tsx)) valida antes de renderizar rotas protegidas.
- Usuário fica em `useSessionStore` ([`src/hooks/useSessionStore.ts`](src/hooks/useSessionStore.ts)) — Zustand.

### Estado global

- Zustand para client state global compartilhado (sessão, tema).
- TanStack Query para server state — não duplique resposta de API no Zustand.
- Estado local de tela: `useState` normal.

### Formulários

- Use `useZodForm` ([`src/lib/forms/useZodForm.ts`](src/lib/forms/useZodForm.ts)) — integra React Hook Form com schema Zod.
- Componentes de campo prontos em [`src/components/global/form/`](src/components/global/form) (`inputField`, `select`, `dateField`, `dateTimeField`, `checkbox`, `switch`, `textArea`, `multiSelect`).
- Todos seguem o mesmo padrão: aceitam **uncontrolled** (`{...register('campo')}` + `errors`) **ou controlled** (`control` + `name` + opcional `rules`/`defaultValue`). Discriminated union impede misturar os dois modos.
- Veja [`src/screens/session/login.tsx`](src/screens/session/login.tsx) e a story `Formulário/Formulário completo` no Storybook como referência.

### Variáveis de ambiente

- Validadas em [`src/lib/env.ts`](src/lib/env.ts) com Zod no boot — falha rápido se faltar.
- Ao adicionar uma env, declare-a no schema **e** em [`.env.example`](.env.example).
- Variáveis devem começar com `VITE_` para serem expostas ao cliente.

### Notificações

- `sonner` (Toaster montado no `Layout`). Os interceptors do `api` já disparam toasts de erro — não duplique no caller.

### shadcn/ui

- Adicione componentes via CLI: `npx shadcn@latest add <nome>`. **Não escreva à mão.**
- Customize `components/ui/<x>.tsx` localmente quando necessário; mas só edite o que foi gerado pelo shadcn.
- **Componentes próprios (não-shadcn) ficam em `components/global/`, não em `components/ui/`.** Exemplo: o primitivo `MultiSelect` é escrito à mão e vive em [`global/form/multiSelectPrimitive.tsx`](src/components/global/form/multiSelectPrimitive.tsx), ao lado do wrapper integrado ao `react-hook-form`.
- Wrappers genéricos só com ganho real (API simplificada, default visual do projeto, integração com `react-hook-form`). Quando criar um, siga o padrão em **Abstrações globais** abaixo.
- Use `cn()` de [`src/lib/utils.ts`](src/lib/utils.ts) para concatenar classes do Tailwind.

### Abstrações globais (`components/global/`)

Wrappers sobre primitivos do shadcn que padronizam API, defaults visuais (incluindo dark mode) e integração com `react-hook-form`. Use estes antes de cair direto no `components/ui/`:

| Abstração       | Caminho                                                                                    | Quando usar                                                                                                                                                                           |
| --------------- | ------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Card`          | [`card/card.tsx`](src/components/global/card/card.tsx)                                     | Container de conteúdo com `title` + `description` + `children`. Já trata `bg-card`, borda, `shadow-sm` (light) e `dark:shadow-none`.                                                  |
| `Modal`         | [`modal/modal.tsx`](src/components/global/modal/modal.tsx)                                 | Dialog no desktop, drawer no mobile. Props: `title`, `description`, `children`, `open`, `setOpen`.                                                                                    |
| `Empty`         | [`empty/empty.tsx`](src/components/global/empty/empty.tsx)                                 | Empty state. Props: `title`, `description` (obrigatórios), `icon`, `children` (opcionais).                                                                                            |
| `Skeleton*`     | [`skeleton/skeleton.tsx`](src/components/global/skeleton/skeleton.tsx)                     | `SkeletonText`, `SkeletonValue`, `SkeletonBadge`, `SkeletonAvatar`. **Skeleton só no dado, nunca no card inteiro** — rótulos, títulos e estrutura permanecem visíveis durante o load. |
| `Button`        | [`button/button.tsx`](src/components/global/button/button.tsx)                             | Estende o Button do shadcn com prop `loading` — exibe spinner antes do label e desabilita o botão automaticamente. Mantém todas as variantes/props do primitivo.                      |
| `ConfirmDialog` | [`confirmDialog/confirmDialog.tsx`](src/components/global/confirmDialog/confirmDialog.tsx) | Confirmação para ações destrutivas/reversíveis. **Uncontrolled** (`trigger` prop, estado interno) ou **controlled** (`open`/`setOpen`). Loading interno automático e auto-close.      |
| `PageHeader`    | [`pageHeader/pageHeader.tsx`](src/components/global/pageHeader/pageHeader.tsx)             | Cabeçalho padrão de tela: `title`, `description`, `actions` opcional. Usado em `home/`.                                                                                               |

**Padrão para criar uma nova abstração global:**

- Pasta `components/global/<nome>/<nome>.tsx`, export nomeado, interface prefixada com `I`.
- Importe o primitivo como `XPrimitive` (ex.: `Card as CardPrimitive`) para evitar shadowing.
- Mantenha a API minimalista: props essenciais como obrigatórias, extras como opcionais.
- Para componentes de formulário ou de "abre/fecha", espelhe o padrão de `inputField.tsx` / `switch.tsx` / `confirmDialog.tsx`: modo **uncontrolled** + modo **controlled** via discriminated union. Discrimine via `'prop' in props` — nunca via `prop !== undefined`. Quando uma das variantes declarar `prop?: never`, o `'prop' in props` sozinho não narrowed para TS; nesses casos, encapsule num **type guard** com type predicate. Padrão usado em todos os fields e no `ConfirmDialog`:

```ts
function isControlled<TFieldValues, TName>(
  props: FieldProps<TFieldValues, TName>
): props is ControlledFieldProps<TFieldValues, TName> {
  return 'control' in props;
}

export function Field(props: FieldProps<...>) {
  if (isControlled(props)) {
    return <ControlledField {...props} />;
  }
  return <FieldBase {...props} />;
}
```

**Confirmações de ação (delete, publicar, arquivar)**: use `ConfirmDialog` com modo uncontrolled — dispensa `useState` no consumidor:

```tsx
<ConfirmDialog
  title="Excluir registro?"
  description="Esta ação não pode ser desfeita."
  confirmLabel="Excluir"
  destructive
  trigger={<Button variant="destructive">Excluir</Button>}
  onConfirm={async () => {
    await api.delete(`/records/${id}`);
    toast.success('Registro excluído.');
  }}
/>
```

O dialog fica aberto enquanto `onConfirm` resolve (botão com spinner via `loading`), fecha em sucesso e permanece aberto se a promise lançar — deixe o erro propagar pro interceptor do `api` (que já mostra o toast).

### Cor da marca e tema

A cor primária do sistema vive em **uma única variável** no topo de [`src/index.css`](src/index.css):

```css
:root {
  --brand: oklch(0.488 0.243 264.376); /* azul atual */
  --brand-foreground: oklch(0.97 0.014 254.604);
}
.dark {
  --brand: oklch(0.424 0.199 265.638); /* mesma marca, tonada */
}
```

`--primary`, `--primary-foreground`, `--sidebar-primary` e `--sidebar-primary-foreground` são apenas aliases (`var(--brand)`) — não duplicar valores. Pra trocar a marca em um novo projeto, mude apenas `--brand` (light + dark).

**Não fazem parte da marca**: `--ring`/`--sidebar-ring` (neutros, convenção shadcn), `--chart-1..5` (paleta separada, 5 tons harmonizados), e os tokens neutros (background, border, muted, etc.).

**Dark mode em superfícies "card-like"**: use `bg-card` em vez de `bg-background` (o `.dark` já clareia `--card` em relação ao `--background` pra dar elevação) e adicione `dark:shadow-none` — sombras não rendem em fundo escuro. O `Card` global já faz isso automaticamente.

### Tipografia

- Use o componente [`Typography`](src/components/ui/typography.tsx) para textos do sistema (headings de página, parágrafos, labels). Variantes: `hero`, `h1`, `h2`, `h3`, `lead`, `p`, `small`, `muted`.
- `as` aceita o elemento HTML semântico independente do styling (ex.: `<Typography as="h1" variant="h3">` para uma h1 com peso visual de h3).
- Não use a classes `text-{size} font-{weight} text-muted-foreground` manualmente quando uma variante já bate — isso garante consistência visual entre telas.
- Texto dentro de primitivos shadcn (`CardTitle`, `EmptyTitle`, `FieldLabel`, `Badge`) já tem tipografia interna — não envolver com `Typography`.

### Datas

- Utilitários em [`src/lib/dateTime/`](src/lib/dateTime) cobrem parsing/formatação para inputs e queries (`transformIntoInputDate`, `transformIntoDatabaseDate`, `transformIntoDatabaseQueryDate`, `dateFormatter`). Reaproveite — não importe `date-fns` direto em telas.

### DataTable

- Padrão de tabela com paginação/filtro server-side em [`src/components/global/dataTable/`](src/components/global/dataTable). Use [`useDataTableQuery`](src/components/global/dataTable/useDataTableQuery.ts) (estado da URL via [`useDataTableUrlQuery`](src/components/global/dataTable/useDataTableUrlQuery.ts)).
- Empty state automático: quando não há resultados e há filtros ativos, exibe um `Empty` com botão "Limpar filtros" que dispara `onSearch({})`. Sem filtros, mostra "Ainda não há registros para exibir.".
- Exemplo vivo: story `DataTable/ServerSide` no Storybook.

### Storybook (demos de componentes)

Cada componente global tem uma story co-localizada (`button/button.stories.tsx`, etc.) com uma única "Vitrine" mostrando todas as variações em um só lugar. Rode com `npm run storybook` (porta 6006).

- Stories vivem ao lado do componente, mesmo padrão dos arquivos de teste.
- Cada vitrine envolve as variações em `Card` global com título + descrição explicativa.
- Composições maiores (`DataTable`, `Form completo`, `CRUD`, `OptimisticUpdate`) ficam em [`src/stories/`](src/stories).
- Configuração: [`.storybook/main.ts`](.storybook/main.ts) e [`.storybook/preview.tsx`](.storybook/preview.tsx) (já injetam `ThemeProvider`, `QueryClient` e `Toaster`).

---

## Scripts

| Script               | O que faz                          |
| -------------------- | ---------------------------------- |
| `npm run dev`        | Servidor de desenvolvimento (Vite) |
| `npm run build`      | Typecheck + build de produção      |
| `npm run preview`    | Pré-visualiza o build              |
| `npm run lint`       | ESLint                             |
| `npm run format`     | Prettier (escrita)                 |
| `npm run typecheck`  | `tsc -b`                           |
| `npm test`           | Vitest run                         |
| `npm run test:watch` | Vitest watch                       |
| `npm run check`      | Lint + typecheck + test            |
| `npm run clean`      | Remove `dist/` e caches            |

---

## Ambiente

- Windows (PowerShell). Em comandos shell use sintaxe PS (`$env:VAR`, `$null`, sem `&&` em PS 5.1).
- Node >= 22 (versão fixa do template; CI roda em Node 22).
- `npm` (lockfile `package-lock.json`).
