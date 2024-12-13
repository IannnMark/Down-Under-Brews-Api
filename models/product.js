const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    origin: {
        type: String,
        required: true,
    },
    roastLevel: {
        type: String,
        enum: ["Light", "Medium", "Dark"],
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    availableWeights: {
        type: [
            {
                weight: { type: String, required: true },
                stock: { type: Number, required: true, min: 0 },
            },
        ],
        required: true,
    },
    availability: {
        type: Boolean,
        required: true,
    },
    processingMethod: {
        type: String,
        enum: ["Washed", "Natural", "Honey-Processed"],
        required: true,
    },
    harvestSeason: {
        type: String,
        required: false,
    },
    certifications: {
        type: String,
        required: false,
    },
    imageUrls: {
        type: Array,
        required: true,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
    deletedAt: {
        type: Date,
        default: null,
    }
}, { timestamps: true })

module.exports = mongoose.model("Product", productSchema);