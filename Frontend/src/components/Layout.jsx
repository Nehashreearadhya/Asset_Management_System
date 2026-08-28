import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

function Layout({ children, role }) {

    return (
        <div className="app-layout">

            <Sidebar role={role} />

            <div className="main-section">

                <Navbar />

                <main className="page-content">

                    {children}

                </main>

            </div>

        </div>
    );
}

export default Layout;