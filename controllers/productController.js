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
                imagesLinks.push({ url: result.secure_url });
            }
        }

        req.body.imageUrls = imagesLinks;


        if (req.body.availableWeights) {
            req.body.availableWeights = JSON.parse(req.body.availableWeights);
        }

        const product = await Product.create(req.body);
        return res.status(200).json(product);
    } catch (error) {
        next(error);
    }
};

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


exports.getAdminProducts = async (req, res, next) => {
    try {
        const products = await Product.find({ isDeleted: false });

        res.status(200).json(products);
    } catch (error) {
        next(error);
    }
}

exports.getSingleProduct = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return next(errorHandler(404, "Product not found"));
        }

        res.status(200).json(product);
    } catch (error) {
        next(error);
    }
}

exports.getProducts = async (req, res, next) => {
    try {
        const limit = parseInt(req.query.limit) || 9;
        const startIndex = parseInt(req.query.startIndex) || 0;
        let availability = req.query.availability;

        if (availability === undefined || availability === "false") {
            availability = { $in: [false, true] };
        }

        const searchTerm = req.query.searchTerm || '';
        const sort = req.query.sort || "createdAt";
        const order = req.query.order || "desc";


        let aggregationPipeline = [
            {
                $match: {
                    $or: [
                        { name: { $regex: searchTerm, $options: 'i' } },
                        { description: { $regex: searchTerm, $options: 'i' } },
                        { category: { $regex: searchTerm, $options: 'i' } },
                        { origin: { $regex: searchTerm, $options: 'i' } },
                        { roastLevel: { $regex: searchTerm, $options: 'i' } },
                        { processingMethod: { $regex: searchTerm, $options: 'i' } },
                        { harvestSeason: { $regex: searchTerm, $options: 'i' } },
                        { certifications: { $regex: searchTerm, $options: 'i' } },
                    ],
                    availability,
                }
            },
            {
                $addFields: {
                    lowestPrice: { $min: "$availableWeights.price" },
                }
            },
            {
                $sort: {
                    lowestPrice: order === 'desc' ? -1 : 1,
                }
            },
            {
                $skip: startIndex,
            },
            {
                $limit: limit,
            }
        ];


        if (sort !== "Price") {
            aggregationPipeline.unshift({
                $sort: { [sort]: order === "desc" ? -1 : 1 }
            });
        }

        const products = await Product.aggregate(aggregationPipeline);

        return res.status(200).json(products);
    } catch (error) {
        next(error);
    }
};

exports.archivedProduct = async (req, res, next) => {
    try {
        const { id } = req.params;

        const product = await Product.findByIdAndUpdate(
            id,
            { isDeleted: true, deletedAt: Date() },
            { new: true }
        );

        if (!product) {
            return next(errorHandler(404, "Product not found"));
        }

        res.status(200).json("Product archived successfully");
    } catch (error) {
        next(error);
    }
}
