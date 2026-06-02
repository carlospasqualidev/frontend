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

### Inspirações de design e organização

Para decisões de UX, layout ou organização de tela, siga esta ordem:

1. **Procure primeiro no próprio projeto.** Antes de inventar, varra `src/screens/`, `src/components/global/` e o Storybook (`npm run storybook`) atrás de algo equivalente. Replique pasta, abstração e cadência visual que já existem (`PageActions`, `Card`, `Tabs` variant `line`, `DataTable`, organização em pastas por aba). Padronização interna **sempre** vence preferência individual — uma tela nova deve parecer parte do sistema, não um experimento isolado.
2. **Quando não houver referência interna, inspire-se em sistemas consolidados** (GitHub, Linear, Vercel Dashboard, Stripe Dashboard, Notion). Use-os para preencher lacunas — _como_ eles organizam abas de settings, _onde_ eles colocam ações primárias, _como_ eles paginam. Adapte para as abstrações deste projeto; não copie estrutura paralela ("trouxe um header novo do GitHub" em vez de usar `PageActions` é regressão de padronização).
3. **Se a decisão vai virar padrão para outras telas, documente.** Quando você introduz uma nova convenção que se repetirá (ex.: slot global de `PageActions`, organização em pasta por aba), registre brevemente em `CLAUDE.md` para que a próxima sessão (humana ou Claude) já chegue alinhada.

Resumo: **consistência interna > inspiração externa > improvisar do zero.**

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
- **Prefira utilitários da escala Tailwind à notação em pixel**. A escala do Tailwind (1 = 0.25rem = 4px) cobre praticamente todo caso de UI — use ela em vez de bracket notation com `px`. Valores arbitrários quebram a escala, descalibram o ritmo visual entre componentes e o ESLint do projeto sinaliza casos comuns (`min-h-[4px]` → `min-h-1`).
  - ❌ `min-h-[4px]` · `w-[16px]` · `size-[20px]` · `gap-[8px]` · `mt-[12px]`
  - ✓ `min-h-1` · `w-4` · `size-5` · `gap-2` · `mt-3`
  - Bracket notation só para valores fora da escala (ex.: `min-w-[260px]` em uma coluna específica de tabela, `top-[3px]` para ajuste óptico fino).
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

### LGPD e dados pessoais (PII)

Produto pt-BR opera sob a LGPD. Considere PII e **proibido logar** em qualquer canal (console, Sentry/breadcrumb, analytics, query string da URL, body de erro exibido ao usuário, payload de toast):

- **Identificadores pessoais**: nome completo, CPF, CNPJ (de pessoa física), RG, CNH, passaporte, título de eleitor, PIS.
- **Contato**: e-mail, telefone, endereço, CEP.
- **Credenciais e sessão**: senha (em qualquer forma — texto puro, hash, parcial), token de API, cookie de sessão, código 2FA, perguntas de recuperação.
- **Financeiro**: número de cartão (mesmo mascarado), CVV, dados bancários, conta, chave PIX.
- **Sensíveis (art. 5º, II)**: dados de saúde, biometria, origem racial, religião, opinião política, orientação sexual.

Regras práticas:

- **Erros de API**: o interceptor do `api` exibe mensagem amigável — não relogue o objeto de erro cru no `console.error` de produção. Em dev, OK, desde que o `.env.local` não vá pro repo.
- **Query string nunca leva PII** (`?email=foo@bar.com` aparece em log de servidor, histórico do navegador, referer). Use POST body.
- **URL de tela pode conter ID opaco** (`/users/abc123`), nunca CPF na URL.
- **Toast/erro ao usuário não ecoa o input**: `"Falha ao salvar."` em vez de `"Falha ao salvar o usuário ${nome} (CPF ${cpf})."`.
- **Form com PII** (cadastro, perfil): se for usar `react-hook-form` devtools/Storybook, garanta que defaultValues não foram commitados com dado real.
- **Storybook e mocks**: dados de exemplo são fictícios — não cole CPF/e-mail real "porque é só pra testar".

---

## Performance

- Code-splitting por rota já está em uso (`lazyRouteComponent`) — mantenha o padrão.
- TanStack Query: configure `staleTime` em queries que não precisam refazer a cada navegação. Não use `useEffect` + `fetch`.
- Liste só o necessário: para tabelas grandes, use paginação server-side via [`useDataTableQuery`](src/components/global/dataTable/useDataTableQuery.ts).
- Memoize (`useMemo`/`useCallback`) apenas com benefício mensurável — não por reflexo.

---

## Testes

