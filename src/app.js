import express from "express";
import { errorHandler } from "./middlewares/error-handler.js";

const app = express();

app.disable("x-powered-by");
app.use(express.json({ limit: "10kb" }));

app.use(errorHandler);

app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
  });
});

export default app;
