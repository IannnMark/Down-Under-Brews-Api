const Product = require("../models/product");
const errorHandler = require("../utils/error");
const cloudinary = require("cloudinary");

exports.createProduct = async (req, res, next) => {
    try {
        let imagesLinks = [];

        if (req.files && req.files.length > 0) {
            for (const file of req.files) {
                const result = await cloudinary.v2.uploader.upload(file.path, {
                    folder: "Products",
                });
                imagesLinks.push({
                    url: result.secure_url,
                });
            }
        }

        req.body.imageUrls = imagesLinks;

        const product = await Product.create(req.body);
        return res.status(200).json(product);
    } catch (error) {
        next(error);
    }
}

exports.deleteProduct = async (req, res, next) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        return next(errorHandler(404, "Product not found"));
    }
    try {
        await Product.findByIdAndDelete(req.params.id);
        return res.status(200).json("Product has been deleted")
    } catch (error) {
        next(error);
    }
}

exports.updateProduct = async (req, res, next) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        return next(errorHandler(404, "Product not found"));
    }
    try {
        if (req.files && req.files.length > 0) {
            if (product.imageUrls && Array.isArray(product.imageUrls)) {
                for (const image of product.imageUrls) {
                    if (image.public_id) {
                        await cloudinary.uploader.destroy(image.public_id);
                    }
                }
            }

            const imagesLinks = [];
            for (const file of req.files) {
                const result = await cloudinary.v2.uploader.upload(file.path, {
                    folder: "Products",
                });
                imagesLinks.push({
                    url: result.secure_url,
                });
            }

            res.body.imageUrls = imagesLinks;
        } else {
            req.body.imageUrls = product.imageUrls;

        }

        const updateProduct = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.status(200).json(updateProduct);

    } catch (error) {
        next(error);
    }
}