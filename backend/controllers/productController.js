const mongoose = require("mongoose");
const productModel = require("../models/poductModel");
const categoryModel = require("../models/categoryModel");
const orderModel = require("../models/orderModel");
const fs = require("fs");
const slugify = require("slugify");

// CREATE PRODUCT (ADMIN)
const createProductController = async (req, res) => {
    try {
        const {
            name,
            description,
            price,
            originalPrice,
            rating,
            category,
            quantity,
            shipping,
            colors,
            sizes,
            dressStyle,
        } = req.fields;
        const photo = req.files && req.files.photo;

        // validation
        switch (true) {
            case !name:
                return res.status(400).send({ error: "Name is Required" });
            case !description:
                return res.status(400).send({ error: "Description is Required" });
            case !price:
                return res.status(400).send({ error: "Price is Required" });
            case !category:
                return res.status(400).send({ error: "Category is Required" });
            case quantity === undefined || quantity === null || quantity === "":
                return res.status(400).send({ error: "Quantity is Required" });
            case photo && photo.size > 1000000:
                return res.status(400).send({ error: "Photo should be less than 1MB" });
        }

        const parsedColors = colors
            ? Array.isArray(colors)
                ? colors
                : typeof colors === "string" && colors.startsWith("[")
                ? JSON.parse(colors)
                : colors.split(",").map((c) => c.trim())
            : [];

        const parsedSizes = sizes
            ? Array.isArray(sizes)
                ? sizes
                : typeof sizes === "string" && sizes.startsWith("[")
                ? JSON.parse(sizes)
                : sizes.split(",").map((s) => s.trim())
            : [];

        const products = new productModel({
            name,
            slug: slugify(name),
            description,
            price: Number(price),
            originalPrice: originalPrice ? Number(originalPrice) : undefined,
            rating: rating ? Number(rating) : 4.5,
            category,
            quantity: Number(quantity),
            shipping: shipping === "1" || shipping === true || shipping === "true",
            colors: parsedColors,
            sizes: parsedSizes,
            dressStyle: dressStyle || "",
        });

        if (photo) {
            products.photo = {
                data: fs.readFileSync(photo.path),
                contentType: photo.type,
            };
        }

        await products.save();
        res.status(201).send({
            success: true,
            message: "Product Created Successfully",
            products,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error: error.message,
            message: "Error in creating product",
        });
    }
};

// GET ALL PRODUCTS
const getProductController = async (req, res) => {
    try {
        const products = await productModel
            .find({})
            .populate("category")
            .select("-photo")
            .limit(50)
            .sort({ createdAt: -1 });

        res.status(200).send({
            success: true,
            countTotal: products.length,
            message: "All Products",
            products,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in getting products",
            error: error.message,
        });
    }
};

// GET SINGLE PRODUCT (BY SLUG OR ID)
const getSingleProductController = async (req, res) => {
    try {
        const { slug } = req.params;
        let product = await productModel
            .findOne({ slug })
            .select("-photo")
            .populate("category");

        if (!product && mongoose.Types.ObjectId.isValid(slug)) {
            product = await productModel
                .findById(slug)
                .select("-photo")
                .populate("category");
        }

        if (!product) {
            return res.status(404).send({
                success: false,
                message: "Product not found",
            });
        }

        res.status(200).send({
            success: true,
            message: "Single Product fetched",
            product,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error getting single product",
            error: error.message,
        });
    }
};

// GET PRODUCT PHOTO
const getPhotoController = async (req, res) => {
    try {
        const product = await productModel
            .findById(req.params.pid)
            .select("photo");
        if (product && product.photo && product.photo.data) {
            res.set("Content-type", product.photo.contentType);
            return res.status(200).send(product.photo.data);
        }
        return res.status(404).send({ message: "Photo not found" });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error while getting product photo",
            error: error.message,
        });
    }
};

// DELETE PRODUCT (ADMIN)
const deleteProductController = async (req, res) => {
    try {
        await productModel.findByIdAndDelete(req.params.pid).select("-photo");
        res.status(200).send({
            success: true,
            message: "Product Deleted Successfully",
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error while deleting product",
            error: error.message,
        });
    }
};

