import { expect, type Page } from '@playwright/test';

/*
 * Helper de autenticação para os E2E.
 *
 * Este template roda em MODO FAKE de sessão (ver
 * `src/services/session/sessionService.ts`): não há backend, e o `signIn`
 * aceita QUALQUER e-mail válido + senha não-vazia, gravando um cookie de sessão
 * fictício. Portanto o login no E2E é só preencher o formulário — sem seed de
 * banco, sem usuário fixo, sem stack externa.
 *
 * Ao trocar o template pelo backend real, este helper passa a exercitar o login
 * de verdade; mantenha-o como o único ponto de autenticação dos specs.
 */
export async function login(page: Page): Promise<void> {
  await page.goto('/login');
  await page.getByLabel('E-mail').fill('tester@example.com');
  await page.getByLabel('Senha').fill('senha-de-teste');
  await page.getByRole('button', { name: 'Entrar' }).click();

  // O login redireciona para a home; espere sair da tela de login.
  await expect(page).not.toHaveURL(/\/login$/);
}
