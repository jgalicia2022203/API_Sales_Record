import { Router } from "express";
import { check } from "express-validator";
import { emailValid, usernameValid } from "../helpers/db-validators.js";
import { validateFields } from "../middlewares/validate-fields.js";
import { login } from "./auth.controller.js";

const router = Router();

router.post(
  "/login",
  [
    check("username", "username or email is needed").not().isEmpty(),
    check("username", "Please enter a valid email or username").custom(
      async (value) => {
        return (await emailValid(value)) || (await usernameValid(value));
      }
    ),
    check("password", "The password is obligatory").not().isEmpty(),
    validateFields,
  ],
  login
);

export default router;
