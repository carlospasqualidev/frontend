import { expect, test } from '@playwright/test';

import { login } from './helpers/session';

// Configurações do sistema (`/settings`) — formulário agrupado por módulo no
// padrão "salvar aparece quando há mudança". Cobre: navegar → ver os grupos →
// editar um campo → salvar → confirmar sucesso e volta a pristine.
test.describe('Configurações', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await page.goto('/settings');
  });

  test('exibe os grupos de configuração', async ({ page }) => {
    await expect(page.getByText('Geral', { exact: true })).toBeVisible();
    await expect(page.getByLabel('Nome da aplicação')).toBeVisible();
  });

  test('salvar só aparece quando há mudança e o form volta a pristine ao salvar', async ({
    page,
  }) => {
    const nome = page.getByLabel('Nome da aplicação');
    await expect(nome).toBeVisible();

    // Pristine: nenhuma ação de salvar no topo.
    await expect(page.getByRole('button', { name: 'Salvar alterações' })).toHaveCount(0);

    // Editar torna o form dirty → aparece Descartar + Salvar alterações.
    await nome.fill('Produto Renomeado');
    const salvar = page.getByRole('button', { name: 'Salvar alterações' });
    await expect(salvar).toBeVisible();
    await expect(page.getByRole('button', { name: 'Descartar' })).toBeVisible();

    await salvar.click();

    // Sucesso e retorno ao estado pristine (as ações somem).
    await expect(page.getByText('Configurações atualizadas com sucesso.')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Salvar alterações' })).toHaveCount(0);
  });

  test('descartar reverte a alteração', async ({ page }) => {
    const nome = page.getByLabel('Nome da aplicação');
    const original = await nome.inputValue();

    await nome.fill('Valor Temporário');
    await page.getByRole('button', { name: 'Descartar' }).click();

    await expect(nome).toHaveValue(original);
    await expect(page.getByRole('button', { name: 'Salvar alterações' })).toHaveCount(0);
  });
});
