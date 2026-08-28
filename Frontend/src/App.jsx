import {
    BrowserRouter,
    Routes,
    Route
} from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";

import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";

import AdminDashboard from "./pages/AdminDashboard";
import Assets from "./pages/Assets";
import Employee from "./pages/Employee";
import Assignment from "./pages/Assignment";
import Department from "./pages/Department";
import EmployeeDashboard from "./pages/EmployeeDashboard";


// ==========================================
// PLACEHOLDER PAGE
// ==========================================

function Page({ title }) {
    return (
        <div>
            <h1>{title}</h1>

            <p>
                This page will be developed next.
            </p>
        </div>
    );
}


// ==========================================
// APP
// ==========================================

function App() {

    return (
        <BrowserRouter>

            <Routes>

                {/* =================================
                    PUBLIC ROUTES
                ================================= */}

                <Route
                    path="/"
                    element={<Login />}
                />

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />


                {/* =================================
                    ADMIN DASHBOARD
                ================================= */}

                <Route
                    path="/admin/dashboard"
                    element={
                        <ProtectedRoute
                            allowedRoles={["admin"]}
                        >
                            <Layout role="admin">
                                <AdminDashboard />
                            </Layout>
                        </ProtectedRoute>
                    }
                />


                {/* =================================
                    ADMIN ASSETS
                ================================= */}

                <Route
                    path="/admin/assets"
                    element={
                        <ProtectedRoute
                            allowedRoles={["admin"]}
                        >
                            <Layout role="admin">
                                <Assets />
                            </Layout>
                        </ProtectedRoute>
                    }
                />


                {/* =================================
                    ADMIN EMPLOYEES
                ================================= */}

                <Route
                    path="/admin/employees"
                    element={
                        <ProtectedRoute
                            allowedRoles={["admin"]}
                        >
                            <Layout role="admin">
                                <Employee />
                            </Layout>
                        </ProtectedRoute>
                    }
                />


                {/* =================================
                    ADMIN ASSIGNMENTS
                ================================= */}

                <Route
                    path="/admin/assignments"
                    element={
                        <ProtectedRoute
                            allowedRoles={["admin"]}
                        >
                            <Layout role="admin">
                                <Assignment />
                            </Layout>
                        </ProtectedRoute>
                    }
                />


                {/* =================================
                    ADMIN DEPARTMENTS
                ================================= */}

                <Route
                    path="/admin/departments"
                    element={
                        <ProtectedRoute
                            allowedRoles={["admin"]}
                        >
                            <Layout role="admin">
                                <Department />
                            </Layout>
                        </ProtectedRoute>
                    }
                />


                {/* =================================
                    EMPLOYEE DASHBOARD
                ================================= */}

                <Route
                    path="/employee/dashboard"
                    element={
                        <ProtectedRoute
                            allowedRoles={["employee"]}
                        >
                            <Layout role="employee">
                                <EmployeeDashboard />
                            </Layout>
                        </ProtectedRoute>
                    }
                />


                {/* =================================
                    EMPLOYEE ASSETS
                ================================= */}

                <Route
                    path="/employee/assets"
                    element={
                        <ProtectedRoute
                            allowedRoles={["employee"]}
                        >
                            <Layout role="employee">
                                <Page title="My Assets" />
                            </Layout>
                        </ProtectedRoute>
                    }
                />


                {/* =================================
                    EMPLOYEE ASSIGNMENTS
                ================================= */}

                <Route
                    path="/employee/assignments"
                    element={
                        <ProtectedRoute
                            allowedRoles={["employee"]}
                        >
                            <Layout role="employee">
                                <Page title="My Assignments" />
                            </Layout>
                        </ProtectedRoute>
                    }
                />

            </Routes>

        </BrowserRouter>
    );
}

export default App;