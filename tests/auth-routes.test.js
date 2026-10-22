import test, { after } from "node:test";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import request from "supertest";

import app from "../src/app.js";
import { pool } from "../src/config/database.js";
import { createUser } from "../src/repositories/user-repository.js";

const createdEmails = new Set();

after(async () => {
  try {
    for (const email of createdEmails) {
      await pool.query("DELETE FROM users WHERE email = $1", [email]);
    }
  } finally {
    await pool.end();
  }
});

test("POST /auth/register crea un usuario y devuelve 201", async () => {
  const email = `register-${randomUUID()}@example.com`;
  createdEmails.add(email);

  const response = await request(app).post("/auth/register").send({
    email: email.toUpperCase(),
    password: "una-contraseña-segura-de-prueba",
  });

  assert.equal(response.status, 201);
  assert.equal(response.body.data.user.email, email);
  assert.ok(response.body.data.user.id);
  assert.ok(response.body.data.user.created_at);
  assert.equal("password_hash" in response.body.data.user, false);
  assert.equal("password" in response.body.data.user, false);
});

test("POST /auth/register rechaza datos inválidos", async () => {
  const response = await request(app).post("/auth/register").send({
    email: "esto-no-es-un-email",
    password: "corta",
  });

  assert.equal(response.status, 400);
  assert.equal(response.body.error.code, "VALIDATION_ERROR");
  assert.ok(Array.isArray(response.body.error.details));
});

test("POST /auth/register rechaza un email duplicado", async () => {
  const email = `duplicate-${randomUUID()}@example.com`;
  createdEmails.add(email);

  await createUser({
    email,
    passwordHash: "hash-de-prueba",
  });

  const response = await request(app).post("/auth/register").send({
    email,
    password: "una-contraseña-segura-de-prueba",
  });

  assert.equal(response.status, 409);
  assert.equal(response.body.error.code, "EMAIL_ALREADY_EXISTS");
});
