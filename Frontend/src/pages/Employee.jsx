
import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import "./Employee.css";

const Employee = () => {

    // ==========================================
    // STATES
    // ==========================================

    const [employees, setEmployees] = useState([]);
    const [departments, setDepartments] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [showForm, setShowForm] = useState(false);
    const [saving, setSaving] = useState(false);

    const [selectedEmployee, setSelectedEmployee] =
        useState(null);


    // ==========================================
    // FORM DATA
    // ==========================================

    const [formData, setFormData] = useState({
        employeeId: "",
        name: "",
        email: "",
        phone: "",
        department: "",
        designation: "",
        joiningDate: "",
        location: ""
    });


    // ==========================================
    // GET ALL EMPLOYEES
    // ==========================================

    const fetchEmployees = async () => {

        try {

            setLoading(true);
            setError("");

            const response =
                await axios.get(
                    "/employee/getEmployee"
                );

            console.log(
                "Employees:",
                response.data
            );

            setEmployees(
                response.data.employees || []
            );

        } catch (err) {

            console.error(
                "Fetch Employees Error:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Failed to fetch employees"
            );

        } finally {

            setLoading(false);

        }
    };


    // ==========================================
    // GET ALL DEPARTMENTS
    // ==========================================

    const fetchDepartments = async () => {

        try {

            const response =
                await axios.get(
                    "/department/getDepartment"
                );

            console.log(
                "Departments:",
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

        }
    };


    // ==========================================
    // LOAD DATA
    // ==========================================

    useEffect(() => {

        fetchEmployees();
        fetchDepartments();

    }, []);


    // ==========================================
    // HANDLE FORM INPUT
    // ==========================================

    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value
        }));

    };


    // ==========================================
    // OPEN CREATE FORM
    // ==========================================

    const openCreateForm = () => {

        setFormData({
            employeeId: "",
            name: "",
            email: "",
            phone: "",
            department: "",
            designation: "",
            joiningDate: "",
            location: ""
        });

        setShowForm(true);

    };


    // ==========================================
    // CLOSE FORM
    // ==========================================

    const closeForm = () => {

        setShowForm(false);

        setFormData({
            employeeId: "",
            name: "",
            email: "",
            phone: "",
            department: "",
            designation: "",
            joiningDate: "",
            location: ""
        });

    };


    // ==========================================
    // CREATE EMPLOYEE
    // ==========================================

    const createEmployee = async (e) => {

        e.preventDefault();

        try {

            setSaving(true);

            const response =
                await axios.post(
                    "/employee/create",
                    formData
                );

            console.log(
                "Created Employee:",
                response.data
            );

            alert(
                response.data.message ||
                "Employee created successfully"
            );

            closeForm();

            await fetchEmployees();

        } catch (err) {

            console.error(
                "Create Employee Error:",
                err
            );

            alert(
                err.response?.data?.message ||
                "Failed to create employee"
            );

        } finally {

            setSaving(false);

        }
    };


    // ==========================================
    // DELETE EMPLOYEE
    // ==========================================

    const deleteEmployee = async (id) => {

        const confirmDelete =
            window.confirm(
                "Are you sure you want to delete this employee?"
            );

        if (!confirmDelete) {
            return;
        }

        try {

            await axios.delete(
                `/employee/deleteEmployee/${id}`
            );

            alert(
                "Employee deleted successfully"
            );

            fetchEmployees();

        } catch (err) {

            console.error(
                "Delete Employee Error:",
                err
            );

            alert(
                err.response?.data?.message ||
                "Failed to delete employee"
            );

        }
    };


    // ==========================================
    // VIEW EMPLOYEE
    // ==========================================

    const viewEmployee = (employee) => {

        setSelectedEmployee(employee);

    };


    // ==========================================
    // CLOSE DETAILS
    // ==========================================

    const closeDetails = () => {

        setSelectedEmployee(null);

    };


    // ==========================================
    // FORMAT DATE
    // ==========================================

    const formatDate = (date) => {

        if (!date) {
            return "-";
        }

        return new Date(date).toLocaleDateString(
            "en-IN"
        );

    };


    // ==========================================
    // RENDER
    // ==========================================

    return (

        <div className="employee-page">

            {/* ==========================================
                HEADER
            ========================================== */}

            <div className="employee-header">

                <div>

                    <h1>
                        Employees
                    </h1>

                    <p>
                        Manage and view all employees
                    </p>

                </div>


                <div className="employee-header-actions">

                    <button
                        className="refresh-btn"
                        onClick={fetchEmployees}
                    >
                        ↻ Refresh
                    </button>


                    <button
                        className="add-employee-btn"
                        onClick={openCreateForm}
                    >
                        + Add Employee
                    </button>

                </div>

            </div>


            {/* ==========================================
                SUMMARY
            ========================================== */}

            <div className="employee-summary">

                <div className="employee-summary-card">

                    <div className="employee-icon">
                        👥
                    </div>

                    <div>

                        <p>
                            Total Employees
                        </p>

                        <h2>
                            {employees.length}
                        </h2>

                    </div>

                </div>

            </div>


            {/* ==========================================
                CREATE EMPLOYEE FORM
            ========================================== */}

            {showForm && (

                <div className="employee-form-container">

                    <div className="form-title">

                        <div>

                            <h2>
                                Create Employee
                            </h2>

                            <p>
                                Enter employee information
                            </p>

                        </div>


                        <button
                            className="close-btn"
                            onClick={closeForm}
                            type="button"
                        >
                            ×
                        </button>

                    </div>


                    <form
                        className="employee-form"
                        onSubmit={createEmployee}
                    >

                        {/* Employee ID */}

                        <div className="form-group">

                            <label>
                                Employee ID *
                            </label>

                            <input
                                type="text"
                                name="employeeId"
                                value={
                                    formData.employeeId
                                }
                                onChange={handleChange}
                                placeholder="EMP001"
                                required
                            />

                        </div>


                        {/* Name */}

                        <div className="form-group">

                            <label>
                                Full Name *
                            </label>

                            <input
                                type="text"
                                name="name"
                                value={
                                    formData.name
                                }
                                onChange={handleChange}
                                placeholder="Enter full name"
                                required
                            />

                        </div>


                        {/* Email */}

                        <div className="form-group">

                            <label>
                                Email *
                            </label>

                            <input
                                type="email"
                                name="email"
                                value={
                                    formData.email
                                }
                                onChange={handleChange}
                                placeholder="employee@gmail.com"
                                required
                            />

                        </div>


                        {/* Phone */}

                        <div className="form-group">

                            <label>
                                Phone *
                            </label>

                            <input
                                type="tel"
                                name="phone"
                                value={
                                    formData.phone
                                }
                                onChange={handleChange}
                                placeholder="9876543210"
                                required
                            />

                        </div>


                        {/* Department */}

                        <div className="form-group">

                            <label>
                                Department *
                            </label>

                            <select
                                name="department"
                                value={
                                    formData.department
                                }
                                onChange={handleChange}
                                required
                            >

                                <option value="">
                                    Select Department
                                </option>

                                {departments.map(
                                    (department) => (

                                        <option
                                            key={
                                                department._id
                                            }
                                            value={
                                                department._id
                                            }
                                        >
                                            {
                                                department.name
                                            }
                                        </option>

                                    )
                                )}

                            </select>

                            {departments.length === 0 && (
                                <small className="form-warning">
                                    No departments found.
                                    Create a department first.
                                </small>
                            )}

                        </div>


                        {/* Designation */}

                        <div className="form-group">

                            <label>
                                Designation *
                            </label>

                            <input
                                type="text"
                                name="designation"
                                value={
                                    formData.designation
                                }
                                onChange={handleChange}
                                placeholder="Software Developer"
                                required
                            />

                        </div>


                        {/* Joining Date */}

                        <div className="form-group">

                            <label>
                                Joining Date *
                            </label>

                            <input
                                type="date"
                                name="joiningDate"
                                value={
                                    formData.joiningDate
                                }
                                onChange={handleChange}
                                required
                            />

                        </div>


                        {/* Location */}

                        <div className="form-group">

                            <label>
                                Location *
                            </label>

                            <input
                                type="text"
                                name="location"
                                value={
                                    formData.location
                                }
                                onChange={handleChange}
                                placeholder="Bangalore"
                                required
                            />

                        </div>


                        {/* FORM BUTTONS */}

                        <div className="form-buttons">

                            <button
                                type="button"
                                className="cancel-btn"
                                onClick={closeForm}
                            >
                                Cancel
                            </button>


                            <button
                                type="submit"
                                className="save-btn"
                                disabled={saving}
                            >

                                {saving
                                    ? "Creating..."
                                    : "Create Employee"}

                            </button>

                        </div>

                    </form>

                </div>

            )}


            {/* ==========================================
                ERROR
            ========================================== */}

            {error && (

                <div className="employee-error">

                    <div>

                        <strong>
                            Unable to load employees
                        </strong>

                        <p>
                            {error}
                        </p>

                    </div>


                    <button
                        onClick={fetchEmployees}
                    >
                        Try Again
                    </button>

                </div>

            )}


            {/* ==========================================
                LOADING
            ========================================== */}

            {loading && (

                <div className="employee-loading">

                    <div className="loading-spinner">
                        ⟳
                    </div>

                    <p>
                        Loading employees...
                    </p>

                </div>

            )}


            {/* ==========================================
                EMPLOYEE CARDS
            ========================================== */}

            {!loading && !error && (

                <div className="employee-card-grid">

                    {employees.length === 0 ? (

                        <div className="employee-empty">

                            <div className="empty-icon">
                                👥
                            </div>

                            <h3>
                                No Employees Found
                            </h3>

                            <p>
                                Click "+ Add Employee"
                                to create an employee.
                            </p>

                        </div>

                    ) : (

                        employees.map(
                            (employee) => (

                                <div
                                    className="employee-card"
                                    key={
                                        employee._id
                                    }
                                >

                                    {/* CARD HEADER */}

                                    <div className="employee-card-header">

                                        <div className="employee-avatar">

                                            {employee.name
                                                ? employee.name
                                                    .charAt(0)
                                                    .toUpperCase()
                                                : "?"}

                                        </div>


                                        <div className="employee-card-title">

                                            <h3>
                                                {
                                                    employee.name ||
                                                    "-"
                                                }
                                            </h3>

                                            <span>
                                                {
                                                    employee.employeeId ||
                                                    "-"
                                                }
                                            </span>

                                        </div>


                                        <span
                                            className={`employee-status ${
                                                employee.status ===
                                                "Active"
                                                    ? "status-active"
                                                    : "status-inactive"
                                            }`}
                                        >
                                            {
                                                employee.status ||
                                                "Unknown"
                                            }
                                        </span>

                                    </div>


                                    {/* CARD DETAILS */}

                                    <div className="employee-card-details">

                                        <div className="employee-detail">

                                            <span>
                                                📧 Email
                                            </span>

                                            <strong>
                                                {
                                                    employee.email ||
                                                    "-"
                                                }
                                            </strong>

                                        </div>


                                        <div className="employee-detail">

                                            <span>
                                                📱 Phone
                                            </span>

                                            <strong>
                                                {
                                                    employee.phone ||
                                                    "-"
                                                }
                                            </strong>

                                        </div>


                                        <div className="employee-detail">

                                            <span>
                                                🏢 Department
                                            </span>

                                            <strong>
                                                {
                                                    employee.department?.name ||
                                                    "-"
                                                }
                                            </strong>

                                        </div>


                                        <div className="employee-detail">

                                            <span>
                                                💼 Designation
                                            </span>

                                            <strong>
                                                {
                                                    employee.designation ||
                                                    "-"
                                                }
                                            </strong>

                                        </div>


                                        <div className="employee-detail">

                                            <span>
                                                📍 Location
                                            </span>

                                            <strong>
                                                {
                                                    employee.location ||
                                                    "-"
                                                }
                                            </strong>

                                        </div>


                                        <div className="employee-detail">

                                            <span>
                                                📅 Joining Date
                                            </span>

                                            <strong>
                                                {
                                                    formatDate(
                                                        employee.joiningDate
                                                    )
                                                }
                                            </strong>

                                        </div>

                                    </div>


                                    {/* ACTIONS */}

                                    <div className="employee-card-actions">

                                        <button
                                            className="view-btn"
                                            onClick={() =>
                                                viewEmployee(
                                                    employee
                                                )
                                            }
                                        >
                                            View Details
                                        </button>


                                        <button
                                            className="delete-btn"
                                            onClick={() =>
                                                deleteEmployee(
                                                    employee._id
                                                )
                                            }
                                        >
                                            Delete
                                        </button>

                                    </div>

                                </div>

                            )
                        )

                    )}

                </div>

            )}


            {/* ==========================================
                EMPLOYEE DETAILS MODAL
            ========================================== */}

            {selectedEmployee && (

                <div
                    className="employee-modal-overlay"
                    onClick={closeDetails}
                >

                    <div
                        className="employee-modal"
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                    >

                        <div className="modal-header">

                            <div>

                                <h2>
                                    Employee Details
                                </h2>

                                <p>
                                    Complete employee information
                                </p>

                            </div>


                            <button
                                className="close-btn"
                                onClick={closeDetails}
                            >
                                ×
                            </button>

                        </div>


                        <div className="modal-profile">

                            <div className="modal-avatar">

                                {selectedEmployee.name
                                    ?.charAt(0)
                                    .toUpperCase()}

                            </div>


                            <div>

                                <h3>
                                    {
                                        selectedEmployee.name
                                    }
                                </h3>

                                <p>
                                    {
                                        selectedEmployee.employeeId
                                    }
                                </p>

                            </div>

                        </div>


                        <div className="modal-details">

                            <div>
                                <span>
                                    Employee ID
                                </span>
                                <strong>
                                    {
                                        selectedEmployee.employeeId
                                    }
                                </strong>
                            </div>


                            <div>
                                <span>
                                    Full Name
                                </span>
                                <strong>
                                    {
                                        selectedEmployee.name
                                    }
                                </strong>
                            </div>


                            <div>
                                <span>
                                    Email
                                </span>
                                <strong>
                                    {
                                        selectedEmployee.email
                                    }
                                </strong>
                            </div>


                            <div>
                                <span>
                                    Phone
                                </span>
                                <strong>
                                    {
                                        selectedEmployee.phone
                                    }
                                </strong>
                            </div>


                            <div>
                                <span>
                                    Department
                                </span>
                                <strong>
                                    {
                                        selectedEmployee.department?.name ||
                                        "-"
                                    }
                                </strong>
                            </div>


                            <div>
                                <span>
                                    Designation
                                </span>
                                <strong>
                                    {
                                        selectedEmployee.designation
                                    }
                                </strong>
                            </div>


                            <div>
                                <span>
                                    Joining Date
                                </span>
                                <strong>
                                    {
                                        formatDate(
                                            selectedEmployee.joiningDate
                                        )
                                    }
                                </strong>
                            </div>


                            <div>
                                <span>
                                    Location
                                </span>
                                <strong>
                                    {
                                        selectedEmployee.location
                                    }
                                </strong>
                            </div>


                            <div>
                                <span>
                                    Status
                                </span>

                                <strong>

                                    <span
                                        className={`employee-status ${
                                            selectedEmployee.status ===
                                            "Active"
                                                ? "status-active"
                                                : "status-inactive"
                                        }`}
                                    >
                                        {
                                            selectedEmployee.status
                                        }
                                    </span>

                                </strong>

                            </div>


                            <div>
                                <span>
                                    Created By
                                </span>

                                <strong>
                                    {
                                        selectedEmployee.createdBy?.name ||
                                        "-"
                                    }
                                </strong>

                            </div>

                        </div>


                        <button
                            className="modal-close-btn"
                            onClick={closeDetails}
                        >
                            Close
                        </button>

                    </div>

                </div>

            )}

        </div>
    );
};

export default Employee;

