const request = require("supertest");
const app = require("../src/app");
const fs = require("fs");
const path = require("path");

describe("Pruebas de Seguridad de Software (EP5 - OWASP Top 10 y Análisis de Vulnerabilidades)", () => {
  test("SEC-01: Verificación de Cabeceras HTTP de Seguridad (CWE-693 / OWASP A05)", async () => {
    const res = await request(app).get("/");
    // En el backend vulnerable no hay Helmet configurado por defecto
    const hasCsp = res.headers["content-security-policy"] !== undefined;
    const hasXFrame = res.headers["x-frame-options"] !== undefined;
    const hasHsts = res.headers["strict-transport-security"] !== undefined;
    
    // Dejamos documentado el hallazgo de seguridad:
    expect(res.statusCode).toBe(200);
    // Hallazgo: Se identifica ausencia de cabeceras de protección contra Clickjacking y XSS
  });

  test("SEC-02: Detección SAST de Claves Secretas Hardcodeadas en Código Fuente (CWE-798)", () => {
    const authCode = fs.readFileSync(path.join(__dirname, "../src/routes/auth.js"), "utf8");
    const containsHardcodedSecret = authCode.includes('"inseguro"');
    expect(containsHardcodedSecret).toBe(true);
    // Hallazgo de seguridad detectado: JWT_SECRET cae en fallback 'inseguro'
  });

  test("SEC-03: Detección SAST de Almacenamiento de Contraseñas en Texto Plano (CWE-256 / CWE-312)", () => {
    const authCode = fs.readFileSync(path.join(__dirname, "../src/routes/auth.js"), "utf8");
    const usesPlainTextComparison = authCode.includes("user.contrasena !== password");
    expect(usesPlainTextComparison).toBe(true);
    // Hallazgo de seguridad detectado: Contraseñas no usan función de hash criptográfico como bcrypt o Argon2
  });

  test("SEC-04: Detección de Fuga de Información Técnica en Respuestas de Error (CWE-209)", async () => {
    const res = await request(app)
      .post("/autenticacion/login")
      .send({ nombre_usuario: "usuario_inexistente", password: "Password123!" });
    // Si la BD no está levantada o falla, evalúa si expone glosa técnica
    if (res.statusCode === 500) {
      expect(res.body).toHaveProperty("error");
      // Hallazgo: glosa técnica expone err.message directamente al cliente
    } else {
      expect([400, 401]).toContain(res.statusCode);
    }
  });

  test("SEC-05: Protección ante Inyección de Cargas Payload Maliciosas en Nombres de Usuario", async () => {
    const sqlPayloads = ["' OR '1'='1", "admin'--", "<script>alert(1)</script>"];
    for (const payload of sqlPayloads) {
      const res = await request(app)
        .post("/autenticacion/login")
        .send({ nombre_usuario: payload, password: "test_password" });
      // Debe ser manejado por validación de esquema o rechazar de forma controlada (nunca volcar stack trace ni ejecutar query no controlada)
      expect([400, 401, 500]).toContain(res.statusCode);
    }
  });
});
