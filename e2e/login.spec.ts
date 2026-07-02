import { expect, test } from '@playwright/test';

// Spec de exemplo/referência para novos E2E. Exercita a tela de login pelas
// mesmas affordances que o usuário usa: role + nome acessível, nunca seletor
// de implementação (classe CSS, testid) quando existe role natural.
test.describe('Login', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('renderiza o formulário de login', async ({ page }) => {
    await expect(
      page.getByRole('heading', { name: 'Bem-vindo de volta' })
    ).toBeVisible();
    await expect(page.getByLabel('E-mail')).toBeVisible();
    await expect(page.getByLabel('Senha')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Entrar' })).toBeVisible();
  });

  test('valida e-mail inválido antes de enviar', async ({ page }) => {
    await page.getByLabel('E-mail').fill('email-invalido');
    await page.getByLabel('Senha').fill('123456');
    await page.getByRole('button', { name: 'Entrar' }).click();

    await expect(page.getByText('Informe um e-mail válido.')).toBeVisible();
  });

  test('navega para a tela de criar conta', async ({ page }) => {
    await page.getByRole('link', { name: 'Criar conta' }).click();

    await expect(page).toHaveURL(/\/signup$/);
  });
});
