import express from "express";
import authRoutes from "./routes/auth-routes.js";
import { errorHandler } from "./middlewares/error-handler.js";

const app = express();

app.disable("x-powered-by");
app.use(express.json({ limit: "10kb" }));

app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
  });
});

app.use("/auth", authRoutes);
app.use(errorHandler);

export default app;