// UPDATE PRODUCT (ADMIN)
const updateProductController = async (req, res) => {
    try {
        const {
            name,
            description,
            price,
            originalPrice,
            rating,
            category,
            quantity,
            shipping,
            colors,
            sizes,
            dressStyle,
        } = req.fields;
        const photo = req.files && req.files.photo;

        // validation
        switch (true) {
            case !name:
                return res.status(400).send({ error: "Name is Required" });
            case !description:
                return res.status(400).send({ error: "Description is Required" });
            case !price:
                return res.status(400).send({ error: "Price is Required" });
            case !category:
                return res.status(400).send({ error: "Category is Required" });
            case quantity === undefined || quantity === null || quantity === "":
                return res.status(400).send({ error: "Quantity is Required" });
            case photo && photo.size > 1000000:
                return res.status(400).send({ error: "Photo should be less than 1MB" });
        }

        const parsedColors = colors
            ? Array.isArray(colors)
                ? colors
                : typeof colors === "string" && colors.startsWith("[")
                ? JSON.parse(colors)
                : colors.split(",").map((c) => c.trim())
            : undefined;

        const parsedSizes = sizes
            ? Array.isArray(sizes)
                ? sizes
                : typeof sizes === "string" && sizes.startsWith("[")
                ? JSON.parse(sizes)
                : sizes.split(",").map((s) => s.trim())
            : undefined;

        const updateData = {
            name,
            slug: slugify(name),
            description,
            price: Number(price),
            category,
            quantity: Number(quantity),
            shipping: shipping === "1" || shipping === true || shipping === "true",
        };

        if (originalPrice !== undefined) updateData.originalPrice = Number(originalPrice);
        if (rating !== undefined) updateData.rating = Number(rating);
        if (parsedColors !== undefined) updateData.colors = parsedColors;
        if (parsedSizes !== undefined) updateData.sizes = parsedSizes;
        if (dressStyle !== undefined) updateData.dressStyle = dressStyle;

        const products = await productModel.findByIdAndUpdate(
            req.params.pid,
            updateData,
            { new: true }
        );

        if (photo) {
            products.photo = {
                data: fs.readFileSync(photo.path),
                contentType: photo.type,
            };
            await products.save();
        }

        res.status(200).send({
            success: true,
            message: "Product Updated Successfully",
            products,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error: error.message,
            message: "Error in updating product",
        });
    }
};

// FILTER & SORT PRODUCTS (SEARCH + CATEGORY + PRICE + AVAILABILITY + COLORS + SIZES + STYLES + SORTING + PAGINATION)
const productFilterController = async (req, res) => {
    try {
        const {
            checked = [],
            radio = [],
            availability,
            colors = [],
            sizes = [],
            dressStyle,
            keyword,
            sortBy,
            page = 1,
            limit = 12,
        } = req.body;

        let args = {};

        // Keyword search filter
        if (keyword && typeof keyword === "string" && keyword.trim() !== "") {
            const escapedKeyword = keyword.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
            args.$or = [
                { name: { $regex: escapedKeyword, $options: "i" } },
                { description: { $regex: escapedKeyword, $options: "i" } },
                { dressStyle: { $regex: escapedKeyword, $options: "i" } },
            ];
        }

        // Category filter
        if (checked && checked.length > 0) {
            args.category = { $in: checked };
        }

        // Price filter
        if (radio && radio.length === 2) {
            args.price = { $gte: Number(radio[0]), $lte: Number(radio[1]) };
        }

        // Availability filter
        if (availability === "in-stock") {
            args.quantity = { $gt: 0 };
        } else if (availability === "out-of-stock") {
            args.quantity = { $lte: 0 };
        }

        // Colors filter
        if (colors && colors.length > 0) {
            args.colors = { $in: colors };
        }

        // Sizes filter
        if (sizes && sizes.length > 0) {
            args.sizes = { $in: sizes };
        }

        // Dress style filter
        if (dressStyle) {
            if (Array.isArray(dressStyle) && dressStyle.length > 0) {
                args.dressStyle = { $in: dressStyle };
            } else if (typeof dressStyle === "string") {
                args.dressStyle = { $regex: dressStyle, $options: "i" };
            }
        }

        // Sorting options
        let sortOption = { createdAt: -1 };
        if (sortBy === "price-asc" || sortBy === "price-low") {
            sortOption = { price: 1 };
        } else if (sortBy === "price-desc" || sortBy === "price-high") {
            sortOption = { price: -1 };
        } else if (sortBy === "newest") {
            sortOption = { createdAt: -1 };
        } else if (sortBy === "name") {
            sortOption = { name: 1 };
        } else if (sortBy === "rating") {
            sortOption = { rating: -1 };
        }

        const skip = (Number(page) - 1) * Number(limit);
        const total = await productModel.countDocuments(args);
        const products = await productModel
            .find(args)
            .select("-photo")
            .populate("category")
            .sort(sortOption)
            .skip(skip)
            .limit(Number(limit));

        res.status(200).send({
            success: true,
            total,
            totalCount: total,
            page: Number(page),
            totalPages: Math.ceil(total / Number(limit)),
            products,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error while filtering products",
            error: error.message,
        });
    }
};

// PRODUCT COUNT
const productCountController = async (req, res) => {
    try {
        const total = await productModel.countDocuments({});
        res.status(200).send({
            success: true,
            total,
            message: "Product counted successfully",
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error while getting product count",
            error: error.message,
        });
    }
};

// PRODUCT LIST BASED ON PAGE
const productListController = async (req, res) => {
    try {
        const perPage = 9;
        const page = req.params.page ? Number(req.params.page) : 1;
        const products = await productModel
            .find({})
            .select("-photo")
            .populate("category")
            .skip((page - 1) * perPage)
            .limit(perPage)
            .sort({ createdAt: -1 });

        const total = await productModel.countDocuments({});

        res.status(200).send({
            success: true,
            products,
            total,
            page,
            totalPages: Math.ceil(total / perPage),
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error while getting paginated products",
            error: error.message,
        });
    }
};

