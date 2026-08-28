const Department = require("../models/Department");
const Employee = require("../models/Employee");
const Assignment = require("../models/Assignment");


// ==========================================
// CREATE DEPARTMENT
// ==========================================

exports.createDepartment = async (req, res) => {
    try {

        const { name, description } = req.body;

        if (!name) {
            return res.status(400).json({
                message: "Department name is required"
            });
        }

        const existingDepartment = await Department.findOne({
            name: name.trim()
        });

        if (existingDepartment) {
            return res.status(400).json({
                message: "Department already exists"
            });
        }

        const department = await Department.create({
            name: name.trim(),
            description,
            status: "Active",
            createdBy: req.user.id
        });

        const createdDepartment = await Department.findById(
            department._id
        ).populate("createdBy", "name email role");

        res.status(201).json({
            message: "Department created successfully",
            department: createdDepartment
        });

    } catch (error) {

        console.error("Create Department Error:", error);

        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};



// ==========================================
// GET ALL DEPARTMENTS
// ==========================================

exports.getDepartments = async (req, res) => {
    try {

        const departments = await Department.find()
            .populate("createdBy", "name email role")
            .sort({ createdAt: -1 });

        res.status(200).json({
            count: departments.length,
            departments
        });

    } catch (error) {

        console.error("Get Departments Error:", error);

        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};



// ==========================================
// GET DEPARTMENT BY ID
// ==========================================

exports.getDepartmentById = async (req, res) => {
    try {

        const department = await Department.findById(
            req.params.id
        ).populate("createdBy", "name email role");

        if (!department) {
            return res.status(404).json({
                message: "Department not found"
            });
        }

        res.status(200).json({
            department
        });

    } catch (error) {

        console.error("Get Department Error:", error);

        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};



// ==========================================
// UPDATE DEPARTMENT
// ==========================================

exports.updateDepartment = async (req, res) => {
    try {

        const department = await Department.findById(
            req.params.id
        );

        if (!department) {
            return res.status(404).json({
                message: "Department not found"
            });
        }

        const {
            name,
            description,
            status
        } = req.body;


        // Update name

        if (name !== undefined) {

            const existingDepartment = await Department.findOne({
                name: name.trim(),
                _id: { $ne: req.params.id }
            });

            if (existingDepartment) {
                return res.status(400).json({
                    message: "Department name already exists"
                });
            }

            department.name = name.trim();
        }


        // Update description

        if (description !== undefined) {
            department.description = description;
        }


        // Update status

        if (status !== undefined) {

            if (!["Active", "Inactive"].includes(status)) {
                return res.status(400).json({
                    message: "Invalid department status"
                });
            }

            department.status = status;
        }


        await department.save();


        const updatedDepartment =
            await Department.findById(department._id)
                .populate("createdBy", "name email role");


        res.status(200).json({
            message: "Department updated successfully",
            department: updatedDepartment
        });

    } catch (error) {

        console.error("Update Department Error:", error);

        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};



// ==========================================
// DELETE DEPARTMENT
// ==========================================

exports.deleteDepartment = async (req, res) => {
    try {

        const department = await Department.findById(
            req.params.id
        );

        if (!department) {
            return res.status(404).json({
                message: "Department not found"
            });
        }


        // Check employees

        const employees = await Employee.countDocuments({
            department: department._id
        });

        if (employees > 0) {
            return res.status(400).json({
                message: "Cannot delete department because employees are assigned to it"
            });
        }


        await department.deleteOne();

        res.status(200).json({
            message: "Department deleted successfully"
        });

    } catch (error) {

        console.error("Delete Department Error:", error);

        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};



// ==========================================
// GET DEPARTMENT SUMMARY
// ==========================================

exports.getDepartmentSummary = async (req, res) => {
    try {

        const department = await Department.findById(
            req.params.id
        );

        if (!department) {
            return res.status(404).json({
                message: "Department not found"
            });
        }


        // ==================================
        // GET EMPLOYEES
        // ==================================

        const employees = await Employee.find({
            department: department._id
        }).select(
            "employeeId name email designation status"
        );


        const employeeIds = employees.map(
            employee => employee._id
        );


        // ==================================
        // GET ACTIVE ASSIGNMENTS
        // ==================================

        const assignments = await Assignment.find({
            employee: { $in: employeeIds },
            status: "Assigned"
        })
            .populate(
                "employee",
                "employeeId name email designation"
            )
            .populate(
                "asset",
                "assetName assetCode assetType serialNumber brand model status"
            )
            .sort({
                assignedDate: -1
            });


        // ==================================
        // RESPONSE
        // ==================================

        res.status(200).json({

            department: {
                id: department._id,
                name: department.name,
                description: department.description,
                status: department.status
            },

            totalEmployees: employees.length,

            totalAssignedAssets: assignments.length,

            employees: employees,

            assets: assignments.map(assignment => ({

                assignmentId: assignment._id,

                asset: assignment.asset,

                employee: assignment.employee,

                assignedDate: assignment.assignedDate,

                expectedReturnDate:
                    assignment.expectedReturnDate,

                status: assignment.status

            }))

        });

    } catch (error) {

        console.error(
            "Department Summary Error:",
            error
        );

        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};