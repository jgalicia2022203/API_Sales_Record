import { Router } from "express";
import { check } from "express-validator";
import {
  existsInvoiceById,
  existsProductById,
} from "../helpers/db-validators.js";
import { validateFields } from "../middlewares/validate-fields.js";
import { validateJWT } from "../middlewares/validate-jwt.js";
import { provideStock } from "../middlewares/validate-provided-stock.js";
import { hasRole } from "../middlewares/validate-roles.js";
import { validateStock } from "../middlewares/validate-stock.js";
import {
  addProductToCart,
  generateInvoice,
  getUserInvoices,
  makePurchase,
  updateInvoice,
} from "../shopping/shoppingCart.controller.js";

const router = Router();

router.post(
  "/addProducts",
  validateJWT,
  [
    check("product", "product cannot be empty").not().isEmpty(),
    check("product").custom(existsProductById),
    check("stock", "stock cannot be empty").not().isEmpty(),
    provideStock,
    validateStock,
    validateFields,
  ],
  addProductToCart
);

router.post("/purchase", validateJWT, makePurchase);

router.post(
  "/:invoiceId/pdf",
  [
    check("invoiceId", "invoiceId must be provided").not().isEmpty(),
    check("invoiceId").custom(existsInvoiceById),
    validateFields,
  ],
  generateInvoice
);

router.put(
  "/update/:invoiceId",
  validateJWT,
  hasRole,
  [
    check("invoiceId", "invoiceId must be provided").not().isEmpty(),
    check("invoiceId").custom(existsInvoiceById),
    check("user", "user must be provided").not().isEmpty(),
    check("shopping", "shopping must be provided").not().isEmpty(),
    check("total", "total must be provided").not().isEmpty(),
    check("items", "items must be provided").not().isEmpty(),
  ],
  updateInvoice
);

router.get("/history", validateJWT, getUserInvoices);

export default router;
