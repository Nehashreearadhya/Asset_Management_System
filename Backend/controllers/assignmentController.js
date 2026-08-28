const Assignment = require("../models/Assignment");
const Asset = require("../models/Asset");
const Employee = require("../models/Employee");


// ==========================================
// CREATE ASSIGNMENT
// ==========================================

exports.createAssignment = async (req, res) => {
    try {

        const {
            asset,
            employee,
            assignedDate,
            expectedReturnDate,
            purpose,
            remarks
        } = req.body;


        // Required fields
        if (!asset || !employee) {
            return res.status(400).json({
                message: "Asset and employee are required"
            });
        }


        // Check asset exists
        const existingAsset = await Asset.findById(asset);

        if (!existingAsset) {
            return res.status(404).json({
                message: "Asset not found"
            });
        }


        // Check employee exists
        const existingEmployee = await Employee.findById(employee);

        if (!existingEmployee) {
            return res.status(404).json({
                message: "Employee not found"
            });
        }


        // ==========================================
        // IMPORTANT BUSINESS RULE
        // ==========================================

        // Asset must be Available

        if (existingAsset.status !== "Available") {
            return res.status(400).json({
                message: "Asset is already assigned. Return the asset before assigning it to another employee."
            });
        }


        // Double check active assignment
        const activeAssignment = await Assignment.findOne({
            asset: asset,
            status: "Assigned"
        });

        if (activeAssignment) {
            return res.status(400).json({
                message: "Asset is already assigned to another employee"
            });
        }


        // ==========================================
        // CREATE ASSIGNMENT
        // ==========================================

        const assignment = await Assignment.create({

            asset,
            employee,

            assignedDate: assignedDate || Date.now(),

            expectedReturnDate,

            purpose,

            remarks,

            status: "Assigned",

            assignedBy: req.user.id
        });


        // ==========================================
        // CHANGE ASSET STATUS
        // ==========================================

        existingAsset.status = "Assigned";

        await existingAsset.save();


        // Populate response

        const populatedAssignment =
            await Assignment.findById(assignment._id)
                .populate("asset")
                .populate("employee")
                .populate("assignedBy", "name email");


        res.status(201).json({
            message: "Asset assigned successfully",
            assignment: populatedAssignment
        });


    } catch (error) {

        console.error("Create Assignment Error:", error);

        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};



// ==========================================
// GET ALL ASSIGNMENTS
// ==========================================

exports.getAssignments = async (req, res) => {
    try {

        const assignments = await Assignment.find()
            .populate("asset")
            .populate("employee")
            .populate("assignedBy", "name email")
            .sort({ createdAt: -1 });


        res.status(200).json({
            count: assignments.length,
            assignments
        });


    } catch (error) {

        console.error("Get Assignments Error:", error);

        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};



// ==========================================
// GET ASSIGNMENT BY ID
// ==========================================

exports.getAssignmentById = async (req, res) => {
    try {

        const assignment = await Assignment.findById(req.params.id)
            .populate("asset")
            .populate("employee")
            .populate("assignedBy", "name email");


        if (!assignment) {
            return res.status(404).json({
                message: "Assignment not found"
            });
        }


        res.status(200).json({
            assignment
        });


    } catch (error) {

        console.error("Get Assignment Error:", error);

        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};



// ==========================================
// UPDATE ASSIGNMENT
// ==========================================

exports.updateAssignment = async (req, res) => {
    try {

        const assignment = await Assignment.findById(req.params.id);


        if (!assignment) {
            return res.status(404).json({
                message: "Assignment not found"
            });
        }


        // Do not allow modification of returned assignment

        if (assignment.status === "Returned") {
            return res.status(400).json({
                message: "Returned assignment cannot be modified"
            });
        }


        const {
            expectedReturnDate,
            purpose,
            remarks
        } = req.body;


        if (expectedReturnDate !== undefined) {
            assignment.expectedReturnDate = expectedReturnDate;
        }

        if (purpose !== undefined) {
            assignment.purpose = purpose;
        }

        if (remarks !== undefined) {
            assignment.remarks = remarks;
        }


        const updatedAssignment = await assignment.save();


        const populatedAssignment =
            await Assignment.findById(updatedAssignment._id)
                .populate("asset")
                .populate("employee")
                .populate("assignedBy", "name email");


        res.status(200).json({
            message: "Assignment updated successfully",
            assignment: populatedAssignment
        });


    } catch (error) {

        console.error("Update Assignment Error:", error);

        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};



// ==========================================
// DELETE ASSIGNMENT
// ==========================================

exports.deleteAssignment = async (req, res) => {
    try {

        const assignment = await Assignment.findById(req.params.id);


        if (!assignment) {
            return res.status(404).json({
                message: "Assignment not found"
            });
        }


        // Do not delete active assignment

        if (assignment.status === "Assigned") {
            return res.status(400).json({
                message: "Active assignment cannot be deleted. Return the asset first."
            });
        }


        await assignment.deleteOne();


        res.status(200).json({
            message: "Assignment deleted successfully"
        });


    } catch (error) {

        console.error("Delete Assignment Error:", error);

        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};



// ==========================================
// RETURN / RELEASE ASSET
// ==========================================

exports.returnAssignment = async (req, res) => {
    try {

        const assignment = await Assignment.findById(req.params.id);


        if (!assignment) {
            return res.status(404).json({
                message: "Assignment not found"
            });
        }


        // Already returned

        if (assignment.status === "Returned") {
            return res.status(400).json({
                message: "Asset has already been returned"
            });
        }


        // ==========================================
        // UPDATE ASSIGNMENT
        // ==========================================

        assignment.status = "Returned";

        assignment.actualReturnDate = new Date();


        await assignment.save();


        // ==========================================
        // MAKE ASSET AVAILABLE
        // ==========================================

        const asset = await Asset.findById(assignment.asset);


        if (asset) {
            asset.status = "Available";

            await asset.save();
        }


        const populatedAssignment =
            await Assignment.findById(assignment._id)
                .populate("asset")
                .populate("employee")
                .populate("assignedBy", "name email");


        res.status(200).json({
            message: "Asset returned successfully",
            assignment: populatedAssignment
        });


    } catch (error) {

        console.error("Return Assignment Error:", error);

        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};

// ==========================================
// GET MY ASSIGNMENTS
// ==========================================

exports.getMyAssignments = async (req, res) => {
    try {

        // Find employee linked to logged-in user
        const employee = await Employee.findOne({
            email: req.user.email
        });

        if (!employee) {
            return res.status(404).json({
                message: "Employee profile not found"
            });
        }

        const assignments = await Assignment.find({
            employee: employee._id
        })
            .populate(
                "asset",
                "assetName assetCode assetType serialNumber brand model status"
            )
            .populate(
                "employee",
                "employeeId name email phone designation department"
            )
            .populate(
                "assignedBy",
                "name email"
            )
            .sort({
                assignedDate: -1
            });

        res.status(200).json({
            count: assignments.length,
            assignments
        });

    } catch (error) {

        console.error(
            "Get My Assignments Error:",
            error
        );

        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};