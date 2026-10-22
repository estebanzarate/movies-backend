import { AppError } from "../utils/app-error.js";
import { hashPassword } from "../utils/password.js";
import {
  createUser,
  findUserByEmail,
} from "../repositories/user-repository.js";

export function createAuthService({
  findUserByEmail,
  createUser,
  hashPassword,
}) {
  return async function registerUser({ email, password }) {
    const existingUser = await findUserByEmail(email);

    if (existingUser) {
      throw new AppError(
        409,
        "EMAIL_ALREADY_EXISTS",
        "Ya existe una cuenta con ese email.",
      );
    }

    const passwordHash = await hashPassword(password);

    try {
      return await createUser({ email, passwordHash });
    } catch (error) {
      if (error.code === "23505" && error.constraint === "users_email_key") {
        throw new AppError(
          409,
          "EMAIL_ALREADY_EXISTS",
          "Ya existe una cuenta con ese email.",
        );
      }

      throw error;
    }
  };
}

export const registerUser = createAuthService({
  findUserByEmail,
  createUser,
  hashPassword,
});
