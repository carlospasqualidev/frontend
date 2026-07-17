import { z } from 'zod';

/*
 * Configurações do sistema — versão TEMPLATE com dados MOCK (não há backend
 * real). O valor trafega sempre como string; `valueType` diz à tela como
 * renderizar/editar. Num projeto real, `fetch`/`update` viram chamadas ao `api`
 * mantendo a mesma assinatura. Aqui o `update` muta o mock em memória, então a
 * alteração "persiste" durante a sessão (até recarregar a página).
 */
const valueTypeSchema = z.enum(['string', 'int', 'float', 'boolean', 'json']);
export type SystemConfigValueType = z.infer<typeof valueTypeSchema>;

const systemConfigSchema = z.object({
  id: z.string(),
  key: z.string(),
  label: z.string(),
  value: z.string(),
  valueType: valueTypeSchema,
  module: z.string(),
  description: z.string().nullable(),
});

export type SystemConfig = z.infer<typeof systemConfigSchema>;

let MOCK_CONFIGS: SystemConfig[] = [
  {
    id: 'cfg_app_name', key: 'app.name', label: 'Nome da aplicação',
    value: 'Meu Produto', valueType: 'string', module: 'GENERAL',
    description: 'Exibido no cabeçalho e nos e-mails do sistema.',
  },
  {
    id: 'cfg_support_email', key: 'app.supportEmail', label: 'E-mail de suporte',
    value: 'suporte@example.com', valueType: 'string', module: 'GENERAL',
    description: 'Destino dos chamados enviados pelos usuários.',
  },
  {
    id: 'cfg_items_per_page', key: 'app.itemsPerPage', label: 'Itens por página',
    value: '25', valueType: 'int', module: 'GENERAL',
    description: 'Tamanho padrão das listagens.',
  },
  {
    id: 'cfg_session_timeout', key: 'security.sessionTimeout', label: 'Expiração da sessão (min)',
    value: '60', valueType: 'int', module: 'SECURITY',
    description: 'Tempo de inatividade até o usuário ser desconectado.',
  },
  {
    id: 'cfg_enforce_2fa', key: 'security.enforce2fa', label: 'Exigir autenticação em duas etapas',
    value: 'false', valueType: 'boolean', module: 'SECURITY',
    description: 'Obriga o segundo fator no login de todos os usuários.',
  },
  {
    id: 'cfg_password_policy', key: 'security.passwordPolicy', label: 'Política de senha (JSON)',
    value: '{\n  "minLength": 8,\n  "requireNumber": true\n}', valueType: 'json', module: 'SECURITY',
    description: 'Regras aplicadas na criação e troca de senha.',
  },
  {
    id: 'cfg_email_enabled', key: 'notifications.email', label: 'Notificações por e-mail',
    value: 'true', valueType: 'boolean', module: 'NOTIFICATIONS',
    description: 'Envia avisos operacionais por e-mail.',
  },
  {
    id: 'cfg_daily_digest', key: 'notifications.dailyDigest', label: 'Resumo diário',
    value: 'false', valueType: 'boolean', module: 'NOTIFICATIONS',
    description: 'Envia um consolidado das atividades do dia.',
  },
  {
    id: 'cfg_webhook_url', key: 'integrations.webhookUrl', label: 'URL de webhook',
    value: 'https://hooks.example.com/inbound', valueType: 'string', module: 'INTEGRATIONS',
    description: 'Endpoint chamado a cada evento relevante.',
  },
];

const MOCK_DELAY_MS = 300;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function fetchSystemConfigs(): Promise<SystemConfig[]> {
  await sleep(MOCK_DELAY_MS);
  return systemConfigSchema.array().parse(MOCK_CONFIGS);
}

export async function updateSystemConfig(id: string, value: string): Promise<void> {
  await sleep(MOCK_DELAY_MS);
  MOCK_CONFIGS = MOCK_CONFIGS.map((config) => (config.id === id ? { ...config, value } : config));
}

// Rótulo pt-BR do módulo dono da configuração (switch — sem indexar objeto por
// variável).
export function systemConfigModuleLabel(module: string): string {
  switch (module) {
    case 'SECURITY':
      return 'Segurança';
    case 'NOTIFICATIONS':
      return 'Notificações';
    case 'INTEGRATIONS':
      return 'Integrações';
    case 'GENERAL':
    default:
      return 'Geral';
  }
}