- Vitest + Testing Library, ambiente `jsdom`.
- Todos os testes vivem em [`src/tests/`](src/tests), organizados em pastas — uma pasta por componente/módulo, com o arquivo `<name>.test.ts(x)` dentro. Espelha o agrupamento usado nas stories.
- Setup global em [`src/tests/setup.ts`](src/tests/setup.ts) (referenciado em [`vitest.config.ts`](vitest.config.ts)).
- O componente/módulo é importado via alias `@/...`, nunca por caminho relativo.

```
src/tests/
├── setup.ts
├── globais/<component>/<name>.test.tsx     # abstrações de components/global/
│   ├── button/button.test.tsx
│   ├── card/card.test.tsx
│   ├── dataTable/{dataTable,dataTableSearch,useDataTableQuery}.test.tsx
│   └── form/<field>/<field>.test.tsx
├── hooks/<hook>/<hook>.test.tsx
├── lib/<grupo>/<arquivo>.test.ts
└── services/<servico>/<arquivo>.test.ts
```

- Escreva teste para lógica não-trivial: utilidades puras, hooks com lógica, regras de negócio, edge cases.
- Teste o caminho de falha, não só o happy path.
- Testes legíveis — eles documentam o comportamento esperado.
- As abstrações globais (`Button`, `Card`, `Empty`, `ConfirmDialog`) já têm testes que cobrem o contrato público — ao mudar a API delas, atualize o teste junto, não depois.

### Como escrever testes (práticas)

Três regras pegam 90% da qualidade de teste:

**1. Use `userEvent`, não `fireEvent`.** `userEvent` simula a sequência real (`pointerdown` → `focus` → `input` → `change` → `blur`) e dispara handlers que o `fireEvent` pula. `fireEvent.click` em um botão controlado por React Hook Form não dispara `onBlur` e o erro de validação não aparece. Importe sempre de `@testing-library/user-event`.

```ts
const user = userEvent.setup();
await user.type(screen.getByLabelText('E-mail'), 'foo@bar.com');
await user.click(screen.getByRole('button', { name: 'Entrar' }));
```

**2. Prefira `getByRole` / `findByRole` a `getByTestId`.** Role + accessible name é como o usuário (e o leitor de tela) encontra o elemento — se o teste passa por role, a acessibilidade do componente também passou. `data-testid` é fallback para casos sem role natural (containers genéricos, elementos puramente visuais).

```ts
✓ screen.getByRole('button', { name: 'Salvar' });
✓ screen.getByRole('textbox', { name: 'E-mail' });
✓ screen.getByRole('alert');                          // erro de validação, toast
✗ screen.getByTestId('save-button');                  // só se não houver role
```

Ordem de prioridade (segue Testing Library): `getByRole` → `getByLabelText` (forms) → `getByPlaceholderText` → `getByText` → `getByDisplayValue` → `getByTestId`.

**3. `findBy*` para async, não `await waitFor(() => getBy*)`.** `findBy*` já é `waitFor` + `getBy` — mais curto, mais legível, mensagem de erro melhor.

```ts
✓ await screen.findByText('Registro salvo.');
✗ await waitFor(() => expect(screen.getByText('Registro salvo.')).toBeInTheDocument());
```

Use `waitFor` apenas para asserções que não são "elemento apareceu" (ex.: `expect(mock).toHaveBeenCalledWith(...)`).

**Outras práticas:**

- **`queryBy*` para asserção negativa** (`expect(queryByText('...')).not.toBeInTheDocument()`). Nunca use `getBy*` esperando ausência — ele lança.
- **Não mocke o que você está testando.** Mocke serviços externos (`api`, `toast`), não o próprio componente nem os fields globais.
- **Wrapper de teste centralizado**: queries do TanStack Query, router e theme provider devem vir de um helper em `src/tests/` para não repetir setup em cada teste.
- **Factories de dados** (`makeUser({ name: 'Maria' })`) co-localizadas no teste ou em `src/tests/factories/` — evita literais gigantes inline.
- **Limpe estado entre testes**: `afterEach(() => queryClient.clear())` quando o teste compartilha cliente.

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

### Acentuação e codificação (evitar mojibake)

**Sempre acentue corretamente.** Texto pt-BR sem acento é erro, não estilo — `usuario`, `nao`, `acao`, `informacoes` viram bug visível para o usuário final. Mesmo em rascunho, mantenha `usuário`, `não`, `ação`, `informações`.

