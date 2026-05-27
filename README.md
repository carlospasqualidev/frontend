# Frontend Template

Template base para iniciar novos projetos de frontend, com uma stack moderna já
configurada (roteamento type-safe, UI, formulários validados, estado, data
fetching, testes, lint e hooks de commit).

## Stack

| Área          | Ferramenta                                                   |
| ------------- | ------------------------------------------------------------ |
| Build / Dev   | [Vite](https://vite.dev) 7                                   |
| UI            | React 19 + TypeScript                                        |
| Estilo        | Tailwind CSS v4 + [shadcn/ui](https://ui.shadcn.com) (Radix) |
| Roteamento    | [TanStack Router](https://tanstack.com/router) (code-based)  |
| Data fetching | [TanStack Query](https://tanstack.com/query)                 |
| Estado global | [Zustand](https://zustand-demo.pmnd.rs)                      |
| Formulários   | React Hook Form + [Zod](https://zod.dev)                     |
| HTTP          | Axios (instância em `services/api`)                          |
| Notificações  | [Sonner](https://sonner.emilkowal.ski)                       |
| Testes        | Vitest + Testing Library                                     |
| Qualidade     | ESLint + Prettier + Husky + lint-staged                      |

## Requisitos

- Node.js >= 22 (ou 20.19+)
- npm

## Começando

```bash
npm install
cp .env.example .env   # ajuste as variáveis
npm run dev
```

## Scripts

| Script               | Descrição                          |
| -------------------- | ---------------------------------- |
| `npm run dev`        | Servidor de desenvolvimento        |
| `npm run build`      | Typecheck + build de produção      |
| `npm run preview`    | Pré-visualiza o build              |
| `npm run lint`       | ESLint                             |
| `npm run format`     | Prettier (escrita)                 |
| `npm run typecheck`  | Checagem de tipos (`tsc --noEmit`) |
| `npm test`           | Executa a suíte de testes uma vez  |
| `npm run test:watch` | Testes em modo watch               |

## Variáveis de ambiente

As variáveis são validadas na inicialização em [`src/lib/env.ts`](src/lib/env.ts).
Se algo estiver ausente ou malformado, o app falha rápido com mensagem clara.
Ao adicionar uma env, declare-a no schema **e** em [`.env.example`](.env.example).

| Variável                   | Obrigatória | Descrição                                 |
| -------------------------- | ----------- | ----------------------------------------- |
| `VITE_API_URL`             | sim         | URL base da API                           |
| `VITE_PROJECT_NAME`        | não         | Nome do projeto (logs de erro)            |
| `VITE_PROJECT_ENVIRONMENT` | não         | Ambiente lógico (ex.: Sandbox/Production) |
| `VITE_PROJECT_SIDE`        | não         | Lado da app (ex.: Client/Backoffice)      |
| `VITE_ERROR_LOG_URL`       | não         | Endpoint de reporte de erros (só em PROD) |

## Estrutura de pastas

```
src/
├── assets/             # imagens e estáticos importados
├── components/
│   ├── global/         # componentes da aplicação (layout, sidebar, forms, modal...)
│   └── ui/             # componentes shadcn/ui (gerados via CLI)
├── hooks/              # hooks reutilizáveis (tema, sessão, mobile...)
├── lib/                # utilidades puras (env, datas, forms, queryClient, cn)
├── screens/            # telas, cada uma com seu `routes.ts` co-localizado
├── services/           # camada de acesso a dados (api, session...)
├── types/              # tipos compartilhados de domínio
├── routes.tsx          # árvore de rotas raiz
└── main.tsx            # entrypoint (providers globais)
```

### Convenções

- Imports internos usam o alias `@/` (ex.: `@/components/ui/button`).
- Componentes do shadcn em `components/ui` mantêm o padrão `kebab-case`.
- Código próprio usa `camelCase` para arquivos `.ts`/`.tsx`.
- Cada tela em `screens/` expõe suas rotas em um `routes.ts` próprio, montado em
  `src/routes.tsx`.

## Padrões

### Adicionar um componente shadcn/ui

```bash
npx shadcn@latest add button
```

### Nova tela + rota

1. Crie `src/screens/minha-tela/index.tsx` exportando o componente.
2. Crie `src/screens/minha-tela/routes.ts` com `createRoute`, usando
   `lazyRouteComponent` para code-splitting:

   ```ts
   import { createRoute, lazyRouteComponent } from '@tanstack/react-router';
   import { protectedLayoutRoute } from '@/routes';

   export const minhaTelaRoute = createRoute({
     getParentRoute: () => protectedLayoutRoute,
     path: '/minha-tela',
     staticData: { breadcrumb: 'Minha tela' },
     component: lazyRouteComponent(() => import('.'), 'MinhaTela'),
   });
   ```

3. Registre a rota na árvore em `src/routes.tsx`.

### Formulários

Use o hook tipado `useZodForm` ([`src/lib/forms/useZodForm.ts`](src/lib/forms/useZodForm.ts)),
que integra React Hook Form com um schema Zod. Veja
[`src/screens/session/login.tsx`](src/screens/session/login.tsx) como referência.

### Requisições

Use a instância `api` ([`src/services/api`](src/services/api)) — ela já trata
`baseURL`, cookies (`withCredentials`) e toasts de sucesso/erro via interceptors.
Para dados de servidor, prefira TanStack Query (`useQuery`/`useMutation`) com o
`queryClient` de [`src/lib/queryClient.ts`](src/lib/queryClient.ts).

### Autenticação

A sessão é baseada em cookie. `SessionValidation` valida a sessão antes de
renderizar as rotas protegidas; o usuário fica em `useSessionStore` (Zustand).

## Testes

Vitest + Testing Library, ambiente `jsdom`. Arquivos `*.test.ts(x)` ao lado do
código. Setup global em [`src/test/setup.ts`](src/test/setup.ts).

```bash
npm test
```
