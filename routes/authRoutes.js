const express = require("express")
const { registerController, loginController , testController ,forgotPasswordController} = require("../controllers/authController")
const {requireSignin , isAdmin }= require("../middleware/authMiddleware")



const router = express.Router();
//register
router.post("/register", registerController)

//login
router.post("/login", loginController)

//forgotPassword
router.post("/forgot-password", forgotPasswordController)

//test
router.get("/test",requireSignin, isAdmin , testController)

//user-atuh
router.get("/user-auth", requireSignin, (req,res)=>{
    res.status(200).send({ok :true});
})

//admin-auth
router.get("/admin-auth", requireSignin, isAdmin ,(req,res)=>{
    res.status(200).send({ok :true});
})

module.exports = router; 