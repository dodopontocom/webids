const express = require("express");

const checkAuth = require("../middleware/check-auth");
const extracFile = require("../middleware/file");

const ProductController = require("../controllers/products");

const router = express.Router();

router.post(
  "",
  checkAuth,
  extracFile,
  ProductController.createProduct
);

router.put(
  "/:id",
  checkAuth,
  extracFile,
  ProductController.updateProduct
);

router.get("", ProductController.getProducts);

router.get("/:id", ProductController.getProduct);

router.delete("/:id", checkAuth, ProductController.deleteProduct);

module.exports = router;