- **Salve arquivos em UTF-8 sem BOM.** Strings literais (`'Não foi possível salvar.'`), comentários, labels, mensagens de erro de schema Zod, títulos de `Card`/`Modal`/`Empty`, tudo em UTF-8 correto.
- **Mojibake é zero-tolerância.** Se você ver `não`, `ã`, `Ã§`, `Ã©`, `â€"`, `?` no lugar de letra acentuada, ou caracteres invertidos `Â`, `Ã`, isso é arquivo lido como Latin-1/CP1252 e escrito como UTF-8 (ou vice-versa). Conserte o arquivo (re-salve em UTF-8) — **não "corrija" o texto trocando por versão sem acento.**
- **No PowerShell (Windows), nunca redirecione texto pt-BR com `>` ou `Out-File` sem `-Encoding utf8`** — o default vira UTF-16 LE com BOM e quebra o build/leitura. Para escrever texto com acento via shell, use as ferramentas `Write`/`Edit` do projeto, não `echo "..." > arquivo`.
- **Caracteres comuns que precisam aparecer corretos**: `á é í ó ú â ê ô ã õ à ç` (minúsculas) e suas maiúsculas. Aspas tipográficas (`" "` `' '`) e travessão (`—`) também são UTF-8 — preserve.
- **Lista mínima de palavras que aparecem direto no produto e precisam estar acentuadas**: ação, não, número, código, válido/inválido, próximo/anterior, página, último, índice, descrição, padrão, série, área, é/está, mês, está, três, após, até, já, só.
- **Atalhos automáticos do editor** (autocorreção que troca `não` por `nao`, configuração regional do shell) são fonte recorrente de regressão. Se você notar um arquivo onde acento sumiu silenciosamente, é provável que tenha sido salvo numa codificação errada — re-salve em UTF-8 antes de continuar editando.

❌ `<Empty title="Nenhum usuario encontrado" description="Tente uma nova busca." />`
✓ `<Empty title="Nenhum usuário encontrado" description="Tente uma nova busca." />`

❌ `z.string().min(1, 'Campo obrigatorio.')`
✓ `z.string().min(1, 'Campo obrigatório.')`

---

## Acessibilidade (a11y)

Radix (via shadcn) dá a base de a11y — foco, ARIA, navegação por teclado. Mas as regressões comuns vêm de **remover** ou **ignorar** o que Radix já entrega. As regras abaixo são o mínimo para uma tela nova não degradar.

- **Nunca remova o `focus-visible:ring`.** Se está atrapalhando o visual, ajuste a cor do ring (`--ring`), não remova. Sem indicador de foco, navegação por teclado fica cega.
- **Toda input precisa de label associada.** Use os fields globais (`InputField`, `Select`, `DateField`...) — eles já geram `<FieldLabel htmlFor>` ↔ `<Input id>`. **Não use `placeholder` como label** — placeholder some quando o usuário começa a digitar e leitor de tela ignora.
- **Botão-ícone exige `aria-label` em pt-BR**. `<Button variant="ghost" size="icon" aria-label="Fechar"><X /></Button>`. Sem isso, o leitor de tela anuncia "botão" sem dizer o quê.
- **Texto sempre dentro do elemento certo.** Não envolva texto em `<div onClick={...}>` — use `<button>` (ou `<Button variant="link">`). Div clicável não é focável por teclado, não tem role de botão, não dispara em `Enter`/`Space`.
- **Imagens precisam de `alt`.** Decorativa: `alt=""` (explícito). Informativa: descrição curta em pt-BR. Avatar: `alt={nome}` com fallback nas iniciais.
- **Contraste mínimo de 4.5:1** para texto sobre fundo (WCAG AA). Os tokens do projeto (`text-foreground` sobre `bg-background`, `text-muted-foreground` sobre `bg-card`) já passam — desvio só com motivo claro.
- **Foco inicial em Modal/Drawer/ConfirmDialog**: Radix põe foco no primeiro elemento focável; se há campo de input principal, garanta que ele seja o primeiro. Em `ConfirmDialog` destrutivo, **foco fica no botão de cancelar**, não no de confirmar (evita confirmação acidental no `Enter`).
- **Toasts (`sonner`)**: já anunciam via `aria-live` por padrão. Não envolva toast em wrapper que sobrescreva role.
- **Listas com seleção/navegação por teclado**: use `role="listbox"` + `role="option"` + `aria-selected`, ou simplesmente reuse `Select` / `MultiSelect` globais que já têm isso.
- **`tabIndex` só quando há motivo.** `tabIndex={0}` em elemento naturalmente focável é redundante; `tabIndex={-1}` só para remover do tab order temporariamente; `tabIndex` positivo (`tabIndex={1}`) **nunca** — quebra a ordem natural do documento.
- **Não esconda conteúdo só para vidente.** `display: none` / `hidden` esconde de todos; para conteúdo só-leitor-de-tela use a classe utilitária `sr-only`. Para esconder do leitor mas manter visível, `aria-hidden="true"`.
- **Animação respeita `prefers-reduced-motion`**: Tailwind tem `motion-safe:` / `motion-reduce:` — use em qualquer animação não-trivial.

---

## Design responsivo

**Não esconda colunas, células ou qualquer conteúdo em mobile.** Quando uma tabela (ou área) não cabe na largura, a solução é **scroll lateral** dentro do container — não esconder informação.

