const express = require("express")
const {isAdmin,requireSignin} = require("../middleware/authMiddleware")
const {createProductController , getProductController , getSingleProductController ,
    getPhotoController , deleteProductController ,updateProductController , 
    productFilterController , productCountController , productListController ,
    searchProductController}= require("../controllers/productController")
const formidable = require("express-formidable")

const router = express.Router()

//create product 
router.post("/create-product",requireSignin, isAdmin , formidable, createProductController)
//get all products
router.get("/get-product", getProductController)

//get single product 
router.get("/get-product/:slug", getSingleProductController)

//get photo
router.get("/get-product-photo/:pid", getPhotoController)

//update product 
router.post("/update-product/:pid",requireSignin, isAdmin , formidable, updateProductController)

//delete product

router.delete("/delete-product/:pid", deleteProductController)

//filter product 
router.post("/product-filter", productFilterController)


//product count 

router.get("/product-count", productCountController)

//product per page 
router.get("/product-list/:page", productListController)

// search product 
router.get("/search", searchProductController)

module.exports = router