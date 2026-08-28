import { NavLink } from "react-router-dom";

function Sidebar({ role }) {

    const adminMenu = [
        {
            name: "Dashboard",
            path: "/admin/dashboard"
        },
        {
            name: "Assets",
            path: "/admin/assets"
        },
        {
            name: "Employees",
            path: "/admin/employees"
        },
        {
            name: "Assignments",
            path: "/admin/assignments"
        },
        {
            name: "Departments",
            path: "/admin/departments"
        }
    ];

    const employeeMenu = [
        {
            name: "Dashboard",
            path: "/employee/dashboard"
        },
        {
            name: "My Assets",
            path: "/employee/assets"
        },
        {
            name: "My Assignments",
            path: "/employee/assignments"
        }
    ];

    const menu =
        role === "admin"
            ? adminMenu
            : employeeMenu;

    return (
        <aside className="sidebar">

            <div className="sidebar-logo">
                <h2>Asset<span>MS</span></h2>
            </div>

            <nav>

                {menu.map((item) => (

                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            isActive
                                ? "sidebar-link active"
                                : "sidebar-link"
                        }
                    >
                        {item.name}
                    </NavLink>

                ))}

            </nav>

        </aside>
    );
}

export default Sidebar;