- Tabelas largas: `overflow-x-auto` no container imediato do `<table>`. Deixe a `<table>` ficar mais larga que o viewport e rolar horizontalmente.
- Inputs de filtro: `w-full` em mobile (largura fixa só a partir de `sm:`/`md:`).
- **Não use** `hidden`, `md:hidden`, `md:table-cell` para esconder coluna/campo por breakpoint.
- Se a tabela parece cortada e não rola, o problema é um ancestral com `overflow-hidden` ou container com largura indefinida sendo expandido pelo conteúdo — conserte lá, não escondendo dados.

Esconder coluna em mobile é regressão de UX, não responsividade.

---

## Loading e estados intermediários

**Não substitua a tela por um spinner gigante nem por um skeleton genérico.** Quando algo está carregando, monte a **estrutura final da tela primeiro** e troque **apenas o dado que muda** por skeleton. Cabeçalhos, rótulos, ações, filtros, navegação, breadcrumb — tudo que não muda entre vazio e preenchido continua **visível e interativo**.

### Por quê

Spinner gigante centralizado no lugar do conteúdo:

- **Atrasa a percepção do que a tela é** — o usuário só descobre o layout depois que carrega.
- **Esconde a navegação contextual** (breadcrumb, abas, ações secundárias) que ele poderia usar pra clicar em outro lugar enquanto espera.
- **Provoca CLS** (layout shift) — quando o conteúdo aparece, a estrutura se monta de uma vez e empurra tudo.

Skeleton localizado onde o dado entra:

- O usuário já entende **o que a tela faz** antes dos dados chegarem.
- Mantém a UI **interativa** ao redor (filtros, breadcrumb, ações secundárias).
- Sem layout shift: o espaço final do dado já está reservado.

### Padrões corretos (já no projeto — reuse antes de criar)

- **[`DataTable`](src/components/global/dataTable/dataTable.tsx)** com `isLoading={true}`: header, filtros e paginação **continuam visíveis**; só as células do `<tbody>` viram skeleton, linha-a-linha.
- **[`Skeleton*`](src/components/global/skeleton/skeleton.tsx)** (`SkeletonText`, `SkeletonValue`, `SkeletonBadge`, `SkeletonAvatar`): granulares por design — coloque no lugar **exato** do dado, dentro do card real.
- **[`Button` global](src/components/global/button/button.tsx)** com `loading`: spinner pequeno inline **dentro do botão** que disparou a ação. Esse spinner é localizado, não é "spinner de tela".

Regra adicional: Os skeletons devem ser extraídos para arquivos próprios em vez de serem definidos inline nos `index` ou arquivos de tela. Coloque o skeleton co-localizado com o componente que ele simula (por exemplo: `src/screens/users/userListSkeleton.tsx`) ou em `src/components/global/skeleton/` quando for reutilizável. Nome recomendado: `ComponentSkeleton.tsx` (camelCase para arquivos .tsx do projeto). Cada skeleton novo deve vir acompanhado de uma story e um teste (mesma regra das abstrações globais) para manter a vitrine e a cobertura automatizada. Isso evita poluição do arquivo `index` e melhora legibilidade e reuso.

### Anti-padrões a evitar

- ❌ `<div className="flex min-h-64 items-center justify-center"><Loader2 /></div>` no lugar do conteúdo de uma tela.
- ❌ Envolver tela ou card inteiro num `<Skeleton className="h-full w-full" />` genérico.
- ❌ Skeletonizar rótulos fixos ("Nome", "E-mail", "Status") — eles nunca mudam, não precisam virar bloco cinza.
- ❌ Modal/Drawer que abre e mostra spinner gigante até o form aparecer. Renderize o form com skeleton nos campos.

### Exceções legítimas

Tela cheia com indicador grande **só** quando ainda não existe shell pra mostrar — ex.: [`SessionValidationScreen`](src/components/global/layout/sessionValidationScreen.tsx) durante o boot da app, antes de qualquer rota protegida ter renderizado. Aí o "shell" não existe ainda; branding + barra de progresso é o melhor que dá.

O fallback do `<Suspense>` que carrega chunks de rota (em [`layout.tsx`](src/components/global/layout/layout.tsx)) deve ser **discreto** (barra fina pulsante, dots, ou nada visível) — `defaultPreload: 'intent'` já cobre 99% dos casos; o fallback é só pra cliques antes do hover. Spinner gigante aqui empobrece a navegação.

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
- **Toda rota protegida declara `errorComponent`** — sem isso, um erro lançado no render derruba o app inteiro num fallback genérico. Use o [`ErrorFallback`](src/components/global/errorFallback) global, que mostra mensagem amigável em pt-BR + botão "Tentar novamente" disparando `router.invalidate()` (refaz loaders e remonta a rota).

