import { AppError } from "../utils/app-error.js";

export function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const details = result.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      }));

      return next(
        new AppError(
          400,
          "VALIDATION_ERROR",
          "Los datos enviados no son válidos.",
          details,
        ),
      );
    }

    req.validatedBody = result.data;

    return next();
  };
}
