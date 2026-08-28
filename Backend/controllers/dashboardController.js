const Asset = require("../models/Asset");
const Employee = require("../models/Employee");
const Department = require("../models/Department");
const Assignment = require("../models/Assignment");


// ==========================================
// DASHBOARD SUMMARY
// ==========================================

exports.getDashboardSummary = async (req, res) => {

    try {

        const totalAssets =
            await Asset.countDocuments();

        const availableAssets =
            await Asset.countDocuments({
                status: "Available"
            });

        const assignedAssets =
            await Asset.countDocuments({
                status: "Assigned"
            });

        const totalEmployees =
            await Employee.countDocuments();

        const totalDepartments =
            await Department.countDocuments();

        const totalAssignments =
            await Assignment.countDocuments();


        res.status(200).json({

            totalAssets,

            availableAssets,

            assignedAssets,

            totalEmployees,

            totalDepartments,

            totalAssignments

        });


    } catch (error) {

        console.error(
            "Dashboard Summary Error:",
            error
        );

        res.status(500).json({

            message: "Server error",

            error: error.message

        });
    }
};



// ==========================================
// DEPARTMENT-WISE ASSET COUNT
// ==========================================

exports.getDepartmentAssetSummary = async (req, res) => {

    try {

        const departments =
            await Department.find()
                .select("name status")
                .sort({ name: 1 });


        const result = [];


        for (const department of departments) {

            // Employees belonging to department

            const employees =
                await Employee.find({
                    department: department._id
                }).select("_id");


            const employeeIds =
                employees.map(
                    employee => employee._id
                );


            // Active assignments for those employees

            const assetCount =
                await Assignment.countDocuments({

                    employee: {
                        $in: employeeIds
                    },

                    status: "Assigned"

                });


            result.push({

                department: department.name,

                assetCount: assetCount

            });
        }


        res.status(200).json({

            departments: result

        });


    } catch (error) {

        console.error(
            "Department Asset Summary Error:",
            error
        );

        res.status(500).json({

            message: "Server error",

            error: error.message

        });
    }
};