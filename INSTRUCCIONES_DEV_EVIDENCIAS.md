# Instrucciones para el dev: evidencias pendientes del informe EP5

Hay **dos tareas**. No edites el Word: solo reemplaza el archivo de pruebas, ejecuta y envía de vuelta las evidencias listadas al final.

---

## TAREA A – Pruebas E2E reales con Playwright

Las pruebas E2E-02 y E2E-03 actuales son vacías (`expect(true).toBe(true)`). Hay que reemplazarlas por pruebas que verifiquen comportamiento real.

### A1. Reemplazar el archivo de pruebas
Abre `tests/playwright/cuidarteplus.spec.js` y **reemplaza todo su contenido** por esto:

```js
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
```

### A2. Levantar el frontend (terminal 1)
Debe quedar corriendo en el puerto **5173** (el que espera Playwright). No hace falta el backend.
```bash
cd FRONTEND
```
```bash
npm run dev
```

### A3. Ejecutar las pruebas (terminal 2, en la raíz del proyecto)
```bash
npx playwright install chromium
```
```bash
npx playwright test
```
Deben salir **3 passed**. Si alguna falla, **no la modifiques**: copia el mensaje de error completo y envíalo.

### A4. Abrir el reporte HTML
```bash
npx playwright show-report
```

---

## TAREA B – Resultados de CodeQL y SonarQube

### B1. CodeQL (en GitHub)
1. Abre el repositorio en GitHub → pestaña **Security** → **Code scanning**.
2. Anota cuántas alertas hay en total y cuántas son de severidad alta o crítica. Si hay 0, es un resultado válido.

### B2. SonarQube
1. Abre el panel del proyecto `cuidarteplus-is1102`. La URL es la del secreto `SONAR_HOST_URL` del repositorio (GitHub → Settings → Secrets and variables → Actions).
2. En **Overview**, anota: Quality Gate (Passed / Failed), cobertura (%), bugs, vulnerabilidades, code smells.
3. Si el proyecto no aparece o está vacío, avisa. No inventes valores.

---

## QUÉ DEVOLVER (todo esto, sin editar el Word)

**De la Tarea A:**
- [ ] Captura de la terminal con el resultado de `npx playwright test` (se deben ver los 3 nombres de prueba y "3 passed").
- [ ] Captura de la pantalla del reporte HTML de Playwright (lista de las 3 pruebas en verde).
- [ ] Fecha y hora en que se ejecutó.
- [ ] Si algo falló: el mensaje de error completo copiado como texto.

**De la Tarea B:**
- [ ] Captura de la lista de **Code scanning** de GitHub (con el total de alertas visible).
- [ ] Captura de la vista **Overview** de SonarQube (Quality Gate, cobertura, bugs, vulnerabilidades y code smells visibles).
- [ ] Los números en texto: alertas totales y de severidad alta/crítica de CodeQL; Quality Gate, cobertura, bugs, vulnerabilidades y code smells de SonarQube.

**Reglas de las capturas:** recorta solo la zona útil, que se lea bien el texto, sin datos personales ni claves.
