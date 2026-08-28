import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, allowedRoles }) {

    const token = localStorage.getItem("token");

    const user = JSON.parse(
        localStorage.getItem("user")
    );


    // ==========================================
    // NO TOKEN
    // ==========================================

    if (!token) {

        return (
            <Navigate
                to="/login"
                replace
            />
        );
    }


    // ==========================================
    // NO USER
    // ==========================================

    if (!user) {

        localStorage.removeItem("token");

        return (
            <Navigate
                to="/login"
                replace
            />
        );
    }


    // ==========================================
    // ROLE CHECK
    // ==========================================

    if (
        allowedRoles &&
        !allowedRoles.includes(user.role)
    ) {

        if (user.role === "admin") {

            return (
                <Navigate
                    to="/admin/dashboard"
                    replace
                />
            );

        }

        if (user.role === "employee") {

            return (
                <Navigate
                    to="/employee/dashboard"
                    replace
                />
            );
        }

        return (
            <Navigate
                to="/login"
                replace
            />
        );
    }


    // ==========================================
    // AUTHORIZED
    // ==========================================

    return children;
}

export default ProtectedRoute;