const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
    {
        products: [
            {
                product: {
                    type: mongoose.ObjectId,
                    ref: "Products",
                },
                name: {
                    type: String,
                },
                price: {
                    type: Number,
                },
                quantity: {
                    type: Number,
                    default: 1,
                },
                size: {
                    type: String,
                },
                color: {
                    type: String,
                },
            },
        ],
        buyer: {
            type: mongoose.ObjectId,
            ref: "user",
            required: true,
        },
        shippingAddress: {
            type: Object,
        },
        subtotal: {
            type: Number,
            required: true,
        },
        coupon: {
            type: String,
            default: "",
        },
        discount: {
            type: Number,
            default: 0,
        },
        finalTotal: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            default: "Not Process",
            enum: ["Not Process", "Processing", "Shipped", "Delivered", "Cancelled"],
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);