Esqueleto para nova tela + rota:

```ts
// src/screens/minha-tela/routes.ts
import { createRoute, lazyRouteComponent } from '@tanstack/react-router';
import { protectedLayoutRoute } from '@/routes';
import { ErrorFallback } from '@/components/global/errorFallback';

export const minhaTelaRoute = createRoute({
  getParentRoute: () => protectedLayoutRoute,
  path: '/minha-tela',
  staticData: { breadcrumb: 'Minha tela' },
  component: lazyRouteComponent(() => import('.'), 'MinhaTela'),
  errorComponent: ErrorFallback,
});
```

Depois, registre em [`src/routes.tsx`](src/routes.tsx).

### Organização de telas

`screens/<feature>/index.tsx` deve ficar **enxuto** — apenas o shell da tela: orquestração de abas, layout principal, navegação e chamadas a hooks/serviços. Quando a tela cresce com várias seções lógicas (abas, blocos extensos, dialogs específicos, formulários grandes), **promova para pasta** e separe cada bloco em seu próprio arquivo. Não empilhe `OverviewTab`, `ActivityTab`, `PermissionsTab` etc. num único arquivo gigante.

❌ Tudo num só `userDetails.tsx`:

```tsx
function OverviewTab() { ... }      // 40 linhas
function ActivityTab() { ... }      // 60 linhas
function PermissionsTab() { ... }   // 50 linhas
function SessionsTab() { ... }      // 70 linhas

export function UserDetailsPage() {
  return <Tabs>...</Tabs>;
}
```

✓ Pasta com uma seção por arquivo:

```
screens/users/userDetails/
├── index.tsx              # UserDetailsPage — só o shell, monta as abas
├── overviewTab.tsx        # exporta OverviewTab
├── activityTab.tsx        # exporta ActivityTab
├── permissionsTab.tsx     # exporta PermissionsTab
└── sessionsTab.tsx        # exporta SessionsTab
```

Cada arquivo exporta apenas o seu componente público. Helpers privados (constantes de ícones, sub-componentes usados em uma única seção, type guards locais) ficam **dentro do arquivo onde são usados**, não num `utils.ts` compartilhado por reflexo. Utilitários compartilhados entre lista e detalhe (ex.: `getInitials`, mapas de variante de `Badge`) vivem ao lado do `routes.ts` da feature (`screens/<feature>/getInitials.ts`, `screens/<feature>/userBadges.ts`).

O `lazyRouteComponent(() => import('./userDetails'), 'UserDetailsPage')` continua funcionando sem mudança — o resolver acha `userDetails/index.tsx` automaticamente.

O mesmo padrão vale para a lista (`index.tsx` da feature) quando ela ganha extensão: extraia colunas, filtros e células custom para arquivos próprios em vez de inflar o componente da página.

**Não embrulhe a tela inteira num wrapper de spacing/padding.** O [`Layout`](src/components/global/layout/layout.tsx) global já aplica `space-y-4` ao container que recebe `children`, então os filhos diretos do componente da tela (`<PageHeader />`, `<section>`, `<Tabs>`, grids) **já ficam espaçados automaticamente**. Adicionar `<div className="space-y-6">…</div>` (ou outro `space-y-*` / `p-*`) na raiz da tela é redundante, descalibra o ritmo visual entre telas e empilha uma `<div>` à toa.

❌ Wrapper redundante:

```tsx
export function DashboardPage() {
  return (
    <div className="space-y-6">           {/* o Layout já faz isso */}
      <PageHeader ... />
      <StatsGrid />
      <ActivityChart />
    </div>
  );
}
```

✓ Filhos soltos sob um Fragment (`<>` somente se houver `<PageActions>` ou múltiplos irmãos):

```tsx
export function DashboardPage() {
  return (
    <>
      <PageActions>...</PageActions>
      <PageHeader ... />
      <StatsGrid />
      <ActivityChart />
    </>
  );
}
```

Só introduza um wrapper na raiz quando precisar de um comportamento de layout real que o Layout não cobre — ex.: a tela quer ocupar 100% da altura disponível (`flex h-full min-h-0 flex-col`, como na lista de usuários). Nesse caso, o wrapper paga pelo seu lugar; spacing puro não.

### HTTP

- Use a instância `api` de [`src/services/api`](src/services/api) — ela já trata `baseURL`, `withCredentials: true` (cookie) e toasts via interceptors. **Não crie axios direto.**
- Para server state: TanStack Query (`useQuery` / `useMutation`) com o `queryClient` de [`src/lib/queryClient.ts`](src/lib/queryClient.ts). Não use `useEffect` + `fetch`.

#### Convenção de `queryKey`

