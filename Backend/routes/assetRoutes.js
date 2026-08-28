const express = require("express");

const router = express.Router();

const {
    createAsset,
    getAssets,
    getAssetById,
    updateAsset,
    deleteAsset
} = require("../controllers/assetController");

const { protect } = require("../middleware/authMiddleware");


// Create Asset
router.post("/create", protect, createAsset);


// Get All Assets
router.get("/getAsset", protect, getAssets);


// Get Asset By ID
router.get("/getAsset/:id", protect, getAssetById);


// Update Asset
router.put("/updateAsset/:id", protect, updateAsset);


// Delete Asset
router.delete("/deleteAsset/:id", protect, deleteAsset);


module.exports = router;