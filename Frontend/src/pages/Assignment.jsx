
import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import "./Assignment.css";

const Assignment = () => {
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");

    // ==========================================
    // FETCH ASSIGNMENTS
    // ==========================================

    const fetchAssignments = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await axios.get(
                "/assignment/getAssignment"
            );

            console.log("Assignment API Response:", response.data);

            let assignmentData = [];

            if (Array.isArray(response.data)) {
                assignmentData = response.data;
            } else if (
                Array.isArray(response.data.assignments)
            ) {
                assignmentData = response.data.assignments;
            } else if (
                Array.isArray(response.data.data)
            ) {
                assignmentData = response.data.data;
            }

            setAssignments(assignmentData);

        } catch (err) {
            console.error(
                "Assignment Fetch Error:",
                err
            );

            console.log(
                "Status:",
                err.response?.status
            );

            console.log(
                "Server Response:",
                err.response?.data
            );

            setError(
                err.response?.data?.message ||
                err.response?.data?.msg ||
                "Failed to fetch assignments"
            );

        } finally {
            setLoading(false);
        }
    };


    // ==========================================
    // LOAD ASSIGNMENTS
    // ==========================================

    useEffect(() => {
        fetchAssignments();
    }, []);


    // ==========================================
    // SEARCH
    // ==========================================

    const filteredAssignments = assignments.filter(
        (assignment) => {

            const searchValue =
                search.toLowerCase().trim();

            if (!searchValue) {
                return true;
            }

            const employeeName =
                assignment.employee?.name
                    ?.toString()
                    .toLowerCase() || "";

            const employeeEmail =
                assignment.employee?.email
                    ?.toString()
                    .toLowerCase() || "";

            const employeeId =
                assignment.employee?.employeeId
                    ?.toString()
                    .toLowerCase() || "";

            const assetName =
                assignment.asset?.name
                    ?.toString()
                    .toLowerCase() || "";

            const assetId =
                assignment.asset?.assetId
                    ?.toString()
                    .toLowerCase() || "";

            const status =
                assignment.status
                    ?.toString()
                    .toLowerCase() || "";

            return (
                employeeName.includes(searchValue) ||
                employeeEmail.includes(searchValue) ||
                employeeId.includes(searchValue) ||
                assetName.includes(searchValue) ||
                assetId.includes(searchValue) ||
                status.includes(searchValue)
            );
        }
    );


    // ==========================================
    // FORMAT DATE
    // ==========================================

    const formatDate = (date) => {

        if (!date) {
            return "N/A";
        }

        return new Date(date).toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        );
    };


    // ==========================================
    // UI
    // ==========================================

    return (
        <div className="assignment-page">

            {/* ==================================
                HEADER
            ================================== */}

            <div className="assignment-header">

                <div>

                    <h1>
                        Assignments
                    </h1>

                    <p>
                        Manage asset assignments
                    </p>

                </div>


                <div className="assignment-total">

                    <strong>
                        {assignments.length}
                    </strong>

                    <span>
                        Total Assignments
                    </span>

                </div>

            </div>


            {/* ==================================
                SEARCH + REFRESH
            ================================== */}

            <div className="assignment-toolbar">

                <div className="assignment-search">

                    <span>
                        🔍
                    </span>

                    <input
                        type="text"
                        placeholder="Search by employee or asset..."
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                    />

                </div>


                <button
                    className="refresh-button"
                    onClick={fetchAssignments}
                >
                    ↻ Refresh
                </button>

            </div>


            {/* ==================================
                LOADING
            ================================== */}

            {loading && (

                <div className="assignment-message">

                    <div className="spinner"></div>

                    <p>
                        Loading assignments...
                    </p>

                </div>

            )}


            {/* ==================================
                ERROR
            ================================== */}

            {!loading && error && (

                <div className="assignment-error">

                    <div className="error-icon">
                        ⚠️
                    </div>

                    <h3>
                        Unable to load assignments
                    </h3>

                    <p>
                        {error}
                    </p>

                    <button
                        onClick={fetchAssignments}
                    >
                        Try Again
                    </button>

                </div>

            )}


            {/* ==================================
                NO ASSIGNMENTS
            ================================== */}

            {!loading &&
                !error &&
                assignments.length === 0 && (

                    <div className="assignment-message">

                        <div className="empty-icon">
                            📋
                        </div>

                        <h3>
                            No assignments found
                        </h3>

                        <p>
                            Assigned assets will appear here.
                        </p>

                    </div>

                )}


            {/* ==================================
                ASSIGNMENT CARDS
            ================================== */}

            {!loading &&
                !error &&
                filteredAssignments.length > 0 && (

                    <div className="assignment-grid">

                        {filteredAssignments.map(
                            (assignment, index) => (

                                <div
                                    className="assignment-card"
                                    key={
                                        assignment._id ||
                                        index
                                    }
                                >

                                    {/* CARD HEADER */}

                                    <div className="assignment-card-header">

                                        <div className="assignment-number">

                                            #{index + 1}

                                        </div>


                                        <span
                                            className={
                                                assignment.status ===
                                                "Returned"
                                                    ? "status returned"
                                                    : "status assigned"
                                            }
                                        >

                                            <span className="status-dot"></span>

                                            {assignment.status ||
                                                "Assigned"}

                                        </span>

                                    </div>


                                    {/* EMPLOYEE */}

                                    <div className="assignment-section">

                                        <h3>
                                            👤 Employee
                                        </h3>

                                        <div className="detail-row">

                                            <span>
                                                Name
                                            </span>

                                            <strong>
                                                {assignment.employee?.name ||
                                                    "N/A"}
                                            </strong>

                                        </div>


                                        <div className="detail-row">

                                            <span>
                                                Employee ID
                                            </span>

                                            <strong>
                                                {assignment.employee?.employeeId ||
                                                    assignment.employee?._id ||
                                                    "N/A"}
                                            </strong>

                                        </div>


                                        <div className="detail-row">

                                            <span>
                                                Email
                                            </span>

                                            <strong>
                                                {assignment.employee?.email ||
                                                    "N/A"}
                                            </strong>

                                        </div>

                                    </div>


                                    {/* ASSET */}

                                    <div className="assignment-section">

                                        <h3>
                                            💻 Asset
                                        </h3>

                                        <div className="detail-row">

                                            <span>
                                                Asset Name
                                            </span>

                                            <strong>
                                                {assignment.asset?.name ||
                                                    "N/A"}
                                            </strong>

                                        </div>


                                        <div className="detail-row">

                                            <span>
                                                Asset ID
                                            </span>

                                            <strong>
                                                {assignment.asset?.assetId ||
                                                    assignment.asset?._id ||
                                                    "N/A"}
                                            </strong>

                                        </div>


                                        <div className="detail-row">

                                            <span>
                                                Category
                                            </span>

                                            <strong>
                                                {assignment.asset?.category ||
                                                    "N/A"}
                                            </strong>

                                        </div>

                                    </div>


                                    {/* ASSIGNMENT DETAILS */}

                                    <div className="assignment-section">

                                        <h3>
                                            📅 Assignment Details
                                        </h3>

                                        <div className="detail-row">

                                            <span>
                                                Assigned Date
                                            </span>

                                            <strong>
                                                {formatDate(
                                                    assignment.assignedDate
                                                )}
                                            </strong>

                                        </div>


                                        <div className="detail-row">

                                            <span>
                                                Expected Return
                                            </span>

                                            <strong>
                                                {formatDate(
                                                    assignment.expectedReturnDate
                                                )}
                                            </strong>

                                        </div>


                                        <div className="detail-row">

                                            <span>
                                                Actual Return
                                            </span>

                                            <strong>
                                                {formatDate(
                                                    assignment.actualReturnDate
                                                )}
                                            </strong>

                                        </div>


                                        <div className="detail-row">

                                            <span>
                                                Purpose
                                            </span>

                                            <strong>
                                                {assignment.purpose ||
                                                    "N/A"}
                                            </strong>

                                        </div>


                                        <div className="detail-row">

                                            <span>
                                                Remarks
                                            </span>

                                            <strong>
                                                {assignment.remarks ||
                                                    "N/A"}
                                            </strong>

                                        </div>

                                    </div>


                                    {/* ASSIGNED BY */}

                                    <div className="assignment-footer">

                                        <span>
                                            Assigned By
                                        </span>

                                        <strong>
                                            {assignment.assignedBy?.name ||
                                                "N/A"}
                                        </strong>

                                    </div>

                                </div>

                            )
                        )}

                    </div>

                )}


            {/* ==================================
                SEARCH NO RESULT
            ================================== */}

            {!loading &&
                !error &&
                assignments.length > 0 &&
                filteredAssignments.length === 0 && (

                    <div className="assignment-message">

                        <div className="empty-icon">
                            🔍
                        </div>

                        <h3>
                            No matching assignments
                        </h3>

                        <p>
                            Try searching for another employee or asset.
                        </p>

                    </div>

                )}

        </div>
    );
};

export default Assignment;

