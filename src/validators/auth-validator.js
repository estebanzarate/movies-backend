import { z } from "zod";

export const registerSchema = z.strictObject({
  email: z
    .string({
      error: "El email es obligatorio y debe ser un texto.",
    })
    .trim()
    .min(1, "El email es obligatorio.")
    .max(254, "El email no puede superar los 254 caracteres.")
    .pipe(
      z.email({
        error: "El formato del email no es válido.",
      }),
    )
    .transform((email) => email.toLowerCase()),

  password: z
    .string({
      error: "La contraseña es obligatoria y debe ser un texto.",
    })
    .min(15, "La contraseña debe tener al menos 15 caracteres.")
    .max(128, "La contraseña no puede superar los 128 caracteres."),
});
