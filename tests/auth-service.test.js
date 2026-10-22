import test from "node:test";
import assert from "node:assert/strict";
import { createAuthService } from "../src/services/auth-service.js";
import { AppError } from "../src/utils/app-error.js";

function createDependencies(overrides = {}) {
  return {
    findUserByEmail: async () => null,
    createUser: async ({ email }) => ({
      id: "user-123",
      email,
      created_at: new Date(),
    }),
    hashPassword: async () => "argon2-hash-de-prueba",
    ...overrides,
  };
}

test("registra un usuario usando el hash de la contraseña", async () => {
  const calls = {
    hash: 0,
    create: 0,
  };

  const dependencies = createDependencies({
    hashPassword: async (password) => {
      calls.hash++;
      assert.equal(password, "contraseña-de-prueba");
      return "argon2-hash-de-prueba";
    },
    createUser: async (data) => {
      calls.create++;
      assert.equal(data.email, "persona@example.com");
      assert.equal(data.passwordHash, "argon2-hash-de-prueba");
      assert.equal("password" in data, false);

      return { id: "user-123", email: data.email };
    },
  });

  const registerUser = createAuthService(dependencies);

  const user = await registerUser({
    email: "persona@example.com",
    password: "contraseña-de-prueba",
  });

  assert.equal(user.id, "user-123");
  assert.equal(user.email, "persona@example.com");
  assert.equal(calls.hash, 1);
  assert.equal(calls.create, 1);
});

test("rechaza un email que ya está registrado", async () => {
  let hashCalled = false;
  let createCalled = false;

  const dependencies = createDependencies({
    findUserByEmail: async () => ({ id: "existing-user" }),
    hashPassword: async () => {
      hashCalled = true;
      return "hash";
    },
    createUser: async () => {
      createCalled = true;
    },
  });

  const registerUser = createAuthService(dependencies);

  await assert.rejects(
    registerUser({
      email: "persona@example.com",
      password: "contraseña-de-prueba",
    }),
    (error) => {
      assert.ok(error instanceof AppError);
      assert.equal(error.statusCode, 409);
      assert.equal(error.code, "EMAIL_ALREADY_EXISTS");
      return true;
    },
  );

  assert.equal(hashCalled, false);
  assert.equal(createCalled, false);
});

test("maneja una colisión de email detectada por PostgreSQL", async () => {
  const databaseError = Object.assign(new Error("duplicate key"), {
    code: "23505",
    constraint: "users_email_key",
  });

  const registerUser = createAuthService(
    createDependencies({
      createUser: async () => {
        throw databaseError;
      },
    }),
  );

  await assert.rejects(
    registerUser({
      email: "persona@example.com",
      password: "contraseña-de-prueba",
    }),
    (error) => {
      assert.ok(error instanceof AppError);
      assert.equal(error.statusCode, 409);
      assert.equal(error.code, "EMAIL_ALREADY_EXISTS");
      return true;
    },
  );
});

test("propaga errores inesperados de la base de datos", async () => {
  const databaseError = new Error("Database unavailable");

  const registerUser = createAuthService(
    createDependencies({
      createUser: async () => {
        throw databaseError;
      },
    }),
  );

  await assert.rejects(
    registerUser({
      email: "persona@example.com",
      password: "contraseña-de-prueba",
    }),
    (error) => error === databaseError,
  );
});
