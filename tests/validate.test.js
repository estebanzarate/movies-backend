import test from "node:test";
import assert from "node:assert/strict";
import express from "express";
import request from "supertest";
import { validate } from "../src/middlewares/validate.js";
import { registerSchema } from "../src/validators/auth-validator.js";
import { errorHandler } from "../src/middlewares/error-handler.js";

function createTestApp() {
  const app = express();

  app.use(express.json());

  app.post("/test", validate(registerSchema), (req, res) => {
    res.status(200).json(req.validatedBody);
  });

  app.use(errorHandler);

  return app;
}

test("rechaza datos inválidos con VALIDATION_ERROR", async () => {
  const app = createTestApp();

  const response = await request(app).post("/test").send({
    email: "email-invalido",
    password: "corta",
  });

  assert.equal(response.status, 400);
  assert.equal(response.body.error.code, "VALIDATION_ERROR");
  assert.ok(Array.isArray(response.body.error.details));
});

test("continúa con los datos validados y normalizados", async () => {
  const app = createTestApp();

  const response = await request(app).post("/test").send({
    email: " Usuario@Example.com ",
    password: "UnaClaveSeguraDePrueba123!",
  });

  assert.equal(response.status, 200);
  assert.equal(response.body.email, "usuario@example.com");
});
