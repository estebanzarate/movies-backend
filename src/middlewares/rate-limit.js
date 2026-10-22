import { rateLimit } from "express-rate-limit";

export function createRegisterRateLimit(options = {}) {
  return rateLimit({
    windowMs: options.windowMs ?? 60 * 1000,
    limit: options.limit ?? 5,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: {
      error: {
        code: "RATE_LIMIT_EXCEEDED",
        message:
          "Demasiadas solicitudes de registro. Intentá nuevamente en un minuto.",
      },
    },
  });
}

export const registerRateLimit = createRegisterRateLimit();
