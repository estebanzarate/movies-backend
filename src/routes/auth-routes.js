import { Router } from "express";
import { validate } from "../middlewares/validate.js";
import { registerSchema } from "../validators/auth-validator.js";
import { registerUser } from "../services/auth-service.js";

const router = Router();

router.post("/register", validate(registerSchema), async (req, res, next) => {
  try {
    const user = await registerUser(req.validatedBody);

    return res.status(201).json({
      data: {
        user,
      },
    });
  } catch (error) {
    return next(error);
  }
});

export default router;
