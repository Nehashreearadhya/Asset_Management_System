import { useEffect, useState } from "react";
import api from "../api/axios";

function AdminDashboard() {

    const [summary, setSummary] = useState(null);
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadDashboard();
    }, []);

    const loadDashboard = async () => {

        try {

            setLoading(true);
            setError("");

            const summaryResponse = await api.get(
                "/dashboard/summary"
            );

            const departmentResponse = await api.get(
                "/dashboard/department-assets"
            );

            setSummary(summaryResponse.data);

            setDepartments(
                departmentResponse.data.departments ||
                departmentResponse.data
            );

        } catch (error) {

            console.error("Dashboard Error:", error);

            setError(
                error.response?.data?.message ||
                "Failed to load dashboard"
            );

        } finally {

            setLoading(false);

        }
    };

    if (loading) {
        return <h2>Loading dashboard...</h2>;
    }

    if (error) {
        return (
            <div>
                <h2>Dashboard</h2>
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div className="dashboard">

            <div className="dashboard-header">

                <div>
                    <h1>Dashboard</h1>

                    <p>
                        Asset Management Overview
                    </p>
                </div>

                <button onClick={loadDashboard}>
                    Refresh
                </button>

            </div>


            {/* =================================
                SUMMARY CARDS
            ================================= */}

            <div className="dashboard-cards">

                <div className="dashboard-card">
                    <span>Total Assets</span>

                    <h2>
                        {summary?.totalAssets ?? 0}
                    </h2>
                </div>


                <div className="dashboard-card">
                    <span>Available Assets</span>

                    <h2>
                        {summary?.availableAssets ?? 0}
                    </h2>
                </div>


                <div className="dashboard-card">
                    <span>Assigned Assets</span>

                    <h2>
                        {summary?.assignedAssets ?? 0}
                    </h2>
                </div>


                <div className="dashboard-card">
                    <span>Total Employees</span>

                    <h2>
                        {summary?.totalEmployees ?? 0}
                    </h2>
                </div>


                <div className="dashboard-card">
                    <span>Departments</span>

                    <h2>
                        {summary?.totalDepartments ?? 0}
                    </h2>
                </div>


                <div className="dashboard-card">
                    <span>Assignments</span>

                    <h2>
                        {summary?.totalAssignments ?? 0}
                    </h2>
                </div>

            </div>


            {/* =================================
                DEPARTMENT ASSETS
            ================================= */}

            <div className="dashboard-section">

                <div className="section-header">

                    <h2>
                        Department-wise Assets
                    </h2>

                </div>


                {departments.length === 0 ? (

                    <p>
                        No department asset data available.
                    </p>

                ) : (

                    <div className="department-table">

                        <table>

                            <thead>

                                <tr>
                                    <th>Department</th>
                                    <th>Asset Count</th>
                                </tr>

                            </thead>

                            <tbody>

                                {departments.map(
                                    (department, index) => (

                                    <tr key={index}>

                                        <td>
                                            {department.department ||
                                             department._id}
                                        </td>

                                        <td>
                                            {department.assetCount ??
                                             department.count ??
                                             0}
                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>

        </div>
    );
}

export default AdminDashboard;