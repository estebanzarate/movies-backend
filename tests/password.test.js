import test from "node:test";
import assert from "node:assert/strict";
import { hashPassword, verifyPassword } from "../src/utils/password.js";

test("genera un hash Argon2id que no contiene la contraseña original", async () => {
  const password = "ClaveDePrueba-123!";
  const hash = await hashPassword(password);

  assert.notEqual(hash, password);
  assert.ok(hash.startsWith("$argon2id$"));
});

test("verifica correctamente la contraseña original", async () => {
  const password = "ClaveDePrueba-123!";
  const hash = await hashPassword(password);

  assert.equal(await verifyPassword(hash, password), true);
});

test("rechaza una contraseña incorrecta", async () => {
  const hash = await hashPassword("ClaveDePrueba-123!");

  assert.equal(await verifyPassword(hash, "OtraClave-456!"), false);
});