// SEARCH PRODUCT (CASE-INSENSITIVE & PARTIAL)
const searchProductController = async (req, res) => {
    try {
        const { keyword } = req.params;
        const result = await productModel
            .find({
                $or: [
                    { name: { $regex: keyword, $options: "i" } },
                    { description: { $regex: keyword, $options: "i" } },
                    { dressStyle: { $regex: keyword, $options: "i" } },
                ],
            })
            .select("-photo")
            .populate("category");

        res.json(result);
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error while searching products",
            error: error.message,
        });
    }
};

// CATEGORY WISE PRODUCTS
const productCategoryController = async (req, res) => {
    try {
        const category = await categoryModel.findOne({ slug: req.params.slug });
        if (!category) {
            return res.status(404).send({
                success: false,
                message: "Category not found",
            });
        }
        const products = await productModel
            .find({ category: category._id })
            .select("-photo")
            .populate("category");

        res.status(200).send({
            success: true,
            category,
            products,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error while getting category products",
            error: error.message,
        });
    }
};

// RELATED PRODUCTS ("You might also like")
const getRelatedProductsController = async (req, res) => {
    try {
        const { pid, cid } = req.params;
        const products = await productModel
            .find({
                category: cid,
                _id: { $ne: pid },
            })
            .select("-photo")
            .limit(4)
            .populate("category");

        res.status(200).send({
            success: true,
            products,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error while fetching related products",
            error: error.message,
        });
    }
};

// VALIDATE COUPON
const validateCouponController = async (req, res) => {
    try {
        const { couponCode, subtotal } = req.body;
        if (!couponCode) {
            return res.status(400).send({
                success: false,
                message: "Coupon code is required",
            });
        }

        const code = couponCode.trim().toUpperCase();
        let discountPercent = 0;

        if (code === "SAVE10") {
            discountPercent = 10;
        } else if (code === "SAVE20") {
            discountPercent = 20;
        } else {
            return res.status(400).send({
                success: false,
                message: "Invalid coupon code. Try SAVE10 or SAVE20",
            });
        }

        const numSubtotal = Number(subtotal) || 0;
        const discountAmount = Math.round(((numSubtotal * discountPercent) / 100) * 100) / 100;
        const finalTotal = Math.max(0, numSubtotal - discountAmount);

        res.status(200).send({
            success: true,
            couponCode: code,
            discountPercent,
            discountAmount,
            subtotal: numSubtotal,
            finalTotal,
            message: `${discountPercent}% discount coupon applied successfully`,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error validating coupon",
            error: error.message,
        });
    }
};

// CHECKOUT & ORDER CREATION WITH INVENTORY VALIDATION & STOCK DEDUCTION
const checkoutOrderController = async (req, res) => {
    try {
        const { cartItems, couponCode, shippingAddress } = req.body;

        if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
            return res.status(400).send({
                success: false,
                message: "Cart is empty",
            });
        }

        let subtotal = 0;
        const orderProducts = [];

        // 1. Validate each product & inventory in DB and pull actual prices
        for (const item of cartItems) {
            const productId = item._id || item.id || item.product;
            if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
                return res.status(400).send({
                    success: false,
                    message: `Invalid product ID in cart for item: ${item.name || "Unknown"}`,
                });
            }

            const quantity = Number(item.quantity) || 1;
            const product = await productModel.findById(productId);
            if (!product) {
                return res.status(404).send({
                    success: false,
                    message: `Product "${item.name || productId}" was not found`,
                });
            }

            // Inventory check
            if (product.quantity < quantity) {
                return res.status(400).send({
                    success: false,
                    message: `Product "${product.name}" only has ${product.quantity} items left in stock`,
                });
            }

            const itemPrice = product.price;
            subtotal += itemPrice * quantity;

            orderProducts.push({
                product: product._id,
                name: product.name,
                price: itemPrice,
                quantity: quantity,
                size: item.size || "",
                color: item.color || "",
            });
        }

        // 2. Validate Coupon and Calculate Discount
        let discount = 0;
        let appliedCoupon = "";

        if (couponCode) {
            const code = couponCode.trim().toUpperCase();
            if (code === "SAVE10") {
                discount = Math.round(((subtotal * 10) / 100) * 100) / 100;
                appliedCoupon = "SAVE10";
            } else if (code === "SAVE20") {
                discount = Math.round(((subtotal * 20) / 100) * 100) / 100;
                appliedCoupon = "SAVE20";
            }
        }

        const finalTotal = Math.max(0, Math.round((subtotal - discount) * 100) / 100);

        // 3. Deduct product inventory in MongoDB
        for (const item of orderProducts) {
            await productModel.findByIdAndUpdate(item.product, {
                $inc: { quantity: -item.quantity },
            });
        }

        // 4. Create Order Record
        const order = await new orderModel({
            products: orderProducts,
            buyer: req.user._id,
            shippingAddress: shippingAddress || {},
            subtotal,
            coupon: appliedCoupon,
            discount,
            finalTotal,
            status: "Not Process",
        }).save();

        res.status(201).send({
            success: true,
            message: "Order placed successfully",
            order,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error during checkout",
            error: error.message,
        });
    }
};

module.exports = {
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
};