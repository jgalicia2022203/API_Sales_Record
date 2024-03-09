import { Router } from "express";
import { check } from "express-validator";
import {
  existsEmail,
  existsUserById,
  existsUsername,
} from "../helpers/db-validators.js";
import { checkEmptyBody } from "../middlewares/empty-body.js";
import {
  confirmAction,
  validateFields,
} from "../middlewares/validate-fields.js";
import { validateJWT } from "../middlewares/validate-jwt.js";
import { hasRole, validRole } from "../middlewares/validate-roles.js";
import {
  UpdateClientInfo,
  deleteUser,
  deleteUserAccount,
  listUsers,
  register,
  updateUserInfo,
  updateUserRole,
} from "../users/user.controller.js";

const router = Router();

//ADMIN ROUTES
router.get("/", validateJWT, hasRole, listUsers);

router.post(
  "/register",
  [
    check("username", "username cannot be empty").not().isEmpty(),
    check("username").custom(existsUsername),
    check("email", "email cannot be empty").not().isEmpty(),
    check("email").custom(existsEmail),
    check("password", "password cannot be empty").not().isEmpty(),
    validateFields,
  ],
  register
);

router.put(
  "/update-role/:id",
  validateJWT,
  hasRole,
  [
    check("id", "isn't a valid id").isMongoId(),
    check("id").custom(existsUserById),
    check("role", "role cannot be empty").not().isEmpty(),
    validRole,
    validateFields,
  ],
  updateUserRole
);

router.put(
  "/update-info/:id",
  validateJWT,
  hasRole,
  [
    check("id", "user id required").not().isEmpty(),
    check("id").custom(existsUserById),
    checkEmptyBody,
    validateFields,
  ],
  updateUserInfo
);

router.delete(
  "/delete-user/:id",
  validateJWT,
  hasRole,
  [
    check("id", "user id required").not().isEmpty(),
    check("id").custom(existsUserById),
    validateFields,
  ],
  deleteUser
);

//CLIENT ROUTES
router.put(
  "/profile-settings",
  validateJWT,
  [checkEmptyBody, validateFields],
  UpdateClientInfo
);

router.delete(
  "/profile-settings",
  validateJWT,
  confirmAction,
  deleteUserAccount
);

export default router;
