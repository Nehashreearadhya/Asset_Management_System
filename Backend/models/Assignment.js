const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema(
    {
        asset: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Asset",
            required: true
        },

        employee: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Employee",
            required: true
        },

        assignedDate: {
            type: Date,
            required: true,
            default: Date.now
        },

        expectedReturnDate: {
            type: Date
        },

        actualReturnDate: {
            type: Date
        },

        purpose: {
            type: String,
            trim: true
        },

        remarks: {
            type: String,
            trim: true
        },

        status: {
            type: String,
            enum: [
                "Assigned",
                "Returned"
            ],
            default: "Assigned"
        },

        assignedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Assignment", assignmentSchema);