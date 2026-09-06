const express = require("express");
const { isAdmin, requireSignin } = require("../middleware/authMiddleware");
const {
    createProductController,
    getProductController,
    getSingleProductController,
    getPhotoController,
    deleteProductController,
    updateProductController,
    productFilterController,
    productCountController,
    productListController,
    searchProductController,
    productCategoryController,
    getRelatedProductsController,
    validateCouponController,
    checkoutOrderController,
} = require("../controllers/productController");
const formidable = require("express-formidable");

const router = express.Router();

// Create product (admin)
router.post(
    "/create-product",
    requireSignin,
    isAdmin,
    formidable(),
    createProductController
);

// Get all products
router.get("/get-product", getProductController);

// Get single product by slug or id
router.get("/get-product/:slug", getSingleProductController);

// Get photo
router.get("/get-product-photo/:pid", getPhotoController);

// Update product (admin)
router.put(
    "/update-product/:pid",
    requireSignin,
    isAdmin,
    formidable(),
    updateProductController
);

// Delete product (admin)
router.delete(
    "/delete-product/:pid",
    requireSignin,
    isAdmin,
    deleteProductController
);

// Filter and sort products
router.post("/product-filter", productFilterController);

// Product count
router.get("/product-count", productCountController);

// Product per page pagination
router.get("/product-list/:page", productListController);

// Search product
router.get("/search/:keyword", searchProductController);

// Category wise product
router.get("/product-category/:slug", productCategoryController);

// Related products
router.get("/related-product/:pid/:cid", getRelatedProductsController);

// Validate coupon
router.post("/validate-coupon", validateCouponController);

// Checkout and place order
router.post("/order-checkout", requireSignin, checkoutOrderController);

module.exports = router;