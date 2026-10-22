import test from "node:test";
import assert from "node:assert/strict";
import { registerSchema } from "../src/validators/auth-validator.js";

test("acepta datos válidos y normaliza el email", () => {
  const result = registerSchema.safeParse({
    email: "  Usuario@Example.com  ",
    password: "UnaClaveSeguraDePrueba123!",
  });

  assert.equal(result.success, true);

  if (result.success) {
    assert.equal(result.data.email, "usuario@example.com");
    assert.equal(result.data.password, "UnaClaveSeguraDePrueba123!");
  }
});

test("rechaza un email con formato inválido", () => {
  const result = registerSchema.safeParse({
    email: "esto-no-es-un-email",
    password: "UnaClaveSeguraDePrueba123!",
  });

  assert.equal(result.success, false);
});

test("rechaza una contraseña demasiado corta", () => {
  const result = registerSchema.safeParse({
    email: "usuario@example.com",
    password: "corta",
  });

  assert.equal(result.success, false);
});

test("rechaza campos adicionales", () => {
  const result = registerSchema.safeParse({
    email: "usuario@example.com",
    password: "UnaClaveSeguraDePrueba123!",
    role: "admin",
  });

  assert.equal(result.success, false);
});

test("rechaza campos faltantes", () => {
  const result = registerSchema.safeParse({
    email: "usuario@example.com",
  });

  assert.equal(result.success, false);
});
