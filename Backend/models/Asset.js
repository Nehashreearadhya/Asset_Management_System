const mongoose = require("mongoose");

const assetSchema = new mongoose.Schema(
    {
        assetName: {
            type: String,
            required: true,
            trim: true
        },

        assetCode: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },

        assetType: {
            type: String,
            required: true,
            enum: [
                "Laptop",
                "Desktop",
                "Monitor",
                "Mobile",
                "Printer",
                "Keyboard",
                "Mouse",
                "Furniture",
                "Other"
            ]
        },

        serialNumber: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },

        brand: {
            type: String,
            required: true,
            trim: true
        },

        model: {
            type: String,
            required: true,
            trim: true
        },

        purchaseDate: {
            type: Date,
            required: true
        },

        purchasePrice: {
            type: Number,
            required: true,
            min: 0
        },

        warrantyExpiry: {
            type: Date
        },

        location: {
            type: String,
            required: true,
            trim: true
        },

        status: {
            type: String,
            enum: [
                "Available",
                "Assigned",
                "Under Repair",
                "Lost",
                "Retired",
                "Disposed"
            ],
            default: "Available"
        },

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    },

    {
        timestamps: true
    }
);

module.exports = mongoose.model("Asset", assetSchema);