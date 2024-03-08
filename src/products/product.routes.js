import { Router } from "express";
import { check } from "express-validator";
import {
  existsCategoryById,
  existsProductById,
  existsProductName,
} from "../helpers/db-validators.js";
import { checkEmptyBody } from "../middlewares/empty-body.js";
import { validateFields } from "../middlewares/validate-fields.js";
import { validateJWT } from "../middlewares/validate-jwt.js";
import { hasRole } from "../middlewares/validate-roles.js";
import {
  addProduct,
  bestSellingProducts,
  deleteProduct,
  editProduct,
  getBestSellingProducts,
  getProductsByCategory,
  listProducts,
  outOfStock,
  productDetails,
  searchProductsByName,
} from "../products/product.controller.js";

const router = Router();

// ADMIN ROUTES
router.post(
  "/new-product",
  validateJWT,
  hasRole,
  [
    check("name", "name cannot be empty").not().isEmpty(),
    check("name").custom(existsProductName),
    check("description", "description cannot be empty").not().isEmpty(),
    check("price", "price cannot be empty").not().isEmpty(),
    validateFields,
  ],
  addProduct
);

router.get(
  "/product-details/:id",
  validateJWT,
  hasRole,
  [
    check("id", "isn't a valid id").isMongoId(),
    check("id").custom(existsProductById),
    validateFields,
  ],
  productDetails
);

router.get("/", validateJWT, hasRole, listProducts);

router.put(
  "/edit-product/:id",
  validateJWT,
  hasRole,
  [
    check("id", "isn't a valid id").isMongoId(),
    check("id").custom(existsProductById),
    checkEmptyBody,
    validateFields,
  ],
  editProduct
);

router.get("/out-of-stock", validateJWT, hasRole, outOfStock);

router.get("/best-selling", validateJWT, hasRole, bestSellingProducts);

router.delete(
  "/delete-product/:id",
  validateJWT,
  hasRole,
  [
    check("id", "user id required").not().isEmpty(),
    check("id").custom(existsProductById),
    validateFields,
  ],
  deleteProduct
);

// CLIENT ROUTES

router.get("/search", validateJWT, searchProductsByName);
router.get("/most-sold", validateJWT, getBestSellingProducts);
router.get(
  "/category/:id",
  validateJWT,
  [
    check("id", "user id required").not().isEmpty(),
    check("id").custom(existsCategoryById),
  ],
  getProductsByCategory
);

export default router;
