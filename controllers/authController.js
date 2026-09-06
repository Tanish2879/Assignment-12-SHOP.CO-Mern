const userModel = require("../models/userModel");
const { hashPassword, comparePassword } = require("../helpers/authHelper");
const JWT = require("jsonwebtoken");
const orderModel = require("../models/orderModel");
const productModel = require("../models/poductModel");
const categoryModel = require("../models/categoryModel");

// REGISTER
const registerController = async (req, res) => {
    try {
        const { name, email, password, phone, address, answer } = req.body;
        // validation
        if (!name) {
            return res.send({ error: "Name is Required" });
        }
        if (!email) {
            return res.send({ error: "Email is Required" });
        }
        if (!password) {
            return res.send({ error: "Password is Required" });
        }
        if (!phone) {
            return res.send({ error: "Phone is Required" });
        }
        if (!address) {
            return res.send({ error: "Address is Required" });
        }
        if (!answer) {
            return res.send({ error: "Answer is Required" });
        }

        // check user
        const existingUser = await userModel.findOne({ email });
        // existing user
        if (existingUser) {
            return res.status(200).send({
                success: false,
                message: "Already registered, please login",
            });
        }

        // register user
        const hashedPassword = await hashPassword(password);

        // save
        const user = await new userModel({
            name,
            email,
            phone,
            address,
            password: hashedPassword,
            answer,
        }).save();

        res.status(201).send({
            success: true,
            message: "User registered successfully",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
                role: user.role,
            },
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in Register Controller",
            error: error.message,
        });
    }
};

// LOGIN
const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;

        // validation
        if (!email || !password) {
            return res.status(404).send({
                success: false,
                message: "Invalid email or password",
            });
        }
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).send({
                success: false,
                message: "Email is not registered",
            });
        }
        const match = await comparePassword(password, user.password);

        if (!match) {
            return res.status(200).send({
                success: false,
                message: "Invalid Password",
            });
        }

        const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });
        res.status(200).send({
            success: true,
            message: "Login Successfully",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
                role: user.role,
            },
            token,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in login credentials",
            error: error.message,
        });
    }
};

const testController = (req, res) => {
    res.send("Protected routes");
};

// FORGOT PASSWORD
const forgotPasswordController = async (req, res) => {
    try {
        const { email, answer, newPassword } = req.body;
        if (!email) {
            return res.status(400).send({ message: "Email is required" });
        }
        if (!answer) {
            return res.status(400).send({ message: "Answer is required" });
        }
        if (!newPassword) {
            return res.status(400).send({ message: "New password is required" });
        }

        const user = await userModel.findOne({ email, answer });
        if (!user) {
            return res.status(404).send({
                success: false,
                message: "Wrong Email or Answer",
            });
        }

        const hashed = await hashPassword(newPassword);
        await userModel.findByIdAndUpdate(user._id, { password: hashed });
        res.status(200).send({
            success: true,
            message: "Password Reset Successfully",
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Something went wrong",
            error: error.message,
        });
    }
};

// UPDATE PROFILE
const updateProfileController = async (req, res) => {
    try {
        const { name, email, password, address, phone } = req.body;
        const user = await userModel.findById(req.user._id);

        // password validation
        if (password && password.length < 6) {
            return res.json({ error: "Password must be at least 6 characters long" });
        }

        const hashedPassword = password ? await hashPassword(password) : undefined;
        const updatedUser = await userModel.findByIdAndUpdate(
            req.user._id,
            {
                name: name || user.name,
                password: hashedPassword || user.password,
                phone: phone || user.phone,
                address: address || user.address,
            },
            { new: true }
        );

        res.status(200).send({
            success: true,
            message: "Profile Updated Successfully",
            updatedUser: {
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                phone: updatedUser.phone,
                address: updatedUser.address,
                role: updatedUser.role,
            },
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error while updating profile",
            error: error.message,
        });
    }
};

// GET CUSTOMER ORDERS
const getOrdersController = async (req, res) => {
    try {
        const orders = await orderModel
            .find({ buyer: req.user._id })
            .populate("products.product", "-photo")
            .populate("buyer", "name email phone")
            .sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error while getting orders",
            error: error.message,
        });
    }
};

// GET ALL ORDERS (ADMIN)
const getAllOrdersController = async (req, res) => {
    try {
        const orders = await orderModel
            .find({})
            .populate("products.product", "-photo")
            .populate("buyer", "name email phone")
            .sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error while getting all orders",
            error: error.message,
        });
    }
};

// GET SINGLE ORDER DETAILS
const getSingleOrderController = async (req, res) => {
    try {
        const { orderId } = req.params;
        const order = await orderModel
            .findById(orderId)
            .populate("products.product", "-photo")
            .populate("buyer", "name email phone address");

        if (!order) {
            return res.status(404).send({
                success: false,
                message: "Order not found",
            });
        }

        // Check if user is buyer or admin
        const user = await userModel.findById(req.user._id);
        if (order.buyer._id.toString() !== req.user._id.toString() && user.role !== 1) {
            return res.status(401).send({
                success: false,
                message: "Unauthorized to view this order",
            });
        }

        res.status(200).send({
            success: true,
            order,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error while getting order details",
            error: error.message,
        });
    }
};

// UPDATE ORDER STATUS (ADMIN)
const orderStatusController = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;
        const order = await orderModel.findByIdAndUpdate(
            orderId,
            { status },
            { new: true }
        );
        res.status(200).send({
            success: true,
            message: "Order status updated successfully",
            order,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error while updating order status",
            error: error.message,
        });
    }
};

// ADMIN DASHBOARD STATS
const getAdminDashboardStatsController = async (req, res) => {
    try {
        const totalProducts = await productModel.countDocuments({});
        const totalCategories = await categoryModel.countDocuments({});
        const totalUsers = await userModel.countDocuments({});
        const totalOrders = await orderModel.countDocuments({});
        const outOfStockProducts = await productModel.countDocuments({ quantity: { $lte: 0 } });
        const lowStockProducts = await productModel.countDocuments({
            quantity: { $gt: 0, $lte: 5 },
        });

        res.status(200).send({
            success: true,
            stats: {
                totalProducts,
                totalCategories,
                totalUsers,
                totalOrders,
                outOfStockProducts,
                lowStockProducts,
            },
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error while fetching dashboard stats",
            error: error.message,
        });
    }
};

module.exports = {
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
};