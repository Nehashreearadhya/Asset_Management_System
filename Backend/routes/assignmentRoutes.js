const express = require("express");

const router = express.Router();

const {
    createAssignment,
    getAssignments,
    getAssignmentById,
    updateAssignment,
    deleteAssignment,
    returnAssignment,
    getMyAssignments
} = require("../controllers/assignmentController");

const { protect } = require("../middleware/authMiddleware");


// ==========================================
// CREATE ASSIGNMENT
// ==========================================

router.post(
    "/create",
    protect,
    createAssignment
);


// ==========================================
// GET ALL ASSIGNMENTS
// ADMIN
// ==========================================

router.get(
    "/getAssignment",
    protect,
    getAssignments
);


// ==========================================
// GET MY ASSIGNMENTS
// EMPLOYEE
// ==========================================

router.get(
    "/myAssignments",
    protect,
    getMyAssignments
);


// ==========================================
// GET ASSIGNMENT BY ID
// ==========================================

router.get(
    "/getAssignment/:id",
    protect,
    getAssignmentById
);


// ==========================================
// UPDATE ASSIGNMENT
// ==========================================

router.put(
    "/updateAssignment/:id",
    protect,
    updateAssignment
);


// ==========================================
// DELETE ASSIGNMENT
// ==========================================

router.delete(
    "/deleteAssignment/:id",
    protect,
    deleteAssignment
);


// ==========================================
// RETURN / RELEASE ASSET
// ==========================================

router.put(
    "/returnAssignment/:id",
    protect,
    returnAssignment
);


module.exports = router;