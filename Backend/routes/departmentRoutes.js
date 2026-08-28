const express = require("express");

const router = express.Router();

const {
    createDepartment,
    getDepartments,
    getDepartmentById,
    updateDepartment,
    deleteDepartment,
    getDepartmentSummary
} = require("../controllers/departmentController");

const { protect } = require("../middleware/authMiddleware");


// ==========================================
// DEPARTMENT CRUD
// ==========================================

// CREATE
router.post(
    "/create",
    protect,
    createDepartment
);


// GET ALL
router.get(
    "/getDepartment",
    protect,
    getDepartments
);


// GET BY ID
router.get(
    "/getDepartment/:id",
    protect,
    getDepartmentById
);


// UPDATE
router.put(
    "/updateDepartment/:id",
    protect,
    updateDepartment
);


// DELETE
router.delete(
    "/deleteDepartment/:id",
    protect,
    deleteDepartment
);


// ==========================================
// DEPARTMENT SUMMARY
// ==========================================

router.get(
    "/summary/:id",
    protect,
    getDepartmentSummary
);


module.exports = router;