import { test, expect } from '@playwright/test';

test.describe('Pruebas Funcionales E2E - Cuidarte+ (Playwright)', () => {
  test('E2E-01: Carga de la pantalla de inicio de sesión', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByTestId('input-nombre-usuario')).toBeVisible();
    await expect(page.getByTestId('input-password')).toBeVisible();
    await expect(page.getByTestId('button-login')).toBeVisible();
  });

  test('E2E-02: Formulario de login rechaza campos vacíos', async ({ page }) => {
    await page.goto('/login');
    await page.getByTestId('button-login').click();
    await expect(page.getByText('El nombre de usuario es requerido')).toBeVisible();
    await expect(page.getByText('La contraseña es requerida')).toBeVisible();
    await expect(page).toHaveURL(/\/login/);
  });

  test('E2E-03: Ruta protegida redirige al login sin sesión', async ({ page }) => {
    await page.goto('/pacientes');
    await expect(page).toHaveURL(/\/login/);
    await expect(page.getByTestId('button-login')).toBeVisible();
  });
});