`queryKey` é a identidade do dado no cache — ela determina o que é deduplicado, o que é invalidado e o que sobrevive a uma navegação. Sem convenção firme, uma tela invalida `['users']`, outra invalida `['user-list']` e nada bate.

**Use array hierárquico, do mais genérico ao mais específico:**

```ts
['users']; // lista global
['users', { page: 1, search: 'maria' }]; // lista paginada/filtrada
['users', userId]; // detalhe
['users', userId, 'permissions']; // sub-recurso do detalhe
['users', userId, 'sessions']; // outro sub-recurso
```

A regra mental: o primeiro elemento é o **recurso**, o segundo é o **identificador** (ou objeto de filtros), e os elementos seguintes são **sub-recursos**. Filtros vão como objeto (`{ page, search }`), nunca concatenados em string (`['users-page-1-maria']`) — TanStack Query compara estruturalmente.

**Factory por feature.** Para cada feature, exporte um `queryKeys` factory em `screens/<feature>/queryKeys.ts` (ou no arquivo de serviço) — assim a tela, o hook e a mutation falam a mesma língua:

```ts
// screens/users/queryKeys.ts
export const userKeys = {
  all: ['users'] as const,
  list: (filters: UserFilters) => [...userKeys.all, filters] as const,
  detail: (id: string) => [...userKeys.all, id] as const,
  permissions: (id: string) => [...userKeys.detail(id), 'permissions'] as const,
};
```

**Invalidação: invalide o prefixo certo, não o mundo.** `invalidateQueries({ queryKey: userKeys.all })` invalida tudo que começa com `['users']` — lista, detalhe, sub-recursos. Use isso para "alguma coisa no domínio mudou, recarregue". Para invalidação cirúrgica, passe a key mais específica.

```ts
// editou permissões de um usuário
queryClient.invalidateQueries({ queryKey: userKeys.permissions(id) }); // só esse sub-recurso
// criou usuário novo
queryClient.invalidateQueries({ queryKey: userKeys.all }); // refaz lista e qualquer detalhe stale
```

**Nunca chame `invalidateQueries()` sem args** — invalida o cache inteiro e derruba todas as telas montadas.

**`setQueryData` vs `invalidateQueries`**: se você já tem a resposta da API em mãos (POST que retorna o registro criado), use `setQueryData(userKeys.detail(id), data)` para popular o cache sem ida ao servidor. `invalidate` é para forçar refetch quando não temos o dado novo.

#### Toda tela usa TanStack Query

Qualquer dado vindo do servidor entra na tela via **TanStack Query** — sem exceção. Não há `useEffect` + `fetch`, não há `useState` espelhando resposta de API, não há `axios` chamado direto no `onClick`. Isso não é preferência estética: o cache compartilhado, deduplicação, refetch em foco, retry, devtools e integração com router só funcionam se **todo mundo** usar a biblioteca.

**Estrutura mínima de uma tela com dados:**

```tsx
const { data, isPending, isError, refetch } = useQuery({
  queryKey: userKeys.list(filters),
  queryFn: () => api.get('/users', { params: filters }).then((r) => r.data),
  staleTime: 30_000,
});

if (isPending) return <UsersListSkeleton />;
if (isError) return <ErrorFallback onRetry={refetch} />;
return <UsersTable rows={data} />;
```

**Técnicas que toda tela deve aplicar quando se aplicarem:**

**1. `staleTime` consciente, não default.** O default do TanStack Query é `staleTime: 0` — qualquer remontagem refetcha. Para uma listagem que muda pouco (catálogo, settings), use `staleTime: 60_000` (1 min) ou mais; para dado volátil (saldo, status em tempo real), `staleTime: 0` é correto. Sem `staleTime` definido, navegar entre telas vira "carregando..." perpétuo.

**2. `staleTime` ≠ `gcTime`.** `staleTime` decide quando o dado é considerado velho (e refetcha em background); `gcTime` decide quando o dado **sai do cache** depois que nenhum componente o usa (default 5 min). Para dados consultados várias vezes na mesma sessão (perfil do usuário logado), aumente `gcTime` para evitar refetch ao voltar pra uma tela já visitada.

**3. `placeholderData` para paginação/filtro sem flicker.** Em listas paginadas, ao trocar de página o default é "limpar tudo e mostrar skeleton". Com `placeholderData: keepPreviousData` (ou função custom), a tela mantém os dados anteriores enquanto a nova página carrega — sem layout jumping. Já usado em `useDataTableQuery`; replique em listas custom.

```ts
import { keepPreviousData } from '@tanstack/react-query';
useQuery({ queryKey, queryFn, placeholderData: keepPreviousData });
```

