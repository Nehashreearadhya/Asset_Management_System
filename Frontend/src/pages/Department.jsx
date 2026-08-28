import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import "./Department.css";

const Department = () => {

    // ==========================================
    // STATES
    // ==========================================

    const [departments, setDepartments] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [success, setSuccess] = useState("");

    const [showModal, setShowModal] = useState(false);

    const [editingDepartment, setEditingDepartment] = useState(null);

    const [search, setSearch] = useState("");

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        status: "Active"
    });


    // ==========================================
    // GET ALL DEPARTMENTS
    // ==========================================

    const fetchDepartments = async () => {

        try {

            setLoading(true);
            setError("");

            const response = await axios.get(
                "/department/getDepartment"
            );

            console.log(
                "Department API Response:",
                response.data
            );

            setDepartments(
                response.data.departments || []
            );

        } catch (err) {

            console.error(
                "Fetch Departments Error:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Failed to fetch departments"
            );

        } finally {

            setLoading(false);

        }
    };


    // ==========================================
    // LOAD DEPARTMENTS
    // ==========================================

    useEffect(() => {

        fetchDepartments();

    }, []);


    // ==========================================
    // FORM INPUT CHANGE
    // ==========================================

    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value
        });

    };


    // ==========================================
    // OPEN ADD MODAL
    // ==========================================

    const openAddModal = () => {

        setEditingDepartment(null);

        setFormData({
            name: "",
            description: "",
            status: "Active"
        });

        setError("");
        setSuccess("");

        setShowModal(true);

    };


    // ==========================================
    // OPEN EDIT MODAL
    // ==========================================

    const openEditModal = (department) => {

        setEditingDepartment(department);

        setFormData({
            name: department.name || "",
            description: department.description || "",
            status: department.status || "Active"
        });

        setError("");
        setSuccess("");

        setShowModal(true);

    };


    // ==========================================
    // CLOSE MODAL
    // ==========================================

    const closeModal = () => {

        setShowModal(false);

        setEditingDepartment(null);

        setFormData({
            name: "",
            description: "",
            status: "Active"
        });

    };


    // ==========================================
    // CREATE / UPDATE DEPARTMENT
    // ==========================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");
        setSuccess("");

        if (!formData.name.trim()) {

            setError(
                "Department name is required"
            );

            return;
        }


        try {

            if (editingDepartment) {

                // ==================================
                // UPDATE
                // ==================================

                const response = await axios.put(
                    `/department/updateDepartment/${editingDepartment._id}`,
                    formData
                );

                setSuccess(
                    response.data.message ||
                    "Department updated successfully"
                );

            } else {

                // ==================================
                // CREATE
                // ==================================

                const response = await axios.post(
                    "/department/create",
                    {
                        name: formData.name,
                        description: formData.description
                    }
                );

                setSuccess(
                    response.data.message ||
                    "Department created successfully"
                );

            }


            // Refresh department list

            await fetchDepartments();

            // Close modal

            setShowModal(false);

            setEditingDepartment(null);

            setFormData({
                name: "",
                description: "",
                status: "Active"
            });


        } catch (err) {

            console.error(
                "Department Save Error:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Failed to save department"
            );

        }

    };


    // ==========================================
    // DELETE DEPARTMENT
    // ==========================================

    const deleteDepartment = async (id) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this department?"
        );

        if (!confirmDelete) {
            return;
        }


        try {

            const response = await axios.delete(
                `/department/deleteDepartment/${id}`
            );

            setSuccess(
                response.data.message ||
                "Department deleted successfully"
            );

            fetchDepartments();

        } catch (err) {

            console.error(
                "Delete Department Error:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Failed to delete department"
            );

        }

    };


    // ==========================================
    // SEARCH
    // ==========================================

    const filteredDepartments =
        departments.filter((department) => {

            const searchText =
                search.toLowerCase();

            return (

                department.name
                    ?.toLowerCase()
                    .includes(searchText)

                ||

                department.description
                    ?.toLowerCase()
                    .includes(searchText)

                ||

                department.status
                    ?.toLowerCase()
                    .includes(searchText)

            );

        });


    // ==========================================
    // TOTAL ACTIVE
    // ==========================================

    const activeDepartments =
        departments.filter(
            department =>
                department.status === "Active"
        ).length;


    // ==========================================
    // TOTAL INACTIVE
    // ==========================================

    const inactiveDepartments =
        departments.filter(
            department =>
                department.status === "Inactive"
        ).length;


    // ==========================================
    // UI
    // ==========================================

    return (

        <div className="department-page">


            {/* ==================================
                HEADER
            ================================== */}

            <div className="department-header">

                <div>

                    <h1>
                        Departments
                    </h1>

                    <p>
                        Manage and view all departments
                    </p>

                </div>


                <button
                    className="add-department-btn"
                    onClick={openAddModal}
                >
                    + Add Department
                </button>

            </div>


            {/* ==================================
                SUCCESS MESSAGE
            ================================== */}

            {success && (

                <div className="department-success">

                    {success}

                </div>

            )}


            {/* ==================================
                ERROR MESSAGE
            ================================== */}

            {error && (

                <div className="department-error">

                    {error}

                </div>

            )}


            {/* ==================================
                SUMMARY
            ================================== */}

            <div className="department-summary">


                <div className="department-card">

                    <h3>
                        Total Departments
                    </h3>

                    <div className="number">
                        {departments.length}
                    </div>

                </div>


                <div className="department-card">

                    <h3>
                        Active Departments
                    </h3>

                    <div className="number">
                        {activeDepartments}
                    </div>

                </div>


                <div className="department-card">

                    <h3>
                        Inactive Departments
                    </h3>

                    <div className="number">
                        {inactiveDepartments}
                    </div>

                </div>

            </div>


            {/* ==================================
                SEARCH
            ================================== */}

            <div className="department-toolbar">

                <input
                    type="text"
                    className="department-search"
                    placeholder="🔍 Search departments..."
                    value={search}
                    onChange={(e) =>
                        setSearch(e.target.value)
                    }
                />

            </div>


            {/* ==================================
                LOADING
            ================================== */}

            {loading && (

                <div className="department-loading">

                    Loading departments...

                </div>

            )}


            {/* ==================================
                DEPARTMENT CARDS
            ================================== */}

            {!loading && (

                <div className="department-cards-container">


                    {filteredDepartments.length === 0 ? (

                        <div className="department-empty">

                            <div className="department-empty-icon">
                                🏢
                            </div>

                            <h3>
                                No Departments Found
                            </h3>

                            <p>
                                Click "Add Department" to create your first department.
                            </p>

                        </div>

                    ) : (

                        <div className="department-cards">


                            {filteredDepartments.map(
                                (department, index) => (

                                    <div
                                        className="department-display-card"
                                        key={department._id}
                                    >


                                        {/* CARD TOP */}

                                        <div className="department-card-top">

                                            <div className="department-card-icon">
                                                🏢
                                            </div>

                                            <span
                                                className={`department-status ${
                                                    department.status === "Active"
                                                        ? "status-active"
                                                        : "status-inactive"
                                                }`}
                                            >
                                                {department.status}
                                            </span>

                                        </div>


                                        {/* DEPARTMENT NAME */}

                                        <h2>
                                            {department.name}
                                        </h2>


                                        {/* DESCRIPTION */}

                                        <p className="department-description">

                                            {department.description ||
                                                "No description available"}

                                        </p>


                                        {/* CREATED DATE */}

                                        <div className="department-info">

                                            <span>
                                                📅 Created
                                            </span>

                                            <strong>
                                                {department.createdAt
                                                    ? new Date(
                                                        department.createdAt
                                                    ).toLocaleDateString()
                                                    : "-"}
                                            </strong>

                                        </div>


                                        {/* CREATED BY */}

                                        {department.createdBy && (

                                            <div className="department-info">

                                                <span>
                                                    👤 Created By
                                                </span>

                                                <strong>
                                                    {department.createdBy.name ||
                                                        department.createdBy.email ||
                                                        "-"}
                                                </strong>

                                            </div>

                                        )}


                                        {/* ACTIONS */}

                                        <div className="department-card-actions">

                                            <button
                                                className="edit-btn"
                                                onClick={() =>
                                                    openEditModal(
                                                        department
                                                    )
                                                }
                                            >
                                                Edit
                                            </button>


                                            <button
                                                className="delete-btn"
                                                onClick={() =>
                                                    deleteDepartment(
                                                        department._id
                                                    )
                                                }
                                            >
                                                Delete
                                            </button>

                                        </div>

                                    </div>

                                )
                            )}

                        </div>

                    )}

                </div>

            )}


            {/* ==================================
                ADD / EDIT MODAL
            ================================== */}

            {showModal && (

                <div className="department-modal-overlay">

                    <div className="department-modal">


                        {/* MODAL HEADER */}

                        <div className="department-modal-header">

                            <h2>

                                {editingDepartment
                                    ? "Edit Department"
                                    : "Add Department"}

                            </h2>


                            <button
                                className="close-modal"
                                onClick={closeModal}
                            >
                                ×
                            </button>

                        </div>


                        {/* FORM */}

                        <form
                            onSubmit={handleSubmit}
                            className="department-form"
                        >


                            {/* NAME */}

                            <div className="department-form-group">

                                <label>
                                    Department Name *
                                </label>

                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Enter department name"
                                    required
                                />

                            </div>


                            {/* DESCRIPTION */}

                            <div className="department-form-group">

                                <label>
                                    Description
                                </label>

                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="Enter department description"
                                />

                            </div>


                            {/* STATUS */}

                            {editingDepartment && (

                                <div className="department-form-group">

                                    <label>
                                        Status
                                    </label>

                                    <select
                                        name="status"
                                        value={formData.status}
                                        onChange={handleChange}
                                    >

                                        <option value="Active">
                                            Active
                                        </option>

                                        <option value="Inactive">
                                            Inactive
                                        </option>

                                    </select>

                                </div>

                            )}


                            {/* BUTTONS */}

                            <div className="department-form-actions">

                                <button
                                    type="button"
                                    className="cancel-btn"
                                    onClick={closeModal}
                                >
                                    Cancel
                                </button>


                                <button
                                    type="submit"
                                    className="save-department-btn"
                                >

                                    {editingDepartment
                                        ? "Update Department"
                                        : "Create Department"}

                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}

        </div>

    );

};

export default Department;