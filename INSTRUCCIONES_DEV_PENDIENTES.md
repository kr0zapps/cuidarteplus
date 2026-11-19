# Pendientes para el dev: evidencias que faltan del informe EP5

Quedan **dos tareas**. No edites el Word: solo reemplaza el archivo de pruebas, ejecuta y envía de vuelta lo que se lista al final.

---

## TAREA A – Pruebas E2E reales con Playwright (obligatoria)

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
Debe quedar corriendo en el puerto **5173**. No hace falta el backend.
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

## TAREA B – Detalle de alertas de CodeQL (opcional, mejora el informe)

Hoy el informe solo puede decir "32 alertas abiertas". Con el detalle se puede indicar cuántas son de severidad alta o crítica.

1. GitHub → repositorio → **Security** → **Code scanning**.
2. Haz clic en el filtro **Severity** y anota cuántas alertas hay por cada severidad (Critical, High, Medium, Low). Una captura del desplegable del filtro alcanza si muestra los conteos; si no, aplica cada filtro y anota el total que sale arriba (por ejemplo "12 Open").
3. Haz clic en el filtro **Rule** y anota las reglas distintas y cuántas alertas tiene cada una.

---

## QUÉ DEVOLVER (sin editar el Word)

**De la Tarea A:**
- [ ] Captura de la terminal con el resultado de `npx playwright test` (se deben ver los 3 nombres de prueba y "3 passed").
- [ ] Captura de la pantalla del reporte HTML de Playwright (las 3 pruebas en verde).
- [ ] Fecha y hora de la ejecución.
- [ ] Si algo falló: el mensaje de error completo, copiado como texto.

**De la Tarea B (si la hace):**
- [ ] Captura del filtro Severity con los conteos.
- [ ] Texto con: alertas por severidad y lista de reglas con su cantidad.

**Reglas de las capturas:** recorta solo la zona útil, que el texto se lea bien, sin datos personales ni claves.
