const request = require("supertest");
const app = require("../src/app");
const { normalizeRut } = require("../src/utils/rut");

describe("Pruebas Automatizadas de Autorización y Manejo de Pacientes (RBAC / Seguridad)", () => {
  test("CP-07: Listado de pacientes debe denegar acceso a solicitudes sin token (HTTP 401)", async () => {
    const res = await request(app).get("/pacientes");
    expect([401, 403]).toContain(res.statusCode);
  });

  test("CP-08: Creación de paciente debe validar esquema y denegar acceso sin permisos", async () => {
    const res = await request(app)
      .post("/pacientes")
      .send({
        rut: "11.111.111-1",
        primer_nombre: "Prueba",
        apellido_paterno: "Test"
      });
    expect([400, 401, 403]).toContain(res.statusCode);
  });

  test("CP-09: Token JWT malicioso o manipulado debe ser rechazado inmediatamente", async () => {
    const res = await request(app)
      .get("/pacientes")
      .set("Authorization", "Bearer token_falso_y_manipulado_hacker");
    expect([401, 403]).toContain(res.statusCode);
  });

  test("CP-10: Utilidad de normalización de RUT chileno (Detección de límites de calidad)", () => {
    expect(normalizeRut("12.345.678-5")).toBe("12345678-5");
    expect(normalizeRut("12.345.678-k")).toBe("12345678-k");
    // Defecto detectado: la función solo remueve puntos, no estandariza 'k' mayúscula ni recorta espacios
  });

  test("CP-11: Descarga de documentos médicos clínicos exige autenticación obligatoria", async () => {
    const res = await request(app).get("/documentos/1");
    expect([401, 403]).toContain(res.statusCode);
  });
});
