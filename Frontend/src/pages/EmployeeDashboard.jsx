import React from "react";
import "./EmployeeDashboard.css";

const EmployeeDashboard = () => {
    return (
        <div className="employee-dashboard">

            {/* Header */}
            <div className="dashboard-header">
                <div>
                    <h1>Dashboard</h1>
                    <p>Welcome to Employee Dashboard</p>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="dashboard-cards">

                <div className="dashboard-card">
                    <div className="dashboard-card-icon">
                        💻
                    </div>

                    <div>
                        <h3>My Assets</h3>
                        <h2>0</h2>
                        <p>Assets assigned to you</p>
                    </div>
                </div>


                <div className="dashboard-card">
                    <div className="dashboard-card-icon">
                        📋
                    </div>

                    <div>
                        <h3>My Assignments</h3>
                        <h2>0</h2>
                        <p>Current assignments</p>
                    </div>
                </div>


                <div className="dashboard-card">
                    <div className="dashboard-card-icon">
                        🔄
                    </div>

                    <div>
                        <h3>Pending Returns</h3>
                        <h2>0</h2>
                        <p>Assets to be returned</p>
                    </div>
                </div>

            </div>


            {/* Welcome Section */}
            <div className="employee-welcome">

                <div className="welcome-icon">
                    👋
                </div>

                <div>
                    <h2>Welcome!</h2>

                    <p>
                        You can view your assigned assets and
                        assignments from the menu.
                    </p>
                </div>

            </div>


            {/* Quick Access */}
            <div className="quick-access">

                <h2>Quick Access</h2>

                <div className="quick-access-grid">

                    <a
                        href="/employee/assets"
                        className="quick-card"
                    >
                        <span>💻</span>

                        <div>
                            <h3>My Assets</h3>
                            <p>
                                View assets assigned to you
                            </p>
                        </div>
                    </a>


                    <a
                        href="/employee/assignments"
                        className="quick-card"
                    >
                        <span>📋</span>

                        <div>
                            <h3>My Assignments</h3>
                            <p>
                                View your asset assignments
                            </p>
                        </div>
                    </a>

                </div>

            </div>

        </div>
    );
};

export default EmployeeDashboard;