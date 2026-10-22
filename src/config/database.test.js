import test from "node:test";
import assert from "node:assert/strict";
import { pool } from "./database.js";

test("conecta a PostgreSQL y ejecuta una consulta", async () => {
  try {
    const result = await pool.query("SELECT current_database() AS database");

    assert.equal(result.rows[0].database, "movies_dev");
  } finally {
    await pool.end();
  }
});