**4. `enabled` para queries dependentes.** Quando uma query depende de outra (`useQuery` do detalhe depende do `id` que veio da rota), nunca chame com `id` vazio — passe `enabled: !!id`. Sem isso, a query roda com `undefined` e a API retorna 404.

```ts
useQuery({
  queryKey: userKeys.detail(id),
  queryFn: () => api.get(`/users/${id}`).then((r) => r.data),
  enabled: !!id,
});
```

**5. Prefetch em hover / loader de rota.** `defaultPreload: 'intent'` do TanStack Router já dispara prefetch do **chunk** ao passar o mouse — mas **não** prefetcha os dados. Para tela rápida sem skeleton, prefetch o dado em paralelo:

```ts
// no routes.ts da tela
loader: ({ params }) =>
  queryClient.prefetchQuery({
    queryKey: userKeys.detail(params.id),
    queryFn: () => api.get(`/users/${params.id}`).then((r) => r.data),
  }),
```

Quando o usuário chega na tela, o `useQuery` encontra o cache pronto e renderiza sem loading.

**6. Mutations expõem estado, não inventam.** Use `isPending`, `error`, `isSuccess` da `useMutation` — não crie `useState('loading' | 'idle')` paralelo. O `Button` global aceita `loading={mutation.isPending}` direto.

```tsx
const mutation = useMutation({ mutationFn: api.createUser });
<Button loading={mutation.isPending} onClick={() => mutation.mutate(data)}>
  Criar
</Button>;
```

**7. Invalide na hora certa.** Após mutation, invalide a key afetada em `onSuccess` (ou `onSettled` se a UI precisa esperar o refetch antes do próximo passo). Veja a subseção "Convenção de `queryKey`" acima.

**8. `refetchOnWindowFocus`**: ligado por default — bom para dado que envelhece (dashboard, lista de tickets). Para dado caro/raro de mudar, desligue na query específica (`refetchOnWindowFocus: false`), não globalmente.

**9. Deduplicação é automática.** Dois componentes que chamam `useQuery` com a **mesma `queryKey`** ao mesmo tempo disparam **uma** requisição. Aproveite isso: extraia hooks (`useUserDetail(id)`) e use em quantos lugares precisar — não há custo de rede extra.

**10. `useInfiniteQuery` para "carregar mais" / scroll infinito.** Não recrie scroll infinito com `useState([...itens, ...novos])`. `useInfiniteQuery` cuida de paginação cumulativa, `getNextPageParam`, e expõe `fetchNextPage` + `hasNextPage`.

**11. DevTools no dev.** O `@tanstack/react-query-devtools` está disponível — mantenha montado em desenvolvimento (oculto por default). Cache, key, estado de cada query ficam inspecionáveis sem `console.log`.

**Anti-padrões a evitar:**

- ❌ `useState` + `useEffect(() => fetch(...))` — substitua por `useQuery`.
- ❌ `useQuery` dentro de `useEffect` ou dentro de condicional — sempre top-level do componente; use `enabled` para condicionar.
- ❌ `queryKey: ['users']` em duas telas com filtros diferentes — vira mesma entrada de cache e uma sobrescreve a outra.
- ❌ `queryClient.invalidateQueries()` sem args — derruba o cache inteiro.
- ❌ Espelhar `data` em `useState` local — duplica fonte de verdade; consuma `data` direto.
- ❌ Chamar `api.get` no `onClick` para "atualizar a tela" — invalide a queryKey, o `useQuery` refetcha sozinho.

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

#### Cobertura obrigatória com Zod

**Todo formulário precisa ter cada campo coberto por um schema Zod — sem exceção.** A validação acontece **antes** do submit e antes de qualquer chamada à API. O schema é a fonte de verdade do shape e das regras do formulário; nada de validação ad-hoc dentro do `onSubmit` ou em `useState`.

- **Defina um schema por formulário** com `z.object({ ... })` colocando regra apropriada em cada campo (`z.string().min(1, 'Obrigatório')`, `z.string().email('E-mail inválido')`, `z.coerce.number().int().positive()`, etc.). Não deixe campo "solto" — se ele existe no form, ele existe no schema.
- **Mensagens de erro em pt-BR** dentro do próprio schema (`{ message: 'Informe um CPF válido.' }`). Erros do Zod chegam direto nos `errors` dos fields — não reescreva no componente.
- **Tipos derivam do schema**: `type FormData = z.infer<typeof schema>`. Não declare uma `interface` paralela ao schema — quando ela diverge, o form mente.
- **Validações com dependência entre campos** vão em `.refine()` / `.superRefine()` (ex.: `passwordConfirm === password`, `endDate >= startDate`), não em `useEffect`.
- **Transformações de entrada/saída** (máscaras de CPF/telefone, parse de data) ficam no schema via `.transform()` ou nos utilitários de [`src/lib/dateTime/`](src/lib/dateTime). Não duplique no `onSubmit`.
- **Resposta da API que vira valor inicial** (modo edição) também passa por um schema — defina `apiSchema` e use `.parse()` antes de jogar no `defaultValues`. Servidor não é fonte de verdade do shape do cliente.

