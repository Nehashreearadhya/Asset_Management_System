const Asset = require("../models/Asset");


// ======================================
// CREATE ASSET
// ======================================

exports.createAsset = async (req, res) => {
    try {

        const {
            assetName,
            assetCode,
            assetType,
            serialNumber,
            brand,
            model,
            purchaseDate,
            purchasePrice,
            warrantyExpiry,
            location
        } = req.body;


        // Check required fields
        if (
            !assetName ||
            !assetCode ||
            !assetType ||
            !serialNumber ||
            !brand ||
            !model ||
            !purchaseDate ||
            purchasePrice === undefined ||
            !location
        ) {
            return res.status(400).json({
                message: "Please provide all required asset details"
            });
        }


        // Check duplicate asset code
        const existingAssetCode = await Asset.findOne({
            assetCode
        });

        if (existingAssetCode) {
            return res.status(400).json({
                message: "Asset code already exists"
            });
        }


        // Check duplicate serial number
        const existingSerialNumber = await Asset.findOne({
            serialNumber
        });

        if (existingSerialNumber) {
            return res.status(400).json({
                message: "Serial number already exists"
            });
        }


        // Create asset
        const asset = await Asset.create({

            assetName,
            assetCode,
            assetType,
            serialNumber,
            brand,
            model,
            purchaseDate,
            purchasePrice,
            warrantyExpiry,
            location,

            // Automatically set
            status: "Available",

            // Comes from JWT middleware
            createdBy: req.user.id
        });


        res.status(201).json({
            message: "Asset created successfully",
            asset
        });

    } catch (error) {

        res.status(500).json({
            message: "Server error",
            error: error.message
        });

    }
};



// ======================================
// GET ALL ASSETS
// ======================================

exports.getAssets = async (req, res) => {
    try {

        const assets = await Asset.find()
            .populate("createdBy", "name email role")
            .sort({ createdAt: -1 });


        res.status(200).json({
            count: assets.length,
            assets
        });

    } catch (error) {

        res.status(500).json({
            message: "Server error",
            error: error.message
        });

    }
};



// ======================================
// GET SINGLE ASSET
// ======================================

exports.getAssetById = async (req, res) => {
    try {

        const asset = await Asset.findById(req.params.id)
            .populate("createdBy", "name email role");


        if (!asset) {
            return res.status(404).json({
                message: "Asset not found"
            });
        }


        res.status(200).json({
            asset
        });

    } catch (error) {

        res.status(500).json({
            message: "Server error",
            error: error.message
        });

    }
};



// ======================================
// UPDATE ASSET
// ======================================

exports.updateAsset = async (req, res) => {
    try {

        const asset = await Asset.findById(req.params.id);


        if (!asset) {
            return res.status(404).json({
                message: "Asset not found"
            });
        }


        const {
            assetName,
            assetCode,
            assetType,
            serialNumber,
            brand,
            model,
            purchaseDate,
            purchasePrice,
            warrantyExpiry,
            location,
            status
        } = req.body;


        // Update only provided fields

        if (assetName !== undefined)
            asset.assetName = assetName;

        if (assetCode !== undefined)
            asset.assetCode = assetCode;

        if (assetType !== undefined)
            asset.assetType = assetType;

        if (serialNumber !== undefined)
            asset.serialNumber = serialNumber;

        if (brand !== undefined)
            asset.brand = brand;

        if (model !== undefined)
            asset.model = model;

        if (purchaseDate !== undefined)
            asset.purchaseDate = purchaseDate;

        if (purchasePrice !== undefined)
            asset.purchasePrice = purchasePrice;

        if (warrantyExpiry !== undefined)
            asset.warrantyExpiry = warrantyExpiry;

        if (location !== undefined)
            asset.location = location;

        if (status !== undefined)
            asset.status = status;


        const updatedAsset = await asset.save();


        res.status(200).json({
            message: "Asset updated successfully",
            asset: updatedAsset
        });

    } catch (error) {

        res.status(500).json({
            message: "Server error",
            error: error.message
        });

    }
};



// ======================================
// DELETE ASSET
// ======================================

exports.deleteAsset = async (req, res) => {
    try {

        const asset = await Asset.findById(req.params.id);


        if (!asset) {
            return res.status(404).json({
                message: "Asset not found"
            });
        }


        await asset.deleteOne();


        res.status(200).json({
            message: "Asset deleted successfully"
        });

    } catch (error) {

        res.status(500).json({
            message: "Server error",
            error: error.message
        });

    }
};