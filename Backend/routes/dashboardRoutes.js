const express = require("express");

const router = express.Router();

const {
    getDashboardSummary,
    getDepartmentAssetSummary
} = require("../controllers/dashboardController");

const { protect } =
    require("../middleware/authMiddleware");


// ==========================================
// DASHBOARD SUMMARY
// ==========================================

router.get(
    "/summary",
    protect,
    getDashboardSummary
);


// ==========================================
// DEPARTMENT ASSET SUMMARY
// ==========================================

router.get(
    "/department-assets",
    protect,
    getDepartmentAssetSummary
);


module.exports = router;