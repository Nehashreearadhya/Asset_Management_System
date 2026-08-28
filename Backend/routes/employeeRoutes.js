const express = require("express");

const router = express.Router();

const {
    createEmployee,
    getEmployees,
    getEmployeeById,
    updateEmployee,
    deleteEmployee
} = require("../controllers/employeeController");

const { protect } = require("../middleware/authMiddleware");


// CREATE EMPLOYEE
router.post("/create", protect, createEmployee);


// GET ALL EMPLOYEES
router.get("/getEmployee", protect, getEmployees);


// GET EMPLOYEE BY ID
router.get("/getEmployee/:id", protect, getEmployeeById);


// UPDATE EMPLOYEE
router.put("/updateEmployee/:id", protect, updateEmployee);


// DELETE EMPLOYEE
router.delete("/deleteEmployee/:id", protect, deleteEmployee);


module.exports = router;