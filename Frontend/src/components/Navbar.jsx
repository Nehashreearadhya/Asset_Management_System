import { useNavigate } from "react-router-dom";

function Navbar() {

    const navigate = useNavigate();

    const user = JSON.parse(
        localStorage.getItem("user")
    );

    const handleLogout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");
    };

    return (
        <header className="navbar">

            <div>
                <h3>Asset Management System</h3>
            </div>

            <div className="navbar-user">

                <div className="user-info">

                    <strong>
                        {user?.name}
                    </strong>

                    <span>
                        {user?.role}
                    </span>

                </div>

                <button
                    onClick={handleLogout}
                    className="logout-btn"
                >
                    Logout
                </button>

            </div>

        </header>
    );
}

export default Navbar;