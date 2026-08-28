import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";

function Login() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const [error, setError] = useState("");

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");

        try {

            const response = await api.post(
                "/auth/login",
                formData
            );

            console.log("Login Response:", response.data);

            const token = response.data.token;

            // Save token
            localStorage.setItem("token", token);

            // Save user
            if (response.data.user) {

                localStorage.setItem(
                    "user",
                    JSON.stringify(response.data.user)
                );
            }


            // Get role
            const role = response.data.user?.role;


            // ==================================
            // ROLE BASED REDIRECT
            // ==================================

            if (role === "admin") {

                navigate("/admin/dashboard");

            } else if (role === "employee") {

                navigate("/employee/dashboard");

            } else {

                setError("Invalid user role");

            }

        } catch (error) {

            console.error(error);

            setError(
                error.response?.data?.message ||
                "Login failed"
            );
        }
    };


    return (
        <div className="auth-container">

            <div className="auth-card">

                <h1>Login</h1>

                <p>
                    Asset Management System
                </p>


                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}


                <form onSubmit={handleSubmit}>

                    <input
                        type="email"
                        name="email"
                        placeholder="Enter email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />


                    <input
                        type="password"
                        name="password"
                        placeholder="Enter password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />


                    <button type="submit">
                        Login
                    </button>

                </form>


                <p>
                    Don't have an account?{" "}
                    <Link to="/register">
                        Register
                    </Link>
                </p>

            </div>

        </div>
    );
}

export default Login;