❌ Validação à mão fora do schema:

```tsx
const onSubmit = (data: FormData) => {
  if (!data.email.includes('@')) {
    toast.error('E-mail inválido');
    return;
  }
  // ...
};
```

✓ Tudo no schema, o form bloqueia o submit sozinho:

```ts
const schema = z.object({
  email: z.string().email('Informe um e-mail válido.'),
  password: z.string().min(8, 'Mínimo de 8 caracteres.'),
});
type FormData = z.infer<typeof schema>;
```

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

Wrappers sobre primitivos do shadcn que padronizam API, defaults visuais (incluindo dark mode) e integração com `react-hook-form`.

**Regra dura: sempre prefira a abstração de `components/global/` antes de importar do `components/ui/`.** O `components/ui/` é o andar do primitivo shadcn cru — ele existe para alimentar o `global/`, não para ser consumido direto pelas telas. Quando você importa `@/components/ui/...` numa tela, você está pulando a camada que padroniza dark mode, espaçamento, integração com `react-hook-form` e tom visual do projeto — e a próxima tela vai parecer diferente da anterior.

- **Antes de importar de `components/ui/`**, varra `components/global/` (incluindo `global/form/`) atrás de equivalente. Se já existe, use o global.
- **Se faltar a abstração**, crie uma nova em `components/global/<nome>/` seguindo o padrão da seção "Padrão para criar uma nova abstração global" abaixo — assim a próxima tela já encontra pronto. Não saia importando `ui/` direto "só por essa vez".
- **Exceções legítimas para importar de `ui/` direto**: (1) você está escrevendo a própria abstração `global/` que envolve aquele primitivo; (2) é um primitivo composicional puro sem equivalente global (ex.: `Tabs`, `Sheet`, `Popover` usados como blocos de layout). Em nenhum caso `Button`, `Card`, `Input`, `Select`, `Dialog`, `Checkbox`, `Switch`, `Textarea` devem ser importados de `ui/` numa tela — todos têm wrapper global.

Use estes antes de cair direto no `components/ui/`:

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
- **Story obrigatória no mesmo PR.** Toda abstração nova em `components/global/<nome>/` precisa entrar acompanhada de `src/stories/globais/<nome>/<nome>.stories.tsx` com vitrine das variações principais (estados: default, loading, error/disabled, com/sem prop opcional). Sem story, a abstração some do radar da próxima sessão — humano ou Claude — e a tela seguinte reinventa o componente.
- **Teste obrigatório no mesmo PR.** Espelhe a story com `src/tests/globais/<nome>/<nome>.test.tsx` cobrindo o contrato público (props obrigatórias, estados, handlers). Veja `button/button.test.tsx` e `confirmDialog/confirmDialog.test.tsx` como referência de profundidade esperada.
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

Todas as stories vivem em [`src/stories/`](src/stories), organizadas em três pastas — uma pasta por componente, com o arquivo `<name>.stories.tsx` dentro. Cada componente tem uma "Vitrine" mostrando todas as variações em um só lugar. Rode com `npm run storybook` (porta 6006).

```
src/stories/
├── Introducao.stories.tsx                    # boas-vindas
├── globais/<component>/<component>.stories.tsx     # abstrações em components/global/
│   ├── button/button.stories.tsx
│   ├── card/card.stories.tsx
│   ├── dataTable/DataTable.stories.tsx
│   ├── pageActions/pageActions.stories.tsx
│   └── form/<field>/<field>.stories.tsx       # inputField, select, dateField...
├── ui-primitivos/<component>/<Component>.stories.tsx  # primitivos shadcn em components/ui/
│   ├── tabs/Tabs.stories.tsx
│   └── typography/Typography.stories.tsx
└── padroes/<padrao>/<Padrao>.stories.tsx      # composições e padrões
    ├── form/Form.stories.tsx                  # formulário completo com Zod
    └── patterns/Patterns.stories.tsx          # OptimisticUpdate, CRUD, etc.
```

- Stories ficam **separadas** do componente (diferente dos `*.test.tsx`, que continuam co-localizados). Isso mantém o source dos componentes enxuto e centraliza a documentação visual.
- Cada vitrine envolve as variações em `Card` global com título + descrição explicativa.
- O componente é importado via alias `@/components/...`, nunca por caminho relativo.
- O título da story (`title:` no `meta`) usa o mesmo prefixo da pasta (`Globais/Button`, `UI primitivos/Tabs`, `Padrões/OptimisticUpdate`).
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
