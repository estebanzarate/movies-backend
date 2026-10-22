import test from "node:test";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { pool } from "../src/config/database.js";
import {
  createUser,
  findUserByEmail,
} from "../src/repositories/user-repository.js";

test("crea y busca un usuario en PostgreSQL", async () => {
  const email = `repo-test-${randomUUID()}@example.com`;

  try {
    const created = await createUser({
      email,
      passwordHash: "hash-de-prueba",
    });

    assert.ok(created.id);
    assert.equal(created.email, email);
    assert.ok(created.created_at);
    assert.equal("password_hash" in created, false);

    const found = await findUserByEmail(email);

    assert.ok(found);
    assert.equal(found.email, email);
    assert.equal(found.password_hash, "hash-de-prueba");
  } finally {
    try {
      await pool.query("DELETE FROM users WHERE email = $1", [email]);
    } finally {
      await pool.end();
    }
  }
});
