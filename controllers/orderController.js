const Order = require("../models/order");
const Product = require("../models/product");
const errorHandler = require("../utils/error");


exports.newOrder = async (req, res, next) => {

    const { orderItems, shippingAddress, paymentInfo, orderStatus, totalPrice, shippingPrice, taxPrice } = req.body;

    if (!orderItems || !shippingAddress || !paymentInfo || !orderStatus || !totalPrice || !shippingPrice || !taxPrice) {
        return res.status(400).json({
            success: false,
            message: "Please field all required fields",
        });
    }
    try {
        const order = await Order.create({
            orderItems,
            shippingAddress,
            paymentInfo,
            orderStatus,
            totalPrice,
            shippingPrice,
            taxPrice,
            user: req.user._id,
        })
        res.status(200).json({
            success: true,
            order,
        });
    } catch (error) {
        next(error);
    }
}