const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        slug: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        originalPrice: {
            type: Number,
        },
        rating: {
            type: Number,
            default: 4.5,
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
        },
        colors: [
            {
                type: String,
            },
        ],
        sizes: [
            {
                type: String,
            },
        ],
        dressStyle: {
            type: String,
        },
        photo: {
            data: Buffer,
            contentType: String,
        },
        shipping: {
            type: Boolean,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Products", productSchema);