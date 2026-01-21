import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/authSlice";
import "./admin.css";

const AdminLayout = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const { token, user } = useSelector(state => state.auth);

    const handleLogout = () => {
        dispatch(logout()).then(() => {
            navigate("/login");
        });
    };

    const isActive = (path) => {
        return location.pathname === path ? "active" : "";
    };

    if (!token) {
        return null;
    }

    return (
        <div className="admin-wrapper">
            {/* SIDEBAR */}
            <aside className="admin-sidebar">
                <div className="sidebar-logo">Algorixa</div>

                <ul className="sidebar-menu">
                    <li>
                        <a
                            href="/admin"
                            className={isActive("/admin")}
                        >
                            📊 Dashboard
                        </a>
                    </li>
                    <li>
                        <a
                            href="/admin/projects"
                            className={isActive("/admin/projects")}
                        >
                            🎨 Projeler
                        </a>
                    </li>
                    <li>
                        <a
                            href="/admin/messages"
                            className={isActive("/admin/messages")}
                        >
                            💬 Mesajlar
                        </a>
                    </li>
                </ul>

                <div style={{
                    marginTop: "auto",
                    paddingTop: "20px",
                    borderTop: "1px solid rgba(255, 255, 255, 0.1)"
                }}>
                    <a
                        href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            handleLogout();
                        }}
                        className="sidebar-menu"
                        style={{
                            display: "block",
                            padding: "12px 14px",
                            color: "#f87171",
                            textDecoration: "none",
                            borderRadius: "10px",
                            transition: "all 0.3s ease",
                            marginBottom: 0
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = "rgba(248, 113, 113, 0.1)";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = "transparent";
                        }}
                    >
                        🚪 Çıkış Yap
                    </a>
                </div>
            </aside>

            {/* MAIN */}
            <main className="admin-main">
                <header className="admin-header">
                    <span>🏢 Yönetim Paneli</span>
                    <div style={{ fontSize: "13px", color: "#999" }}>
                        {user?.role && `Rol: ${user.role}`}
                    </div>
                </header>

                <div className="admin-content">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
