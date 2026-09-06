const express = require("express");
const { requireSignin, isAdmin } = require("../middleware/authMiddleware");
const {
    createCategoryController,
    updateCategoryController,
    categoryController,
    singleCategoryController,
    deleteCategoryController,
} = require("../controllers/categoryController");

const router = express.Router();

// Create category (admin)
router.post("/create-category", requireSignin, isAdmin, createCategoryController);

// Update category (admin)
router.put("/update-category/:id", requireSignin, isAdmin, updateCategoryController);

// Get all categories
router.get("/get-category", categoryController);

// Get single category
router.get("/single-category/:slug", singleCategoryController);

// Delete category (admin)
router.delete("/delete-category/:id", requireSignin, isAdmin, deleteCategoryController);

module.exports = router;