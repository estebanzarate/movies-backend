import test from "node:test";
import assert from "node:assert/strict";
import express from "express";
import request from "supertest";

import { createRegisterRateLimit } from "../src/middlewares/rate-limit.js";

test("bloquea solicitudes que superan el límite configurado", async () => {
  const app = express();

  app.get(
    "/test",
    createRegisterRateLimit({
      limit: 2,
      windowMs: 60 * 1000,
    }),
    (_req, res) => {
      res.status(200).json({ status: "ok" });
    },
  );

  const first = await request(app).get("/test");
  const second = await request(app).get("/test");
  const third = await request(app).get("/test");

  assert.equal(first.status, 200);
  assert.equal(second.status, 200);

  assert.equal(third.status, 429);
  assert.equal(third.body.error.code, "RATE_LIMIT_EXCEEDED");
  assert.match(third.body.error.message, /Demasiadas solicitudes/);
});
