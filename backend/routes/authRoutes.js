const express = require("express");
const {
    registerController,
    loginController,
    testController,
    forgotPasswordController,
    updateProfileController,
    getOrdersController,
    getAllOrdersController,
    getSingleOrderController,
    orderStatusController,
    getAdminDashboardStatsController,
} = require("../controllers/authController");
const { requireSignin, isAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

// Register
router.post("/register", registerController);

// Login
router.post("/login", loginController);

// Forgot Password
router.post("/forgot-password", forgotPasswordController);

// Test protected admin route
router.get("/test", requireSignin, isAdmin, testController);

// User auth check
router.get("/user-auth", requireSignin, (req, res) => {
    res.status(200).send({ ok: true });
});

// Admin auth check
router.get("/admin-auth", requireSignin, isAdmin, (req, res) => {
    res.status(200).send({ ok: true });
});

// Update profile
router.put("/profile", requireSignin, updateProfileController);

// Customer orders
router.get("/orders", requireSignin, getOrdersController);

// Single order details
router.get("/order/:orderId", requireSignin, getSingleOrderController);

// All orders (admin)
router.get("/all-orders", requireSignin, isAdmin, getAllOrdersController);

// Order status update (admin)
router.put("/order-status/:orderId", requireSignin, isAdmin, orderStatusController);

// Admin dashboard statistics
router.get("/admin-dashboard-stats", requireSignin, isAdmin, getAdminDashboardStatsController);

module.exports = router;