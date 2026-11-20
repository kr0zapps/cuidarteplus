const request = require("supertest");
const app = require("../src/app");

describe("Pruebas Automatizadas de Autenticación y Validación (EP5 - Calidad de Software)", () => {
  test("CP-01: El endpoint raíz debe responder status ok con código 200", async () => {
    const res = await request(app).get("/");
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("name", "cuidarteplus");
    expect(res.body).toHaveProperty("status", "ok");
  });

  test("CP-02: Endpoint /docs debe servir la especificación OpenAPI de la API", async () => {
    const res = await request(app).get("/openapi.json");
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("openapi");
    expect(res.body.info).toHaveProperty("title");
  });

  test("CP-03: Rechazo de login sin credenciales (Validación de esquema Yup)", async () => {
    const res = await request(app)
      .post("/autenticacion/login")
      .send({});
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  test("CP-04: Rechazo de login con password vacío o formato inválido", async () => {
    const res = await request(app)
      .post("/autenticacion/login")
      .send({ nombre_usuario: "admin", password: "" });
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  test("CP-05: Rechazo de registro con correo electrónico mal formado", async () => {
    const res = await request(app)
      .post("/autenticacion/registro")
      .send({
        nombre_usuario: "usuario_prueba",
        password: "Password123!",
        correo: "correo-invalido-sin-arroba",
        rut: "12.345.678-5"
      });
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  test("CP-06: Rechazo de registro sin campos obligatorios", async () => {
    const res = await request(app)
      .post("/autenticacion/registro")
      .send({ nombre_usuario: "incompleto" });
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error");
  });
});
