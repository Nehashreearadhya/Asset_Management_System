const Employee = require("../models/Employee");
const Department = require("../models/Department");


// ==========================================
// CREATE EMPLOYEE
// ==========================================

exports.createEmployee = async (req, res) => {
    try {

        const {
            employeeId,
            name,
            email,
            phone,
            department,
            designation,
            joiningDate,
            location
        } = req.body;


        // ==========================================
        // VALIDATION
        // ==========================================

        if (
            !employeeId ||
            !name ||
            !email ||
            !phone ||
            !department ||
            !designation ||
            !joiningDate ||
            !location
        ) {
            return res.status(400).json({
                message: "Please provide all employee details"
            });
        }


        // ==========================================
        // CHECK EMPLOYEE ID
        // ==========================================

        const existingEmployeeId = await Employee.findOne({
            employeeId: employeeId.trim()
        });

        if (existingEmployeeId) {
            return res.status(400).json({
                message: "Employee ID already exists"
            });
        }


        // ==========================================
        // CHECK EMAIL
        // ==========================================

        const existingEmail = await Employee.findOne({
            email: email.trim().toLowerCase()
        });

        if (existingEmail) {
            return res.status(400).json({
                message: "Employee email already exists"
            });
        }


        // ==========================================
        // CHECK DEPARTMENT
        // ==========================================

        const departmentExists = await Department.findById(
            department
        );

        if (!departmentExists) {
            return res.status(404).json({
                message: "Department not found"
            });
        }


        // ==========================================
        // CREATE EMPLOYEE
        // ==========================================

        const employee = await Employee.create({

            employeeId: employeeId.trim(),

            name: name.trim(),

            email: email.trim().toLowerCase(),

            phone: phone.trim(),

            department: department,

            designation: designation.trim(),

            joiningDate,

            location: location.trim(),

            status: "Active",

            createdBy: req.user.id
        });


        // ==========================================
        // POPULATE RESPONSE
        // ==========================================

        const createdEmployee = await Employee.findById(
            employee._id
        )
            .populate(
                "department",
                "name description status"
            )
            .populate(
                "createdBy",
                "name email role"
            );


        res.status(201).json({

            message: "Employee created successfully",

            employee: createdEmployee
        });


    } catch (error) {

        console.error(
            "Create Employee Error:",
            error
        );

        res.status(500).json({

            message: "Server error",

            error: error.message
        });
    }
};



// ==========================================
// GET ALL EMPLOYEES
// ==========================================

exports.getEmployees = async (req, res) => {

    try {

        const employees = await Employee.find()

            .populate(
                "department",
                "name description status"
            )

            .populate(
                "createdBy",
                "name email role"
            )

            .sort({
                createdAt: -1
            });


        res.status(200).json({

            count: employees.length,

            employees
        });


    } catch (error) {

        console.error(
            "Get Employees Error:",
            error
        );

        res.status(500).json({

            message: "Server error",

            error: error.message
        });
    }
};



// ==========================================
// GET EMPLOYEE BY ID
// ==========================================

exports.getEmployeeById = async (req, res) => {

    try {

        const employee = await Employee.findById(
            req.params.id
        )

            .populate(
                "department",
                "name description status"
            )

            .populate(
                "createdBy",
                "name email role"
            );


        if (!employee) {

            return res.status(404).json({

                message: "Employee not found"
            });
        }


        res.status(200).json({

            employee
        });


    } catch (error) {

        console.error(
            "Get Employee Error:",
            error
        );

        res.status(500).json({

            message: "Server error",

            error: error.message
        });
    }
};



// ==========================================
// UPDATE EMPLOYEE
// ==========================================

exports.updateEmployee = async (req, res) => {

    try {

        const employee = await Employee.findById(
            req.params.id
        );


        if (!employee) {

            return res.status(404).json({

                message: "Employee not found"
            });
        }


        const {
            employeeId,
            name,
            email,
            phone,
            department,
            designation,
            joiningDate,
            location,
            status
        } = req.body;


        // ==========================================
        // EMPLOYEE ID
        // ==========================================

        if (employeeId !== undefined) {

            const existingEmployeeId =
                await Employee.findOne({

                    employeeId: employeeId.trim(),

                    _id: {
                        $ne: req.params.id
                    }
                });


            if (existingEmployeeId) {

                return res.status(400).json({

                    message: "Employee ID already exists"
                });
            }


            employee.employeeId =
                employeeId.trim();
        }


        // ==========================================
        // NAME
        // ==========================================

        if (name !== undefined) {

            employee.name = name.trim();
        }


        // ==========================================
        // EMAIL
        // ==========================================

        if (email !== undefined) {

            const normalizedEmail =
                email.trim().toLowerCase();


            const existingEmail =
                await Employee.findOne({

                    email: normalizedEmail,

                    _id: {
                        $ne: req.params.id
                    }
                });


            if (existingEmail) {

                return res.status(400).json({

                    message: "Employee email already exists"
                });
            }


            employee.email =
                normalizedEmail;
        }


        // ==========================================
        // PHONE
        // ==========================================

        if (phone !== undefined) {

            employee.phone =
                phone.trim();
        }


        // ==========================================
        // DEPARTMENT
        // ==========================================

        if (department !== undefined) {

            const departmentExists =
                await Department.findById(
                    department
                );


            if (!departmentExists) {

                return res.status(404).json({

                    message: "Department not found"
                });
            }


            employee.department =
                department;
        }


        // ==========================================
        // DESIGNATION
        // ==========================================

        if (designation !== undefined) {

            employee.designation =
                designation.trim();
        }


        // ==========================================
        // JOINING DATE
        // ==========================================

        if (joiningDate !== undefined) {

            employee.joiningDate =
                joiningDate;
        }


        // ==========================================
        // LOCATION
        // ==========================================

        if (location !== undefined) {

            employee.location =
                location.trim();
        }


        // ==========================================
        // STATUS
        // ==========================================

        if (status !== undefined) {

            if (
                !["Active", "Inactive"].includes(
                    status
                )
            ) {

                return res.status(400).json({

                    message: "Invalid employee status"
                });
            }


            employee.status =
                status;
        }


        // ==========================================
        // SAVE
        // ==========================================

        await employee.save();


        // ==========================================
        // POPULATE UPDATED EMPLOYEE
        // ==========================================

        const updatedEmployee =
            await Employee.findById(
                employee._id
            )

                .populate(
                    "department",
                    "name description status"
                )

                .populate(
                    "createdBy",
                    "name email role"
                );


        res.status(200).json({

            message:
                "Employee updated successfully",

            employee:
                updatedEmployee
        });


    } catch (error) {

        console.error(
            "Update Employee Error:",
            error
        );

        res.status(500).json({

            message: "Server error",

            error: error.message
        });
    }
};



// ==========================================
// DELETE EMPLOYEE
// ==========================================

exports.deleteEmployee = async (req, res) => {

    try {

        const employee = await Employee.findById(
            req.params.id
        );


        if (!employee) {

            return res.status(404).json({

                message: "Employee not found"
            });
        }


        await employee.deleteOne();


        res.status(200).json({

            message:
                "Employee deleted successfully"
        });


    } catch (error) {

        console.error(
            "Delete Employee Error:",
            error
        );

        res.status(500).json({

            message: "Server error",

            error: error.message
        });
    }
};