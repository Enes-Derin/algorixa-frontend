// AdminLayout.jsx — revize edilmiş hali
import { useState } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/authSlice";
import "./admin.css";

const AdminLayout = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useSelector((state) => state.auth);

    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleLogout = () => {
        dispatch(logout());
        navigate("/admin/login");
    };

    const isActive = (path) => location.pathname === path;

    const closeSidebar = () => setSidebarOpen(false);

    return (
        <div className="admin-container">

            {/* Mobile toggle button */}
            <button
                className="sidebar-toggle"
                onClick={() => setSidebarOpen(v => !v)}
                aria-label="Menüyü aç"
            >
                {sidebarOpen ? "✕" : "☰"}
            </button>

            {/* Overlay */}
            <div
                className={`sidebar-overlay ${sidebarOpen ? "is-open" : ""}`}
                onClick={closeSidebar}
            />

            {/* SIDEBAR */}
            <aside className={`admin-sidebar ${sidebarOpen ? "is-open" : ""}`}>
                <div className="sidebar-header">
                    <h4>ALGORIXA</h4>
                    <p className="user-info">
                        👤 {user?.username || "Admin"}
                        <span className="user-role">{user?.role || "ADMIN"}</span>
                    </p>
                </div>

                <nav className="sidebar-nav">
                    <Link
                        to="/admin"
                        className={`nav-item ${isActive("/admin") ? "active" : ""}`}
                        onClick={closeSidebar}
                    >
                        Dashboard
                    </Link>

                    <div className="nav-section">
                        <div className="nav-section-title">İçerik Yönetimi</div>
                        <Link
                            to="/admin/blog"
                            className={`nav-item ${isActive("/admin/blog") ? "active" : ""}`}
                            onClick={closeSidebar}
                        >
                            Blog Yazıları
                        </Link>
                        <Link
                            to="/admin/portfolio"
                            className={`nav-item ${isActive("/admin/portfolio") ? "active" : ""}`}
                            onClick={closeSidebar}
                        >
                            Portföy
                        </Link>
                    </div>

                    <div className="nav-section">
                        <div className="nav-section-title">Fiyatlandırma</div>
                        <Link
                            to="/admin/pricing"
                            className={`nav-item ${isActive("/admin/pricing") ? "active" : ""}`}
                            onClick={closeSidebar}
                        >
                            Paketler
                        </Link>
                        <Link
                            to="/admin/maintenance"
                            className={`nav-item ${isActive("/admin/maintenance") ? "active" : ""}`}
                            onClick={closeSidebar}
                        >
                            Bakım Planları
                        </Link>
                        <Link
                            to="/admin/campaign"
                            className={`nav-item ${isActive("/admin/campaign") ? "active" : ""}`}
                            onClick={closeSidebar}
                        >
                            Kampanyalar
                        </Link>
                    </div>

                    <div className="nav-section">
                        <div className="nav-section-title">İletişim</div>
                        <Link
                            to="/admin/messages"
                            className={`nav-item ${isActive("/admin/messages") ? "active" : ""}`}
                            onClick={closeSidebar}
                        >
                            Mesajlar
                        </Link>
                    </div>

                    <button onClick={handleLogout} className="nav-item logout-btn">
                        Çıkış Yap
                    </button>
                </nav>
            </aside>

            {/* MAIN */}
            <main className="admin-main">
                <div className="admin-content">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;