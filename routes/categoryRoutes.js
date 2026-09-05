 const express = require("express");
const { requireSignin , isAdmin } = require("../middleware/authMiddleware");
const { createCategoryController,updateCategoryController, singleCategoryController} = require("../controllers/categoryController")

 const router = express.Router();

 router.post("/create-category", requireSignin, isAdmin, createCategoryController);

 router.put("/update-category/:id", requireSignin, isAdmin , updateCategoryController)

 router.get("/single-category/:slug", singleCategoryController)


 module.exports = router; 