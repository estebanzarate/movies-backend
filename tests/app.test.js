import test from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import app from "../src/app.js";

test("GET /health responde 200 y status ok", async () => {
  const response = await request(app).get("/health");

  assert.equal(response.status, 200);
  assert.deepEqual(response.body, {
    status: "ok",
  });
});

test("JSON inválido devuelve 400 con código INVALID_JSON", async () => {
  const response = await request(app)
    .post("/health")
    .set("Content-Type", "application/json")
    .send('{"title":');

  assert.equal(response.status, 400);
  assert.equal(response.body.error.code, "INVALID_JSON");
});
